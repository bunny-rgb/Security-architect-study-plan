'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { comprehensiveLessons } from '@/lib/comprehensiveLessons'
import { getCurrentUser, getUserProgress } from '@/lib/auth'
import { ALL_PHASES } from '@/lib/phases'

export default function LearnPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null)

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
  }, [router])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const filteredLessons = selectedPhase !== null 
    ? comprehensiveLessons.filter(l => l.phase === selectedPhase)
    : comprehensiveLessons

  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const phase = lesson.phase
    if (!acc[phase]) acc[phase] = []
    acc[phase].push(lesson)
    return acc
  }, {} as Record<number, typeof comprehensiveLessons>)

  const getLessonStatus = (lessonId: number) => {
    if (!progress) return 'locked'
    const completed = progress.completedLessons?.includes(lessonId)
    if (completed) return 'completed'
    
    // Check if unlocked based on previous lessons
    const lessonIndex = comprehensiveLessons.findIndex(l => l.id === lessonId)
    if (lessonIndex === 0) return 'unlocked'
    const previousLesson = comprehensiveLessons[lessonIndex - 1]
    if (progress.completedLessons?.includes(previousLesson.id)) {
      return 'unlocked'
    }
    return 'locked'
  }

  const completedCount = progress?.completedLessons?.length || 0
  const totalCount = comprehensiveLessons.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Top App Bar */}
      <header className="bg-white border-b border-[#E7EAF0] sticky top-0 z-50">
        <div className="max-w-[1000px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[14px] font-semibold">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
              <span className="text-[14px] font-semibold text-[#111827]">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-4 py-6">
        {/* Progress Overview Card */}
        <div className="bg-white rounded-[14px] p-5 border border-[#E7EAF0] mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-semibold text-[#111827] mb-1">Learning Progress</h2>
              <p className="text-[13px] text-[#6B7280]">{completedCount} of {totalCount} lessons completed</p>
            </div>
            <div className="text-right">
              <div className="text-[28px] font-bold text-[#2563EB]">{progressPercent}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Phase Filter */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold text-[#6B7280] mb-3 uppercase tracking-wide">Filter by Phase</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <button
              onClick={() => setSelectedPhase(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-[10px] text-[14px] font-semibold transition-all ${
                selectedPhase === null
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white border border-[#E7EAF0] text-[#6B7280] hover:border-[#2563EB]'
              }`}
            >
              All Phases
            </button>
            {ALL_PHASES.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-[10px] text-[14px] font-semibold transition-all ${
                  selectedPhase === phase.id
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-white border border-[#E7EAF0] text-[#6B7280] hover:border-[#2563EB]'
                }`}
              >
                Phase {phase.id}
              </button>
            ))}
          </div>
        </div>

        {/* Lessons List by Phase */}
        <div className="space-y-8">
          {Object.entries(groupedLessons).map(([phaseNum, phaseLessons]) => {
            const phase = ALL_PHASES.find(p => p.id === parseInt(phaseNum))
            if (!phase) return null

            return (
              <div key={phaseNum}>
                {/* Phase Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white text-[18px] font-bold`}>
                      {phase.id}
                    </div>
                    <div>
                      <h2 className="text-[18px] font-semibold text-[#111827]">{phase.name}</h2>
                      <p className="text-[13px] text-[#6B7280]">{phase.shortDesc}</p>
                    </div>
                  </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phaseLessons.map((lesson) => {
                    const status = getLessonStatus(lesson.id)
                    const isLocked = status === 'locked'
                    const isCompleted = status === 'completed'

                    return (
                      <Link
                        key={lesson.id}
                        href={isLocked ? '#' : `/lesson/${lesson.id}`}
                        onClick={(e) => {
                          if (isLocked) {
                            e.preventDefault()
                            alert('Complete previous lessons to unlock')
                          }
                        }}
                        className={`block bg-white rounded-[14px] p-4 border transition-all ${
                          isLocked
                            ? 'border-[#E7EAF0] opacity-60 cursor-not-allowed'
                            : isCompleted
                            ? 'border-[#22C55E] hover:shadow-md'
                            : 'border-[#E7EAF0] hover:border-[#2563EB] hover:shadow-md active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[12px] font-semibold text-[#6B7280]">Day {lesson.day}</span>
                              <span className={`px-2 py-0.5 rounded-[6px] text-[11px] font-semibold ${
                                lesson.difficulty === 'beginner'
                                  ? 'bg-[#DBEAFE] text-[#1E40AF]'
                                  : lesson.difficulty === 'intermediate'
                                  ? 'bg-[#FEF3C7] text-[#92400E]'
                                  : 'bg-[#FEE2E2] text-[#991B1B]'
                              }`}>
                                {lesson.difficulty}
                              </span>
                            </div>
                            <h3 className="text-[15px] font-semibold text-[#111827] mb-1 line-clamp-2">
                              {lesson.title}
                            </h3>
                            <p className="text-[13px] text-[#6B7280] line-clamp-2">
                              {lesson.description}
                            </p>
                          </div>

                          {/* Status Icon */}
                          <div className="ml-3 flex-shrink-0">
                            {isCompleted ? (
                              <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : isLocked ? (
                              <div className="w-8 h-8 rounded-full bg-[#E7EAF0] flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Lesson Meta */}
                        <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{lesson.reading_time_min} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Quiz included</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7EAF0] z-50">
        <div className="max-w-[600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#2563EB] transition-colors min-w-[44px] min-h-[44px] justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[11px] font-semibold">Home</span>
            </Link>

            <Link href="/learn" className="flex flex-col items-center gap-1 text-[#2563EB] transition-colors min-w-[44px] min-h-[44px] justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-[11px] font-semibold">Learn</span>
            </Link>

            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#2563EB] transition-colors min-w-[44px] min-h-[44px] justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-[11px] font-semibold">Progress</span>
            </Link>

            <Link href="/profile" className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#2563EB] transition-colors min-w-[44px] min-h-[44px] justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[11px] font-semibold">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
