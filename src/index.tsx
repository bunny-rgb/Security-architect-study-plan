import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Bindings } from './types';
import { authRoutes } from './routes/auth';
import { lessonRoutes } from './routes/lessons';
import { dailyRoutes } from './routes/daily';
import { quizRoutes } from './routes/quiz';
import { incidentRoutes } from './routes/incidents';
import { progressRoutes } from './routes/progress';
import { adminRoutes } from './routes/admin';

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());
app.use('/api/*', cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/lessons', lessonRoutes);
app.route('/api/daily', dailyRoutes);
app.route('/api/quiz', quizRoutes);
app.route('/api/incidents', incidentRoutes);
app.route('/api/progress', progressRoutes);
app.route('/api/admin', adminRoutes);

// Root route
app.get('/', (c) => {
  return c.json({
    message: 'Security Architect Training API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/guest',
      lessons: '/api/lessons',
      daily: '/api/daily/today',
      quiz: '/api/quiz/:lessonId',
      incidents: '/api/incidents',
      progress: '/api/progress/summary',
      admin: '/api/admin/*',
      health: '/health'
    }
  });
});

export default app;
