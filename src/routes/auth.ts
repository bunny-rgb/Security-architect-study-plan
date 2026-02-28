import { Hono } from 'hono';
import type { Bindings } from '../types';
import { generateUserId } from '../lib/utils';

export const authRoutes = new Hono<{ Bindings: Bindings }>();

// Guest login - creates or retrieves guest user
authRoutes.post('/guest', async (c) => {
  const db = c.env.DB;
  const { username } = await c.req.json();
  
  if (!username || username.trim().length < 3) {
    return c.json({ error: 'Username must be at least 3 characters' }, 400);
  }

  try {
    // Check if user exists
    const existing = await db.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username.trim())
      .first();

    if (existing) {
      // Update last login
      await db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(existing.id)
        .run();

      return c.json({
        user: existing,
        message: 'Welcome back!'
      });
    }

    // Create new user
    const userId = generateUserId();
    await db.prepare(
      'INSERT INTO users (id, username, is_admin, created_at, last_login) VALUES (?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
    )
      .bind(userId, username.trim())
      .run();

    const newUser = await db.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    // Initialize knowledge scores
    const domains = ['networking', 'web', 'tls', 'waf', 'bot', 'api', 'incident_response'];
    for (const domain of domains) {
      await db.prepare(
        'INSERT INTO knowledge_scores (user_id, domain, score, questions_answered, questions_correct) VALUES (?, ?, 0, 0, 0)'
      )
        .bind(userId, domain)
        .run();
    }

    return c.json({
      user: newUser,
      message: 'Account created! Let\'s start your journey.'
    }, 201);
  } catch (error) {
    console.error('Auth error:', error);
    return c.json({ error: 'Authentication failed' }, 500);
  }
});

// Get current user info
authRoutes.get('/me/:userId', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');

  try {
    const user = await db.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});
