import { Outlet, createRootRoute } from '@tanstack/react-router'

import '../styles.css'
import { Header } from '#/components/Header'
import { Footer } from '#/components/Footer'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Header />
      <main className=''>
        <Outlet />

      </main>
      <Footer />
    </>
  )
}
