'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DailyPlan {
  date: string
  lesson: {
    id: number
    title: string
    phase: number
    day: number
    difficulty: string
    reading_time_min: number
  }
  completed: boolean
  quiz_completed: boolean
}

interface ProgressSummary {
  user: {
    username: string
    created_at: string
  }
  overall: {
    total_lessons: number
    completed_lessons: number
    completion_percentage: number
    current_streak: number
    longest_streak: number
    total_time_spent_minutes: number
  }
  domains: Array<{
    domain: string
    score: number
    lessons_count: number
  }>
}

export default function HomePage() {
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null)
  const [progress, setProgress] = useState<ProgressSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get or create user
    const initUser = async () => {
      let storedUserId = localStorage.getItem('userId')
      
      if (!storedUserId) {
        // Create guest user
        const res = await fetch('/api/auth/guest', { method: 'POST' })
        const data = await res.json()
        storedUserId = data.user.id
        if (storedUserId) {
          localStorage.setItem('userId', storedUserId)
        }
      }
      
      setUserId(storedUserId)
      
      // Fetch daily plan and progress
      const [planRes, progressRes] = await Promise.all([
        fetch(`/api/daily/today?userId=${storedUserId}`),
        fetch(`/api/progress/summary?userId=${storedUserId}`)
      ])
      
      const planData = await planRes.json()
      const progressData = await progressRes.json()
      
      setDailyPlan(planData)
      setProgress(progressData)
      setLoading(false)
    }
    
    initUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold gradient-text">SecArch Academy</h1>
              <p className="text-xs text-gray-400 mt-1">Security Architect Training</p>
            </div>
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 bg-dark-elevated px-4 py-2 rounded-lg border border-dark-border hover:border-primary transition-colors"
            >
              <span className="text-2xl">🎯</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Streak</p>
                <p className="text-sm font-bold text-primary">{progress?.overall.current_streak || 0} days</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-400">
            Ready to level up your security skills today?
          </p>
        </div>

        {/* Progress Overview */}
        {progress && (
          <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-up">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-4">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-2xl font-bold">{progress.overall.completed_lessons}</p>
              <p className="text-sm text-gray-400">Lessons Done</p>
            </div>
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 rounded-2xl p-4">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-2xl font-bold">{Math.round(progress.overall.total_time_spent_minutes / 60)}h</p>
              <p className="text-sm text-gray-400">Time Invested</p>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-2xl p-4">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-2xl font-bold">{progress.overall.current_streak}</p>
              <p className="text-sm text-gray-400">Day Streak</p>
            </div>
            <div className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-2xl p-4">
              <div className="text-3xl mb-2">📈</div>
              <p className="text-2xl font-bold">{progress.overall.completion_percentage}%</p>
              <p className="text-sm text-gray-400">Complete</p>
            </div>
          </div>
        )}

        {/* Today's Lesson */}
        {dailyPlan && (
          <div className="mb-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Today's Challenge</h3>
              <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30">
                Day {dailyPlan.lesson.day}
              </span>
            </div>
            
            <Link href={`/lesson/${dailyPlan.lesson.id}`}>
              <div className="bg-gradient-to-br from-dark-elevated to-dark-surface border border-dark-border rounded-2xl p-6 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {dailyPlan.lesson.phase === 0 ? '🌐' : 
                     dailyPlan.lesson.phase === 1 ? '🔒' :
                     dailyPlan.lesson.phase === 2 ? '⚡' :
                     dailyPlan.lesson.phase === 3 ? '🛡️' : '🚨'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                        Phase {dailyPlan.lesson.phase}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-md border ${
                        dailyPlan.lesson.difficulty === 'beginner' ? 'bg-success/10 text-success border-success/20' :
                        dailyPlan.lesson.difficulty === 'intermediate' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-danger/10 text-danger border-danger/20'
                      }`}>
                        {dailyPlan.lesson.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">
                        📖 {dailyPlan.lesson.reading_time_min} min
                      </span>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{dailyPlan.lesson.title}</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Tap to start your lesson and unlock the quiz
                    </p>
                    
                    {dailyPlan.completed ? (
                      <div className="flex items-center gap-2 text-success text-sm">
                        <span>✓</span>
                        <span>Lesson completed!</span>
                        {!dailyPlan.quiz_completed && (
                          <span className="text-warning">• Quiz pending</span>
                        )}
                      </div>
                    ) : (
                      <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl btn-glow">
                        Start Learning →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Domain Progress */}
        {progress && progress.domains.length > 0 && (
          <div className="mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h3 className="text-lg font-bold mb-3">Your Expertise</h3>
            <div className="space-y-3">
              {progress.domains.map((domain) => (
                <div key={domain.domain} className="bg-dark-elevated border border-dark-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{domain.domain}</span>
                    <span className="text-sm font-bold text-primary">{domain.score}%</span>
                  </div>
                  <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full progress-bar rounded-full"
                      style={{width: `${domain.score}%`}}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{domain.lessons_count} lessons</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <Link href="/learn">
            <div className="bg-dark-elevated border border-dark-border rounded-xl p-4 text-center card-hover">
              <div className="text-3xl mb-2">📚</div>
              <p className="font-bold">All Lessons</p>
              <p className="text-xs text-gray-400 mt-1">Browse curriculum</p>
            </div>
          </Link>
          <Link href="/incidents">
            <div className="bg-dark-elevated border border-dark-border rounded-xl p-4 text-center card-hover">
              <div className="text-3xl mb-2">🚨</div>
              <p className="font-bold">Incidents</p>
              <p className="text-xs text-gray-400 mt-1">Practice responses</p>
            </div>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 text-primary">
              <span className="text-2xl">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link href="/learn" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">📚</span>
              <span className="text-xs">Learn</span>
            </Link>
            <Link href="/incidents" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">🚨</span>
              <span className="text-xs">Incidents</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">📊</span>
              <span className="text-xs">Progress</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
