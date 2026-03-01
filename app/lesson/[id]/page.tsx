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

export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const lessonId = parseInt(params.id)
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
    setCurrentImageIndex((prev) => (prev === 0 ? lessonImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === lessonImages.length - 1 ? 0 : prev + 1))
  }

  const difficultyColors: Record<string, { bg: string; text: string }> = {
    beginner: { bg: 'bg-green-50', text: 'text-green-700' },
    intermediate: { bg: 'bg-orange-50', text: 'text-orange-700' },
    advanced: { bg: 'bg-red-50', text: 'text-red-700' },
  }

  const difficultyColor = difficultyColors[lesson.difficulty] || difficultyColors.beginner

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-[#E7EAF0] sticky top-0 z-50">
        <div className="max-w-[800px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[14px] font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#6B7280]">Day {lesson.day}</span>
              <span className={`px-3 py-1 ${difficultyColor.bg} ${difficultyColor.text} rounded-[8px] text-[12px] font-semibold`}>
                {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 py-8 space-y-6">
        {/* Title Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              Phase {lesson.phase}
            </span>
            <span className="text-[13px] text-[#6B7280]">•</span>
            <span className="text-[13px] text-[#6B7280] flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.reading_time_min} min
            </span>
          </div>

          <h1 className="text-[28px] md:text-[32px] font-bold text-[#111827] mb-4 leading-tight">
            {lesson.title}
          </h1>

          <p className="text-[16px] text-[#6B7280] leading-relaxed mb-4">
            {lesson.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {lesson.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-[#F7F8FA] border border-[#E7EAF0] text-[#6B7280] rounded-[8px] text-[13px]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Image Carousel (if lesson has images) */}
        {lessonImages.length > 0 && (
          <div className="bg-white rounded-[14px] p-5 border border-[#E7EAF0]">
            <h3 className="text-[16px] font-semibold text-[#111827] mb-4">Visual Diagrams</h3>
            
            <div className="relative">
              <img
                src={lessonImages[currentImageIndex]}
                alt={`Diagram ${currentImageIndex + 1}`}
                className="w-full rounded-[10px] border border-[#E7EAF0]"
              />

              {lessonImages.length > 1 && (
                <>
                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center border border-[#E7EAF0] shadow-sm transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center border border-[#E7EAF0] shadow-sm transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Dot Indicators */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {lessonImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'w-6 bg-[#2563EB]'
                            : 'w-2 bg-[#E7EAF0]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[13px] text-[#6B7280] text-center mt-2">
                    {currentImageIndex + 1} of {lessonImages.length}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content Sections */}
        {lesson.content.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-[14px] p-6 border border-[#E7EAF0]">
            <h2 className="text-[20px] font-semibold text-[#111827] mb-4">
              {section.title}
            </h2>
            
            <div className="space-y-4">
              <p className="text-[15px] text-[#6B7280] leading-relaxed">
                {section.content}
              </p>
            </div>

            {section.keyPoints && section.keyPoints.length > 0 && (
              <div className="mt-4 space-y-2">
                {section.keyPoints.map((point, kIndex) => (
                  <div key={kIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
                    </div>
                    <p className="text-[14px] text-[#6B7280] leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.codeExample && (
              <div className="mt-4 bg-[#F7F8FA] rounded-[10px] p-4 border border-[#E7EAF0]">
                <pre className="text-[13px] text-[#111827] overflow-x-auto">
                  <code>{section.codeExample}</code>
                </pre>
              </div>
            )}
          </div>
        ))}


        {/* Complete Lesson Button */}
        <div className="sticky bottom-20 md:bottom-4 bg-white rounded-[14px] p-4 border border-[#E7EAF0] shadow-lg">
          <button
            onClick={handleCompleteLesson}
            className="w-full bg-[#2563EB] text-white py-3 px-6 rounded-[10px] text-[15px] font-semibold hover:bg-[#1d4ed8] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Complete lesson & take quiz</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  )
}
