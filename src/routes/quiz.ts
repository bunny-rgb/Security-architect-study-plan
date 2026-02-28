import { Hono } from 'hono';
import type { Bindings, QuizQuestion } from '../types';
import { parseJSON, formatDate, shouldRemediate, calculateScore } from '../lib/utils';

export const quizRoutes = new Hono<{ Bindings: Bindings }>();

// Get quiz questions for a lesson
quizRoutes.get('/:lessonId', async (c) => {
  const db = c.env.DB;
  const lessonId = parseInt(c.req.param('lessonId'));
  const userId = c.req.query('userId');

  try {
    const result = await db.prepare(
      'SELECT * FROM quiz_questions WHERE lesson_id = ? ORDER BY id'
    )
      .bind(lessonId)
      .all();

    // Don't send correct answers to client initially
    const questions = result.results.map((q: any) => ({
      id: q.id,
      lesson_id: q.lesson_id,
      question_type: q.question_type,
      question_text: q.question_text,
      options: parseJSON(q.options, []),
      difficulty: q.difficulty,
      points: q.points
    }));

    // Get previous attempts if userId provided
    let attempts = [];
    if (userId) {
      const attemptsResult = await db.prepare(
        'SELECT question_id, is_correct, attempt_number FROM quiz_attempts WHERE user_id = ? AND lesson_id = ? ORDER BY created_at DESC'
      )
        .bind(userId, lessonId)
        .all();
      attempts = attemptsResult.results;
    }

    return c.json({ questions, attempts });
  } catch (error) {
    console.error('Get quiz error:', error);
    return c.json({ error: 'Failed to fetch quiz' }, 500);
  }
});

