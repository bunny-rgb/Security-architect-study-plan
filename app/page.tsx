'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { mockDailyPlan, mockProgress, mockUser } from '@/lib/mockData'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show simple loading during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#141419] to-[#0a0a0f]">
        <div className="text-center px-4">
          <div className="text-7xl mb-6 animate-pulse">🛡️</div>
          <h1 className="text-3xl font-bold mb-3" style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SecArch Academy
          </h1>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const dailyPlan = mockDailyPlan
  const progress = mockProgress as any

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                SecArch Academy
              </h1>
              <p className="text-xs text-gray-400 mt-1">Security Architect Training</p>
            </div>
            <Link 
              href="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#1c1c24',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #2a2a35'
              }}
            >
              <span className="text-2xl">🔥</span>
              <div style={{ textAlign: 'left' }}>
                <p className="text-xs text-gray-400">Streak</p>
                <p className="text-sm font-bold" style={{ color: '#6366f1' }}>{progress.overall.current_streak} days</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Welcome back! 👋
          </h2>
          <p className="text-gray-400">
            Ready to level up your security skills today?
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '1rem',
            padding: '1rem'
          }}>
            <div className="text-3xl mb-2">📚</div>
            <p className="text-2xl font-bold text-white">{progress.overall.completed_lessons}</p>
            <p className="text-sm text-gray-400">Lessons Done</p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '1rem',
            padding: '1rem'
          }}>
            <div className="text-3xl mb-2">⏱️</div>
            <p className="text-2xl font-bold text-white">{Math.round(progress.overall.total_time_spent_minutes / 60)}h</p>
            <p className="text-sm text-gray-400">Time Invested</p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.05) 100%)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '1rem',
            padding: '1rem'
          }}>
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-white">{progress.overall.current_streak}</p>
            <p className="text-sm text-gray-400">Day Streak</p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '1rem',
            padding: '1rem'
          }}>
            <div className="text-3xl mb-2">📈</div>
            <p className="text-2xl font-bold text-white">{progress.overall.completion_percentage}%</p>
            <p className="text-sm text-gray-400">Complete</p>
          </div>
        </div>

        {/* Today's Lesson */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Today's Challenge</h3>
            <span className="text-xs px-3 py-1" style={{
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              color: '#6366f1',
              borderRadius: '9999px',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              Day {dailyPlan.lesson.day}
            </span>
          </div>
          
          <Link href={`/lesson/${dailyPlan.lesson.id}`}>
            <div style={{
              background: 'linear-gradient(135deg, #1c1c24 0%, #141419 100%)',
              border: '1px solid #2a2a35',
              borderRadius: '1rem',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div className="flex items-start gap-4">
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  🌐
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1" style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366f1',
                      borderRadius: '0.375rem',
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                      Phase {dailyPlan.lesson.phase}
                    </span>
                    <span className="text-xs px-2 py-1" style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      borderRadius: '0.375rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      {dailyPlan.lesson.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">
                      📖 {dailyPlan.lesson.reading_time_min} min
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-1 text-white">{dailyPlan.lesson.title}</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Tap to start your lesson and unlock the quiz
                  </p>
                  
                  <button style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                  }}>
                    Start Learning →
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/learn">
            <div style={{
              backgroundColor: '#1c1c24',
              border: '1px solid #2a2a35',
              borderRadius: '0.75rem',
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <div className="text-3xl mb-2">📚</div>
              <p className="font-bold text-white">All Lessons</p>
              <p className="text-xs text-gray-400 mt-1">Browse curriculum</p>
            </div>
          </Link>
          <Link href="/incidents">
            <div style={{
              backgroundColor: '#1c1c24',
              border: '1px solid #2a2a35',
              borderRadius: '0.75rem',
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <div className="text-3xl mb-2">🚨</div>
              <p className="font-bold text-white">Incidents</p>
              <p className="text-xs text-gray-400 mt-1">Practice responses</p>
            </div>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#6366f1',
              textDecoration: 'none'
            }}>
              <span className="text-2xl">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link href="/learn" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#9ca3af',
              textDecoration: 'none'
            }}>
              <span className="text-2xl">📚</span>
              <span className="text-xs">Learn</span>
            </Link>
            <Link href="/incidents" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#9ca3af',
              textDecoration: 'none'
            }}>
              <span className="text-2xl">🚨</span>
              <span className="text-xs">Incidents</span>
            </Link>
            <Link href="/dashboard" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#9ca3af',
              textDecoration: 'none'
            }}>
              <span className="text-2xl">📊</span>
              <span className="text-xs">Progress</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
