'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Lesson {
  id: number
  title: string
  slug: string
  phase: number
  day: number
  difficulty: string
  reading_time_min: number
  prerequisites: string | null
}

export default function LearnPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null)

  useEffect(() => {
    // Use mock data for now
    import('@/lib/mockData').then(({ mockLessons }) => {
      setTimeout(() => {
        setLessons(mockLessons)
        setLoading(false)
      }, 1000)
    })
  }, [])

  const phases = [
    { num: 0, name: 'Networking', icon: '🌐', color: 'from-blue-500 to-cyan-500' },
    { num: 1, name: 'Security Fundamentals', icon: '🔒', color: 'from-green-500 to-emerald-500' },
    { num: 2, name: 'CDN & Edge', icon: '⚡', color: 'from-purple-500 to-pink-500' },
    { num: 3, name: 'WAF & Bot Defense', icon: '🛡️', color: 'from-orange-500 to-red-500' },
    { num: 4, name: 'Incident Response', icon: '🚨', color: 'from-red-500 to-rose-500' },
  ]

  const filteredLessons = selectedPhase !== null 
    ? lessons.filter(l => l.phase === selectedPhase)
    : lessons

  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    const phase = lesson.phase
    if (!acc[phase]) acc[phase] = []
    acc[phase].push(lesson)
    return acc
  }, {} as Record<number, Lesson[]>)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl">←</Link>
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold">Learning Path</h1>
              <p className="text-xs text-gray-400">{lessons.length} lessons available</p>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Phase Filter */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">Choose Phase</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <button
              onClick={() => setSelectedPhase(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedPhase === null
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'bg-dark-elevated border border-dark-border text-gray-400'
              }`}
            >
              All Phases
            </button>
            {phases.map((phase) => (
              <button
                key={phase.num}
                onClick={() => setSelectedPhase(phase.num)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedPhase === phase.num
                    ? `bg-gradient-to-r ${phase.color} text-white shadow-lg`
                    : 'bg-dark-elevated border border-dark-border text-gray-400'
                }`}
              >
                <span>{phase.icon}</span>
                <span className="text-sm">{phase.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lessons by Phase */}
        {Object.keys(groupedLessons)
          .sort((a, b) => Number(a) - Number(b))
          .map((phaseNum) => {
            const phase = phases[Number(phaseNum)]
            const phaseLessons = groupedLessons[Number(phaseNum)]
            
            return (
              <div key={phaseNum} className="mb-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-2xl`}>
                    {phase.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Phase {phaseNum}</h3>
                    <p className="text-sm text-gray-400">{phase.name}</p>
                  </div>
                  <div className="flex-1"></div>
                  <span className="text-xs px-3 py-1 bg-dark-elevated border border-dark-border rounded-full">
                    {phaseLessons.length} lessons
                  </span>
                </div>

                <div className="space-y-3">
                  {phaseLessons.map((lesson, index) => (
                    <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                      <div className="bg-dark-elevated border border-dark-border rounded-xl p-4 card-hover">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-lg flex items-center justify-center font-bold text-primary flex-shrink-0">
                            {lesson.day}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-0.5 rounded-md border ${
                                lesson.difficulty === 'beginner' ? 'bg-success/10 text-success border-success/20' :
                                lesson.difficulty === 'intermediate' ? 'bg-warning/10 text-warning border-warning/20' :
                                'bg-danger/10 text-danger border-danger/20'
                              }`}>
                                {lesson.difficulty}
                              </span>
                              <span className="text-xs text-gray-400">
                                📖 {lesson.reading_time_min} min
                              </span>
                            </div>
                            <h4 className="font-bold mb-1 text-sm leading-tight">{lesson.title}</h4>
                            {lesson.prerequisites && (
                              <p className="text-xs text-gray-500">
                                Prerequisites: {lesson.prerequisites}
                              </p>
                            )}
                          </div>
                          <div className="text-primary text-xl flex-shrink-0">→</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">🏠</span>
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/learn" className="flex flex-col items-center gap-1 text-primary">
              <span className="text-2xl">📚</span>
              <span className="text-xs font-medium">Learn</span>
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

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
