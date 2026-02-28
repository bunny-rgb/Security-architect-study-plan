# Security Architect Training Platform 🚀

An **iPhone-optimized**, mobile-first web application designed to train beginners into expert security architects with expertise in networking, CDN, WAF, and real-time incident handling.

## 🌟 Live Demo

**Production URL**: https://3000-i70uoxestx7d5lzbs2d85-02b9cc79.sandbox.novita.ai

## ✨ Features

### 🎯 Comprehensive Curriculum
- **Phase 0**: Networking Foundations (OSI/TCP-IP, DNS, HTTP/HTTPS, TLS)
- **Phase 1**: Cybersecurity Fundamentals (OWASP Top 10, Authentication, Encryption)
- **Phase 2**: CDN & Edge Architecture (Caching, Origin Protection, Traffic Steering)
- **Phase 3**: WAF/Bot/API Security (Rule Tuning, Bot Management, DDoS Mitigation)
- **Phase 4**: Real-time Incident Response (Simulations, Decision Trees, Scoring)

### 📱 Mobile-First Design
- iPhone-optimized interface with large tap targets
- Dark theme with smooth animations
- Glass morphism effects and gradient accents
- Progressive Web App (PWA) support
- Offline-friendly lesson content

### 🎮 Gamification & Engagement
- Daily streaks and progress tracking
- Achievement badges and readiness levels
- Domain expertise scores
- Real-time incident simulations with time pressure
- Adaptive learning based on quiz performance

### 📊 Progress Tracking
- Overall completion percentage
- Time invested tracking
- Domain-specific scores (Networking, Web, TLS, WAF, Bot, API, IR)
- Weak topics identification
- Streak tracking (current & longest)

### 🧠 Intelligent Learning System
- **<60% quiz score**: Remediation content
- **60-85% quiz score**: Normal progression
- **>85% quiz score**: Advanced content unlocked
- Non-trivial, real-world problem-based quizzes
- Detailed explanations for every answer

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- Dark theme with custom animations
- Mobile-first responsive design

### Backend
- **Hono** lightweight web framework
- **Cloudflare Workers** edge runtime
- **Cloudflare D1** SQLite database
- **Wrangler** for development & deployment

### Infrastructure
- **PM2** for process management
- **Cloudflare Pages** for deployment
- Edge-first architecture

## 📦 Project Structure

```
webapp/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home dashboard
│   ├── learn/               # Lesson browser
│   ├── lesson/[id]/         # Lesson detail & reading
│   ├── quiz/[id]/           # Interactive quiz interface
│   ├── incidents/           # Incident simulations
│   │   └── [id]/            # Incident detail & gameplay
│   ├── dashboard/           # Progress tracking
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles & animations
├── src/                      # Hono API
│   ├── index.tsx            # Main entry point
│   ├── routes/              # API endpoints
│   │   ├── auth.ts          # Authentication
│   │   ├── lessons.ts       # Lesson management
│   │   ├── quiz.ts          # Quiz system
│   │   ├── daily.ts         # Daily progress
│   │   ├── progress.ts      # Progress tracking
│   │   ├── incidents.ts     # Incident simulations
│   │   └── admin.ts         # Admin/coach features
│   └── types/               # TypeScript types
├── migrations/               # D1 database schema
│   └── 0001_initial_schema.sql
├── seed.sql                  # Sample data (50 lessons, 200 quizzes, 10 incidents)
├── public/                   # Static assets
├── ecosystem.config.cjs      # PM2 configuration
├── wrangler.jsonc           # Cloudflare configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies & scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Wrangler CLI
- PM2 (pre-installed in sandbox)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create D1 database
npm run db:create

# Apply migrations
npm run db:migrate:local

# Seed data (50 lessons, 200 quizzes, 10 incidents)
npm run db:seed:local
```

### 3. Build Application
```bash
# Build API (Hono)
npm run build:api

# Build Frontend (Next.js)
npm run build:frontend
```

### 4. Start Development Server
```bash
# Clean ports
npm run clean-port

# Start both API & UI with PM2
pm2 start ecosystem.config.cjs

# Check status
pm2 list

# View logs
npm run logs:pm2
```

### 5. Access Application
- **UI**: http://localhost:3000
- **API**: http://localhost:3001/api

## 📱 Pages & Features

### 🏠 Home Dashboard
- Today's lesson plan
- Quick stats (lessons completed, time invested, streak)
- Domain progress overview
- Quick navigation to all sections

### 📚 Learn (Lesson Browser)
- Filter by phase (0-4)
- View all 50 lessons organized by curriculum
- Difficulty indicators (beginner, intermediate, advanced)
- Reading time estimates

