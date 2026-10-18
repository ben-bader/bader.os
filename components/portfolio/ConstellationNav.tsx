'use client'

import { portfolioSections, useActiveSection } from './useActiveSection'

const starPoints: Record<(typeof portfolioSections)[number]['id'], { x: number; y: number }> = {
  home: { x: 68, y: 14 },
  work: { x: 121, y: 43 },
  about: { x: 61, y: 57 },
  capabilities: { x: 22, y: 96 },
  journey: { x: 87, y: 103 },
  contact: { x: 126, y: 137 },
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
    <nav className="fixed right-page-gutter top-[calc(78px+10px)] z-navigation w-[148px] text-center max-mobile:right-[max(12px,env(safe-area-inset-right))] max-mobile:top-[calc(68px+8px)]" aria-label="Portfolio sections">
      <div className="relative h-40 w-[148px]">
        <svg className="constellation-lines pointer-events-none absolute inset-0 size-full overflow-visible" viewBox="0 0 148 160" aria-hidden="true">
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
              className="group constellation-star absolute z-content grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[#89968a] no-underline [touch-action:manipulation] transition-[color,filter] duration-[180ms] hover:text-[#e4f1d1] hover:[filter:drop-shadow(0_0_5px_rgba(198,243,107,.4))] focus-visible:text-[#e4f1d1] focus-visible:[filter:drop-shadow(0_0_5px_rgba(198,243,107,.4))] aria-[current=location]:text-accent aria-[current=location]:[filter:drop-shadow(0_0_7px_rgba(198,243,107,.58))]"
              key={section.id}
              href={`#${section.id}`}
              aria-label={`${section.label} section`}
              aria-current={active ? 'location' : undefined}
              data-label={section.label}
              style={{ left: point.x, top: point.y }}
              onClick={() => selectSection(section.id)}
            >
              <svg className="size-[11px] overflow-visible fill-current transition-transform duration-[180ms] group-hover:scale-[1.2] group-focus-visible:scale-[1.2]" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0.8 9.75 6.25 15.2 8l-5.45 1.75L8 15.2l-1.75-5.45L.8 8l5.45-1.75L8 .8Z" />
              </svg>
            </a>
          )
        })}
      </div>
      <span className="mt-1 block min-h-6 font-portfolio-body text-copy-secondary text-[.68rem] font-medium tracking-[.14em] leading-6 uppercase">
        <span className="inline-block animate-[constellation-label-in_180ms_ease_both]" key={activeSection.id}>{activeSection.label}</span>
      </span>
    </nav>
  )
}
