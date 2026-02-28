# Security Architect Training Platform

A comprehensive, mobile-first web application that trains complete beginners into expert Security Architects, specializing in Networking, Cybersecurity fundamentals, CDN/WAF/Bot/API security, and real-time incident handling.

## Overview

This platform provides:
- **50 structured lessons** across 5 phases (Networking → Cybersecurity → CDN/Edge → WAF/Bot/API → Incident Response)
- **200+ quiz questions** with detailed explanations
- **10+ incident simulations** with decision trees
- **Adaptive learning** system that adjusts difficulty based on performance
- **Comprehensive progress tracking** and skill assessments
- **Coach mode** for mentors to monitor and guide learners

## Tech Stack

### Backend
- **Hono** - Fast, lightweight web framework for Cloudflare Workers
- **Cloudflare Workers** - Edge runtime for API
- **Cloudflare D1** - SQLite-based distributed database
- **TypeScript** - Type-safe development

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **Mobile-first design** - Optimized for iPhone and mobile devices

## Project Structure

```
webapp/
├── src/
│   ├── index.tsx              # Main Hono application
│   ├── routes/                # API route handlers
│   │   ├── auth.ts            # Authentication
│   │   ├── lessons.ts         # Lesson management
│   │   ├── daily.ts           # Daily plan generation
│   │   ├── quiz.ts            # Quiz with adaptive logic
│   │   ├── incidents.ts       # Incident simulations
│   │   ├── progress.ts        # Progress tracking
│   │   └── admin.ts           # Coach mode
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript definitions
├── migrations/
│   └── 0001_initial_schema.sql # Database schema
├── seed.sql                    # Comprehensive seed data
├── public/                     # Static assets
├── ecosystem.config.cjs        # PM2 configuration
├── wrangler.jsonc              # Cloudflare configuration
├── vite.config.ts              # Vite build config
└── package.json

```

## Curriculum

### Phase 0: Networking Foundations (Days 1-10)
- OSI Model & TCP/IP
- IPv4/IPv6, Subnetting, CIDR
- TCP 3-way handshake, UDP
- DNS, HTTP/HTTPS, TLS
- Load balancing, caching, proxies
- Network diagnostic tools

### Phase 1: Cybersecurity Foundations (Days 11-20)
- CIA Triad, Threat Modeling
- Authentication & Authorization
- OWASP Top 10 (complete coverage)
- XSS, SQL Injection, CSRF, SSRF
- Security headers (CSP, HSTS, etc.)
- Encryption, hashing, salting
- Incident Response fundamentals

### Phase 2: CDN & Edge Architecture (Days 21-30)
- CDN architecture (edge, origin shield)
- Cache keys, TTL strategies
- Cache control patterns
- Origin protection strategies
- Edge computing & workers
- Traffic steering & failover
- Multi-CDN strategies

### Phase 3: WAF / Bot / API Security (Days 31-40)
- WAF fundamentals & tuning
- Bot detection & management
- API security best practices
- Rate limiting patterns
- DDoS mitigation (L3/L4/L7)
- JWT security
- API gateway security

### Phase 4: Incident Response Simulations (Days 41-50)
- Incident detection & triage
- DDoS incident response
- Credential stuffing handling
- False positive resolution
- API abuse response
- Cache poisoning mitigation
- Origin failure recovery
- Traffic spike analysis
- Bot bypass handling
- Post-mortem best practices

## Features

### Adaptive Learning System
- **Quiz Performance Tracking**: <60% triggers remediation mode
- **Automatic Difficulty Adjustment**: Strong performance unlocks harder content
- **Personalized Revision Schedule**: Weak topics get extra review
- **Knowledge Domain Scoring**: Track mastery across 7 domains

### Progress Tracking
- **Daily Streak Counter**: Gamification for consistent learning
- **Time Spent Tracking**: Monitor engagement
- **Quiz Averages**: Overall and per-lesson performance
- **Weak Topic Identification**: Focus areas for improvement
- **Readiness Level**: Beginner → Junior → Mid → Senior → Expert
- **Achievement System**: Unlock badges for milestones

### Coach Mode (Admin Features)
- View all users and their progress
- Detailed quiz attempt analysis
- Incident simulation performance
- Add mentor notes and feedback
- Assign custom tasks with due dates
- Export user progress as JSON

## Local Development Setup

### 1. Install Dependencies
```bash
cd /home/user/webapp
npm install
```

