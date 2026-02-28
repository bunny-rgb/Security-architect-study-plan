'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, createNewUser, logout, getUserProgress, PHASE_REQUIREMENTS, isPhaseUnlocked } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [userName, setUserName] = useState('')
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      const userProgress = getUserProgress(currentUser.id)
      setProgress(userProgress)
    } else {
      setShowLogin(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (userName.trim().length < 2) {
      alert('Please enter a valid name (at least 2 characters)')
      return
    }
    
    const newUser = createNewUser(userName)
    setUser(newUser)
    const userProgress = getUserProgress(newUser.id)
    setProgress(userProgress)
    setShowLogin(false)
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    setProgress(null)
    setShowLogin(true)
  }

  if (!mounted) return null

  // Login Screen
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/50">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              SecureEdge
              <span className="block text-2xl mt-1 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                Academy
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Master Security Architecture from Zero to Expert
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                What's your name?
              </label>
              <input
                id="name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                autoFocus
                required
                minLength={2}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl hover:shadow-indigo-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Learning Journey
            </button>

            <p className="text-xs text-slate-500 text-center">
              Your progress will be saved locally. Coming soon: Google SSO
            </p>
          </form>

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-slate-700 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-400">50</p>
              <p className="text-xs text-slate-400">Lessons</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">5</p>
              <p className="text-xs text-slate-400">Phases</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">Free</p>
              <p className="text-xs text-slate-400">Forever</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Dashboard
  const phases = [
    { 
      id: 0, 
      name: 'CDN Fundamentals', 
      lessons: 10,
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-blue-500 to-cyan-500',
      description: 'Content delivery, caching, edge networks'
    },
    { 
      id: 1, 
      name: 'WAF & Security', 
      lessons: 10,
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      color: 'from-purple-500 to-pink-500',
      description: 'Firewall rules, bot detection, DDoS protection'
    },
    { 
      id: 2, 
      name: 'API Security', 
      lessons: 10,
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      color: 'from-emerald-500 to-teal-500',
      description: 'Authentication, JWT, rate limiting, OWASP'
    },
    { 
      id: 3, 
      name: 'Observability', 
      lessons: 10,
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'from-orange-500 to-red-500',
      description: 'Monitoring, logging, metrics, alerting'
    },
    { 
      id: 4, 
      name: 'Incident Response', 
      lessons: 10,
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      color: 'from-red-500 to-pink-500',
      description: 'SOC operations, playbooks, threat response'
    }
  ]

  const completionRate = progress ? (progress.completedLessons.length / 50) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">SecureEdge Academy</h1>
                <p className="text-xs text-slate-400">Welcome, {user?.name}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Your Progress</h2>
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                {Math.round(completionRate)}%
              </p>
              <p className="text-xs text-slate-400">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 mb-6">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{progress?.completedLessons.length || 0}</p>
              <p className="text-sm text-slate-400">Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{progress?.totalXP || 0}</p>
              <p className="text-sm text-slate-400">XP Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{progress?.streak || 0}</p>
              <p className="text-sm text-slate-400">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{progress?.unlockedPhases.length || 1}</p>
              <p className="text-sm text-slate-400">Phases</p>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <h3 className="text-2xl font-bold text-white mb-6">Learning Path</h3>
        <div className="space-y-4">
          {phases.map((phase, index) => {
            const isUnlocked = progress?.unlockedPhases.includes(phase.id)
            const isNext = !isUnlocked && index > 0 && progress?.unlockedPhases.includes(index - 1)
            const requirement = PHASE_REQUIREMENTS[phase.id as keyof typeof PHASE_REQUIREMENTS]
            
            return (
              <div key={phase.id} className={`relative ${!isUnlocked ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => isUnlocked && router.push(`/learn?phase=${phase.id}`)}
                  disabled={!isUnlocked}
                  className={`w-full text-left bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-6 transition-all ${
                    isUnlocked 
                      ? 'border-slate-700 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 transform hover:scale-[1.02]' 
                      : 'border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isUnlocked 
                        ? `bg-gradient-to-br ${phase.color}` 
                        : 'bg-slate-800'
                    }`}>
                      {isUnlocked ? (
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={phase.icon} />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-xl font-bold text-white">{phase.name}</h4>
                        {!isUnlocked && (
                          <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs">
                            Locked
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{phase.description}</p>
                      <p className="text-slate-500 text-xs">{phase.lessons} lessons</p>
                      
                      {isNext && requirement && (
                        <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                          <p className="text-xs text-indigo-300 mb-2">
                            Unlock requirements:
                          </p>
                          <ul className="text-xs text-slate-400 space-y-1">
                            <li>• Complete {requirement.requiredLessons} lessons</li>
                            <li>• Earn {requirement.requiredXP} XP</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around items-center py-3">
            <button className="flex flex-col items-center space-y-1 text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium">Home</span>
            </button>

            <button onClick={() => router.push('/learn')} className="flex flex-col items-center space-y-1 text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs">Learn</span>
            </button>

            <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center space-y-1 text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs">Progress</span>
            </button>

            <button onClick={() => router.push('/profile')} className="flex flex-col items-center space-y-1 text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
