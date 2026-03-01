'use client'

import { useRouter } from 'next/navigation'
import { getUserProgress } from '@/lib/auth'
import { ALL_PHASES, type Phase } from '@/lib/phases'

interface PhaseCardProps {
  phase: Phase
  userProgress: any
  isUnlocked: boolean
}

export default function PhaseCard({ phase, userProgress, isUnlocked }: PhaseCardProps) {
  const router = useRouter()
  
  // Calculate progress for this phase
  const phaseStartLesson = phase.id * 10 + 1
  const phaseEndLesson = (phase.id + 1) * 10
  
  const completedLessons = userProgress?.completedLessons?.filter(
    (l: number) => l >= phaseStartLesson && l <= phaseEndLesson
  ).length || 0
  
  const completedQuizzes = userProgress?.completedQuizzes?.filter(
    (q: number) => q >= phaseStartLesson && q <= phaseEndLesson
  ).length || 0
  
  const progress = (completedLessons / phase.totalLessons) * 100
  
  const handleContinue = () => {
    if (!isUnlocked) return
    
    // Find next incomplete lesson
    const nextLesson = phaseStartLesson + completedLessons
    if (nextLesson <= phaseEndLesson) {
      router.push(`/lesson/${nextLesson}`)
    } else {
      router.push('/learn')
    }
  }
  
  const getProgressColor = () => {
    if (progress >= 80) return '#10b981' // green
    if (progress >= 50) return '#f97316' // orange
    return '#2563eb' // blue
  }
  
  return (
    <div 
      className={`phase-card ${!isUnlocked ? 'locked' : 'card-interactive'}`}
      onClick={isUnlocked ? handleContinue : undefined}
    >
      <div className="phase-header">
        <div className="phase-icon">
          {isUnlocked ? phase.icon : '🔒'}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold mb-1">
            Phase {phase.id}: {phase.name}
          </h4>
          <p className="text-sm text-secondary">
            {phase.shortDesc}
          </p>
        </div>
        <div className="phase-status">
          {Math.round(progress)}%
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="progress-bar mb-4">
        <div 
          className="progress-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${getProgressColor()}, ${getProgressColor()}dd)`
          }}
        />
      </div>
      
      {/* Stats */}
      <div className="phase-stats">
        <div>📚 {completedLessons}/{phase.totalLessons} Lessons</div>
        <div>✅ {completedQuizzes}/{phase.totalLessons} Quizzes</div>
        <div>⭐ {completedLessons * 100} XP</div>
      </div>
      
      {/* Action Button or Lock Info */}
      {isUnlocked ? (
        <button 
          className="btn btn-primary w-full mt-4"
          onClick={(e) => {
            e.stopPropagation()
            handleContinue()
          }}
        >
          {completedLessons === 0 ? 'Start Phase' : 'Continue Learning'} →
        </button>
      ) : (
        <div className="mt-4 p-3 bg-secondary rounded-lg text-center text-sm">
          <span className="font-semibold">🔓 Unlock Requirements:</span>
          <div className="mt-1 text-muted">
            Complete {phase.unlockRequirements.lessons} lessons · Earn {phase.unlockRequirements.xp} XP
          </div>
        </div>
      )}
      
      {/* Status Badge */}
      {isUnlocked && (
        <div className="mt-3">
          {completedLessons === phase.totalLessons ? (
            <span className="badge badge-success">✓ Completed</span>
          ) : completedLessons > 0 ? (
            <span className="badge badge-progress">In Progress</span>
          ) : (
            <span className="badge badge-progress">Ready to Start</span>
          )}
        </div>
      )}
    </div>
  )
}
