export interface User {
  id: string;
  username: string;
  email?: string;
  is_admin: number;
  created_at: string;
  last_login?: string;
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  phase: number;
  phase_name: string;
  day_number: number;
  content: string;
  reading_time_min: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  objectives: string[];
  key_takeaways: string[];
  micro_lab?: MicroLab;
  prerequisites: number[];
  created_at: string;
}

export interface MicroLab {
  title: string;
  steps: string[];
  expected_outcome: string;
}

export interface QuizQuestion {
  id: number;
  lesson_id: number;
  question_type: 'mcq' | 'multiple_correct' | 'short_answer' | 'scenario';
  question_text: string;
  options?: string[];
  correct_answers: (string | number)[];
  explanation: string;
  difficulty: string;
  points: number;
  created_at: string;
}

export interface DailyPlan {
  id: number;
  user_id: string;
  date: string;
  lesson_id: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  created_at: string;
}

export interface DailyProgress {
  id: number;
  user_id: string;
  date: string;
  lesson_id: number;
  time_spent_min: number;
  lesson_completed: number;
  quiz_completed: number;
  quiz_score: number;
  status: 'in_progress' | 'completed' | 'needs_remediation';
  completed_at?: string;
}

export interface QuizAttempt {
  id: number;
  user_id: string;
  lesson_id: number;
  question_id: number;
  user_answer: string | string[];
  is_correct: number;
  points_earned: number;
  attempt_number: number;
  created_at: string;
}

export interface IncidentScenario {
  id: number;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  description: string;
  initial_state: IncidentState;
  decision_points: DecisionPoint[];
  optimal_path: string[];
  learning_objectives: string[];
  time_limit_min: number;
  required_phase: number;
  created_at: string;
}

export interface IncidentState {
  time: string;
  metrics: Record<string, any>;
  alerts: string[];
  context: string;
}

export interface DecisionPoint {
  id: string;
  question: string;
  options: DecisionOption[];
}

export interface DecisionOption {
  id: string;
  text: string;
  next?: string; // Next decision point ID
  outcome?: string; // Final outcome if terminal
  score: number; // Points for this choice
  feedback: string;
}

export interface IncidentAttempt {
  id: number;
  user_id: string;
  incident_id: number;
  decisions_made: string[];
  score: number;
  time_taken_min: number;
  outcome: 'success' | 'partial' | 'failure';
  feedback: string;
  attempt_number: number;
  created_at: string;
}

export interface Achievement {
  id: number;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description?: string;
  earned_at: string;
}

export interface KnowledgeScore {
  id: number;
  user_id: string;
  domain: string;
  score: number;
  questions_answered: number;
  questions_correct: number;
  last_updated: string;
}

export interface MentorNote {
  id: number;
  user_id: string;
  admin_id: string;
  note_type: 'feedback' | 'assignment' | 'concern' | 'praise';
  content: string;
  created_at: string;
}

export interface CustomAssignment {
  id: number;
  user_id: string;
  admin_id: string;
  title: string;
  description: string;
  due_date?: string;
  status: 'assigned' | 'in_progress' | 'completed';
  priority: string;
  created_at: string;
  completed_at?: string;
}

export interface ProgressSummary {
  streak_days: number;
  total_time_min: number;
  lessons_completed: number;
  quiz_average: number;
  knowledge_scores: Record<string, number>;
  weak_topics: string[];
  readiness_level: string;
  achievements: Achievement[];
  current_phase: number;
  next_unlock: string;
}

export interface Bindings {
  DB: D1Database;
  SEED_TOKEN?: string;
}
