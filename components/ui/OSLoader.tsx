'use client'

import { useEffect, useRef, useState } from 'react'
import { easeOutExpo } from '@/lib/utils'

export default function OSLoader({ onComplete }: { onComplete: () => void }) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const countRef   = useRef<HTMLSpanElement>(null)
  const fillRef    = useRef<HTMLDivElement>(null)
  const rafRef     = useRef<number>(0)
  const exitTimer  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const wrap  = wrapRef.current
    const count = countRef.current
    const fill  = fillRef.current
    if (!wrap || !count || !fill) return

    const DURATION = 2600
    const start    = performance.now()

    const tick = (now: number) => {
      const t     = Math.min((now - start) / DURATION, 1)
      const eased = easeOutExpo(t)
      const pct   = Math.round(eased * 100)

      count.textContent = String(pct).padStart(2, '0')
      fill.style.width  = `${pct}%`

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      // Counter finished — trigger exit animation after short pause
      exitTimer.current = setTimeout(() => {
        // Inline clip-path animation — no GSAP dependency in cleanup path
        let exitStart: number | null = null
        const EXIT_DUR = 800

        const exitTick = (now: number) => {
          if (exitStart === null) exitStart = now
          const et = Math.min((now - exitStart) / EXIT_DUR, 1)
          // expo.inOut: fast middle, slow ends
          const eased = et < 0.5
            ? 4 * et * et * et
            : 1 - Math.pow(-2 * et + 2, 3) / 2
          wrap.style.clipPath = `inset(0 0 ${eased * 100}% 0)`

          if (et < 1) {
            rafRef.current = requestAnimationFrame(exitTick)
          } else {
            wrap.style.clipPath = 'inset(0 0 100% 0)'
            setVisible(false)
            onComplete()
          }
        }
        rafRef.current = requestAnimationFrame(exitTick)
      }, 280)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(exitTimer.current)
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      ref={wrapRef}
      className="loader-wrap sys-grid"
      style={{ clipPath: 'inset(0 0 0% 0)', zIndex: 99999 }}
      role="status"
      aria-label="System initialising"
    >
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center z-10" style={{ gap: '40px' }}>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <span className="dot-pulse" aria-hidden="true" />
          <span className="t-system" style={{ color: 'var(--pulse)' }}>bader.os</span>
          <span className="t-system" style={{ color: 'var(--text-3)' }}>v2.0.4</span>
        </div>

        <div className="flex items-end" style={{ gap: '8px' }}>
          <span
            ref={countRef}
            className="tabular-nums leading-none"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(6rem,16vw,13rem)', letterSpacing: '-0.04em', color: 'var(--text-0)' }}
          >
            00
          </span>
          <span
            className="font-medium"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3.5rem)', letterSpacing: '-0.02em', color: 'var(--text-2)', paddingBottom: '12px' }}
          >
            %
          </span>
        </div>

        <div className="relative overflow-hidden" style={{ width: '256px', height: '1px', background: 'rgba(255,255,255,0.06)' }}>
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0"
            style={{ background: 'linear-gradient(90deg, var(--pulse), var(--signal))', width: '0%', boxShadow: '0 0 8px rgba(99,179,237,0.6)' }}
          />
        </div>

        <div className="flex flex-col items-center" style={{ gap: '6px' }}>
          <span className="t-system" style={{ color: 'var(--text-3)' }}>initialising system layers…</span>
          <span className="t-system" style={{ color: 'var(--text-3)' }}>Bader Bennani · Full-Stack Engineering Student</span>
        </div>
      </div>
    </div>
  )
}
