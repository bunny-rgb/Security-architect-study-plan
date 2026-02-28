'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Incident {
  id: number
  title: string
  slug: string
  category: string
  difficulty: string
  description: string
  time_limit_minutes: number
  required_phase: number
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchIncidents = async () => {
      const res = await fetch('/api/incidents')
      const data = await res.json()
      setIncidents(data.incidents)
      setLoading(false)
    }
    fetchIncidents()
  }, [])

  const getCategoryIcon = (category: string) => {
    const categoryMap: Record<string, { icon: string; color: string }> = {
      'DDoS': { icon: '⚡', color: 'from-red-500 to-orange-500' },
      'Bot Attack': { icon: '🤖', color: 'from-purple-500 to-pink-500' },
      'WAF': { icon: '🛡️', color: 'from-blue-500 to-cyan-500' },
      'API Security': { icon: '🔌', color: 'from-green-500 to-emerald-500' },
    }
    return categoryMap[category] || { icon: '🚨', color: 'from-gray-500 to-gray-600' }
  }

  const categories = [
    { name: 'DDoS', icon: '⚡', color: 'from-red-500 to-orange-500' },
    { name: 'Bot Attack', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    { name: 'WAF', icon: '🛡️', color: 'from-blue-500 to-cyan-500' },
    { name: 'API Security', icon: '🔌', color: 'from-green-500 to-emerald-500' },
  ]

  const filteredIncidents = selectedCategory
    ? incidents.filter(i => i.category === selectedCategory)
    : incidents

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
              <h1 className="text-lg font-bold">Incident Response</h1>
              <p className="text-xs text-gray-400">Real-world security scenarios</p>
            </div>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-6 bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/30 rounded-2xl p-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🚨</div>
            <div>
              <h2 className="text-xl font-bold mb-2">Practice Makes Perfect</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Test your skills with real-world security incidents. Make decisions under pressure and learn from every scenario.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">Filter by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'bg-dark-elevated border border-dark-border text-gray-400'
              }`}
            >
              All Types
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === cat.name
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-dark-elevated border border-dark-border text-gray-400'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-4 animate-slide-up">
          {filteredIncidents.map((incident, index) => {
            const categoryData = getCategoryIcon(incident.category)
            
            return (
              <Link key={incident.id} href={`/incidents/${incident.id}`}>
                <div className="bg-dark-elevated border border-dark-border rounded-2xl p-5 card-hover">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${categoryData.color} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
                      {categoryData.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-md border ${
                          incident.difficulty === 'beginner' ? 'bg-success/10 text-success border-success/20' :
                          incident.difficulty === 'intermediate' ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-danger/10 text-danger border-danger/20'
                        }`}>
                          {incident.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 bg-dark-surface rounded-md text-gray-400">
                          {incident.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          ⏱️ {incident.time_limit_minutes} min
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 leading-tight">{incident.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mb-3">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                          Requires Phase {incident.required_phase}+
                        </span>
                      </div>
                    </div>
                    <div className="text-primary text-2xl flex-shrink-0">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filteredIncidents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400">No incidents found in this category</p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span>💡</span>
            Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Read the scenario carefully before making decisions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Consider both immediate impact and long-term consequences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Balance security with user experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Time pressure is part of the challenge - practice makes perfect!</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">🏠</span>
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/learn" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <span className="text-2xl">📚</span>
              <span className="text-xs">Learn</span>
            </Link>
            <Link href="/incidents" className="flex flex-col items-center gap-1 text-primary">
              <span className="text-2xl">🚨</span>
              <span className="text-xs font-medium">Incidents</span>
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
