import { comprehensiveLessons } from '@/lib/comprehensiveLessons'
import { LessonClient } from './lesson-client'

export function generateStaticParams() {
  return comprehensiveLessons.map((lesson) => ({
    id: lesson.id.toString(),
  }))
}

export default function LessonPage({ params }: { params: { id: string } }) {
  return <LessonClient id={params.id} />
}
