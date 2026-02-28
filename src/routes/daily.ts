import { Hono } from 'hono';
import type { Bindings } from '../types';
import { formatDate, parseJSON } from '../lib/utils';

export const dailyRoutes = new Hono<{ Bindings: Bindings }>();

// Get today's plan for user
dailyRoutes.get('/today', async (c) => {
  const db = c.env.DB;
  const userId = c.req.query('userId');

  if (!userId) {
    return c.json({ error: 'userId required' }, 400);
  }

  try {
    const today = formatDate();

    // Check if plan exists for today
    let plan = await db.prepare(
      'SELECT * FROM daily_plan WHERE user_id = ? AND date = ?'
    )
      .bind(userId, today)
      .first();

    // If no plan, generate one
    if (!plan) {
      plan = await generateDailyPlan(db, userId, today);
    }

    if (!plan) {
      return c.json({ error: 'No lesson available' }, 404);
    }

    // Get the lesson details
    const lesson = await db.prepare('SELECT * FROM lessons WHERE id = ?')
      .bind(plan.lesson_id)
      .first();

    if (!lesson) {
      return c.json({ error: 'Lesson not found' }, 404);
    }

    // Get progress for today
    const progress = await db.prepare(
      'SELECT * FROM daily_progress WHERE user_id = ? AND date = ? AND lesson_id = ?'
    )
      .bind(userId, today, plan.lesson_id)
      .first();

    // Format lesson
    const formattedLesson = {
      ...lesson,
      objectives: parseJSON(lesson.objectives, []),
      key_takeaways: parseJSON(lesson.key_takeaways, []),
      micro_lab: parseJSON(lesson.micro_lab, null),
      prerequisites: parseJSON(lesson.prerequisites, [])
    };

    return c.json({
      plan,
      lesson: formattedLesson,
      progress: progress || null
    });
  } catch (error) {
    console.error('Get today error:', error);
    return c.json({ error: 'Failed to fetch today\'s plan' }, 500);
  }
});

// Start lesson (create progress record)
dailyRoutes.post('/start', async (c) => {
  const db = c.env.DB;
  const { userId, lessonId } = await c.req.json();

  if (!userId || !lessonId) {
    return c.json({ error: 'userId and lessonId required' }, 400);
  }

  try {
    const today = formatDate();

    // Check if progress already exists
    const existing = await db.prepare(
      'SELECT * FROM daily_progress WHERE user_id = ? AND date = ? AND lesson_id = ?'
    )
      .bind(userId, today, lessonId)
      .first();

    if (existing) {
      return c.json({ progress: existing });
    }

    // Create new progress record
    await db.prepare(`
      INSERT INTO daily_progress 
      (user_id, date, lesson_id, time_spent_min, lesson_completed, quiz_completed, quiz_score, status)
      VALUES (?, ?, ?, 0, 0, 0, 0, 'in_progress')
    `)
      .bind(userId, today, lessonId)
      .run();

    const progress = await db.prepare(
      'SELECT * FROM daily_progress WHERE user_id = ? AND date = ? AND lesson_id = ?'
    )
      .bind(userId, today, lessonId)
      .first();

    // Update daily plan status
    await db.prepare(
      'UPDATE daily_plan SET status = ? WHERE user_id = ? AND date = ?'
    )
      .bind('in_progress', userId, today)
      .run();

    return c.json({ progress }, 201);
  } catch (error) {
    console.error('Start lesson error:', error);
    return c.json({ error: 'Failed to start lesson' }, 500);
  }
});

// Mark lesson as read
dailyRoutes.post('/complete-reading', async (c) => {
  const db = c.env.DB;
  const { userId, lessonId, timeSpent } = await c.req.json();

  if (!userId || !lessonId) {
    return c.json({ error: 'userId and lessonId required' }, 400);
  }

  try {
    const today = formatDate();

    await db.prepare(`
      UPDATE daily_progress 
      SET lesson_completed = 1, time_spent_min = time_spent_min + ?
      WHERE user_id = ? AND date = ? AND lesson_id = ?
    `)
      .bind(timeSpent || 0, userId, today, lessonId)
      .run();

    const progress = await db.prepare(
      'SELECT * FROM daily_progress WHERE user_id = ? AND date = ? AND lesson_id = ?'
    )
      .bind(userId, today, lessonId)
      .first();

    return c.json({ progress });
  } catch (error) {
    console.error('Complete reading error:', error);
    return c.json({ error: 'Failed to update progress' }, 500);
  }
});

// Generate daily plan for user
async function generateDailyPlan(db: D1Database, userId: string, date: string) {
  try {
    // Get user's latest progress
    const latestProgress = await db.prepare(
      'SELECT * FROM daily_progress WHERE user_id = ? ORDER BY date DESC, id DESC LIMIT 1'
    )
      .bind(userId)
      .first();

    let nextLessonId: number;

    if (!latestProgress) {
      // First lesson for new user
      const firstLesson = await db.prepare(
        'SELECT id FROM lessons ORDER BY phase, day_number LIMIT 1'
      )
        .first();
      
      nextLessonId = firstLesson?.id as number;
    } else {
      // Check if needs remediation
      if (latestProgress.status === 'needs_remediation' || latestProgress.quiz_score < 60) {
        // Repeat same lesson
        nextLessonId = latestProgress.lesson_id as number;
      } else {
        // Get next lesson in sequence
        const currentLesson = await db.prepare(
          'SELECT phase, day_number FROM lessons WHERE id = ?'
        )
          .bind(latestProgress.lesson_id)
          .first();

        const nextLesson = await db.prepare(`
          SELECT id FROM lessons 
          WHERE (phase = ? AND day_number > ?) OR (phase > ?)
          ORDER BY phase, day_number 
          LIMIT 1
        `)
          .bind(currentLesson?.phase, currentLesson?.day_number, currentLesson?.phase)
          .first();

        if (!nextLesson) {
          // All lessons completed
          return null;
        }

        nextLessonId = nextLesson.id as number;
      }
    }

    // Create plan
    await db.prepare(
      'INSERT INTO daily_plan (user_id, date, lesson_id, status) VALUES (?, ?, ?, ?)'
    )
      .bind(userId, date, nextLessonId, 'pending')
      .run();

    const plan = await db.prepare(
      'SELECT * FROM daily_plan WHERE user_id = ? AND date = ?'
    )
      .bind(userId, date)
      .first();

    return plan;
  } catch (error) {
    console.error('Generate plan error:', error);
    return null;
  }
}
