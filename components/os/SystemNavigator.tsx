'use client'

import { useEffect, useState } from 'react'
import { LAYERS } from '@/system/layers'
import { scrollToId } from '@/lib/lenis'

export default function SystemNavigator() {
  const [active,  setActive]  = useState(0)
  const [visible, setVisible] = useState(false)
  const [time,    setTime]    = useState('')

  // --- Section detection -----------------------------------------------
  // ONE IntersectionObserver watching all 7 layer elements.
  // Fires only when a section crosses the 50% threshold — never on every
  // scroll pixel, never races with Lenis, needs no programmatic guard.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is intersecting with the highest ratio.
        // On load or slow scroll multiple entries can fire simultaneously.
        let best: IntersectionObserverEntry | null = null
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry
            }
          }
        })
        if (!best) return
        const idx = LAYERS.findIndex(l => l.anchor === (best as IntersectionObserverEntry).target.id)
        if (idx !== -1) setActive(idx)
      },
      {
        // Trigger when a section covers ≥50% of the viewport
        threshold: 0.5,
        // Shrink the root margin so the midpoint of the viewport is the
        // detection zone — this keeps the readout accurate at all sizes
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    LAYERS.forEach(layer => {
      const el = document.getElementById(layer.anchor)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // --- Navigator visibility + clock ------------------------------------
  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 1400)

    const pad  = (n: number) => String(n).padStart(2, '0')
    const tick = () => {
      const d = new Date()
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`)
    }
    tick()
    const clock = setInterval(tick, 1000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(clock)
    }
  }, [])

  // --- Navigate --------------------------------------------------------
  // Pure function: find target → scroll once → stop.
  // No state mutation, no guard timers, no recursive events.
  const navigateTo = (anchor: string, index: number) => {
    setActive(index)
    scrollToId(anchor, 0)
  }

  // --- Render ----------------------------------------------------------
  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col items-end"
      style={{
        gap:           0,
        opacity:       visible ? 1 : 0,
        transform:     visible ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(10px)',
        transition:    'opacity 0.8s ease, transform 0.8s var(--ease-sys)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-label="System navigator"
    >
      {/* Clock */}
      <div
        className="tabular-nums mb-6"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'var(--text-3)' }}
        aria-label="Current time"
      >
        {time}
      </div>

      {/* Dots */}
      <div className="flex flex-col" style={{ gap: '14px' }}>
        {LAYERS.map((layer, i) => (
          <button
            key={layer.id}
            onClick={() => navigateTo(layer.anchor, i)}
            className="flex items-center group focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--pulse)]"
            style={{ gap: '10px' }}
            aria-label={`Go to ${layer.codename}`}
            aria-current={i === active ? 'location' : undefined}
            data-hover="true"
          >
            {/* Label — revealed on hover via CSS */}
            <span
              className="t-system transition-all duration-200 opacity-0 group-hover:opacity-100"
              style={{
                color:     i === active ? 'var(--pulse)' : 'var(--text-3)',
                transform: 'translateX(4px)',
              }}
              aria-hidden="true"
            >
              {String(layer.index).padStart(2,'0')} {layer.codename}
            </span>

            {/* Dot */}
            <span
              className={`nav-dot${i === active ? ' active' : ''}`}
              style={{ flexShrink: 0, display: 'inline-block' }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {/* Active layer readout */}
      <div className="mt-5 flex flex-col items-end" style={{ gap: '4px' }}>
        <div className="wire-h" style={{ width: '24px' }} aria-hidden="true" />
        <span className="t-system" style={{ color: 'var(--pulse)' }} aria-live="polite">
          L{String(active + 1).padStart(2,'0')}
        </span>
        <span className="t-system" style={{ color: 'var(--text-3)' }}>
          {LAYERS[active]?.codename}
        </span>
      </div>
    </nav>
  )
}
