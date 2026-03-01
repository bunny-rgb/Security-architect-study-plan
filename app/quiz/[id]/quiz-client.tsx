'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { comprehensiveMITQuizzes as fullQuizDatabase, QuizQuestion } from '@/lib/comprehensiveMITQuizzes'
import { getCurrentUser, getUserProgress, markQuizComplete } from '@/lib/auth'

export function QuizClient({ id }: { id: string }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [startTime] = useState(Date.now())

  const lessonId = parseInt(id)

  useEffect(() => {
    setMounted(true)
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)

    // Load questions from fullQuizDatabase
    const lessonQuestions = fullQuizDatabase.filter(q => q.lessonId === lessonId)
    setQuestions(lessonQuestions)
  }, [lessonId, router])

  if (!mounted || !user || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const isLastQuestion = currentIndex === questions.length - 1

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex })
    setShowExplanation(false)
  }

  const checkAnswer = () => {
    if (answers[currentQuestion.id] === undefined) {
      alert('Please select an answer')
      return
    }
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1)
      setShowExplanation(false)
    } else {
      submitQuiz()
    }
  }

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowExplanation(false)
    }
  }

  const submitQuiz = () => {
    // Calculate score
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })

    const finalScore = Math.round((correct / questions.length) * 100)
    setScore(finalScore)
    setShowResult(true)

    // Mark quiz as complete
    markQuizComplete(user.id, lessonId, finalScore)
  }

  const handleNextLesson = () => {
    const nextLessonId = lessonId + 1
    // Check if next lesson exists (assume 50 lessons max)
    if (nextLessonId <= 50) {
      router.push(`/lesson/${nextLessonId}`)
    } else {
      router.push('/learn')
    }
  }

  const selectedAnswer = answers[currentQuestion.id]
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  // Result Screen
  if (showResult) {
    const passed = score >= 60

    return (
      <div className="min-h-screen bg-[#F7F8FA] pb-20">
        <header className="bg-white border-b border-[#E7EAF0]">
          <div className="max-w-[600px] mx-auto px-4 py-4">
            <button
              onClick={() => router.push('/learn')}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[14px] font-medium">Back to lessons</span>
            </button>
          </div>
        </header>

        <main className="max-w-[600px] mx-auto px-4 py-8">
          {/* Result Card */}
          <div className={`bg-gradient-to-br ${passed ? 'from-[#22C55E] to-[#16A34A]' : 'from-[#EF4444] to-[#DC2626]'} rounded-[14px] p-8 text-white mb-6 text-center`}>
            <div className="text-[48px] mb-2">
              {passed ? '🎉' : '📚'}
            </div>
            <h1 className="text-[24px] font-bold mb-2">
              {passed ? 'Great job!' : 'Keep practicing!'}
            </h1>
            <p className="text-[16px] mb-6 text-white/90">
              You scored {score}%
            </p>
            <div className="bg-white/20 rounded-[10px] p-4 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[24px] font-bold">{questions.length}</p>
                  <p className="text-[12px] text-white/80">Questions</p>
                </div>
                <div>
                  <p className="text-[24px] font-bold">
                    {Object.values(answers).filter((ans, idx) => ans === questions[idx].correctAnswer).length}
                  </p>
                  <p className="text-[12px] text-white/80">Correct</p>
                </div>
                <div>
                  <p className="text-[24px] font-bold">{Math.floor((Date.now() - startTime) / 1000)}s</p>
                  <p className="text-[12px] text-white/80">Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleNextLesson}
              className="w-full bg-[#2563EB] text-white py-3 px-6 rounded-[10px] text-[15px] font-semibold hover:bg-[#1d4ed8] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to next lesson</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => router.push(`/lesson/${lessonId}`)}
              className="w-full bg-white text-[#6B7280] py-3 px-6 rounded-[10px] text-[15px] font-semibold border border-[#E7EAF0] hover:border-[#2563EB] hover:text-[#2563EB] active:scale-[0.98] transition-all"
            >
              Review lesson
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Quiz Screen
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Header with Progress */}
      <header className="bg-white border-b border-[#E7EAF0] sticky top-0 z-50">
        <div className="max-w-[600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-[14px] font-medium">Exit quiz</span>
            </button>

            <span className="text-[13px] font-medium text-[#6B7280]">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#F7F8FA] rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-1.5 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6 space-y-6">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-[8px] text-[12px] font-semibold ${
            currentQuestion.difficulty === 'medium' ? 'bg-orange-50 text-orange-700' :
            currentQuestion.difficulty === 'hard' ? 'bg-red-50 text-red-700' :
            'bg-purple-50 text-purple-700'
          }`}>
            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </span>
          {currentQuestion.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-[#F7F8FA] border border-[#E7EAF0] text-[#6B7280] rounded-[8px] text-[12px]">
              {tag}
            </span>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[14px] p-6 border border-[#E7EAF0]">
          {currentQuestion.scenario && (
            <div className="mb-4 bg-[#F7F8FA] rounded-[10px] p-4 border border-[#E7EAF0]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[13px] font-semibold text-[#2563EB]">Scenario</span>
              </div>
              <p className="text-[14px] text-[#6B7280] leading-relaxed">
                {currentQuestion.scenario}
              </p>
            </div>
          )}

          <h2 className="text-[18px] font-semibold text-[#111827] mb-4 leading-snug">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectOption = index === currentQuestion.correctAnswer
              const showResult = showExplanation

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-[10px] border-2 transition-all ${
                    showResult
                      ? isCorrectOption
                        ? 'border-[#22C55E] bg-green-50'
                        : isSelected
                        ? 'border-[#EF4444] bg-red-50'
                        : 'border-[#E7EAF0] bg-white'
                      : isSelected
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-[#E7EAF0] bg-white hover:border-[#2563EB] hover:bg-blue-50/50'
                  } ${!showExplanation && 'active:scale-[0.98]'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      showResult
                        ? isCorrectOption
                          ? 'border-[#22C55E] bg-[#22C55E]'
                          : isSelected
                          ? 'border-[#EF4444] bg-[#EF4444]'
                          : 'border-[#E7EAF0]'
                        : isSelected
                        ? 'border-[#2563EB] bg-[#2563EB]'
                        : 'border-[#E7EAF0]'
                    }`}>
                      {showResult && isCorrectOption && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {showResult && isSelected && !isCorrectOption && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {isSelected && !showResult && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className={`text-[15px] leading-relaxed ${
                      showResult && isCorrectOption ? 'text-[#15803D] font-medium' :
                      showResult && isSelected ? 'text-[#B91C1C] font-medium' :
                      'text-[#111827]'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`bg-gradient-to-br ${isCorrect ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'} rounded-[14px] p-6 border-2 ${isCorrect ? 'border-[#22C55E]' : 'border-[#EF4444]'}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-full ${isCorrect ? 'bg-[#22C55E]' : 'bg-[#EF4444]'} flex items-center justify-center`}>
                {isCorrect ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className={`text-[16px] font-semibold ${isCorrect ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
            </div>
            <p className="text-[14px] text-[#111827] leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={previousQuestion}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white text-[#6B7280] rounded-[10px] text-[15px] font-medium border border-[#E7EAF0] hover:border-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            Previous
          </button>

          {!showExplanation ? (
            <button
              onClick={checkAnswer}
              className="flex-1 bg-[#2563EB] text-white py-3 px-6 rounded-[10px] text-[15px] font-semibold hover:bg-[#1d4ed8] active:scale-[0.98] transition-all"
            >
              Check answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 bg-[#2563EB] text-white py-3 px-6 rounded-[10px] text-[15px] font-semibold hover:bg-[#1d4ed8] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>{isLastQuestion ? 'Submit quiz' : 'Next question'}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
