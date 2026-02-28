import { Hono } from 'hono';
import type { Bindings, IncidentScenario } from '../types';
import { parseJSON } from '../lib/utils';

export const incidentRoutes = new Hono<{ Bindings: Bindings }>();

// Get all incident scenarios
incidentRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const userId = c.req.query('userId');
  const category = c.req.query('category');

  try {
    let query = 'SELECT id, title, slug, category, difficulty, description, time_limit_min, required_phase FROM incident_scenarios';
    const params: any[] = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY required_phase, difficulty';

    const result = await db.prepare(query).bind(...params).all();
    const scenarios = result.results;

    // Add attempt history if userId provided
    if (userId) {
      for (const scenario of scenarios) {
        const attempts = await db.prepare(
          'SELECT score, outcome, created_at FROM incident_attempts WHERE user_id = ? AND incident_id = ? ORDER BY created_at DESC LIMIT 3'
        )
          .bind(userId, scenario.id)
          .all();

        (scenario as any).attempts = attempts.results;
        (scenario as any).best_score = attempts.results.length > 0
          ? Math.max(...attempts.results.map((a: any) => a.score))
          : null;
      }
    }

    return c.json({ scenarios });
  } catch (error) {
    console.error('Get incidents error:', error);
    return c.json({ error: 'Failed to fetch incidents' }, 500);
  }
});

// Get single incident scenario
incidentRoutes.get('/:identifier', async (c) => {
  const db = c.env.DB;
  const identifier = c.req.param('identifier');
  const userId = c.req.query('userId');

  try {
    let scenario;
    if (/^\d+$/.test(identifier)) {
      scenario = await db.prepare('SELECT * FROM incident_scenarios WHERE id = ?')
        .bind(parseInt(identifier))
        .first();
    } else {
      scenario = await db.prepare('SELECT * FROM incident_scenarios WHERE slug = ?')
        .bind(identifier)
        .first();
    }

    if (!scenario) {
      return c.json({ error: 'Incident scenario not found' }, 404);
    }

    const formatted: IncidentScenario = {
      ...scenario,
      initial_state: parseJSON(scenario.initial_state as string, {}),
      decision_points: parseJSON(scenario.decision_points as string, []),
      optimal_path: parseJSON(scenario.optimal_path as string, []),
      learning_objectives: parseJSON(scenario.learning_objectives as string, [])
    } as IncidentScenario;

    // Get user's attempts
    let attempts = [];
    if (userId) {
      const attemptsResult = await db.prepare(
        'SELECT * FROM incident_attempts WHERE user_id = ? AND incident_id = ? ORDER BY created_at DESC'
      )
        .bind(userId, scenario.id)
        .all();
      attempts = attemptsResult.results.map((a: any) => ({
        ...a,
        decisions_made: parseJSON(a.decisions_made, [])
      }));
    }

    return c.json({ scenario: formatted, attempts });
  } catch (error) {
    console.error('Get incident error:', error);
    return c.json({ error: 'Failed to fetch incident' }, 500);
  }
});

