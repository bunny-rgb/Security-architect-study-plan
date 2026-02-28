'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface QuizQuestion {
  id: number
  question: string
  type: string
  options: any
  correct_answer: any
  explanation: string
  points: number
}

interface QuizAttempt {
  totalQuestions: number
  correctAnswers: number
  score: number
  timeSpent: number
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<QuizAttempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    setUserId(storedUserId)

    const fetchQuiz = async () => {
      const res = await fetch(`/api/quiz/${params.id}`)
      const data = await res.json()
      setQuestions(data.questions)
      setLoading(false)
    }
    fetchQuiz()
  }, [params.id])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (answer: any) => {
    setSelectedAnswer(answer)
    setAnswers({ ...answers, [currentQuestion.id]: answer })
  }

  const checkAnswer = () => {
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(answers[questions[currentIndex + 1]?.id] || null)
      setShowExplanation(false)
    } else {
      submitQuiz()
    }
  }

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedAnswer(answers[questions[currentIndex - 1]?.id] || null)
      setShowExplanation(false)
    }
  }

  const submitQuiz = async () => {
    if (!userId) return

    const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60)
    
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        lessonId: params.id,
        answers,
        timeSpent
      })
    })

    const data = await res.json()
    setResult(data.result)
    setShowResult(true)
  }

  const isCorrect = () => {
    if (!selectedAnswer || !currentQuestion) return false
    
    if (currentQuestion.type === 'multiple_choice') {
      return selectedAnswer === currentQuestion.correct_answer
    } else if (currentQuestion.type === 'multiple_correct') {
      const correct = Array.isArray(currentQuestion.correct_answer) 
        ? currentQuestion.correct_answer 
        : [currentQuestion.correct_answer]
      const selected = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer]
      return JSON.stringify(correct.sort()) === JSON.stringify(selected.sort())
    }
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (showResult && result) {
    const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100)
    const passed = percentage >= 60
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className={`text-center p-8 rounded-2xl border-2 ${
            passed 
              ? 'bg-gradient-to-br from-success/20 to-success/5 border-success' 
              : 'bg-gradient-to-br from-danger/20 to-danger/5 border-danger'
          }`}>
            <div className="text-6xl mb-4">
              {percentage >= 85 ? '🏆' : passed ? '✅' : '📚'}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {percentage >= 85 ? 'Excellent!' : passed ? 'Well Done!' : 'Keep Learning!'}
            </h1>
            <p className="text-gray-400 mb-6">
              {percentage >= 85 
                ? 'Outstanding performance! Advanced content unlocked!' 
                : passed 
                ? 'Good job! You passed the quiz.' 
                : 'Don\'t worry, review the material and try again.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-elevated rounded-xl p-4 border border-dark-border">
                <p className="text-3xl font-bold text-primary">{percentage}%</p>
                <p className="text-sm text-gray-400">Score</p>
              </div>
              <div className="bg-dark-elevated rounded-xl p-4 border border-dark-border">
                <p className="text-3xl font-bold text-secondary">{result.correctAnswers}/{result.totalQuestions}</p>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl btn-glow"
              >
                Continue Learning
              </button>
              {!passed && (
                <button
                  onClick={() => router.push(`/lesson/${params.id}`)}
                  className="w-full bg-dark-elevated border border-dark-border text-white font-bold py-4 rounded-xl hover:border-primary transition-colors"
                >
                  Review Lesson
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => router.back()} className="text-2xl">←</button>
            <span className="text-sm font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-primary font-bold">
              {currentQuestion.points} pts
            </span>
          </div>
          <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
            <div 
              className="h-full progress-bar transition-all duration-300"
              style={{width: `${((currentIndex + 1) / questions.length) * 100}%`}}
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Question */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🤔</span>
              <h2 className="text-xl font-bold leading-tight flex-1">
                {currentQuestion.question}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-3 py-1 rounded-lg ${
                currentQuestion.type === 'multiple_choice' 
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-secondary/20 text-secondary border border-secondary/30'
              }`}>
                {currentQuestion.type === 'multiple_choice' ? 'Single Answer' : 'Multiple Answers'}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.type === 'multiple_choice' && 
             Array.isArray(currentQuestion.options) &&
             currentQuestion.options.map((option: string, idx: number) => {
              const optionLetter = String.fromCharCode(65 + idx)
              const isSelected = selectedAnswer === optionLetter
              const showCorrect = showExplanation && optionLetter === currentQuestion.correct_answer
              const showWrong = showExplanation && isSelected && optionLetter !== currentQuestion.correct_answer
              
              return (
                <button
                  key={idx}
                  onClick={() => !showExplanation && handleAnswer(optionLetter)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect 
                      ? 'bg-success/20 border-success'
                      : showWrong
                      ? 'bg-danger/20 border-danger'
                      : isSelected
                      ? 'bg-primary/20 border-primary'
                      : 'bg-dark-elevated border-dark-border hover:border-primary/50'
                  } ${!showExplanation && 'quiz-option'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                      showCorrect 
                        ? 'bg-success text-white'
                        : showWrong
                        ? 'bg-danger text-white'
                        : isSelected
                        ? 'bg-primary text-white'
                        : 'bg-dark-surface text-gray-400'
                    }`}>
                      {showCorrect ? '✓' : showWrong ? '✗' : optionLetter}
                    </div>
                    <span className="flex-1 leading-relaxed">{option}</span>
                  </div>
                </button>
              )
            })}

            {currentQuestion.type === 'multiple_correct' &&
             Array.isArray(currentQuestion.options) &&
             currentQuestion.options.map((option: string, idx: number) => {
              const optionLetter = String.fromCharCode(65 + idx)
              const isSelected = Array.isArray(selectedAnswer) && selectedAnswer.includes(optionLetter)
              const correctAnswers = Array.isArray(currentQuestion.correct_answer) 
                ? currentQuestion.correct_answer 
                : [currentQuestion.correct_answer]
              const showCorrect = showExplanation && correctAnswers.includes(optionLetter)
              const showWrong = showExplanation && isSelected && !correctAnswers.includes(optionLetter)

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (showExplanation) return
                    const current = Array.isArray(selectedAnswer) ? [...selectedAnswer] : []
                    if (current.includes(optionLetter)) {
                      handleAnswer(current.filter((a: string) => a !== optionLetter))
                    } else {
                      handleAnswer([...current, optionLetter])
                    }
                  }}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect 
                      ? 'bg-success/20 border-success'
                      : showWrong
                      ? 'bg-danger/20 border-danger'
                      : isSelected
                      ? 'bg-primary/20 border-primary'
                      : 'bg-dark-elevated border-dark-border hover:border-primary/50'
                  } ${!showExplanation && 'quiz-option'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                      showCorrect 
                        ? 'bg-success text-white'
                        : showWrong
                        ? 'bg-danger text-white'
                        : isSelected
                        ? 'bg-primary text-white'
                        : 'bg-dark-surface text-gray-400'
                    }`}>
                      {showCorrect ? '✓' : showWrong ? '✗' : isSelected ? '☑' : '☐'}
                    </div>
                    <span className="flex-1 leading-relaxed">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-6 rounded-xl border-2 animate-slide-up ${
            isCorrect()
              ? 'bg-success/10 border-success'
              : 'bg-danger/10 border-danger'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{isCorrect() ? '✅' : '❌'}</span>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {isCorrect() ? 'Correct!' : 'Not Quite'}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <button
              onClick={previousQuestion}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-dark-elevated border border-dark-border rounded-xl font-bold disabled:opacity-30"
            >
              ← Back
            </button>
            
            {!showExplanation ? (
              <button
                onClick={checkAnswer}
                disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl btn-glow"
              >
                {currentIndex < questions.length - 1 ? 'Next Question →' : 'Submit Quiz ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