### 📖 Lesson Detail
- Immersive reading experience with scroll progress
- Learning objectives & key takeaways
- Hands-on micro-labs
- Smooth animations & dark theme

### 🧠 Quiz Interface
- Single & multiple-choice questions
- Real-time answer checking
- Detailed explanations
- Progress tracking
- Adaptive scoring (remediation/normal/advanced paths)

### 🚨 Incident Response Simulations
- Real-time decision-making under pressure
- Timer-based challenges
- Live metrics tracking
- Decision tree gameplay
- Score & feedback system

### 📊 Progress Dashboard
- Overall completion stats
- Domain expertise breakdown
- Streak tracking
- Weak topics identification
- Readiness level progression
- Achievement badges

## 📊 Database Schema

### Core Tables
- **users**: User accounts & profiles
- **lessons**: 50+ curriculum lessons
- **lesson_modules**: Lesson content chunks
- **daily_plan**: Personalized daily learning paths
- **daily_progress**: Progress tracking
- **quiz_questions**: 200+ quiz questions
- **quiz_attempts**: Quiz submissions & scores
- **incident_scenarios**: Real-world incident simulations
- **incident_attempts**: Incident response attempts
- **achievements**: Gamification badges

## 🎨 Design System

### Colors
- **Dark Background**: `#0a0a0f`
- **Surface**: `#141419`
- **Elevated**: `#1c1c24`
- **Border**: `#2a2a35`
- **Primary (Indigo)**: `#6366f1`
- **Secondary (Purple)**: `#8b5cf6`
- **Accent (Pink)**: `#ec4899`
- **Success (Green)**: `#10b981`
- **Warning (Amber)**: `#f59e0b`
- **Danger (Red)**: `#ef4444`

### Animations
- Fade in, slide up, pulse, bounce
- Card hover effects
- Button glow effects
- Progress bar gradients
- Glass morphism
- Gradient text effects

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/guest` - Create guest user

### Lessons
- `GET /api/lessons` - List all lessons
- `GET /api/lessons/:id` - Get lesson detail

### Daily Progress
- `GET /api/daily/today?userId=:id` - Get today's lesson
- `POST /api/daily/complete` - Mark lesson complete

### Quizzes
- `GET /api/quiz/:lessonId` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers

### Incidents
- `GET /api/incidents` - List incident scenarios
- `GET /api/incidents/:id` - Get incident detail
- `POST /api/incidents/:id/attempt` - Submit incident response

### Progress
- `GET /api/progress/summary?userId=:id` - Get user progress

### Admin
- `POST /api/admin/seed` - Seed database (requires SEED_TOKEN)
- `GET /api/admin/user/:id/progress` - View user progress (coach mode)

## 📈 Adaptive Learning Logic

The platform adjusts content based on quiz performance:

- **Score < 60%**: Triggers remediation lessons
- **Score 60-85%**: Normal progression
- **Score > 85%**: Unlocks advanced content & challenges

## 🎯 Content Highlights

### 50 Curated Lessons
- 10 lessons per phase (Phase 0-4)
- Practical, real-world focus
- 8-15 minute reading time each
- Includes objectives, takeaways, and labs

### 200+ Quiz Questions
- Multiple-choice & multiple-correct formats
- Scenario-based decision trees
- Short answer questions
- All with detailed explanations

### 10 Incident Simulations
- Credential Stuffing
- HTTP Flood DDoS
- WAF False Positives
- API Scraping
- Cache Poisoning
- Origin Failure
- Traffic Spikes
- Bot Bypass
- And more...

## 🚀 Deployment

### Local Development
```bash
pm2 start ecosystem.config.cjs
```

### Production (Cloudflare Pages)
```bash
# Build
npm run build

# Deploy
npm run deploy
```

## 👥 Coach/Admin Mode

Track learner progress:
- View all user attempts
- Assign specific lessons
- Export progress data as JSON
- Add coaching notes

## 🌟 What Makes This Special

### 1. Real-World Focus
- Content based on actual CDN/WAF scenarios
- Industry best practices
- Practical skills over theory

### 2. Engaging Experience
- Beautiful dark UI optimized for reading
- Smooth animations & transitions
- Gamification elements
- Progress visualization

### 3. Adaptive Learning
- Intelligent difficulty adjustment
- Personalized learning paths
- Weak topic identification

### 4. Mobile-First
- iPhone-optimized design
- Large touch targets
- Fast loading times
- PWA support

## 📝 License

MIT License - feel free to use for learning!

## 🙏 Credits

Built with love for aspiring security architects who want to master CDN, WAF, and real-time incident handling.

---

**Start your journey today!** 🚀
