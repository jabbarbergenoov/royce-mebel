import CatalogPage from '#/Pages/CatalogPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/catalog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CatalogPage/>
}
