'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, createNewUser, logout, getUserProgress, isPhaseUnlocked } from '@/lib/auth'
import { ALL_PHASES, getDailyChallenge, calculateLevel } from '@/lib/phases'

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

  // Login Screen - Keep it simple and clean like reference
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SecureEdge Academy
            </h1>
            <p className="text-gray-500 text-sm">
              Master Security Architecture
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                What's your name?
              </label>
              <input
                id="name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                required
                minLength={2}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main Dashboard - Based on reference images
  const dailyChallenge = getDailyChallenge()
  const levelData = calculateLevel(progress?.totalXP || 0)
  const xpProgress = levelData.progress

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop only */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">SecureEdge</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>
            
            <button onClick={() => router.push('/learn')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Learning Path
            </button>

            <button onClick={() => router.push('/incidents')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Live Scenarios
            </button>

            <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Progress
            </button>
          </nav>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-gray-100">
            <button onClick={() => router.push('/profile')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Level {levelData.level}</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hi, {user?.name}! 👋
              </h1>
              <p className="text-gray-500 mt-1">Ready to secure the edge today?</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-gray-200">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-gray-900">{progress?.totalXP || 0} XP</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-gray-200">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-gray-900">{progress?.streak || 0} Day Streak</span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Level {levelData.level}: {levelData.title}</p>
                <p className="text-2xl font-bold text-gray-900">{progress?.totalXP || 0} / {levelData.nextLevelXP} XP</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Daily Challenge */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1 mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">DAILY {dailyChallenge.difficulty.toUpperCase()} SCENARIO</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{dailyChallenge.title}</h3>
                <p className="text-blue-100 text-sm">{dailyChallenge.description}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Start Challenge
              </button>
              <button className="bg-white/10 text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                View Logs
              </button>
            </div>
          </div>

          {/* All Learning Phases */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Architect Learning Path</h2>
            
            <div className="grid gap-4">
              {ALL_PHASES.map((phase, index) => {
                const isUnlocked = progress?.unlockedPhases.includes(phase.id)
                const completedLessons = progress?.completedLessons.filter((id: number) => {
                  const lessonPhase = Math.floor(id / 10)
                  return lessonPhase === phase.id
                }).length || 0
                const phaseProgress = (completedLessons / phase.totalLessons) * 100

                return (
                  <div key={phase.id} className={`bg-white rounded-2xl border-2 transition-all ${
                    isUnlocked ? 'border-gray-200 hover:border-blue-500 hover:shadow-lg cursor-pointer' : 'border-gray-100 opacity-60'
                  }`}>
                    <button
                      onClick={() => isUnlocked && router.push(`/learn?phase=${phase.id}`)}
                      disabled={!isUnlocked}
                      className="w-full p-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isUnlocked 
                            ? `bg-gradient-to-br ${phase.color === 'blue' ? 'from-blue-500 to-blue-600' : phase.color === 'purple' ? 'from-purple-500 to-purple-600' : phase.color === 'green' ? 'from-green-500 to-green-600' : phase.color === 'orange' ? 'from-orange-500 to-orange-600' : phase.color === 'red' ? 'from-red-500 to-red-600' : phase.color === 'indigo' ? 'from-indigo-500 to-indigo-600' : 'from-cyan-500 to-cyan-600'}` 
                            : 'bg-gray-100'
                        }`}>
                          <span className="text-3xl">{phase.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 truncate">{phase.name}</h3>
                            {completedLessons === phase.totalLessons && isUnlocked && (
                              <span className="flex-shrink-0 inline-flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg text-xs font-semibold">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </span>
                            )}
                            {!isUnlocked && (
                              <span className="flex-shrink-0 inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-1 rounded-lg text-xs font-semibold">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Locked
                              </span>
                            )}
                            {completedLessons > 0 && completedLessons < phase.totalLessons && (
                              <span className="flex-shrink-0 inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-xs font-semibold">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm mb-3 line-clamp-1">{phase.shortDesc}</p>
                          
                          {isUnlocked && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{completedLessons} / {phase.totalLessons} lessons</span>
                                <span className="font-semibold text-gray-900">{Math.round(phaseProgress)}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full bg-gradient-to-r ${phase.color === 'blue' ? 'from-blue-500 to-blue-600' : phase.color === 'purple' ? 'from-purple-500 to-purple-600' : phase.color === 'green' ? 'from-green-500 to-green-600' : phase.color === 'orange' ? 'from-orange-500 to-orange-600' : phase.color === 'red' ? 'from-red-500 to-red-600' : phase.color === 'indigo' ? 'from-indigo-500 to-indigo-600' : 'from-cyan-500 to-cyan-600'} transition-all duration-500`}
                                  style={{ width: `${phaseProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Arrow */}
                        {isUnlocked && (
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Battle Room Section */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="inline-block bg-red-800 text-red-100 px-3 py-1 rounded-lg text-xs font-bold mb-2">NEW</span>
                <h3 className="text-2xl font-bold">Battle Room</h3>
              </div>
            </div>
            
            <p className="text-red-100 mb-6">
              Real-time incident simulations. Defend against live attacks, analyze traffic patterns, 
              and deploy countermeasures under pressure.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-white/10 rounded-xl p-4">
                <p className="text-3xl font-bold">45</p>
                <p className="text-red-100 text-sm">Attacks Mitigated</p>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-4">
                <p className="text-3xl font-bold">12</p>
                <p className="text-red-100 text-sm">Modules Done</p>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-4">
                <p className="text-3xl font-bold">98%</p>
                <p className="text-red-100 text-sm">Success Rate</p>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/incidents')}
              className="w-full bg-white text-red-600 py-4 px-6 rounded-xl font-bold hover:bg-red-50 transition-colors text-lg"
            >
              Enter War Room →
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <button className="flex flex-col items-center justify-center py-2 px-3 bg-blue-50 text-blue-600 rounded-xl">
            <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button onClick={() => router.push('/learn')} className="flex flex-col items-center justify-center py-2 px-3 text-gray-500">
            <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs font-medium">Learn</span>
          </button>

          <button onClick={() => router.push('/incidents')} className="flex flex-col items-center justify-center py-2 px-3 text-gray-500">
            <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">Simulate</span>
          </button>

          <button onClick={() => router.push('/profile')} className="flex flex-col items-center justify-center py-2 px-3 text-gray-500">
            <div className="w-6 h-6 mb-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
