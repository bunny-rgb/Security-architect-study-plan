'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    completed: number
  }>
  weak_topics: Array<{
    domain: string
    score: number
  }>
  readiness_level: {
    level: string
    score: number
    next_level: string
    requirements: string
  }
  recent_achievements: Array<{
    title: string
    description: string
    earned_at: string
  }>
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use mock data
    import('@/lib/mockData').then(({ mockProgress }) => {
      setTimeout(() => {
        setProgress(mockProgress as any)
        setLoading(false)
      }, 800)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No progress data available</p>
      </div>
    )
  }

  const daysSinceStart = Math.floor((Date.now() - new Date(progress.user.created_at).getTime()) / (1000 * 60 * 60 * 24))
  const avgTimePerDay = daysSinceStart > 0 ? Math.round(progress.overall.total_time_spent_minutes / daysSinceStart) : 0

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl">←</Link>
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold">Your Progress</h1>
              <p className="text-xs text-gray-400">Keep up the great work!</p>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="mb-6 animate-fade-in">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📊</span>
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-5">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-3xl font-bold mb-1">{progress.overall.completed_lessons}</p>
              <p className="text-sm text-gray-400">Lessons Completed</p>
              <p className="text-xs text-primary mt-1">
                {progress.overall.total_lessons - progress.overall.completed_lessons} remaining
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 rounded-2xl p-5">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-3xl font-bold mb-1">{progress.overall.completion_percentage}%</p>
              <p className="text-sm text-gray-400">Completion</p>
              <div className="h-1.5 bg-dark-surface rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full progress-bar"
                  style={{width: `${progress.overall.completion_percentage}%`}}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-2xl p-5">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-3xl font-bold mb-1">{progress.overall.current_streak}</p>
              <p className="text-sm text-gray-400">Day Streak</p>
              <p className="text-xs text-accent mt-1">
                Best: {progress.overall.longest_streak} days
              </p>
            </div>

            <div className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-2xl p-5">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-3xl font-bold mb-1">{Math.round(progress.overall.total_time_spent_minutes / 60)}h</p>
              <p className="text-sm text-gray-400">Total Time</p>
              <p className="text-xs text-success mt-1">
                ~{avgTimePerDay} min/day
              </p>
            </div>
          </div>
        </div>

        {/* Readiness Level */}
        <div className="mb-6 animate-slide-up">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🏆</span>
            Readiness Level
          </h2>
          <div className="bg-gradient-to-br from-dark-elevated to-dark-surface border-2 border-primary rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold gradient-text">{progress.readiness_level.level}</h3>
                <p className="text-sm text-gray-400 mt-1">{progress.readiness_level.requirements}</p>
              </div>
              <div className="text-5xl">
                {progress.readiness_level.level === 'Beginner' ? '🌱' :
                 progress.readiness_level.level === 'Intermediate' ? '🌿' :
                 progress.readiness_level.level === 'Advanced' ? '🌳' :
                 progress.readiness_level.level === 'Expert' ? '🏆' : '⭐'}
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Progress to {progress.readiness_level.next_level}</span>
                <span className="font-bold text-primary">{progress.readiness_level.score}%</span>
              </div>
              <div className="h-3 bg-dark-surface rounded-full overflow-hidden">
                <div 
                  className="h-full progress-bar"
                  style={{width: `${progress.readiness_level.score}%`}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Domain Expertise */}
        <div className="mb-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💪</span>
            Domain Expertise
          </h2>
          <div className="space-y-3">
            {progress.domains.map((domain, idx) => {
              const icons = ['🌐', '🔒', '⚡', '🛡️', '🚨', '🔧']
              return (
                <div key={domain.domain} className="bg-dark-elevated border border-dark-border rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{icons[idx % icons.length]}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{domain.domain}</h3>
                        <span className={`text-sm font-bold ${
                          domain.score >= 80 ? 'text-success' :
                          domain.score >= 60 ? 'text-warning' :
                          'text-danger'
                        }`}>
                          {domain.score}%
                        </span>
                      </div>
                      <div className="h-2 bg-dark-surface rounded-full overflow-hidden mb-2">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            domain.score >= 80 ? 'bg-success' :
                            domain.score >= 60 ? 'bg-warning' :
                            'bg-danger'
                          }`}
                          style={{width: `${domain.score}%`}}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        {domain.completed || 0} of {domain.lessons_count} lessons completed
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weak Topics */}
        {progress.weak_topics && progress.weak_topics.length > 0 && (
          <div className="mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📈</span>
              Areas to Improve
            </h2>
            <div className="bg-dark-elevated border border-warning/30 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-3">
                Focus on these topics to boost your overall score:
              </p>
              <div className="space-y-2">
                {progress.weak_topics.map((topic) => (
                  <div key={topic.domain} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                    <span className="text-sm">{topic.domain}</span>
                    <span className="text-sm font-bold text-warning">{topic.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {progress.recent_achievements && progress.recent_achievements.length > 0 && (
          <div className="mb-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🎖️</span>
              Recent Achievements
            </h2>
            <div className="space-y-3">
              {progress.recent_achievements.map((achievement, idx) => (
                <div key={idx} className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-4 flex items-start gap-4">
                  <div className="text-3xl badge-pulse">🏆</div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journey Timeline */}
        <div className="mb-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🗓️</span>
            Your Journey
          </h2>
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Started</span>
                <span className="font-medium">
                  {new Date(progress.user.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Days Active</span>
                <span className="font-medium">{daysSinceStart} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Avg. Time/Day</span>
                <span className="font-medium">{avgTimePerDay} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Completion Rate</span>
                <span className="font-medium text-primary">
                  {daysSinceStart > 0 ? Math.round((progress.overall.completed_lessons / daysSinceStart) * 100) / 100 : 0} lessons/day
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl animate-slide-up" style={{animationDelay: '0.5s'}}>
          <p className="text-lg font-bold mb-2">
            {progress.overall.current_streak >= 7 ? '🔥 You\'re on fire!' :
             progress.overall.completed_lessons >= 10 ? '⭐ Great progress!' :
             '💪 Keep going!'}
          </p>
          <p className="text-sm text-gray-400">
            {progress.overall.current_streak >= 7 ? 'Amazing streak! Your dedication is inspiring.' :
             progress.overall.completed_lessons >= 10 ? 'You\'re building valuable expertise every day.' :
             'Every expert was once a beginner. You\'re doing great!'}
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">🏠</span>
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/learn" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">📚</span>
              <span className="text-xs">Learn</span>
            </Link>
            <Link href="/incidents" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">🚨</span>
              <span className="text-xs">Incidents</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
              <span className="text-2xl">📊</span>
              <span className="text-xs font-medium">Progress</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
