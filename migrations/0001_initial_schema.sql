-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  is_admin INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phase INTEGER NOT NULL, -- 0=Networking, 1=Cybersecurity, 2=CDN, 3=WAF/Bot/API, 4=Incident
  phase_name TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  content TEXT NOT NULL, -- Full markdown lesson content
  reading_time_min INTEGER DEFAULT 10,
  difficulty TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
  objectives TEXT, -- JSON array of learning objectives
  key_takeaways TEXT, -- JSON array of key points
  micro_lab TEXT, -- JSON object with lab instructions
  prerequisites TEXT, -- JSON array of lesson IDs
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  question_type TEXT NOT NULL, -- mcq, multiple_correct, short_answer, scenario
  question_text TEXT NOT NULL,
  options TEXT, -- JSON array for MCQ options
  correct_answers TEXT NOT NULL, -- JSON array of correct answer indices or text
  explanation TEXT NOT NULL, -- Why answer is correct/incorrect
  difficulty TEXT DEFAULT 'medium',
  points INTEGER DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Daily plan table (generated/assigned to users)
CREATE TABLE IF NOT EXISTS daily_plan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  lesson_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, skipped
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  UNIQUE(user_id, date)
);

-- Daily progress tracking
CREATE TABLE IF NOT EXISTS daily_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  lesson_id INTEGER NOT NULL,
  time_spent_min INTEGER DEFAULT 0,
  lesson_completed INTEGER DEFAULT 0,
  quiz_completed INTEGER DEFAULT 0,
  quiz_score REAL DEFAULT 0.0, -- Percentage 0-100
  status TEXT DEFAULT 'in_progress', -- in_progress, completed, needs_remediation
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  UNIQUE(user_id, date, lesson_id)
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  user_answer TEXT NOT NULL, -- JSON array or text
  is_correct INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  attempt_number INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
);

-- Incident scenarios table
CREATE TABLE IF NOT EXISTS incident_scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- credential_stuffing, false_positive, api_abuse, ddos, cache_poisoning, origin_failure
  difficulty TEXT DEFAULT 'intermediate',
  description TEXT NOT NULL,
  initial_state TEXT NOT NULL, -- JSON object describing the situation
  decision_points TEXT NOT NULL, -- JSON array of decision trees
  optimal_path TEXT NOT NULL, -- JSON array of correct decision IDs
  learning_objectives TEXT, -- JSON array
  time_limit_min INTEGER DEFAULT 15,
  required_phase INTEGER DEFAULT 3, -- Minimum phase required to unlock
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Incident attempts table
CREATE TABLE IF NOT EXISTS incident_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  incident_id INTEGER NOT NULL,
  decisions_made TEXT NOT NULL, -- JSON array of decision IDs chosen
  score INTEGER DEFAULT 0, -- 0-100
  time_taken_min INTEGER,
  outcome TEXT, -- success, partial, failure
  feedback TEXT, -- Generated feedback on performance
  attempt_number INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (incident_id) REFERENCES incident_scenarios(id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL, -- streak_7, streak_30, phase_complete, perfect_quiz, incident_master
  achievement_name TEXT NOT NULL,
  description TEXT,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User knowledge scores (domain-specific tracking)
CREATE TABLE IF NOT EXISTS knowledge_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  domain TEXT NOT NULL, -- networking, web, tls, waf, bot, api, incident_response
  score REAL DEFAULT 0.0, -- 0-100
  questions_answered INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, domain)
);

-- Mentor/Coach notes (admin feature)
CREATE TABLE IF NOT EXISTS mentor_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  admin_id TEXT NOT NULL,
  note_type TEXT DEFAULT 'feedback', -- feedback, assignment, concern, praise
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Custom assignments (coach mode)
CREATE TABLE IF NOT EXISTS custom_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  admin_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT, -- YYYY-MM-DD
  status TEXT DEFAULT 'assigned', -- assigned, in_progress, completed
  priority TEXT DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_phase ON lessons(phase, day_number);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson ON quiz_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_daily_plan_user_date ON daily_plan(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user ON daily_progress(user_id, date);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_lesson ON quiz_attempts(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_incident_attempts_user ON incident_attempts(user_id, incident_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_scores_user ON knowledge_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
