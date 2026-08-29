'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { projectSystems } from '@/lib/content'

const CircuitTrace = dynamic(() => import('@/components/visualizations/ArchFlow'), { ssr: false })

export default function LayerSystems() {
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
      if (prefersReduced) { el.querySelectorAll<HTMLElement>('.sys-reveal').forEach(e => { e.style.opacity = '1' }); return }
      ctx = gsap.context(() => {
        gsap.fromTo(el.querySelectorAll('.sys-reveal'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 75%' } })
      }, el)
    }
    init()
    return () => { cancelled = true; ctx?.revert(); ctx = null }
  }, [])

  return (
    <section
      id="layer-systems"
      ref={sectionRef}
      className="os-section"
      aria-label="Layer 04: Systems"
    >
      <div className="absolute inset-0 sys-grid pointer-events-none" style={{ opacity: 0.15 }} aria-hidden="true" />

      <div className="os-container relative z-10">
        {/* Header */}
        <div className="sys-reveal layer-header">
          <span className="t-system" style={{ color: 'var(--pulse)' }}>L04 / SYSTEMS</span>
          <div className="wire-h" style={{ width: '48px' }} />
          <span className="t-system">{projectSystems.length} SYSTEMS DOCUMENTED</span>
        </div>

        <h2 className="sys-reveal t-heading layer-title">
          Systems, not<br />
          <span style={{ color: 'var(--text-2)' }}>thumbnails.</span>
        </h2>

        <p className="sys-reveal layer-desc">
          Each project is a horizontal architecture diagram — services arranged
          in semantic layers from client to infrastructure. Hover any service
          to highlight its data flows. Packets travel the paths continuously,
          showing how the system breathes at runtime.
        </p>

        {/* Arch Flow — horizontal left-to-right architecture with animated packets */}
        <div className="sys-reveal">
          <CircuitTrace />
        </div>
      </div>
    </section>
  )
}
