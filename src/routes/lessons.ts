import { Hono } from 'hono';
import type { Bindings, Lesson } from '../types';
import { parseJSON } from '../lib/utils';

export const lessonRoutes = new Hono<{ Bindings: Bindings }>();

// Get all lessons
lessonRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const phase = c.req.query('phase');
  const userId = c.req.query('userId');

  try {
    let query = 'SELECT * FROM lessons';
    const params: any[] = [];

    if (phase) {
      query += ' WHERE phase = ?';
      params.push(parseInt(phase));
    }

    query += ' ORDER BY phase, day_number';

    const result = await db.prepare(query).bind(...params).all();
    const lessons = result.results.map(formatLesson);

    // If userId provided, add progress info
    if (userId) {
      for (const lesson of lessons) {
        const progress = await db.prepare(
          'SELECT * FROM daily_progress WHERE user_id = ? AND lesson_id = ? ORDER BY id DESC LIMIT 1'
        )
          .bind(userId, lesson.id)
          .first();

        (lesson as any).progress = progress || null;
      }
    }

    return c.json({ lessons });
  } catch (error) {
    console.error('Get lessons error:', error);
    return c.json({ error: 'Failed to fetch lessons' }, 500);
  }
});

// Get single lesson by ID or slug
lessonRoutes.get('/:identifier', async (c) => {
  const db = c.env.DB;
  const identifier = c.req.param('identifier');
  const userId = c.req.query('userId');

  try {
    // Try as ID first, then slug
    let lesson;
    if (/^\d+$/.test(identifier)) {
      lesson = await db.prepare('SELECT * FROM lessons WHERE id = ?')
        .bind(parseInt(identifier))
        .first();
    } else {
      lesson = await db.prepare('SELECT * FROM lessons WHERE slug = ?')
        .bind(identifier)
        .first();
    }

    if (!lesson) {
      return c.json({ error: 'Lesson not found' }, 404);
    }

    const formattedLesson = formatLesson(lesson);

    // Get quiz questions
    const quizResult = await db.prepare(
      'SELECT id, question_type, question_text, options, difficulty, points FROM quiz_questions WHERE lesson_id = ?'
    )
      .bind(lesson.id)
      .all();

    const quizQuestions = quizResult.results.map((q: any) => ({
      ...q,
      options: parseJSON(q.options, [])
    }));

    // Get progress if userId provided
    let progress = null;
    let quizAttempts = [];
    if (userId) {
      progress = await db.prepare(
        'SELECT * FROM daily_progress WHERE user_id = ? AND lesson_id = ? ORDER BY id DESC LIMIT 1'
      )
        .bind(userId, lesson.id)
        .first();

      const attemptsResult = await db.prepare(
        'SELECT * FROM quiz_attempts WHERE user_id = ? AND lesson_id = ? ORDER BY created_at DESC'
      )
        .bind(userId, lesson.id)
        .all();

      quizAttempts = attemptsResult.results;
    }

    return c.json({
      lesson: formattedLesson,
      quiz_questions: quizQuestions,
      progress,
      quiz_attempts: quizAttempts
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    return c.json({ error: 'Failed to fetch lesson' }, 500);
  }
});

// Get lesson prerequisites check
lessonRoutes.get('/:lessonId/can-access', async (c) => {
  const db = c.env.DB;
  const lessonId = parseInt(c.req.param('lessonId'));
  const userId = c.req.query('userId');

  if (!userId) {
    return c.json({ error: 'userId required' }, 400);
  }

  try {
    const lesson = await db.prepare('SELECT prerequisites FROM lessons WHERE id = ?')
      .bind(lessonId)
      .first();

    if (!lesson) {
      return c.json({ error: 'Lesson not found' }, 404);
    }

    const prerequisites = parseJSON<number[]>(lesson.prerequisites as string, []);
    
    if (prerequisites.length === 0) {
      return c.json({ can_access: true, missing: [] });
    }

    // Check if all prerequisites are completed
    const completed = await db.prepare(`
      SELECT lesson_id FROM daily_progress 
      WHERE user_id = ? AND lesson_id IN (${prerequisites.join(',')}) AND lesson_completed = 1
    `)
      .bind(userId)
      .all();

    const completedIds = completed.results.map((r: any) => r.lesson_id);
    const missing = prerequisites.filter(id => !completedIds.includes(id));

    return c.json({
      can_access: missing.length === 0,
      missing,
      prerequisites
    });
  } catch (error) {
    console.error('Check access error:', error);
    return c.json({ error: 'Failed to check access' }, 500);
  }
});

function formatLesson(lesson: any): Lesson {
  return {
    ...lesson,
    objectives: parseJSON(lesson.objectives, []),
    key_takeaways: parseJSON(lesson.key_takeaways, []),
    micro_lab: parseJSON(lesson.micro_lab, null),
    prerequisites: parseJSON(lesson.prerequisites, [])
  };
}
