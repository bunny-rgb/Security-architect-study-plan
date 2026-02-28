'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { comprehensiveLessons } from '@/lib/comprehensiveLessons'

export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [showKnowledgePopup, setShowKnowledgePopup] = useState(false)

  const lessonId = parseInt(params.id)
  const lesson = comprehensiveLessons.find(l => l.id === lessonId)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !lesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const handleCompleteLesson = () => {
    setLessonCompleted(true)
    setShowKnowledgePopup(true)
    
    // Auto redirect to quiz after showing knowledge popup
    setTimeout(() => {
      router.push(`/quiz/${lessonId}`)
    }, 3000)
  }

  const phaseColors = {
    0: 'from-blue-500 to-cyan-500',
    1: 'from-purple-500 to-pink-500',
    2: 'from-emerald-500 to-teal-500',
    3: 'from-orange-500 to-red-500',
    4: 'from-red-500 to-pink-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/learn" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Lessons</span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">Day {lesson.day}</span>
              <div className={`px-3 py-1 bg-gradient-to-r ${phaseColors[lesson.phase as keyof typeof phaseColors]} rounded-full text-xs font-semibold text-white`}>
                Phase {lesson.phase}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-3 py-1 bg-${lesson.difficulty === 'beginner' ? 'green' : lesson.difficulty === 'intermediate' ? 'yellow' : 'red'}-500/20 text-${lesson.difficulty === 'beginner' ? 'green' : lesson.difficulty === 'intermediate' ? 'yellow' : 'red'}-400 rounded-full text-sm font-medium`}>
              {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
            </span>
            <span className="text-slate-400 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.reading_time_min} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {lesson.title}
          </h1>

          <p className="text-xl text-slate-300 mb-6">
            {lesson.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {lesson.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            What You'll Learn
          </h2>
          <ul className="space-y-2">
            {lesson.objectives.map((objective, i) => (
              <li key={i} className="flex items-start text-slate-300">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        {/* Lesson Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-slate-300 leading-relaxed">{lesson.content.introduction}</p>
          </div>

          {lesson.content.sections.map((section, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
              <p className="text-slate-300 leading-relaxed mb-6">{section.content}</p>

              {/* Key Points */}
              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {section.keyPoints.map((point, j) => (
                      <li key={j} className="flex items-start text-slate-300">
                        <span className="text-blue-400 mr-2">▸</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code Example */}
              {section.codeExample && (
                <div className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-700">
                    <span className="text-sm text-slate-400">Code Example</span>
                    <button className="text-xs text-blue-400 hover:text-blue-300">
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-sm text-slate-300 font-mono">{section.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}

          {/* Real World Example */}
          {lesson.content.realWorldExample && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Real-World Example</h2>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {lesson.content.realWorldExample.title}
              </h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                {lesson.content.realWorldExample.description}
              </p>
              <div className="bg-purple-500/10 rounded-xl p-4">
                <p className="text-sm font-semibold text-purple-300 mb-1">Impact:</p>
                <p className="text-slate-300">{lesson.content.realWorldExample.impact}</p>
              </div>
            </div>
          )}
        </div>

        {/* Complete Lesson Button */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Test Your Knowledge?</h3>
          <p className="text-slate-300 mb-6">
            Complete this lesson and take the quiz to earn knowledge points and unlock the next lesson.
          </p>
          <button
            onClick={handleCompleteLesson}
            disabled={lessonCompleted}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span>{lessonCompleted ? 'Redirecting to Quiz...' : 'Complete Lesson and Start Quiz'}</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </main>

      {/* Knowledge Point Popup */}
      {showKnowledgePopup && lesson.knowledgePoints && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full animate-bounce-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Lesson Completed!</h3>
              <p className="text-slate-300 mb-6">You've earned new knowledge points:</p>
              
              {lesson.knowledgePoints.map((kp, i) => (
                <div key={i} className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-4 mb-3">
                  <p className="font-semibold text-blue-400 mb-1">{kp.title}</p>
                  <p className="text-sm text-slate-300">{kp.description}</p>
                </div>
              ))}
              
              <p className="text-sm text-slate-400 mt-6">Redirecting to quiz...</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  )
}
