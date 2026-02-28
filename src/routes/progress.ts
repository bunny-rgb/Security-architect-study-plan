import { Hono } from 'hono';
import type { Bindings, ProgressSummary } from '../types';
import { calculateStreak, getReadinessLevel, calculateScore } from '../lib/utils';

export const progressRoutes = new Hono<{ Bindings: Bindings }>();

// Get progress summary for user
progressRoutes.get('/summary', async (c) => {
  const db = c.env.DB;
  const userId = c.req.query('userId');

  if (!userId) {
    return c.json({ error: 'userId required' }, 400);
  }

  try {
    // Get all completed progress
    const progressResult = await db.prepare(`
      SELECT * FROM daily_progress 
      WHERE user_id = ? AND lesson_completed = 1 
      ORDER BY date DESC
    `)
      .bind(userId)
      .all();

    const progressRecords = progressResult.results;

    // Calculate streak
    const streak = calculateStreak(progressRecords.map((p: any) => ({ date: p.date })));

    // Total time spent
    const totalTime = progressRecords.reduce((sum: number, p: any) => sum + (p.time_spent_min || 0), 0);

    // Lessons completed
    const lessonsCompleted = progressRecords.length;

    // Quiz average
    const quizScores = progressRecords
      .filter((p: any) => p.quiz_completed === 1)
      .map((p: any) => p.quiz_score || 0);
    const quizAverage = quizScores.length > 0
      ? quizScores.reduce((sum: number, score: number) => sum + score, 0) / quizScores.length
      : 0;

    // Knowledge scores by domain
    const knowledgeResult = await db.prepare(
      'SELECT domain, score FROM knowledge_scores WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    const knowledgeScores: Record<string, number> = {};
    knowledgeResult.results.forEach((k: any) => {
      knowledgeScores[k.domain] = k.score || 0;
    });

    // Find weak topics (scores < 70)
    const weakTopics = Object.entries(knowledgeScores)
      .filter(([_, score]) => score < 70 && score > 0)
      .map(([domain, _]) => domain)
      .sort((a, b) => knowledgeScores[a] - knowledgeScores[b]);

    // Readiness level
    const readinessLevel = getReadinessLevel(quizAverage, lessonsCompleted);

    // Current phase
    const latestLesson = progressRecords.length > 0 ? progressRecords[0] : null;
    let currentPhase = 0;
    let nextUnlock = 'Complete Phase 0: Networking Foundations';

    if (latestLesson) {
      const lesson = await db.prepare('SELECT phase, phase_name FROM lessons WHERE id = ?')
        .bind(latestLesson.lesson_id)
        .first();
      
      if (lesson) {
        currentPhase = lesson.phase as number;
        
        if (currentPhase < 4) {
          const nextPhase = await db.prepare('SELECT phase_name FROM lessons WHERE phase = ? LIMIT 1')
            .bind(currentPhase + 1)
            .first();
          nextUnlock = nextPhase ? `Next: ${nextPhase.phase_name}` : 'All phases unlocked!';
        } else {
          nextUnlock = 'All phases unlocked! Focus on incident simulations.';
        }
      }
    }

    // Achievements
    const achievementsResult = await db.prepare(
      'SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC'
    )
      .bind(userId)
      .all();

    const achievements = achievementsResult.results;

    // Incident handling score
    const incidentResult = await db.prepare(
      'SELECT AVG(score) as avg_score FROM incident_attempts WHERE user_id = ?'
    )
      .bind(userId)
      .first();

    const incidentScore = incidentResult?.avg_score || 0;
    knowledgeScores['incident_handling'] = Math.round(incidentScore as number);

    const summary: ProgressSummary = {
      streak_days: streak,
      total_time_min: totalTime,
      lessons_completed: lessonsCompleted,
      quiz_average: Math.round(quizAverage),
      knowledge_scores: knowledgeScores,
      weak_topics: weakTopics,
      readiness_level: readinessLevel,
      achievements: achievements as any[],
      current_phase: currentPhase,
      next_unlock: nextUnlock
    };

    return c.json({ summary });
  } catch (error) {
    console.error('Get progress summary error:', error);
    return c.json({ error: 'Failed to fetch progress summary' }, 500);
  }
});

// Get detailed progress history
progressRoutes.get('/history', async (c) => {
  const db = c.env.DB;
  const userId = c.req.query('userId');
  const limit = parseInt(c.req.query('limit') || '30');

  if (!userId) {
    return c.json({ error: 'userId required' }, 400);
  }

  try {
    const result = await db.prepare(`
      SELECT dp.*, l.title, l.phase_name 
      FROM daily_progress dp
      JOIN lessons l ON dp.lesson_id = l.id
      WHERE dp.user_id = ?
      ORDER BY dp.date DESC
      LIMIT ?
    `)
      .bind(userId, limit)
      .all();

    return c.json({ history: result.results });
  } catch (error) {
    console.error('Get history error:', error);
    return c.json({ error: 'Failed to fetch history' }, 500);
  }
});

// Get weak areas analysis
progressRoutes.get('/weak-areas', async (c) => {
  const db = c.env.DB;
  const userId = c.req.query('userId');

  if (!userId) {
    return c.json({ error: 'userId required' }, 400);
  }

  try {
    // Get all quiz attempts grouped by lesson
    const result = await db.prepare(`
      SELECT 
        l.id as lesson_id,
        l.title,
        l.phase_name,
        COUNT(qa.id) as attempts,
        SUM(CASE WHEN qa.is_correct = 1 THEN 1 ELSE 0 END) as correct,
        COUNT(qa.id) as total
      FROM quiz_attempts qa
      JOIN lessons l ON qa.lesson_id = l.id
      WHERE qa.user_id = ?
      GROUP BY l.id
      HAVING (correct * 100.0 / total) < 70
      ORDER BY (correct * 100.0 / total) ASC
    `)
      .bind(userId)
      .all();

    const weakAreas = result.results.map((r: any) => ({
      lesson_id: r.lesson_id,
      title: r.title,
      phase_name: r.phase_name,
      score: Math.round((r.correct / r.total) * 100),
      attempts: r.attempts
    }));

    return c.json({ weak_areas: weakAreas });
  } catch (error) {
    console.error('Get weak areas error:', error);
    return c.json({ error: 'Failed to fetch weak areas' }, 500);
  }
});

// Get achievements
progressRoutes.get('/achievements', async (c) => {
  const db = c.env.DB;
  const userId = c.req.query('userId');

  if (!userId) {
    return c.json({ error: 'userId required' }, 400);
  }

  try {
    const result = await db.prepare(
      'SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC'
    )
      .bind(userId)
      .all();

    return c.json({ achievements: result.results });
  } catch (error) {
    console.error('Get achievements error:', error);
    return c.json({ error: 'Failed to fetch achievements' }, 500);
  }
});
