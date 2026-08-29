'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { identity, systemStats } from '@/lib/content'

const SceneCore = dynamic(() => import('@/components/three/SceneCore'), {
  ssr: false, loading: () => null,
})

export default function LayerCore() {
  const titleRef = useRef<HTMLDivElement>(null)
  const subRef   = useRef<HTMLDivElement>(null)
  const statRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ctx: ReturnType<typeof import('gsap').default.context> | null = null
    let cancelled = false

    async function init() {
      const { gsap } = await import('gsap')
      if (cancelled) return

      if (prefersReduced) {
        titleRef.current?.querySelectorAll('.title-char').forEach(el => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.filter = 'none' })
        if (subRef.current)  { subRef.current.style.opacity  = '1' }
        statRef.current?.querySelectorAll('.stat-item').forEach(el => { (el as HTMLElement).style.opacity = '1' })
        return
      }

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 3.6 })
        tl.fromTo(
          titleRef.current?.querySelectorAll('.title-char') ?? [],
          { opacity: 0, y: 24, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.035, ease: 'expo.out' }
        )
        .fromTo(subRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, '-=0.5'
        )
        .fromTo(
          statRef.current?.querySelectorAll('.stat-item') ?? [],
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, '-=0.4'
        )
      })
    }

    init()
    return () => { cancelled = true; ctx?.revert(); ctx = null }
  }, [])

  return (
    <section
      id="layer-core"
      className="relative flex flex-col overflow-hidden sys-grid"
      style={{ minHeight: '100dvh' }}
      aria-label="Layer 01: Core"
    >
      {/* Three.js scene */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <SceneCore />
      </div>

      {/* Radial vignette — darkens edges so text is readable */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 65% at 50% 50%, transparent 25%, rgba(2,2,4,0.75) 100%)' }}
        aria-hidden="true"
      />

      {/* Bottom gradient — smooth blend to next layer */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{ height: '220px', background: 'linear-gradient(to top, var(--void) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* ── Top status bar ── */}
      <div className="relative z-[3] flex items-center justify-between" style={{ padding: 'var(--sp-5) var(--container-px)' }}>
        <div className="flex items-center" style={{ gap: 'var(--sp-2)' }}>
          <span className="dot-pulse" aria-hidden="true" />
          <span className="t-system" style={{ color: 'var(--pulse)' }}>L01 / CORE</span>
          <span className="wire-v" style={{ height: '12px' }} aria-hidden="true" />
          <span className="t-system">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center" style={{ gap: 'var(--sp-2)' }}>
          <span className="t-system">bader.os v2.0.4</span>
          <span className="wire-v" style={{ height: '12px' }} aria-hidden="true" />
          <span className="t-system">{identity.location.toUpperCase()}</span>
        </div>
      </div>

      {/* ── Main content — pushed to bottom of viewport ── */}
      <div className="relative z-[3] flex-1 flex flex-col justify-end" style={{ padding: '0 var(--container-px) var(--sp-8) var(--container-px)' }}>

        {/* Display name */}
        <div ref={titleRef} style={{ marginBottom: 'var(--sp-5)' }}>
          {['BADER', 'BENNANI'].map((word, wi) => (
            <div key={wi} className="overflow-hidden">
              <h1 className="t-display flex flex-wrap" aria-label={wi === 0 ? 'BADER BENNANI' : undefined}>
                {word.split('').map((char, ci) => (
                  <span
                    key={ci}
                    className="title-char inline-block"
                    style={{ opacity: 0 }}
                    aria-hidden={wi > 0 ? 'true' : undefined}
                  >
                    {char}
                  </span>
                ))}
              </h1>
            </div>
          ))}
        </div>

        {/* Statement + role */}
        <div ref={subRef} style={{ opacity: 0, marginBottom: 'var(--sp-6)' }}>
          <p
            className="font-light leading-relaxed"
            style={{ maxWidth: '42rem', color: 'var(--text-1)', fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)' }}
          >
            Computer Engineering student building scalable full-stack applications.
            Focused on backend architecture, distributed systems, and secure software delivery.
          </p>
          <div className="flex items-center flex-wrap" style={{ gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>
            <span className="t-label" style={{ color: 'var(--pulse)' }}>COMPUTER ENGINEERING — EILCO</span>
            <span className="wire-v" style={{ height: '10px' }} aria-hidden="true" />
            <span className="t-label">{identity.availability.toUpperCase()}</span>
          </div>
        </div>

        {/* Stats + terminal */}
        <div
          className="grid"
          style={{ gridTemplateColumns: '1fr', gap: 'var(--sp-5)' }}
        >
          {/* Stats row */}
          <div ref={statRef} className="flex flex-wrap" style={{ gap: 'var(--sp-6)' }}>
            {systemStats.map((s) => (
              <div key={s.id} className="stat-item flex flex-col" style={{ gap: 'var(--sp-1)', opacity: 0 }}>
                <span
                  className="tabular-nums font-thin leading-none"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize:   'clamp(1.5rem, 3vw, 2rem)',
                    letterSpacing: '-0.04em',
                    color: 'var(--text-0)',
                  }}
                >
                  {s.value}
                </span>
                <span className="t-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Terminal — only on large screens, never overlaps stats */}
         
        </div>
      </div>
    </section>
  )
}
