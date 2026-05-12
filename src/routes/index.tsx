import { About } from '#/components/About'
import { Catalog } from '#/components/Catalog'
import { Contact } from '#/components/Contact'
import { Hero } from '#/components/Hero'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="">
        <Hero />
      <Catalog />
      <About />
      <Contact />
    </div>
  )
}
