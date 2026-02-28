'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Incident {
  id: number
  title: string
  slug: string
  category: string
  difficulty: string
  description: string
  initial_state: any
  decision_tree: any
  optimal_actions: any
  learning_objectives: string
  time_limit_minutes: number
  required_phase: number
}

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [decisions, setDecisions] = useState<string[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [gameState, setGameState] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    setUserId(storedUserId)

    // Use mock data
    import('@/lib/mockData').then(({ mockIncidents }) => {
      const incidentId = parseInt(params.id as string)
      const foundIncident = mockIncidents.find(i => i.id === incidentId)
      setIncident(foundIncident as any || null)
      setGameState(foundIncident?.initial_state || null)
      setLoading(false)
    })
  }, [params.id])

  useEffect(() => {
    if (simulating && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (simulating && timeRemaining === 0) {
      handleTimeout()
    }
  }, [simulating, timeRemaining])

  const startSimulation = () => {
    setSimulating(true)
    setCurrentStep(0)
    setDecisions([])
    setTimeRemaining((incident?.time_limit_minutes || 5) * 60)
    setGameState(incident?.initial_state)
    setShowResult(false)
  }

  const makeDecision = (action: string) => {
    const newDecisions = [...decisions, action]
    setDecisions(newDecisions)
    
    // Update game state based on decision tree
    if (incident?.decision_tree) {
      const nextState = incident.decision_tree[`step_${currentStep + 1}`]
      if (nextState) {
        setGameState(nextState)
        setCurrentStep(currentStep + 1)
        
        // Check if this is the final step
        if (currentStep + 1 >= Object.keys(incident.decision_tree).length - 1) {
          finishSimulation(newDecisions)
        }
      }
    }
  }

  const finishSimulation = async (finalDecisions: string[]) => {
    setSimulating(false)
    
    // Calculate score based on optimal actions
    let calculatedScore = 0
    if (incident?.optimal_actions) {
      const optimalPath = incident.optimal_actions.path || []
      const matchedActions = finalDecisions.filter((d, i) => d === optimalPath[i]).length
      calculatedScore = Math.round((matchedActions / optimalPath.length) * 100)
    }
    
    setScore(calculatedScore)
    setShowResult(true)
    
    // Submit attempt
    if (userId) {
      await fetch(`/api/incidents/${params.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          decisions: finalDecisions,
          timeSpent: (incident?.time_limit_minutes || 5) * 60 - timeRemaining,
          score: calculatedScore
        })
      })
    }
  }

  const handleTimeout = () => {
    finishSimulation(decisions)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">🤔</p>
          <p className="text-gray-400">Incident not found</p>
          <Link href="/incidents" className="text-primary mt-4 inline-block">
            ← Back to incidents
          </Link>
        </div>
      </div>
    )
  }

  // Result Screen
  if (showResult) {
    const passed = score >= 70
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className={`p-8 rounded-2xl border-2 ${
            passed 
              ? 'bg-gradient-to-br from-success/20 to-success/5 border-success' 
              : 'bg-gradient-to-br from-warning/20 to-warning/5 border-warning'
          }`}>
            <div className="text-center">
              <div className="text-6xl mb-4">
                {score >= 90 ? '🏆' : passed ? '✅' : '📝'}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {score >= 90 ? 'Perfect Response!' : passed ? 'Incident Resolved' : 'Learning Opportunity'}
              </h1>
              <p className="text-gray-400 mb-6">
                {score >= 90 
                  ? 'Excellent! You handled this like a pro.' 
                  : passed 
                  ? 'Good job! You managed the incident effectively.' 
                  : 'Review the optimal actions to improve your response.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-dark-elevated rounded-xl p-4 border border-dark-border">
                  <p className="text-3xl font-bold text-primary">{score}%</p>
                  <p className="text-sm text-gray-400">Score</p>
                </div>
                <div className="bg-dark-elevated rounded-xl p-4 border border-dark-border">
                  <p className="text-3xl font-bold text-secondary">{decisions.length}</p>
                  <p className="text-sm text-gray-400">Actions</p>
                </div>
              </div>

              {incident.optimal_actions && incident.optimal_actions.explanation && (
                <div className="bg-dark-elevated border border-dark-border rounded-xl p-4 mb-6 text-left">
                  <h3 className="font-bold mb-2 text-sm">Optimal Response:</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {incident.optimal_actions.explanation}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={startSimulation}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl btn-glow"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/incidents')}
                  className="w-full bg-dark-elevated border border-dark-border text-white font-bold py-4 rounded-xl hover:border-primary transition-colors"
                >
                  More Incidents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Simulation Screen
  if (simulating && gameState) {
    const metrics = gameState.metrics || {}
    const availableActions = gameState.available_actions || []
    
    return (
      <div className="min-h-screen pb-32">
        {/* Timer Bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className={`h-2 transition-all ${
            timeRemaining < 60 ? 'bg-danger' : 'bg-primary'
          }`} style={{width: `${(timeRemaining / ((incident.time_limit_minutes || 5) * 60)) * 100}%`}} />
        </div>

        {/* Header */}
        <header className="sticky top-2 z-40 glass border-b border-dark-border">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <h1 className="text-sm font-bold">INCIDENT IN PROGRESS</h1>
                  <p className="text-xs text-gray-400">Step {currentStep + 1}</p>
                </div>
              </div>
              <div className={`text-xl font-bold font-mono ${
                timeRemaining < 60 ? 'text-danger animate-pulse' : 'text-primary'
              }`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Situation */}
          <div className="mb-6 bg-danger/10 border-l-4 border-danger rounded-r-xl p-6 animate-fade-in">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>⚠️</span>
              Current Situation
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {gameState.situation || incident.description}
            </p>
          </div>

          {/* Metrics */}
          {Object.keys(metrics).length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {Object.entries(metrics).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-dark-elevated border border-dark-border rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary">{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{key.replace(/_/g, ' ').toUpperCase()}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Choose Your Action:</h3>
            <div className="space-y-3">
              {availableActions.map((action: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => makeDecision(action.id || action.action)}
                  className="w-full text-left p-4 bg-dark-elevated border-2 border-dark-border rounded-xl hover:border-primary transition-all quiz-option"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center font-bold text-primary flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold mb-1">{action.action || action.title}</p>
                      {action.description && (
                        <p className="text-sm text-gray-400">{action.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Previous Decisions */}
          {decisions.length > 0 && (
            <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2 text-gray-400">Your Actions:</h4>
              <div className="space-y-1">
                {decisions.map((decision, idx) => (
                  <div key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="text-primary">→</span>
                    <span>{decision}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  // Briefing Screen
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-2xl">←</button>
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold">Incident Briefing</h1>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Title */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-3 py-1 rounded-lg border ${
              incident.difficulty === 'beginner' ? 'bg-success/10 text-success border-success/20' :
              incident.difficulty === 'intermediate' ? 'bg-warning/10 text-warning border-warning/20' :
              'bg-danger/10 text-danger border-danger/20'
            }`}>
              {incident.difficulty.toUpperCase()}
            </span>
            <span className="text-xs px-3 py-1 bg-dark-elevated rounded-lg border border-dark-border">
              {incident.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-4 leading-tight">{incident.title}</h1>
          <p className="text-gray-400 leading-relaxed">{incident.description}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Time Limit</p>
            <p className="text-2xl font-bold text-primary">{incident.time_limit_minutes} min</p>
          </div>
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Required</p>
            <p className="text-2xl font-bold text-secondary">Phase {incident.required_phase}+</p>
          </div>
        </div>

        {/* Learning Objectives */}
        {incident.learning_objectives && (
          <div className="mb-6 bg-primary/10 border-l-4 border-primary rounded-r-xl p-6">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>🎯</span>
              What You'll Learn
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {incident.learning_objectives}
            </p>
          </div>
        )}

        {/* Initial State */}
        {incident.initial_state && (
          <div className="mb-6 bg-dark-elevated border border-dark-border rounded-xl p-6">
            <h2 className="font-bold text-lg mb-3">Initial State</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {incident.initial_state.situation}
            </p>
            {incident.initial_state.metrics && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(incident.initial_state.metrics).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-dark-surface rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">{key.replace(/_/g, ' ')}</p>
                    <p className="font-bold">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Start Button */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={startSimulation}
            className="w-full bg-gradient-to-r from-danger to-orange-500 text-white font-bold py-4 rounded-xl btn-glow flex items-center justify-center gap-2"
          >
            <span>🚨</span>
            <span>Start Simulation</span>
          </button>
        </div>
      </div>
    </div>
  )
}
