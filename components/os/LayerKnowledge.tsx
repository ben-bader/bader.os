'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { knowledgeNodes } from '@/lib/content'

const SignalField = dynamic(
  () => import('@/components/visualizations/TechMap'),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full glass rounded-sm flex items-center justify-center"
        style={{ height: '480px' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--sp-2)' }}>
          <span className="dot-pulse" aria-hidden="true" />
          <span className="t-system">calibrating signal field…</span>
        </div>
      </div>
    ),
  }
)

const CATEGORY_COLORS: Record<string, string> = {
  language:  '#f6ad55',
  framework: '#63b3ed',
  database:  '#9f7aea',
  devops:    '#68d391',
  concept:   '#fc8181',
  tool:      '#76e4f7',
}

export default function LayerKnowledge() {
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
      if (prefersReduced) { el.querySelectorAll<HTMLElement>('.kn-reveal').forEach(e => { e.style.opacity = '1' }); return }
      ctx = gsap.context(() => {
        gsap.fromTo(el.querySelectorAll('.kn-reveal'), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 78%' } })
      }, el)
    }
    init()
    return () => { cancelled = true; ctx?.revert(); ctx = null }
  }, [])

  const total = knowledgeNodes.length
  const cats  = Array.from(new Set(knowledgeNodes.map(n => n.category)))

  return (
    <section
      id="layer-knowledge"
      ref={sectionRef}
      className="os-section"
      aria-label="Layer 03: Technology Stack"
    >
      {/* Grid bg */}
      <div className="absolute inset-0 sys-grid pointer-events-none" style={{ opacity: 0.25 }} aria-hidden="true" />

      {/* Right glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: 0, top: '30%',
          width: '360px', height: '360px',
          background: 'radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="os-container relative z-10">
        {/* Header */}
        <div className="kn-reveal layer-header">
          <span className="t-system" style={{ color: 'var(--pulse)' }}>L03 / STACK</span>
          <div className="wire-h" style={{ width: '48px' }} />
          <span className="t-system">{total} TECHNOLOGIES · {cats.length} CATEGORIES</span>
        </div>

        <h2 className="kn-reveal t-heading layer-title">
          Technology<br />
          <span style={{ color: 'var(--text-2)' }}>stack.</span>
        </h2>

        <p className="kn-reveal layer-desc">
          Every technology placed by real usage. Hover any node to illuminate
          its connections — edges draw from co-usage in actual projects,
          unrelated technologies fade. Click a node to see which projects used it.
        </p>

        {/* Tech Map — stable positions, hover-activated connections */}
        <div className="kn-reveal">
          <SignalField />
        </div>

        {/* Category summary */}
        <div
          className="kn-reveal grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 'var(--sp-5)',
            marginTop: 'var(--sp-7)',
            paddingTop: 'var(--sp-5)',
            borderTop: '1px solid var(--wire)',
          }}
        >
          {cats.map(cat => {
            const count = knowledgeNodes.filter(n => n.category === cat).length
            const color = CATEGORY_COLORS[cat] ?? 'var(--text-2)'
            return (
              <div key={cat} className="flex flex-col" style={{ gap: 'var(--sp-1)' }}>
                <div className="flex items-center" style={{ gap: '6px', marginBottom: '4px' }}>
                  <span className="rounded-full" style={{ width: 6, height: 6, background: color, flexShrink: 0 }} aria-hidden="true" />
                  <span className="t-label" style={{ color }}>{cat}</span>
                </div>
                <span
                  className="tabular-nums font-thin"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', letterSpacing: '-0.04em', color: 'var(--text-0)' }}
                >
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
