'use client'

import { useEffect, useRef } from 'react'
import { intelligenceMetrics } from '@/lib/content'
import { useInView } from '@/hooks/useInView'
import { easeOutExpo } from '@/lib/utils'

const PRINCIPLES = [
  { title: 'Legibility over cleverness',  body: 'Code that explains itself. Systems a new engineer can understand in an afternoon.' },
  { title: 'Design for change',           body: 'Every architecture decision should hold under 2 years of product iteration.' },
  { title: 'Fail visibly',                body: 'Silent failures are the most dangerous. Log everything. Understand fail modes before production.' },
  { title: 'Boundaries create freedom',   body: 'Clear service contracts let teams move independently without coordination overhead.' },
  { title: 'Performance is a feature',    body: 'Slow software is broken software. Consider access patterns before writing the first query.' },
  { title: 'Security by default',         body: 'JWT, RBAC, and input validation from the first endpoint — not as an afterthought.' },
]

function MetricCard({ metric }: { metric: (typeof intelligenceMetrics)[0] }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4, once: true })
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!inView || !numRef.current) return
    const el   = numRef.current
    const start = performance.now()
    const dur   = 1400

    const tick = (now: number) => {
      const t     = Math.min((now - start) / dur, 1)
      const eased = easeOutExpo(t)
      const val   = Math.round(eased * metric.value)
      el.textContent = val + metric.suffix
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, metric.value, metric.suffix])

  return (
    <div
      ref={ref}
      className="glass rounded-sm flex flex-col"
      style={{ padding: 'var(--sp-4)', gap: 'var(--sp-1)' }}
    >
      {/* Large number */}
      <span
        ref={numRef}
        className="tabular-nums font-thin leading-none"
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      'clamp(2rem, 4vw, 2.75rem)',
          letterSpacing: '-0.04em',
          color:         'var(--pulse)',
        }}
      >
        0{metric.suffix}
      </span>

      {/* Label */}
      <span className="t-label" style={{ color: 'var(--text-1)' }}>
        {metric.label}
      </span>

      {/* Detail */}
      <span className="t-system" style={{ color: 'var(--text-3)', marginTop: '4px' }}>
        {metric.detail}
      </span>
    </div>
  )
}

export default function LayerIntelligence() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ctx: ReturnType<typeof import('gsap').default.context> | null = null
    let cancelled = false
    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const el = sectionRef.current
      if (!el || cancelled) return
      if (prefersReduced) { el.querySelectorAll<HTMLElement>('.int-reveal').forEach(e => { e.style.opacity = '1' }); return }
      ctx = gsap.context(() => {
        gsap.fromTo(el.querySelectorAll('.int-reveal'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 78%' } })
      }, el)
    }
    init()
    return () => { cancelled = true; ctx?.revert(); ctx = null }
  }, [])

  return (
    <section
      id="layer-intelligence"
      ref={sectionRef}
      className="os-section"
      aria-label="Layer 06: Intelligence"
    >
      <div
        className="absolute pointer-events-none"
        style={{ bottom: 0, right: '25%', width: '400px', height: '300px',
          background: 'radial-gradient(circle, rgba(99,179,237,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      <div className="os-container relative z-10">
        {/* Header */}
        <div className="int-reveal layer-header">
          <span className="t-system" style={{ color: 'var(--pulse)' }}>L06 / INTELLIGENCE</span>
          <div className="wire-h" style={{ width: '48px' }} />
          <span className="t-system">BY THE NUMBERS</span>
        </div>

        <h2 className="int-reveal t-heading layer-title">
          Engineering<br />
          <span style={{ color: 'var(--text-2)' }}>in numbers.</span>
        </h2>

        <p className="int-reveal layer-desc">
          Real metrics computed from actual projects, internships, and technologies.
          Nothing fabricated.
        </p>

        {/* Metric cards — animated counters */}
        <div
          className="int-reveal grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
            gap: 'var(--sp-3)',
          }}
        >
          {intelligenceMetrics.map(m => (
            <MetricCard key={m.id} metric={m} />
          ))}
        </div>

        {/* Engineering principles */}
        <div
          className="int-reveal"
          style={{ marginTop: 'var(--sp-9)', paddingTop: 'var(--sp-6)', borderTop: '1px solid var(--wire)' }}
        >
          <div className="t-label" style={{ marginBottom: 'var(--sp-5)' }}>Engineering principles</div>

          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 'var(--sp-3)' }}
          >
            {PRINCIPLES.map(p => (
              <article
                key={p.title}
                className="glass rounded-sm"
                style={{ padding: 'var(--sp-4)', transition: 'border-color 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--wire-bright)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--wire)' }}
                data-hover="true"
              >
                <h3
                  className="font-medium"
                  style={{ fontSize: 'var(--text-sm)', color: 'var(--text-1)', letterSpacing: '-0.01em', lineHeight: 1.4, marginBottom: 'var(--sp-1)' }}
                >
                  {p.title}
                </h3>
                <p className="font-light" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
