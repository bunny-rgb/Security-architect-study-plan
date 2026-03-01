// Phase definitions with comprehensive content
export interface Phase {
  id: number
  name: string
  shortDesc: string
  icon: string
  totalLessons: number
  unlockRequirements: {
    lessons: number
    xp: number
  }
  color: string
}

export const ALL_PHASES: Phase[] = [
  {
    id: 0,
    name: 'Network Fundamentals',
    shortDesc: 'Master OSI, TCP/IP, DNS, and encryption basics',
    icon: '🌐',
    totalLessons: 10,
    unlockRequirements: { lessons: 0, xp: 0 },
    color: 'blue'
  },
  {
    id: 1,
    name: 'Web Security',
    shortDesc: 'Learn HTTP security, authentication, and OWASP Top 10',
    icon: '🔐',
    totalLessons: 10,
    unlockRequirements: { lessons: 8, xp: 800 },
    color: 'purple'
  },
  {
    id: 2,
    name: 'CDN & Edge Computing',
    shortDesc: 'Optimize with caching, Anycast, and edge functions',
    icon: '⚡',
    totalLessons: 10,
    unlockRequirements: { lessons: 18, xp: 1800 },
    color: 'green'
  },
  {
    id: 3,
    name: 'WAF & Bot Defense',
    shortDesc: 'Block attacks with WAF rules and bot management',
    icon: '🛡️',
    totalLessons: 10,
    unlockRequirements: { lessons: 28, xp: 2800 },
    color: 'orange'
  },
  {
    id: 4,
    name: 'Incident Response',
    shortDesc: 'Handle DDoS, observability, and SOC operations',
    icon: '🚨',
    totalLessons: 10,
    unlockRequirements: { lessons: 38, xp: 3800 },
    color: 'red'
  },
  {
    id: 5,
    name: 'API Security',
    shortDesc: 'Secure REST, GraphQL, OAuth, and OWASP API Top 10',
    icon: '🔌',
    totalLessons: 10,
    unlockRequirements: { lessons: 48, xp: 4800 },
    color: 'indigo'
  },
  {
    id: 6,
    name: 'Observability & Monitoring',
    shortDesc: 'Master logs, metrics, tracing, and SIEM',
    icon: '📊',
    totalLessons: 10,
    unlockRequirements: { lessons: 58, xp: 5800 },
    color: 'cyan'
  }
]

export const BATTLE_ROOM = {
  name: 'Battle Room',
  shortDesc: 'Real-time attack simulations under pressure',
  icon: '⚔️',
  unlockRequirements: { lessons: 40, xp: 4000 }
}

// Daily challenges
export interface DailyChallenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  scenario: string
  logs: string[]
  xpReward: number
}

export const getDailyChallenge = (): DailyChallenge => {
  const challenges: DailyChallenge[] = [
    {
      id: 'challenge-1',
      title: 'Incident: Distributed Layer 7 Attack on /login',
      description: 'Your CDN is reporting a massive spike in POST requests targeting the authentication endpoint. The traffic originates from thousands of residential IPs, bypassing basic rate limits. Legitimate users are experiencing timeouts.',
      difficulty: 'hard',
      scenario: 'DDoS Attack - Application Layer',
      logs: [
        '[14:02:11] WARN: Connections to upstream server exceeded 5000/s',
        '[14:02:12] ERROR: Upstream timeout (504 Gateway Timeout)',
        '[14:02:13] INFO: Analyzing payload <signature>...',
        '[14:02:14] WARN: Suspicious User-Agent rotation detected',
        '[14:02:15] ERROR: System awaiting your WAF rule configuration...'
      ],
      xpReward: 500
    },
    {
      id: 'challenge-2',
      title: 'The "Sneaky SQLi" Bypass Attack',
      description: 'An attacker is attempting to bypass our WAF by using deeply nested, URL-encoded payloads disguised as JSON keys in the /api/users endpoint. Your job is to analyze the traffic logs and construct a custom regex WAF rule to drop the traffic at the CDN edge before it hits our origin servers.',
      difficulty: 'expert',
      scenario: 'SQL Injection - WAF Bypass',
      logs: [
        '[15:30:01] INFO: POST /api/users HTTP/1.1',
        '[15:30:02] WARN: Payload contains nested encoding detected',
        '[15:30:03] ERROR: WAF bypass attempt - encoded single quotes',
        '[15:30:04] INFO: User-Agent: Mozilla/5.0 (compatible; scanner)',
        '[15:30:05] WARN: Awaiting custom WAF rule deployment...'
      ],
      xpReward: 750
    },
    {
      id: 'challenge-3',
      title: 'Certificate Expiration Crisis',
      description: 'Your TLS certificate expires in 60 minutes. Production traffic is at peak (50K req/s). You need to renew, deploy, and test without downtime.',
      difficulty: 'hard',
      scenario: 'Certificate Management - Production Emergency',
      logs: [
        '[09:00:00] WARN: Certificate expires in 60 minutes',
        '[09:00:01] INFO: Current traffic: 50,234 req/s',
        '[09:00:02] ERROR: Renewal process must not cause downtime',
        '[09:00:03] INFO: Staging environment available for testing',
        '[09:00:04] WARN: Clock is ticking... 59 minutes remaining'
      ],
      xpReward: 600
    }
  ]
  
  // Rotate daily based on date
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return challenges[dayOfYear % challenges.length]
}

// User level calculation
export const calculateLevel = (xp: number): { level: number; title: string; progress: number; nextLevelXP: number } => {
  const levels = [
    { level: 1, title: 'Security Novice', xp: 0 },
    { level: 2, title: 'Network Explorer', xp: 500 },
    { level: 3, title: 'CDN Apprentice', xp: 1200 },
    { level: 4, title: 'WAF Initiate', xp: 2000 },
    { level: 5, title: 'Security Practitioner', xp: 3000 },
    { level: 6, title: 'CDN Specialist', xp: 4200 },
    { level: 7, title: 'WAF Expert', xp: 5600 },
    { level: 8, title: 'WAF Ninja', xp: 7200 },
    { level: 9, title: 'Security Architect', xp: 9000 },
    { level: 10, title: 'Security Master', xp: 11000 }
  ]
  
  let currentLevel = levels[0]
  let nextLevel = levels[1]
  
  for (let i = 0; i < levels.length - 1; i++) {
    if (xp >= levels[i].xp && xp < levels[i + 1].xp) {
      currentLevel = levels[i]
      nextLevel = levels[i + 1]
      break
    }
  }
  
  if (xp >= levels[levels.length - 1].xp) {
    currentLevel = levels[levels.length - 1]
    nextLevel = levels[levels.length - 1]
  }
  
  const progress = nextLevel.xp > currentLevel.xp 
    ? ((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100
    : 100
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    progress,
    nextLevelXP: nextLevel.xp
  }
}
