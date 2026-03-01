import { mockIncidents } from '@/lib/mockData'
import { IncidentClient } from './incident-client'

export function generateStaticParams() {
  return mockIncidents.map((incident) => ({
    id: incident.id.toString(),
  }))
}

export default function IncidentPage({ params }: { params: { id: string } }) {
  return <IncidentClient id={params.id} />
}
