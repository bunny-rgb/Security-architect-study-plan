'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserProgress, saveUser, logout } from '@/lib/auth'
import { calculateLevel } from '@/lib/phases'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    setMounted(true)
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
    const userProgress = getUserProgress(currentUser.id)
    setProgress(userProgress)
    
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || ''
    })
  }, [router])

  const handleSave = () => {
    if (!user) return
    
    const updatedUser = {
      ...user,
      ...formData,
      lastActive: new Date().toISOString()
    }
    
    saveUser(updatedUser)
    setUser(updatedUser)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!mounted || !user || !progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const levelData = calculateLevel(progress.totalXP)
  const xpProgress = levelData.progress

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">SecureEdge</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button - Mobile */}
          <button onClick={() => router.back()} className="lg:hidden mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-200">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              {!isEditing ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                  {user.email && <p className="text-gray-500 text-sm mb-4">{user.email}</p>}
                  <p className="text-gray-600 mb-6">Level {levelData.level} {levelData.title}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full max-w-sm space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Email (optional)"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: user.name || '',
                          email: user.email || ''
                        })
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200">
              <p className="text-3xl font-bold text-blue-600 mb-1">{progress.totalXP}</p>
              <p className="text-sm text-gray-600">Total XP</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200">
              <p className="text-3xl font-bold text-purple-600 mb-1">{progress.completedLessons.length}</p>
              <p className="text-sm text-gray-600">Lessons</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200">
              <p className="text-3xl font-bold text-green-600 mb-1">{progress.completedQuizzes.length}</p>
              <p className="text-sm text-gray-600">Quizzes</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200">
              <p className="text-3xl font-bold text-orange-600 mb-1">{progress.streak}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Level Progress</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Level {levelData.level}</p>
                <p className="text-sm font-semibold text-gray-900">{progress.totalXP} / {levelData.nextLevelXP} XP</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{levelData.nextLevelXP - progress.totalXP} XP until Level {levelData.level + 1}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <button onClick={() => router.push('/')} className="flex flex-col items-center justify-center py-2 px-3 text-gray-500">
            <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
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

          <button className="flex flex-col items-center justify-center py-2 px-3 bg-blue-50 text-blue-600 rounded-xl">
            <div className="w-6 h-6 mb-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
