'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const links = [
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'capabilities' },
  { label: 'Journey', id: 'journey' },
]

export default function SiteHeader() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
    const observer = new IntersectionObserver(() => {
      const readingLine = window.innerHeight * 0.34
      const closest = sections
        .map(section => ({ id: section.id, distance: Math.abs(section.getBoundingClientRect().top - readingLine) }))
        .sort((a, b) => a.distance - b.distance)[0]
      if (closest) setActive(closest.id)
    }, { rootMargin: '-28% 0px -56% 0px', threshold: 0 })

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Bader Bennani, home">
        <span className="wordmark-mark" aria-hidden="true">b.</span>
        <span>Bader Bennani<small>Computer engineering</small></span>
      </a>
      <nav aria-label="Main navigation">
        {links.map(link => <a href={`#${link.id}`} key={link.id} aria-current={active === link.id ? 'location' : undefined}>{link.label}</a>)}
      </nav>
      <a className="header-cta" href="#contact" aria-current={active === 'contact' ? 'location' : undefined}>Let’s talk <ArrowUpRight aria-hidden="true" size={15} /></a>
    </header>
  )
}
