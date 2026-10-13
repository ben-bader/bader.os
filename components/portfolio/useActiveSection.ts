'use client'

import { useCallback, useEffect, useState } from 'react'

export const portfolioSections = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
] as const

export type PortfolioSectionId = (typeof portfolioSections)[number]['id']

export function useActiveSection() {
  const [activeId, setActiveId] = useState<PortfolioSectionId>('home')

  const selectSection = useCallback((id: PortfolioSectionId) => {
    setActiveId(id)
  }, [])

  useEffect(() => {
    const sections = portfolioSections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement)
    if (!sections.length) return

    let frame = 0
    const updateActive = () => {
      frame = 0
      const scrollTop = window.scrollY
      const atBottom = window.innerHeight + scrollTop >= document.documentElement.scrollHeight - 2
      let nextId: string

      if (scrollTop <= 2) nextId = sections[0].id
      else if (atBottom) nextId = sections[sections.length - 1].id
      else {
        const activationLine = window.innerHeight * 0.36
        let nearestId = sections[0].id
        let nearestDistance = Number.POSITIVE_INFINITY

        for (const section of sections) {
          const bounds = section.getBoundingClientRect()
          const distance = activationLine < bounds.top
            ? bounds.top - activationLine
            : activationLine > bounds.bottom
              ? activationLine - bounds.bottom
              : 0
          if (distance < nearestDistance) {
            nearestId = section.id
            nearestDistance = distance
          }
        }
        nextId = nearestId
      }

      setActiveId(current => current === nextId ? current : nextId as PortfolioSectionId)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateActive)
    }
    const observer = new IntersectionObserver(scheduleUpdate, { threshold: [0, 0.1, 0.5, 1] })
    const resizeObserver = new ResizeObserver(scheduleUpdate)

    sections.forEach(section => {
      observer.observe(section)
      resizeObserver.observe(section)
    })
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    scheduleUpdate()

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return { activeId, selectSection }
}
