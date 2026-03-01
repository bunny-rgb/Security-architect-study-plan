import { comprehensiveLessons } from '@/lib/comprehensiveLessons'
import { QuizClient } from './quiz-client'

export function generateStaticParams() {
  return comprehensiveLessons.map((lesson) => ({
    id: lesson.id.toString(),
  }))
}

export default function QuizPage({ params }: { params: { id: string } }) {
  return <QuizClient id={params.id} />
}