// Submit incident attempt
incidentRoutes.post('/:incidentId/attempt', async (c) => {
  const db = c.env.DB;
  const incidentId = parseInt(c.req.param('incidentId'));
  const { userId, decisions, timeTaken } = await c.req.json();

  if (!userId || !decisions || !Array.isArray(decisions)) {
    return c.json({ error: 'userId and decisions array required' }, 400);
  }

  try {
    // Get incident scenario
    const scenario = await db.prepare('SELECT * FROM incident_scenarios WHERE id = ?')
      .bind(incidentId)
      .first();

    if (!scenario) {
      return c.json({ error: 'Incident not found' }, 404);
    }

    const optimalPath = parseJSON<string[]>(scenario.optimal_path as string, []);
    const decisionPoints = parseJSON(scenario.decision_points as string, []);

    // Calculate score
    const { score, outcome, feedback } = calculateIncidentScore(
      decisions,
      optimalPath,
      decisionPoints
    );

    // Get attempt number
    const previousAttempts = await db.prepare(
      'SELECT MAX(attempt_number) as max_attempt FROM incident_attempts WHERE user_id = ? AND incident_id = ?'
    )
      .bind(userId, incidentId)
      .first();

    const attemptNumber = (previousAttempts?.max_attempt || 0) + 1;

    // Save attempt
    await db.prepare(`
      INSERT INTO incident_attempts 
      (user_id, incident_id, decisions_made, score, time_taken_min, outcome, feedback, attempt_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        userId,
        incidentId,
        JSON.stringify(decisions),
        score,
        timeTaken || 0,
        outcome,
        feedback,
        attemptNumber
      )
      .run();

    // Update knowledge scores for incident_response domain
    await updateIncidentKnowledgeScore(db, userId, score);

    // Check for incident master achievement
    if (score >= 90) {
      const existing = await db.prepare(
        'SELECT id FROM achievements WHERE user_id = ? AND achievement_type = ? AND DATE(earned_at) = DATE(?)'
      )
        .bind(userId, 'incident_master', new Date().toISOString())
        .first();

      if (!existing) {
        await db.prepare(`
          INSERT INTO achievements (user_id, achievement_type, achievement_name, description)
          VALUES (?, ?, ?, ?)
        `)
          .bind(
            userId,
            'incident_master',
            'Incident Master',
            'Scored 90+ on an incident simulation'
          )
          .run();
      }
    }

    return c.json({
      score,
      outcome,
      feedback,
      optimal_path: optimalPath,
      your_path: decisions,
      attempt_number: attemptNumber
    });
  } catch (error) {
    console.error('Submit incident error:', error);
    return c.json({ error: 'Failed to submit incident attempt' }, 500);
  }
});

function calculateIncidentScore(
  userDecisions: string[],
  optimalPath: string[],
  decisionPoints: any[]
): { score: number; outcome: string; feedback: string } {
  let score = 0;
  const maxScore = 100;
  const pointsPerDecision = maxScore / optimalPath.length;

  let feedback = 'Decision Analysis:\n\n';
  
  for (let i = 0; i < userDecisions.length; i++) {
    const userChoice = userDecisions[i];
    const optimalChoice = optimalPath[i];
    
    // Find the decision point
    const decisionPoint = decisionPoints.find((dp: any) => {
      return dp.options.some((opt: any) => opt.id === userChoice || opt.id === optimalChoice);
    });

    if (decisionPoint) {
      const chosenOption = decisionPoint.options.find((opt: any) => opt.id === userChoice);
      
      if (userChoice === optimalChoice) {
        score += pointsPerDecision;
        feedback += `✓ Step ${i + 1}: Correct! ${chosenOption?.feedback || ''}\n`;
      } else {
        score += (chosenOption?.score || 0) * pointsPerDecision / 100;
        feedback += `✗ Step ${i + 1}: ${chosenOption?.feedback || 'Not optimal.'}\n`;
      }
    }
  }

  let outcome: string;
  if (score >= 85) {
    outcome = 'success';
    feedback += '\n🎯 Excellent incident handling! You made optimal decisions.';
  } else if (score >= 60) {
    outcome = 'partial';
    feedback += '\n⚠️ Incident contained, but some improvements needed.';
  } else {
    outcome = 'failure';
    feedback += '\n❌ Incident escalated. Review best practices and try again.';
  }

  return { score: Math.round(score), outcome, feedback };
}

async function updateIncidentKnowledgeScore(db: D1Database, userId: string, score: number) {
  try {
    const current = await db.prepare(
      'SELECT * FROM knowledge_scores WHERE user_id = ? AND domain = ?'
    )
      .bind(userId, 'incident_response')
      .first();

    if (current) {
      const newAnswered = (current.questions_answered as number) + 1;
      const newCorrect = (current.questions_correct as number) + (score / 100);
      const newScore = Math.round((newCorrect / newAnswered) * 100);

      await db.prepare(`
        UPDATE knowledge_scores 
        SET score = ?, questions_answered = ?, questions_correct = ?, last_updated = CURRENT_TIMESTAMP
        WHERE user_id = ? AND domain = ?
      `)
        .bind(newScore, newAnswered, newCorrect, userId, 'incident_response')
        .run();
    }
  } catch (error) {
    console.error('Update incident knowledge score error:', error);
  }
}
