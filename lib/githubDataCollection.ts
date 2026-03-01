/**
 * GitHub Data Collection System
 * 
 * This module collects user learning data and pushes it to a private GitHub repository.
 * Requires GitHub authentication to be set up first.
 */

export interface ProgressSnapshot {
  userId: string
  userName: string
  timestamp: string
  completedLessons: number[]
  completedQuizzes: number[]
  quizScores: Record<number, {
    score: number
    percentage: number
    answers: Record<number, any>
    correctAnswers: number
    totalQuestions: number
    timeSpent: number
    completedAt: string
  }>
  totalXP: number
  currentPhase: number
  unlockedPhases: number[]
  streak: number
  lastStudyDate: string
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: string
    rarity: string
  }>
  studyTimeMinutes: number
  metadata: {
    appVersion: string
    platform: string
    userAgent: string
    timezone: string
  }
}

/**
 * Collects all user progress data from localStorage
 */
export function collectUserData(userId: string): ProgressSnapshot | null {
  if (typeof window === 'undefined') return null

  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    const progressData = JSON.parse(localStorage.getItem(`progress_${userId}`) || 'null')
    
    if (!currentUser || !progressData) return null

    // Collect quiz scores
    const quizScores: Record<number, any> = {}
    for (let i = 1; i <= 50; i++) {
      const quizData = localStorage.getItem(`quiz_result_${userId}_${i}`)
      if (quizData) {
        quizScores[i] = JSON.parse(quizData)
      }
    }

    const snapshot: ProgressSnapshot = {
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString(),
      completedLessons: progressData.completedLessons || [],
      completedQuizzes: progressData.completedQuizzes || [],
      quizScores,
      totalXP: progressData.totalXP || 0,
      currentPhase: progressData.currentPhase || 0,
      unlockedPhases: progressData.unlockedPhases || [0],
      streak: progressData.streak || 0,
      lastStudyDate: progressData.lastStudyDate || new Date().toISOString(),
      achievements: progressData.achievements || [],
      studyTimeMinutes: progressData.studyTimeMinutes || 0,
      metadata: {
        appVersion: '1.0.0',
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    return snapshot
  } catch (error) {
    console.error('Error collecting user data:', error)
    return null
  }
}

/**
 * Formats data as human-readable markdown for GitHub
 */
export function formatAsMarkdown(snapshot: ProgressSnapshot): string {
  const { userName, timestamp, completedLessons, completedQuizzes, quizScores, totalXP, currentPhase, streak, achievements } = snapshot

  let markdown = `# Learning Progress - ${userName}\n\n`
  markdown += `**Generated:** ${new Date(timestamp).toLocaleString()}\n\n`
  markdown += `---\n\n`

  // Summary
  markdown += `## 📊 Summary\n\n`
  markdown += `- **Total XP:** ${totalXP}\n`
  markdown += `- **Current Phase:** Phase ${currentPhase}\n`
  markdown += `- **Completed Lessons:** ${completedLessons.length} / 50\n`
  markdown += `- **Completed Quizzes:** ${completedQuizzes.length} / 50\n`
  markdown += `- **Current Streak:** ${streak} days 🔥\n`
  markdown += `- **Achievements:** ${achievements.length}\n\n`

  // Progress by Phase
  markdown += `## 🎯 Progress by Phase\n\n`
  const phases = ['CDN & Edge', 'WAF & Security', 'API Security', 'Observability', 'Incident Response']
  phases.forEach((phaseName, phaseIdx) => {
    const phaseLessons = completedLessons.filter(l => l >= phaseIdx * 10 + 1 && l <= (phaseIdx + 1) * 10)
    const phaseQuizzes = completedQuizzes.filter(q => q >= phaseIdx * 10 + 1 && q <= (phaseIdx + 1) * 10)
    markdown += `### Phase ${phaseIdx}: ${phaseName}\n`
    markdown += `- Lessons: ${phaseLessons.length} / 10\n`
    markdown += `- Quizzes: ${phaseQuizzes.length} / 10\n\n`
  })

  // Quiz Scores
  if (Object.keys(quizScores).length > 0) {
    markdown += `## 📝 Quiz Results\n\n`
    markdown += `| Lesson | Score | Questions | Time | Date |\n`
    markdown += `|--------|-------|-----------|------|------|\n`
    
    Object.entries(quizScores).forEach(([lessonId, score]) => {
      const percentage = score.percentage || Math.round((score.correctAnswers / score.totalQuestions) * 100)
      const timeSpent = score.timeSpent || 0
      const date = score.completedAt ? new Date(score.completedAt).toLocaleDateString() : 'N/A'
      markdown += `| Lesson ${lessonId} | ${percentage}% | ${score.correctAnswers}/${score.totalQuestions} | ${timeSpent}min | ${date} |\n`
    })
    markdown += `\n`
  }

  // Achievements
  if (achievements.length > 0) {
    markdown += `## 🏆 Achievements\n\n`
    achievements.forEach(achievement => {
      const rarityEmoji = {
        legendary: '💎',
        epic: '🌟',
        rare: '⭐',
        common: '✨'
      }[achievement.rarity] || '✨'
      markdown += `- ${rarityEmoji} **${achievement.title}** - ${achievement.description}\n`
    })
    markdown += `\n`
  }

  // Detailed Lesson Progress
  markdown += `## 📚 Detailed Lesson Progress\n\n`
  completedLessons.sort((a, b) => a - b).forEach(lessonId => {
    markdown += `- ✅ Lesson ${lessonId}\n`
  })

  markdown += `\n---\n\n`
  markdown += `*Generated by Security Architect Academy - ${new Date(timestamp).toISOString()}*\n`

  return markdown
}

/**
 * Formats data as JSON for machine processing
 */
export function formatAsJSON(snapshot: ProgressSnapshot): string {
  return JSON.stringify(snapshot, null, 2)
}

/**
 * Pushes data to GitHub repository
 * NOTE: Requires GitHub authentication to be set up first
 */
export async function pushToGitHub(userId: string, repositoryName: string = 'security-academy-progress'): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const snapshot = collectUserData(userId)
    if (!snapshot) {
      return { success: false, message: 'No data to collect' }
    }

    const markdown = formatAsMarkdown(snapshot)
    const json = formatAsJSON(snapshot)
    
    // Prepare file content
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const userName = snapshot.userName.replace(/[^a-zA-Z0-9]/g, '_')
    
    const files = {
      [`progress/${userName}/latest.md`]: markdown,
      [`progress/${userName}/latest.json`]: json,
      [`progress/${userName}/history/${timestamp}.md`]: markdown,
      [`progress/${userName}/history/${timestamp}.json`]: json,
    }

    // This will be implemented after GitHub auth is set up
    // For now, store locally as backup
    localStorage.setItem('pending_github_push', JSON.stringify({
      repository: repositoryName,
      files,
      timestamp: new Date().toISOString()
    }))

    return {
      success: true,
      message: 'Data prepared for GitHub push. Waiting for GitHub authorization.',
      url: '#github-auth-required'
    }
  } catch (error: any) {
    console.error('GitHub push error:', error)
    return {
      success: false,
      message: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Downloads progress data as file (fallback if GitHub not set up)
 */
export function downloadProgressData(userId: string, format: 'markdown' | 'json' = 'markdown'): void {
  const snapshot = collectUserData(userId)
  if (!snapshot) {
    alert('No progress data to download')
    return
  }

  const content = format === 'markdown' ? formatAsMarkdown(snapshot) : formatAsJSON(snapshot)
  const timestamp = new Date().toISOString().split('T')[0]
  const userName = snapshot.userName.replace(/[^a-zA-Z0-9]/g, '_')
  const filename = `security_academy_progress_${userName}_${timestamp}.${format === 'markdown' ? 'md' : 'json'}`

  // Create download
  const blob = new Blob([content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Check if GitHub is authorized
 */
export async function checkGitHubAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/github/status')
    const data = await response.json()
    return data.authorized === true
  } catch {
    return false
  }
}