### 2. Create D1 Database (First Time Only)
```bash
# Create production database
npm run db:create

# Copy the database_id from output and update wrangler.jsonc
```

### 3. Apply Migrations
```bash
# Create local database and apply schema
npm run db:migrate:local
```

### 4. Seed Database
```bash
# Load 50 lessons, 200 quiz questions, 10 incident scenarios
npm run db:seed:local
```

### 5. Build Application
```bash
npm run build
```

### 6. Start Development Server (PM2)
```bash
# Clean port first
npm run clean-port

# Start with PM2
npm run start:pm2

# Check logs
npm run logs:pm2
```

### 7. Access Application
```
http://localhost:3000
```

## Database Management

### Reset Local Database (Wipe & Reseed)
```bash
npm run db:reset
```

### Execute SQL Queries
```bash
# Local database
wrangler d1 execute webapp-production --local --command="SELECT * FROM lessons LIMIT 5"

# Production database
wrangler d1 execute webapp-production --command="SELECT COUNT(*) FROM users"
```

### Migrations
```bash
# Create new migration
# Add file: migrations/0002_your_migration.sql

# Apply to local
npm run db:migrate:local

# Apply to production
npm run db:migrate:prod
```

## API Endpoints

### Authentication
- `POST /api/auth/guest` - Create/login guest user
- `GET /api/auth/me/:userId` - Get user info

### Lessons
- `GET /api/lessons` - List all lessons (with optional phase filter)
- `GET /api/lessons/:id` - Get lesson details + quiz questions
- `GET /api/lessons/:id/can-access` - Check prerequisites

### Daily Learning
- `GET /api/daily/today?userId=X` - Get today's lesson (auto-generated)
- `POST /api/daily/start` - Start lesson (create progress record)
- `POST /api/daily/complete-reading` - Mark lesson as read

### Quizzes
- `GET /api/quiz/:lessonId?userId=X` - Get quiz questions
- `POST /api/quiz/submit` - Submit answers (returns score + adaptive feedback)

### Incidents
- `GET /api/incidents?userId=X` - List all incident scenarios
- `GET /api/incidents/:id?userId=X` - Get scenario details
- `POST /api/incidents/:id/attempt` - Submit incident decisions

### Progress
- `GET /api/progress/summary?userId=X` - Comprehensive progress summary
- `GET /api/progress/history?userId=X` - Recent activity history
- `GET /api/progress/weak-areas?userId=X` - Topics needing review
- `GET /api/progress/achievements?userId=X` - Earned achievements

### Admin (Coach Mode)
**Requires `X-Admin-Token` header**
- `GET /api/admin/users` - List all users with progress
- `GET /api/admin/user/:userId/progress` - Detailed user analysis
- `POST /api/admin/mentor-note` - Add coaching feedback
- `POST /api/admin/assign` - Assign custom task
- `GET /api/admin/export/:userId` - Export user data as JSON

## Deployment

### Production Deployment to Cloudflare Pages

1. **Setup Cloudflare API Key**
   - Visit Cloudflare Dashboard
   - Get API token with Pages and D1 permissions
   - Store securely

2. **Create Production Database**
   ```bash
   npm run db:create
   # Update database_id in wrangler.jsonc
   ```

3. **Apply Production Migrations**
   ```bash
   npm run db:migrate:prod
   ```

4. **Seed Production Database**
   ```bash
   wrangler d1 execute webapp-production --file=./seed.sql
   ```

5. **Deploy Application**
   ```bash
   npm run deploy
   ```

6. **Set Environment Variables** (if needed)
   ```bash
   wrangler pages secret put SEED_TOKEN --project-name webapp
   ```

## Adaptive Learning Logic

### Quiz Scoring
- Each question has points (typically 10-15)
- Total score calculated as percentage
- Explanations provided for all answers

### Performance-Based Adaptation
- **<60% score**: Needs remediation
  - Repeat lesson tomorrow
  - Add to revision schedule
  - Provide simpler explanations
  
- **60-85% score**: Normal progression
  - Move to next lesson
  - Standard difficulty maintained

- **>85% score**: Advanced track
  - Unlock harder content
  - Optional advanced readings
  - Skip basic reviews

### Knowledge Domain Tracking
System tracks mastery across 7 domains:
1. Networking
2. Web protocols
3. TLS/Security
4. WAF/Filtering
5. Bot management
6. API security
7. Incident response

Each quiz updates relevant domain scores, identifying weak areas.

## Incident Simulation System

