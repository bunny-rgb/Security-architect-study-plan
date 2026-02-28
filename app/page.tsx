'use client'

import Link from 'next/link'
import { mockDailyPlan, mockProgress, mockUser } from '@/lib/mockData'

export default function HomePage() {
  const dailyPlan = mockDailyPlan
  const progress = mockProgress as any

  return (
    <div className="min-h-screen pb-20 bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
                SecArch Academy
              </h1>
              <p className="text-xs text-gray-400 mt-1">Security Architect Training</p>
            </div>
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 bg-[#1c1c24] px-4 py-2 rounded-lg border border-[#2a2a35] hover:border-[#6366f1] transition-all"
            >
              <span className="text-2xl">🔥</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Streak</p>
                <p className="text-sm font-bold text-[#6366f1]">{progress.overall.current_streak} days</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-400">
            Ready to level up your security skills today?
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Lessons */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#6366f1]/20 to-[#6366f1]/5 border border-[#6366f1]/30">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-2xl font-bold">{progress.overall.completed_lessons}</p>
            <p className="text-sm text-gray-400">Lessons Done</p>
          </div>
          
          {/* Time */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 border border-[#8b5cf6]/30">
            <div className="text-3xl mb-2">⏱️</div>
            <p className="text-2xl font-bold">{Math.round(progress.overall.total_time_spent_minutes / 60)}h</p>
            <p className="text-sm text-gray-400">Time Invested</p>
          </div>
          
          {/* Streak */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#ec4899]/20 to-[#ec4899]/5 border border-[#ec4899]/30">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold">{progress.overall.current_streak}</p>
            <p className="text-sm text-gray-400">Day Streak</p>
          </div>
          
          {/* Progress */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/30">
            <div className="text-3xl mb-2">📈</div>
            <p className="text-2xl font-bold">{progress.overall.completion_percentage}%</p>
            <p className="text-sm text-gray-400">Complete</p>
          </div>
        </div>

        {/* Today's Lesson */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Today's Challenge</h3>
            <span className="text-xs px-3 py-1 bg-[#6366f1]/20 text-[#6366f1] rounded-full border border-[#6366f1]/30">
              Day {dailyPlan.lesson.day}
            </span>
          </div>
          
          <Link href={`/lesson/${dailyPlan.lesson.id}`} className="block">
            <div className="bg-gradient-to-br from-[#1c1c24] to-[#141419] border border-[#2a2a35] rounded-2xl p-6 hover:border-[#6366f1] transition-all transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🌐
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs px-2 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded-md border border-[#6366f1]/20">
                      Phase {dailyPlan.lesson.phase}
                    </span>
                    <span className="text-xs px-2 py-1 bg-[#10b981]/10 text-[#10b981] rounded-md border border-[#10b981]/20">
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
                  
                  <button className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all active:scale-[0.98]">
                    Start Learning →
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/learn" className="block">
            <div className="bg-[#1c1c24] border border-[#2a2a35] rounded-xl p-4 text-center hover:border-[#6366f1] transition-all transform hover:-translate-y-1">
              <div className="text-3xl mb-2">📚</div>
              <p className="font-bold">All Lessons</p>
              <p className="text-xs text-gray-400 mt-1">Browse curriculum</p>
            </div>
          </Link>
          <Link href="/incidents" className="block">
            <div className="bg-[#1c1c24] border border-[#2a2a35] rounded-xl p-4 text-center hover:border-[#6366f1] transition-all transform hover:-translate-y-1">
              <div className="text-3xl mb-2">🚨</div>
              <p className="font-bold">Incidents</p>
              <p className="text-xs text-gray-400 mt-1">Practice responses</p>
            </div>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-white/5 border-t border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 text-[#6366f1]">
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
