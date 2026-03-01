'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { comprehensiveLessons } from '@/lib/comprehensiveLessons'
import { getCurrentUser, getUserProgress, markLessonComplete } from '@/lib/auth'

// Lesson image mapping
const LESSON_IMAGES: Record<number, string[]> = {
  1: ['/images/lessons/osi-model.png', '/images/lessons/application-layer.png', '/images/lessons/presentation-layer.png', '/images/lessons/session-layer.png', '/images/lessons/transport-layer.png', '/images/lessons/network-layer.png', '/images/lessons/data-link-layer.png', '/images/lessons/physical-layer.png'],
  2: ['/images/lessons/tcp-handshake.png', '/images/lessons/tcp-vs-udp.png', '/images/lessons/transport-layer.png'],
  3: ['/images/lessons/tcp-handshake.png'],
  4: ['/images/lessons/tcp-vs-udp.png', '/images/lessons/transport-layer.png'],
}

export function LessonClient({ id }: { id: string }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const lessonId = parseInt(id)
  const lesson = comprehensiveLessons.find(l => l.id === lessonId)
  const lessonImages = LESSON_IMAGES[lessonId] || []

  useEffect(() => {
    setMounted(true)
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
  }, [router])

  if (!mounted || !lesson || !user) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const handleCompleteLesson = () => {
    markLessonComplete(user.id, lessonId)
    router.push(`/quiz/${lessonId}`)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : lessonImages.length - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev < lessonImages.length - 1 ? prev + 1 : 0))
  }

  const userProgress = getUserProgress(user.id)
  const isCompleted = userProgress?.completedLessons?.includes(lessonId) || false

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/learn')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Lessons</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-500">Phase {lesson.phase}:</span>
              <span className="ml-1 font-medium text-gray-900">{lesson.phaseName}</span>
            </div>
            {isCompleted && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Day {lesson.day}
            </div>
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {lesson.difficulty}
            </div>
            <div className="text-gray-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.reading_time_min} min read
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{lesson.title}</h1>
          <p className="text-lg text-gray-600">{lesson.description}</p>
        </div>

        {/* Learning Objectives */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learning Objectives
          </h2>
          <ul className="space-y-2">
            {lesson.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2 text-blue-800">
                <span className="text-blue-500 mt-1">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lesson Images - Swipeable Carousel */}
        {lessonImages.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={lessonImages[currentImageIndex]}
                alt={`Lesson ${lessonId} diagram ${currentImageIndex + 1}`}
                className="w-full h-auto"
              />
              {lessonImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                  >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                  >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {lessonImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content Introduction */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-700 leading-relaxed">{lesson.content.introduction}</p>
          </div>
        </div>

        {/* Content Sections */}
        {lesson.content.sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>

            {section.keyPoints && section.keyPoints.length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, pidx) => (
                    <li key={pidx} className="flex items-start gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.codeExample && (
              <div className="mt-6">
                <pre className="bg-gray-900 text-gray-100 rounded-xl p-6 overflow-x-auto">
                  <code>{section.codeExample}</code>
                </pre>
              </div>
            )}
          </div>
        ))}

        {/* Practical Exercise */}
        {lesson.content.practicalExercise && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Practical Exercise
            </h2>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">{lesson.content.practicalExercise.title}</h3>
            <p className="text-purple-700 mb-4">{lesson.content.practicalExercise.scenario}</p>
            <ol className="space-y-3">
              {lesson.content.practicalExercise.steps.map((step, sidx) => (
                <li key={sidx} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-purple-500 text-white rounded-full text-sm font-bold flex-shrink-0">
                    {sidx + 1}
                  </span>
                  <span className="text-purple-900">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Real World Example */}
        {lesson.content.realWorldExample && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Real-World Case Study
            </h2>
            <h3 className="text-xl font-semibold text-amber-800 mb-2">{lesson.content.realWorldExample.title}</h3>
            <p className="text-amber-800 leading-relaxed mb-4">{lesson.content.realWorldExample.description}</p>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900 mb-1">Impact:</p>
              <p className="text-amber-900">{lesson.content.realWorldExample.impact}</p>
            </div>
          </div>
        )}

        {/* Complete Lesson Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCompleteLesson}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <span>Continue to Quiz</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