### Decision Tree Structure
1. **Initial State**: Metrics, alerts, context
2. **Decision Points**: Multiple choice with consequences
3. **Scoring**: Each decision earns points
4. **Outcomes**: Success, Partial, or Failure
5. **Feedback**: Detailed explanation of decisions
6. **Optimal Path**: Best decision sequence shown after attempt

### Scoring Algorithm
- Each decision has a score (0-100)
- Final score is average of all decisions
- 85+ = Success
- 60-84 = Partial
- <60 = Failure

### Example Scenarios
- Credential stuffing attack
- DDoS (HTTP flood)
- WAF false positive
- API scraping/abuse
- Cache poisoning
- Origin failure
- Traffic spike analysis
- Bot bypass attempt

## Mobile-First Design

### Key Features
- Responsive layouts (320px - 2560px)
- Large tap targets (min 44x44px)
- Readable font sizes (16px+ body text)
- Optimized for portrait orientation
- Touch-friendly interactions
- Fast loading (< 2s on 3G)
- Progressive enhancement
- Offline-capable lesson reading (future)

### iPhone Optimization
- Safe area insets respected
- Scroll behaviors optimized
- Input zoom disabled on form fields
- Hardware acceleration for animations
- Lazy loading for images

## Testing

### Manual Testing Checklist
- [ ] Create guest account
- [ ] Complete first lesson
- [ ] Take quiz (intentionally score <60%, 70%, 95%)
- [ ] Verify adaptive behavior
- [ ] Complete incident simulation
- [ ] Check progress dashboard
- [ ] Test coach mode (with admin token)

### API Testing
```bash
# Create user
curl -X POST http://localhost:3000/api/auth/guest \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'

# Get today's lesson
curl "http://localhost:3000/api/daily/today?userId=USER_ID"

# Submit quiz
curl -X POST http://localhost:3000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","lessonId":1,"answers":{"1":3,"2":1}}'
```

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run clean-port
# Or
pm2 delete webapp
```

### Database Not Found
```bash
# Reset local database
npm run db:reset
```

### Build Errors
```bash
# Clean and rebuild
rm -rf dist .wrangler
npm run build
```

### PM2 Logs
```bash
# View logs
npm run logs:pm2

# Or with streaming
pm2 logs webapp
```

## Performance Metrics

### Target Metrics
- **TTFB**: < 200ms (edge cached)
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **API Response**: < 100ms (D1 queries)

### Database Performance
- **D1 Query Time**: ~5-50ms per query
- **Concurrent Users**: 1000+ (Cloudflare Workers scale)
- **Storage Limit**: 2GB (D1 free tier)

## Security Considerations

### Authentication
- Guest mode (no passwords stored)
- Session tokens in HTTP-only cookies (future)
- Rate limiting on auth endpoints

### Admin Access
- Token-based authentication
- Environment variable storage
- Audit logging of admin actions

### Data Privacy
- No PII collected (email optional)
- Progress data belongs to user
- Export functionality for data portability

## Future Enhancements

### Planned Features
- [ ] OAuth authentication (GitHub, Google)
- [ ] Real-time multiplayer incident simulations
- [ ] Video lessons integration
- [ ] Interactive labs (code playgrounds)
- [ ] Certification system
- [ ] Community forum
- [ ] Leaderboards
- [ ] Mobile app (React Native)
- [ ] Offline-first with service workers
- [ ] AI-powered personalized hints

### Content Expansion
- [ ] Advanced topics (Zero Trust, SIEM, Threat Hunting)
- [ ] Vendor-specific modules (Cloudflare, Akamai, Fastly)
- [ ] Compliance (GDPR, SOC 2, PCI DSS)
- [ ] Cloud security (AWS, Azure, GCP)

## Contributing

This is a training platform. Contributions welcome:
1. Fork repository
2. Create feature branch
3. Add lessons, quizzes, or incidents
4. Submit pull request

### Content Guidelines
- Accurate, practical information
- Real-world examples
- Clear explanations for all answers
- Mobile-friendly formatting
- No placeholder content

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check troubleshooting section
- Review API documentation
- Test with provided examples
- Check PM2 logs for errors

## Changelog

### v1.0.0 (2024)
- Initial release
- 50 lessons across 5 phases
- 200+ quiz questions
- 10 incident simulations
- Adaptive learning system
- Progress tracking
- Coach mode

---

**Built with ❤️ for aspiring Security Architects**

Train hard. Secure harder. 🔒
