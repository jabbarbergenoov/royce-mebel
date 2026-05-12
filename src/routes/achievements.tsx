import { Achievements } from '#/components/AchievementsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/achievements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Achievements/>
}
