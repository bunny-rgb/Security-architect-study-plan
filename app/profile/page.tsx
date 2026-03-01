'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserProgress, saveUser, saveUserProgress, logout } from '@/lib/auth'
import { downloadProgressData } from '@/lib/githubDataCollection'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    company: '',
    website: ''
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
      email: currentUser.email || '',
      bio: currentUser.bio || '',
      location: currentUser.location || '',
      company: currentUser.company || '',
      website: currentUser.website || ''
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

  const getPhaseProgress = (phase: number) => {
    if (!progress) return 0
    const phaseLessons = progress.completedLessons.filter(
      (l: number) => l >= phase * 10 + 1 && l <= (phase + 1) * 10
    ).length
    return (phaseLessons / 10) * 100
  }

  if (!mounted || !user || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <button onClick={() => router.back()} className="text-2xl mb-4">←</button>
        <h1 className="text-3xl font-bold">My Profile</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Avatar and Basic Info Card */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Animated Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-2xl border-4 border-slate-800 group-hover:scale-110 transition-transform">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            {!isEditing ? (
              <>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                  {user.email && <p className="text-slate-400">{user.email}</p>}
                  {user.bio && <p className="text-slate-300 mt-3 max-w-md">{user.bio}</p>}
                </div>

                <div className="flex flex-wrap gap-4 justify-center text-sm text-slate-400">
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {user.location}
                    </div>
                  )}
                  {user.company && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {user.company}
                    </div>
                  )}
                  {user.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Website
                    </a>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-indigo-500/50 transition-all"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl hover:border-indigo-500 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full max-w-md space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Name"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Bio (tell us about yourself)"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Location"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Company"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="Website"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-indigo-500/50 transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl hover:border-indigo-500 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-2">{progress.totalXP}</div>
            <div className="text-sm text-slate-400">Total XP</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{progress.completedLessons.length}</div>
            <div className="text-sm text-slate-400">Lessons Done</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">{progress.completedQuizzes.length}</div>
            <div className="text-sm text-slate-400">Quizzes Passed</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">{progress.streak}</div>
            <div className="text-sm text-slate-400">Day Streak 🔥</div>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Learning Progress by Phase</h3>
          <div className="space-y-4">
            {[
              { id: 0, name: 'Phase 0: Network Fundamentals', color: 'from-blue-500 to-cyan-500' },
              { id: 1, name: 'Phase 1: Web Security', color: 'from-purple-500 to-pink-500' },
              { id: 2, name: 'Phase 2: CDN & Edge', color: 'from-green-500 to-teal-500' },
              { id: 3, name: 'Phase 3: WAF & Bot Defense', color: 'from-orange-500 to-red-500' },
              { id: 4, name: 'Phase 4: Incident Response', color: 'from-indigo-500 to-purple-500' }
            ].map((phase) => {
              const progressPercent = getPhaseProgress(phase.id)
              const isUnlocked = progress.unlockedPhases.includes(phase.id)
              
              return (
                <div key={phase.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {isUnlocked ? '🔓' : '🔒'} {phase.name}
                    </span>
                    <span className="text-sm text-slate-400">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${phase.color} transition-all duration-500`}
                      style={{width: `${progressPercent}%`}}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Achievements */}
        {progress.achievements && progress.achievements.length > 0 && (
          <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {progress.achievements.map((achievement: any) => {
                const rarityColors = {
                  legendary: 'from-yellow-500 to-orange-500',
                  epic: 'from-purple-500 to-pink-500',
                  rare: 'from-blue-500 to-cyan-500',
                  common: 'from-gray-500 to-gray-600'
                }
                return (
                  <div 
                    key={achievement.id}
                    className={`bg-gradient-to-br ${rarityColors[achievement.rarity as keyof typeof rarityColors]} p-4 rounded-xl text-center`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon === 'unlock' ? '🔓' : '🏆'}</div>
                    <div className="font-bold text-sm mb-1">{achievement.title}</div>
                    <div className="text-xs opacity-90">{achievement.description}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Data Export */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Export Your Data</h3>
          <p className="text-slate-400 mb-6 text-sm">
            Download your learning progress and quiz results as Markdown or JSON.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => downloadProgressData(user.id, 'markdown')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-indigo-500/50 transition-all"
            >
              📥 Download as Markdown
            </button>
            <button
              onClick={() => downloadProgressData(user.id, 'json')}
              className="flex-1 px-6 py-3 bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl hover:border-indigo-500 transition-all"
            >
              📥 Download as JSON
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Member Since</span>
              <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Active</span>
              <span className="text-white">{new Date(user.lastActive).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Study Time</span>
              <span className="text-white">{Math.round((progress.studyTimeMinutes || 0) / 60)} hours</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
