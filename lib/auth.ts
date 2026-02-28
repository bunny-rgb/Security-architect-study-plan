// User authentication and progress management
export interface User {
  id: string
  name: string
  email?: string
  createdAt: string
  lastActive: string
  preferences: {
    theme: 'dark' | 'light'
    notifications: boolean
  }
}

export interface UserProgress {
  userId: string
  completedLessons: number[]
  completedQuizzes: number[]
  currentPhase: number
  unlockedPhases: number[]
  totalXP: number
  streak: number
  lastStudyDate: string
  achievements: Achievement[]
  studyTimeMinutes: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// Phase unlock logic
export const PHASE_REQUIREMENTS = {
  0: { requiredLessons: 0, requiredXP: 0 }, // Always unlocked
  1: { requiredLessons: 8, requiredXP: 800 }, // Complete 80% of Phase 0
  2: { requiredLessons: 18, requiredXP: 1800 }, // Complete 80% of Phase 1
  3: { requiredLessons: 28, requiredXP: 2800 }, // Complete 80% of Phase 2
  4: { requiredLessons: 38, requiredXP: 3800 }, // Complete 80% of Phase 3
}

export const isPhaseUnlocked = (phase: number, progress: UserProgress): boolean => {
  const requirement = PHASE_REQUIREMENTS[phase as keyof typeof PHASE_REQUIREMENTS]
  if (!requirement) return false
  
  return (
    progress.completedLessons.length >= requirement.requiredLessons &&
    progress.totalXP >= requirement.requiredXP
  )
}

export const getNextUnlockProgress = (currentPhase: number, progress: UserProgress): number => {
  const nextPhase = currentPhase + 1
  const requirement = PHASE_REQUIREMENTS[nextPhase as keyof typeof PHASE_REQUIREMENTS]
  
  if (!requirement) return 100
  
  const lessonProgress = (progress.completedLessons.length / requirement.requiredLessons) * 100
  const xpProgress = (progress.totalXP / requirement.requiredXP) * 100
  
  return Math.min(lessonProgress, xpProgress)
}

// Authentication helpers
export const saveUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('currentUser')
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export const saveUserProgress = (progress: UserProgress): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`progress_${progress.userId}`, JSON.stringify(progress))
  }
}

export const getUserProgress = (userId: string): UserProgress | null => {
  if (typeof window !== 'undefined') {
    const progressData = localStorage.getItem(`progress_${userId}`)
    return progressData ? JSON.parse(progressData) : null
  }
  return null
}

export const createNewUser = (name: string): User => {
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      notifications: true
    }
  }
  
  const initialProgress: UserProgress = {
    userId: user.id,
    completedLessons: [],
    completedQuizzes: [],
    currentPhase: 0,
    unlockedPhases: [0],
    totalXP: 0,
    streak: 0,
    lastStudyDate: new Date().toISOString(),
    achievements: [],
    studyTimeMinutes: 0
  }
  
  saveUser(user)
  saveUserProgress(initialProgress)
  
  return user
}

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
  }
}

// XP and achievement logic
export const LESSON_XP = 100
export const QUIZ_XP = 150
export const PERFECT_QUIZ_BONUS = 50

export const addXP = (userId: string, amount: number): void => {
  const progress = getUserProgress(userId)
  if (!progress) return
  
  progress.totalXP += amount
  
  // Check for new phase unlocks
  for (let phase = 0; phase <= 4; phase++) {
    if (!progress.unlockedPhases.includes(phase)) {
      if (isPhaseUnlocked(phase, progress)) {
        progress.unlockedPhases.push(phase)
        // Award achievement
        progress.achievements.push({
          id: `phase_unlock_${phase}`,
          title: `Phase ${phase} Unlocked!`,
          description: `You've unlocked a new learning phase`,
          icon: 'unlock',
          unlockedAt: new Date().toISOString(),
          rarity: phase === 4 ? 'legendary' : phase >= 3 ? 'epic' : phase >= 2 ? 'rare' : 'common'
        })
      }
    }
  }
  
  saveUserProgress(progress)
}

export const markLessonComplete = (userId: string, lessonId: number): void => {
  const progress = getUserProgress(userId)
  if (!progress) return
  
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId)
    addXP(userId, LESSON_XP)
  }
}

export const markQuizComplete = (userId: string, quizId: number, score: number): void => {
  const progress = getUserProgress(userId)
  if (!progress) return
  
  if (!progress.completedQuizzes.includes(quizId)) {
    progress.completedQuizzes.push(quizId)
    addXP(userId, QUIZ_XP)
    
    if (score === 100) {
      addXP(userId, PERFECT_QUIZ_BONUS)
    }
  }
}

// Streak calculation
export const updateStreak = (userId: string): void => {
  const progress = getUserProgress(userId)
  if (!progress) return
  
  const lastStudy = new Date(progress.lastStudyDate)
  const today = new Date()
  const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    progress.streak++
  } else if (diffDays > 1) {
    progress.streak = 1
  }
  
  progress.lastStudyDate = today.toISOString()
  saveUserProgress(progress)
}
