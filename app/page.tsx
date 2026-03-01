'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, createNewUser, logout, getUserProgress } from '@/lib/auth'
import { ALL_PHASES, getDailyChallenge, calculateLevel } from '@/lib/phases'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [userName, setUserName] = useState('')
  const [progress, setProgress] = useState<any>(null)
  const [showFullScenario, setShowFullScenario] = useState(false)

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

  if (!mounted) return null

  // Login Screen - Clean and minimal
  if (showLogin) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] p-8 max-w-[400px] w-full border border-[#E7EAF0]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2563EB] rounded-[14px] mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-[22px] font-semibold text-gray-900 mb-1">
              SecureEdge Academy
            </h1>
            <p className="text-[14px] text-gray-600">
              Master security architecture
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-[13px] font-medium text-gray-700 mb-2">
                What's your name?
              </label>
              <input
                id="name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-[#F7F8FA] border border-[#E7EAF0] rounded-[10px] text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                autoFocus
                required
                minLength={2}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2563EB] text-white py-3 px-4 rounded-[10px] text-[15px] font-medium hover:bg-[#1d4ed8] active:scale-[0.98] transition-all"
            >
              Start learning
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main Dashboard
  const dailyChallenge = getDailyChallenge()
  const levelData = calculateLevel(progress?.totalXP || 0)
  const xpProgress = levelData.progress

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Top App Bar */}
      <header className="bg-white border-b border-[#E7EAF0] sticky top-0 z-50">
        <div className="max-w-[600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-semibold text-gray-900">
                Hi, {user?.name} 👋
              </h1>
              <p className="text-[13px] text-gray-600 mt-0.5">Ready to secure the edge?</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#F7F8FA] rounded-[8px] px-3 py-1.5 border border-[#E7EAF0]">
                <span className="text-[14px]">⭐</span>
                <span className="text-[13px] font-medium text-gray-900">{progress?.totalXP || 0} XP</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-[#F7F8FA] rounded-[8px] px-3 py-1.5 border border-[#E7EAF0]">
                <span className="text-[14px]">🔥</span>
                <span className="text-[13px] font-medium text-gray-900">{progress?.streak || 0} day</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6 space-y-6">
        {/* Progress Card */}
        <div className="bg-white rounded-[14px] p-5 border border-[#E7EAF0]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] text-gray-600">Level {levelData.level}</p>
              <p className="text-[16px] font-semibold text-gray-900">{levelData.title}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-gray-600">{progress?.totalXP || 0} / {levelData.nextLevelXP} XP</p>
            </div>
          </div>
          <div className="w-full bg-[#F7F8FA] rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-1.5 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] transition-all duration-500 ease-out"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Daily Scenario Card (Hero) */}
        <div className="bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-[14px] p-5 text-white relative overflow-hidden">
          {/* Background illustration */}
          <div className="absolute right-0 top-0 opacity-10">
            <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="70" cy="30" r="20" />
              <circle cx="50" cy="60" r="15" />
              <circle cx="80" cy="70" r="12" />
            </svg>
          </div>
          
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-[8px] px-2.5 py-1 mb-3">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-[12px] font-medium">Daily {dailyChallenge.difficulty} scenario</span>
            </div>
            
            <h3 className="text-[18px] font-semibold mb-2 leading-snug">
              {dailyChallenge.title}
            </h3>
            
            <p className="text-[14px] text-white/90 leading-relaxed mb-4">
              {showFullScenario 
                ? dailyChallenge.description 
                : `${dailyChallenge.description.slice(0, 100)}...`
              }
              {!showFullScenario && (
                <button 
                  onClick={() => setShowFullScenario(true)}
                  className="ml-1 text-[13px] font-medium underline hover:no-underline"
                >
                  Read more
                </button>
              )}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/incidents')}
                className="flex-1 bg-white text-[#2563EB] py-2.5 px-4 rounded-[10px] text-[14px] font-medium hover:bg-white/95 active:scale-[0.98] transition-all"
              >
                Start challenge
              </button>
              <button
                onClick={() => router.push('/incidents')}
                className="bg-white/10 text-white py-2.5 px-4 rounded-[10px] text-[14px] font-medium hover:bg-white/20 active:scale-[0.98] transition-all backdrop-blur-sm border border-white/20"
              >
                View logs
              </button>
            </div>
          </div>
        </div>

        {/* Learning Path Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold text-gray-900">Architect learning path</h2>
            <button 
              onClick={() => router.push('/learn')}
              className="text-[13px] font-medium text-[#2563EB] hover:text-[#1d4ed8] transition-colors"
            >
              See all
            </button>
          </div>
          
          <div className="space-y-3">
            {ALL_PHASES.slice(0, 5).map((phase) => {
              const isUnlocked = progress?.unlockedPhases.includes(phase.id)
              const completedLessons = progress?.completedLessons.filter((id: number) => {
                const lessonPhase = Math.floor(id / 10)
                return lessonPhase === phase.id
              }).length || 0
              const phaseProgress = (completedLessons / phase.totalLessons) * 100

              const colorMap: Record<string, string> = {
                'blue': '#2563EB',
                'purple': '#9333EA',
                'green': '#22C55E',
                'orange': '#F97316',
                'red': '#EF4444',
                'indigo': '#6366F1',
                'cyan': '#06B6D4'
              }

              return (
                <button
                  key={phase.id}
                  onClick={() => isUnlocked && router.push(`/learn?phase=${phase.id}`)}
                  disabled={!isUnlocked}
                  className={`w-full bg-white rounded-[14px] p-4 border border-[#E7EAF0] text-left transition-all ${
                    isUnlocked 
                      ? 'hover:border-[#2563EB] hover:shadow-sm active:scale-[0.98]' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div 
                      className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isUnlocked ? `${colorMap[phase.color]}15` : '#F7F8FA' }}
                    >
                      <span className="text-[20px]" style={{ opacity: isUnlocked ? 1 : 0.4 }}>
                        {phase.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                          {phase.name}
                        </h3>
                        {!isUnlocked && (
                          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[13px] text-gray-600 mb-2 line-clamp-1">
                        {phase.shortDesc}
                      </p>
                      
                      {isUnlocked && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] text-gray-600">
                              {completedLessons}/{phase.totalLessons} lessons
                            </span>
                            <span className="text-[12px] font-semibold text-gray-900">
                              {Math.round(phaseProgress)}%
                            </span>
                          </div>
                          <div className="w-full bg-[#F7F8FA] rounded-full h-1 overflow-hidden">
                            <div 
                              className="h-1 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${phaseProgress}%`,
                                backgroundColor: colorMap[phase.color]
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {!isUnlocked && (
                        <p className="text-[12px] text-gray-500 mt-1">
                          Complete {phase.unlockRequirements.lessons} lessons to unlock
                        </p>
                      )}
                    </div>

                    {/* Chevron */}
                    {isUnlocked && (
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Battle Room Teaser */}
        <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-[14px] p-5 text-white">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-[10px] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-[#7F1D1D] rounded-[8px] px-2.5 py-1 mb-2">
                <span className="text-[11px] font-bold tracking-wide">NEW</span>
              </div>
              <h3 className="text-[16px] font-semibold mb-1">Battle Room</h3>
              <p className="text-[13px] text-white/90 leading-relaxed">
                Real-time attack simulations under pressure
              </p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/incidents')}
            className="w-full bg-white text-[#EF4444] py-2.5 px-4 rounded-[10px] text-[14px] font-medium hover:bg-white/95 active:scale-[0.98] transition-all"
          >
            Enter war room
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7EAF0] z-50">
        <div className="max-w-[600px] mx-auto grid grid-cols-4 gap-1 px-2 py-2">
          <button className="flex flex-col items-center justify-center py-2 px-3 bg-[#F7F8FA] text-[#2563EB] rounded-[10px]">
            <svg className="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-[11px] font-medium">Home</span>
          </button>

          <button onClick={() => router.push('/learn')} className="flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-gray-900 rounded-[10px]">
            <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-[11px] font-medium">Learn</span>
          </button>

          <button onClick={() => router.push('/incidents')} className="flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-gray-900 rounded-[10px]">
            <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] font-medium">Simulate</span>
          </button>

          <button onClick={() => router.push('/profile')} className="flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-gray-900 rounded-[10px]">
            <div className="w-6 h-6 mb-0.5 bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-full flex items-center justify-center text-white text-[11px] font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-[11px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
