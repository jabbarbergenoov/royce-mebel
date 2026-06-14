import Products from '#/Pages/ProductsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Products/>
}