// Submit quiz answers
quizRoutes.post('/submit', async (c) => {
  const db = c.env.DB;
  const { userId, lessonId, answers } = await c.req.json();

  if (!userId || !lessonId || !answers) {
    return c.json({ error: 'userId, lessonId, and answers required' }, 400);
  }

  try {
    const today = formatDate();
    
    // Get all questions with correct answers
    const questionsResult = await db.prepare(
      'SELECT * FROM quiz_questions WHERE lesson_id = ?'
    )
      .bind(lessonId)
      .all();

    const questions = questionsResult.results;
    const results = [];
    let totalPoints = 0;
    let earnedPoints = 0;

    // Get attempt number
    const previousAttempts = await db.prepare(
      'SELECT MAX(attempt_number) as max_attempt FROM quiz_attempts WHERE user_id = ? AND lesson_id = ?'
    )
      .bind(userId, lessonId)
      .first();

    const attemptNumber = (previousAttempts?.max_attempt || 0) + 1;

    // Grade each question
    for (const question of questions) {
      const userAnswer = answers[question.id as number];
      if (!userAnswer) continue;

      const correctAnswers = parseJSON(question.correct_answers as string, []);
      const isCorrect = checkAnswer(
        question.question_type as string,
        userAnswer,
        correctAnswers
      );

      const pointsEarned = isCorrect ? (question.points as number) : 0;
      totalPoints += question.points as number;
      earnedPoints += pointsEarned;

      // Save attempt
      await db.prepare(`
        INSERT INTO quiz_attempts 
        (user_id, lesson_id, question_id, user_answer, is_correct, points_earned, attempt_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
        .bind(
          userId,
          lessonId,
          question.id,
          JSON.stringify(userAnswer),
          isCorrect ? 1 : 0,
          pointsEarned,
          attemptNumber
        )
        .run();

      results.push({
        question_id: question.id,
        is_correct: isCorrect,
        correct_answers: correctAnswers,
        explanation: question.explanation,
        points_earned: pointsEarned
      });
    }

    const quizScore = calculateScore(earnedPoints, totalPoints);

    // Update daily progress
    const status = shouldRemediate(quizScore) ? 'needs_remediation' : 'completed';
    
    await db.prepare(`
      UPDATE daily_progress 
      SET quiz_completed = 1, quiz_score = ?, status = ?, completed_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND date = ? AND lesson_id = ?
    `)
      .bind(quizScore, status, userId, today, lessonId)
      .run();

    // Update daily plan
    await db.prepare(
      'UPDATE daily_plan SET status = ? WHERE user_id = ? AND date = ?'
    )
      .bind('completed', userId, today)
      .run();

    // Update knowledge scores by domain
    await updateKnowledgeScores(db, userId, lessonId, results);

    // Check for achievements
    await checkAchievements(db, userId, quizScore, attemptNumber);

    return c.json({
      score: quizScore,
      earned_points: earnedPoints,
      total_points: totalPoints,
      status,
      needs_remediation: shouldRemediate(quizScore),
      results,
      message: getScoreMessage(quizScore)
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return c.json({ error: 'Failed to submit quiz' }, 500);
  }
});

function checkAnswer(
  questionType: string,
  userAnswer: any,
  correctAnswers: any[]
): boolean {
  if (questionType === 'mcq') {
    return userAnswer === correctAnswers[0];
  }
  
  if (questionType === 'multiple_correct') {
    if (!Array.isArray(userAnswer)) return false;
    if (userAnswer.length !== correctAnswers.length) return false;
    return correctAnswers.every(ans => userAnswer.includes(ans));
  }
  
  if (questionType === 'short_answer') {
    const normalized = userAnswer.toLowerCase().trim();
    return correctAnswers.some(ans => 
      normalized === ans.toString().toLowerCase().trim()
    );
  }
  
  if (questionType === 'scenario') {
    return userAnswer === correctAnswers[0];
  }
  
  return false;
}

async function updateKnowledgeScores(
  db: D1Database,
  userId: string,
  lessonId: number,
  results: any[]
) {
  try {
    // Get lesson phase to determine domain
    const lesson = await db.prepare('SELECT phase FROM lessons WHERE id = ?')
      .bind(lessonId)
      .first();

    if (!lesson) return;

    const domainMap: Record<number, string> = {
      0: 'networking',
      1: 'web',
      2: 'tls',
      3: 'waf',
      4: 'incident_response'
    };

    const domain = domainMap[lesson.phase as number] || 'networking';

    const correct = results.filter(r => r.is_correct).length;
    const total = results.length;

    // Update knowledge score
    const current = await db.prepare(
      'SELECT * FROM knowledge_scores WHERE user_id = ? AND domain = ?'
    )
      .bind(userId, domain)
      .first();

    if (current) {
      const newAnswered = (current.questions_answered as number) + total;
      const newCorrect = (current.questions_correct as number) + correct;
      const newScore = calculateScore(newCorrect, newAnswered);

      await db.prepare(`
        UPDATE knowledge_scores 
        SET score = ?, questions_answered = ?, questions_correct = ?, last_updated = CURRENT_TIMESTAMP
        WHERE user_id = ? AND domain = ?
      `)
        .bind(newScore, newAnswered, newCorrect, userId, domain)
        .run();
    }
  } catch (error) {
    console.error('Update knowledge scores error:', error);
  }
}

async function checkAchievements(
  db: D1Database,
  userId: string,
  quizScore: number,
  attemptNumber: number
) {
  try {
    // Perfect quiz on first attempt
    if (quizScore === 100 && attemptNumber === 1) {
      const existing = await db.prepare(
        'SELECT id FROM achievements WHERE user_id = ? AND achievement_type = ? AND DATE(earned_at) = DATE(?)'
      )
        .bind(userId, 'perfect_quiz', new Date().toISOString())
        .first();

      if (!existing) {
        await db.prepare(`
          INSERT INTO achievements (user_id, achievement_type, achievement_name, description)
          VALUES (?, ?, ?, ?)
        `)
          .bind(
            userId,
            'perfect_quiz',
            'Perfect Score',
            'Achieved 100% on a quiz on first attempt'
          )
          .run();
      }
    }

    // Check streak achievements
    const progressResult = await db.prepare(
      'SELECT DISTINCT date FROM daily_progress WHERE user_id = ? AND lesson_completed = 1 ORDER BY date DESC'
    )
      .bind(userId)
      .all();

    const uniqueDays = progressResult.results.length;

    if (uniqueDays >= 7) {
      const existing = await db.prepare(
        'SELECT id FROM achievements WHERE user_id = ? AND achievement_type = ?'
      )
        .bind(userId, 'streak_7')
        .first();

      if (!existing) {
        await db.prepare(`
          INSERT INTO achievements (user_id, achievement_type, achievement_name, description)
          VALUES (?, ?, ?, ?)
        `)
          .bind(userId, 'streak_7', '7-Day Streak', 'Completed lessons for 7 consecutive days')
          .run();
      }
    }
  } catch (error) {
    console.error('Check achievements error:', error);
  }
}

function getScoreMessage(score: number): string {
  if (score >= 95) return 'Outstanding! You mastered this material.';
  if (score >= 85) return 'Excellent work! You have a strong grasp of the concepts.';
  if (score >= 70) return 'Good job! You understand the fundamentals.';
  if (score >= 60) return 'Passing, but consider reviewing the material.';
  return 'You need to review this lesson. Let\'s try again tomorrow.';
}
