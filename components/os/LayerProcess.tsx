'use client'

import { useEffect, useRef, useState } from 'react'
import { processSteps } from '@/lib/content'

export default function LayerProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState<string | null>(null)

  // GSAP context ref — cleaned up synchronously on unmount
  const gsapCtx = useRef<ReturnType<typeof import('gsap').default.context> | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false

    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const el = sectionRef.current
      if (!el || cancelled) return

      if (prefersReduced) {
        el.querySelectorAll<HTMLElement>('.proc-reveal').forEach(e => { e.style.opacity = '1' })
        return
      }

      gsapCtx.current = gsap.context(() => {
        gsap.fromTo(el.querySelectorAll('.proc-reveal'),
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 78%' },
          }
        )
        gsap.fromTo(el.querySelectorAll('.connector-line'),
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1, duration: 1.4, ease: 'expo.out', stagger: 0.08,
            scrollTrigger: { trigger: el.querySelector('.pipeline-row'), start: 'top 80%' },
          }
        )
      }, el)
    }

    init()

    return () => {
      cancelled = true
      gsapCtx.current?.revert()
      gsapCtx.current = null
    }
  }, [])

  // User manually selects a phase — toggle on/off
  const handlePhaseClick = (id: string) => {
    setActive(prev => prev === id ? null : id)
  }

  return (
    <section
      id="layer-process"
      ref={sectionRef}
      className="os-section"
      aria-label="Layer 05: Process"
    >
      <div
        className="absolute pointer-events-none"
        style={{ left: 0, top: '40%', width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(159,122,234,0.07) 0%, transparent 70%)',
          filter: 'blur(70px)' }}
        aria-hidden="true"
      />

      <div className="os-container relative z-10">
        <div className="proc-reveal layer-header">
          <span className="t-system" style={{ color: 'var(--pulse)' }}>L05 / PROCESS</span>
          <div className="wire-h" style={{ width: '48px' }} />
          <span className="t-system">{processSteps.length} PHASES</span>
        </div>

        <h2 className="proc-reveal t-heading layer-title">
          Not a workflow.<br />
          <span style={{ color: 'var(--text-2)' }}>An engineering method.</span>
        </h2>

        <p className="proc-reveal layer-desc">
          Every system I build follows a disciplined process — not because process is
          bureaucracy, but because good systems demand deliberate decisions at every layer.
        </p>

        {/* Pipeline — desktop */}
        <div className="proc-reveal pipeline-row hidden md:block" style={{ marginBottom: 'var(--sp-5)' }}>
          <div className="flex items-start">
            {processSteps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0 ">
                <button
                  onClick={() => handlePhaseClick(step.id)}
                  className="flex flex-col items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--pulse)]"
                  style={{ gap: 'var(--sp-1)' }}
                  data-hover="true"
                  aria-expanded={active === step.id}
                  aria-controls={`phase-detail-${step.id}`}
                  aria-label={`Phase ${step.phase}: ${step.title}`}
                >
                  <div
                    className="flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      width: '40px', height: '40px',
                      background: active === step.id ? `${step.color}22` : 'var(--surface-2)',
                      border:     `1.5px solid ${active === step.id ? step.color : 'var(--wire)'}`,
                      boxShadow:  active === step.id ? `0 0 14px ${step.color}44` : 'none',
                    }}
                  >
                    <span className="t-system" style={{ color: active === step.id ? step.color : 'var(--text-2)', fontWeight: 700 }}>
                      {step.phase}
                    </span>
                  </div>
                  <span className="t-label text-center whitespace-nowrap transition-colors duration-300"
                    style={{ color: active === step.id ? step.color : 'var(--text-2)' }}>
                    {step.title}
                  </span>
                </button>

                {i < processSteps.length - 1 && (
                  <div className="connector-line flex-1"
                    style={{ height: '1px', background: 'var(--wire)', transform: 'scaleX(0) '}}
                    aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="proc-reveal glass rounded-sm overflow-hidden">
          {processSteps.map(step => (
            <div
              key={step.id}
              id={`phase-detail-${step.id}`}
              style={{
                maxHeight:  active === step.id ? '280px' : '0px',
                opacity:    active === step.id ? 1 : 0,
                overflow:   'hidden',
                transition: 'max-height 0.5s var(--ease-sys), opacity 0.35s ease',
              }}
              aria-hidden={active !== step.id}
            >
              <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', gap: 'var(--sp-5)', padding: 'var(--sp-5)' }}>
                <div>
                  <div className="flex items-center" style={{ gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
                    <span className="t-system" style={{ color: step.color, fontWeight: 700 }}>PHASE {step.phase}</span>
                    <div className="wire-h" style={{ width: '28px', background: step.color, opacity: 0.3 }} aria-hidden="true" />
                    <span className="font-light" style={{ fontSize: 'var(--text-md)', color: 'var(--text-0)', letterSpacing: '-0.01em' }}>
                      {step.title}
                    </span>
                  </div>
                  <p className="font-light" style={{ fontSize: 'var(--text-base)', color: 'var(--text-1)', lineHeight: 1.7 }}>
                    {step.description}
                  </p>
                </div>
                <div className="flex flex-col" style={{ gap: 'var(--sp-1)', minWidth: '172px' }}>
                  <span className="t-label" style={{ marginBottom: '4px' }}>Artifacts</span>
                  {step.artifacts.map(a => (
                    <div key={a} className="flex items-center" style={{ gap: '8px' }}>
                      <span className="rounded-full flex-shrink-0"
                        style={{ width: 5, height: 5, background: step.color, opacity: 0.7 }}
                        aria-hidden="true" />
                      <span className="t-mono">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {!active && (
            <div className="flex items-center" style={{ gap: 'var(--sp-2)', padding: 'var(--sp-4)' }}>
              <span className="dot-pulse" aria-hidden="true" />
              <span className="t-system">Select a phase to explore</span>
            </div>
          )}
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden flex flex-col" style={{ gap: 'var(--sp-2)', marginTop: 'var(--sp-4)' }}>
          {processSteps.map(step => (
            <button
              key={step.id}
              onClick={() => handlePhaseClick(step.id)}
              className="proc-reveal glass rounded-sm text-left transition-all duration-300"
              style={{ padding: 'var(--sp-3)', borderLeft: `2px solid ${step.color}${active === step.id ? 'cc' : '28'}` }}
              data-hover="true"
              aria-expanded={active === step.id}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: 'var(--sp-2)' }}>
                  <span className="t-system" style={{ color: step.color, fontWeight: 700 }}>{step.phase}</span>
                  <span className="font-light" style={{ fontSize: 'var(--text-base)', color: 'var(--text-0)' }}>{step.title}</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                  style={{ color: 'var(--text-3)', transform: active === step.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              {active === step.id && (
                <p className="font-light" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', lineHeight: 1.65, marginTop: 'var(--sp-2)' }}>
                  {step.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
