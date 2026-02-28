'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Lesson {
  id: number
  title: string
  slug: string
  phase: number
  day: number
  difficulty: string
  reading_time_min: number
  content: string
  objectives: string
  key_takeaways: string
  micro_lab: string
  prerequisites: string | null
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [readProgress, setReadProgress] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    setUserId(storedUserId)

    const fetchLesson = async () => {
      const res = await fetch(`/api/lessons/${params.id}`)
      const data = await res.json()
      setLesson(data.lesson)
      setLoading(false)
    }
    fetchLesson()

    // Scroll progress tracking
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight
      const scrolled = window.scrollY
      const progress = (scrolled / (fullHeight - windowHeight)) * 100
      setReadProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [params.id])

  const markAsCompleted = async () => {
    if (!userId || !lesson) return
    
    await fetch('/api/daily/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        lessonId: lesson.id,
        timeSpentMinutes: lesson.reading_time_min
      })
    })
    
    router.push(`/quiz/${lesson.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">🤔</p>
          <p className="text-gray-400">Lesson not found</p>
          <Link href="/learn" className="text-primary mt-4 inline-block">
            ← Back to lessons
          </Link>
        </div>
      </div>
    )
  }

  const phaseColors = {
    0: 'from-blue-500 to-cyan-500',
    1: 'from-green-500 to-emerald-500',
    2: 'from-purple-500 to-pink-500',
    3: 'from-orange-500 to-red-500',
    4: 'from-red-500 to-rose-500',
  }

  const phaseIcons = ['🌐', '🔒', '⚡', '🛡️', '🚨']

  return (
    <div className="min-h-screen pb-24">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-dark-elevated z-50">
        <div 
          className="h-full progress-bar transition-all duration-300"
          style={{width: `${readProgress}%`}}
        />
      </div>

      {/* Header */}
      <header className="sticky top-1 z-40 glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-2xl">←</button>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30">
                Day {lesson.day}
              </span>
              <span className="text-xs text-gray-400">
                {lesson.reading_time_min} min read
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8 animate-fade-in">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${phaseColors[lesson.phase as keyof typeof phaseColors]} text-white font-medium mb-4`}>
            <span className="text-xl">{phaseIcons[lesson.phase]}</span>
            <span>Phase {lesson.phase}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 leading-tight">{lesson.title}</h1>
          
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-lg border ${
              lesson.difficulty === 'beginner' ? 'bg-success/10 text-success border-success/20' :
              lesson.difficulty === 'intermediate' ? 'bg-warning/10 text-warning border-warning/20' :
              'bg-danger/10 text-danger border-danger/20'
            }`}>
              {lesson.difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Learning Objectives */}
        {lesson.objectives && (
          <div className="mb-8 bg-dark-elevated border-l-4 border-primary rounded-r-xl p-6 animate-slide-up">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>🎯</span>
              Learning Objectives
            </h2>
            <div className="text-gray-300 space-y-2 text-sm leading-relaxed whitespace-pre-wrap">
              {lesson.objectives}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-4 text-base whitespace-pre-wrap">
              {lesson.content}
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        {lesson.key_takeaways && (
          <div className="mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>💡</span>
              Key Takeaways
            </h2>
            <div className="text-gray-300 space-y-2 text-sm leading-relaxed whitespace-pre-wrap">
              {lesson.key_takeaways}
            </div>
          </div>
        )}

        {/* Micro Lab */}
        {lesson.micro_lab && (
          <div className="mb-8 bg-dark-elevated border border-dark-border rounded-xl p-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>🧪</span>
              Hands-On Lab
            </h2>
            <div className="text-gray-300 space-y-3 text-sm leading-relaxed whitespace-pre-wrap font-mono bg-dark-surface p-4 rounded-lg border border-dark-border overflow-x-auto">
              {lesson.micro_lab}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {lesson.prerequisites && (
          <div className="mb-8 bg-dark-surface border border-dark-border rounded-xl p-4 text-sm text-gray-400">
            <span className="font-bold">Prerequisites:</span> {lesson.prerequisites}
          </div>
        )}
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={markAsCompleted}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl btn-glow flex items-center justify-center gap-2"
          >
            <span>Complete Lesson & Start Quiz</span>
            <span>→</span>
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            {readProgress < 80 ? `Keep reading... ${Math.round(readProgress)}% done` : '✓ Ready to test your knowledge'}
          </p>
        </div>
      </div>
    </div>
  )
}
