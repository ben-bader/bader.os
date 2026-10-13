'use client'

import { portfolioSections, useActiveSection } from './useActiveSection'

const starPoints: Record<(typeof portfolioSections)[number]['id'], { x: number; y: number }> = {
  home: { x: 68, y: 14 },
  work: { x: 121, y: 43 },
  about: { x: 61, y: 57 },
  capabilities: { x: 22, y: 96 },
  journey: { x: 87, y: 103 },
  contact: { x: 126, y: 143 },
}

const connections = [
  ['home', 'work'],
  ['home', 'about'],
  ['about', 'capabilities'],
  ['capabilities', 'journey'],
  ['journey', 'contact'],
] as const

export default function ConstellationNav() {
  const { activeId, selectSection } = useActiveSection()
  const activeSection = portfolioSections.find(section => section.id === activeId) ?? portfolioSections[0]

  return (
    <nav className="constellation-nav" aria-label="Portfolio sections">
      <div className="constellation-map">
        <svg className="constellation-lines" viewBox="0 0 148 160" aria-hidden="true">
          {connections.map(([from, to]) => (
            <line
              key={`${from}-${to}`}
              x1={starPoints[from].x}
              y1={starPoints[from].y}
              x2={starPoints[to].x}
              y2={starPoints[to].y}
            />
          ))}
        </svg>
        {portfolioSections.map(section => {
          const point = starPoints[section.id]
          const active = section.id === activeId
          return (
            <a
              className={`constellation-star constellation-star-${section.id}`}
              key={section.id}
              href={`#${section.id}`}
              aria-label={`${section.label} section`}
              aria-current={active ? 'location' : undefined}
              data-label={section.label}
              style={{ left: point.x, top: point.y }}
              onClick={() => selectSection(section.id)}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0.8 9.75 6.25 15.2 8l-5.45 1.75L8 15.2l-1.75-5.45L.8 8l5.45-1.75L8 .8Z" />
              </svg>
            </a>
          )
        })}
      </div>
      <span className="constellation-current">
        <span key={activeSection.id}>{activeSection.label}</span>
      </span>
    </nav>
  )
}
