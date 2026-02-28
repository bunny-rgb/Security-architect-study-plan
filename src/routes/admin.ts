import { Hono } from 'hono';
import type { Bindings } from '../types';

export const adminRoutes = new Hono<{ Bindings: Bindings }>();

// Middleware to check admin access (simple token-based for now)
const checkAdmin = async (c: any, next: any) => {
  const token = c.req.header('X-Admin-Token');
  const seedToken = c.env.SEED_TOKEN || 'admin123';
  
  if (token !== seedToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  await next();
};

adminRoutes.use('/*', checkAdmin);

// Get all users with progress
adminRoutes.get('/users', async (c) => {
  const db = c.env.DB;

  try {
    const result = await db.prepare(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.created_at,
        u.last_login,
        COUNT(DISTINCT dp.id) as lessons_completed,
        AVG(dp.quiz_score) as avg_quiz_score
      FROM users u
      LEFT JOIN daily_progress dp ON u.id = dp.user_id AND dp.lesson_completed = 1
      WHERE u.is_admin = 0
      GROUP BY u.id
      ORDER BY u.last_login DESC
    `).all();

    return c.json({ users: result.results });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get detailed user progress
adminRoutes.get('/user/:userId/progress', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');

  try {
    // User info
    const user = await db.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Progress summary
    const progress = await db.prepare(`
      SELECT * FROM daily_progress WHERE user_id = ? ORDER BY date DESC
    `)
      .bind(userId)
      .all();

    // Knowledge scores
    const knowledgeScores = await db.prepare(
      'SELECT * FROM knowledge_scores WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    // Recent quiz attempts
    const quizAttempts = await db.prepare(`
      SELECT qa.*, l.title as lesson_title, qq.question_text
      FROM quiz_attempts qa
      JOIN lessons l ON qa.lesson_id = l.id
      JOIN quiz_questions qq ON qa.question_id = qq.id
      WHERE qa.user_id = ?
      ORDER BY qa.created_at DESC
      LIMIT 50
    `)
      .bind(userId)
      .all();

    // Incident attempts
    const incidentAttempts = await db.prepare(`
      SELECT ia.*, is_scenario.title as scenario_title
      FROM incident_attempts ia
      JOIN incident_scenarios is_scenario ON ia.incident_id = is_scenario.id
      WHERE ia.user_id = ?
      ORDER BY ia.created_at DESC
    `)
      .bind(userId)
      .all();

    // Mentor notes
    const notes = await db.prepare(
      'SELECT * FROM mentor_notes WHERE user_id = ? ORDER BY created_at DESC'
    )
      .bind(userId)
      .all();

    // Custom assignments
    const assignments = await db.prepare(
      'SELECT * FROM custom_assignments WHERE user_id = ? ORDER BY created_at DESC'
    )
      .bind(userId)
      .all();

    return c.json({
      user,
      progress: progress.results,
      knowledge_scores: knowledgeScores.results,
      quiz_attempts: quizAttempts.results,
      incident_attempts: incidentAttempts.results,
      mentor_notes: notes.results,
      assignments: assignments.results
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    return c.json({ error: 'Failed to fetch user progress' }, 500);
  }
});

// Add mentor note
adminRoutes.post('/mentor-note', async (c) => {
  const db = c.env.DB;
  const { userId, adminId, noteType, content } = await c.req.json();

  if (!userId || !adminId || !content) {
    return c.json({ error: 'userId, adminId, and content required' }, 400);
  }

  try {
    await db.prepare(`
      INSERT INTO mentor_notes (user_id, admin_id, note_type, content)
      VALUES (?, ?, ?, ?)
    `)
      .bind(userId, adminId, noteType || 'feedback', content)
      .run();

    const note = await db.prepare(
      'SELECT * FROM mentor_notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
    )
      .bind(userId)
      .first();

    return c.json({ note }, 201);
  } catch (error) {
    console.error('Add note error:', error);
    return c.json({ error: 'Failed to add note' }, 500);
  }
});

// Assign custom task
adminRoutes.post('/assign', async (c) => {
  const db = c.env.DB;
  const { userId, adminId, title, description, dueDate, priority } = await c.req.json();

  if (!userId || !adminId || !title || !description) {
    return c.json({ error: 'userId, adminId, title, and description required' }, 400);
  }

  try {
    await db.prepare(`
      INSERT INTO custom_assignments (user_id, admin_id, title, description, due_date, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, 'assigned')
    `)
      .bind(userId, adminId, title, description, dueDate || null, priority || 'medium')
      .run();

    const assignment = await db.prepare(
      'SELECT * FROM custom_assignments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
    )
      .bind(userId)
      .first();

    return c.json({ assignment }, 201);
  } catch (error) {
    console.error('Assign task error:', error);
    return c.json({ error: 'Failed to assign task' }, 500);
  }
});

// Export user progress as JSON
adminRoutes.get('/export/:userId', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');

  try {
    const user = await db.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const progress = await db.prepare(
      'SELECT * FROM daily_progress WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    const knowledgeScores = await db.prepare(
      'SELECT * FROM knowledge_scores WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    const quizAttempts = await db.prepare(
      'SELECT * FROM quiz_attempts WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    const incidentAttempts = await db.prepare(
      'SELECT * FROM incident_attempts WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    const achievements = await db.prepare(
      'SELECT * FROM achievements WHERE user_id = ?'
    )
      .bind(userId)
      .all();

    const exportData = {
      user,
      progress: progress.results,
      knowledge_scores: knowledgeScores.results,
      quiz_attempts: quizAttempts.results,
      incident_attempts: incidentAttempts.results,
      achievements: achievements.results,
      exported_at: new Date().toISOString()
    };

    return c.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    return c.json({ error: 'Failed to export data' }, 500);
  }
});
