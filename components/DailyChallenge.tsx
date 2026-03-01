'use client'

import { useRouter } from 'next/navigation'
import { getDailyChallenge } from '@/lib/phases'

export default function DailyChallenge() {
  const router = useRouter()
  const challenge = getDailyChallenge()
  
  const difficultyColors = {
    easy: 'badge-difficulty-easy',
    medium: 'badge-difficulty-medium',
    hard: 'badge-difficulty-hard',
    expert: 'badge-difficulty-hard'
  }
  
  const difficultyEmoji = {
    easy: '💚',
    medium: '⚠️',
    hard: '🔥',
    expert: '💀'
  }
  
  return (
    <div className="daily-challenge">
      {/* Difficulty Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`badge ${difficultyColors[challenge.difficulty]}`}>
          {difficultyEmoji[challenge.difficulty]} {challenge.difficulty.toUpperCase()} DIFFICULTY
        </span>
        <span className="badge badge-progress">
          ⚡ +{challenge.xpReward} XP
        </span>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl font-bold mb-2">
        Today's Real-Time Challenge
      </h3>
      
      {/* Scenario Title */}
      <div className="scenario-title">
        💥 {challenge.title}
      </div>
      
      {/* Description */}
      <p className="scenario-desc">
        {challenge.description}
      </p>
      
      {/* Terminal Preview */}
      <div className="terminal mb-4">
        <div className="terminal-header">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="terminal-title ml-4">Live Attack Logs</span>
        </div>
        <div className="terminal-content">
          {challenge.logs.map((log, idx) => {
            const logType = log.includes('WARN') ? 'log-warn' 
              : log.includes('ERROR') ? 'log-error'
              : log.includes('INFO') ? 'log-info'
              : 'log-line'
            
            return (
              <div key={idx} className={`log-line ${logType}`}>
                {log}
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Action Button */}
      <button 
        className="btn-primary-large"
        onClick={() => router.push('/battle-room')}
      >
        ⚔️ Enter War Room & Mitigate
      </button>
      
      {/* Info */}
      <div className="mt-4 text-sm text-secondary text-center">
        Complete today's challenge to earn <span className="font-bold text-primary">{challenge.xpReward} XP</span> and improve your response time!
      </div>
    </div>
  )
}
