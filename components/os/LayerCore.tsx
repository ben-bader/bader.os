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
  const ctaRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ctx: ReturnType<typeof import('gsap').default.context> | null = null
    let cancelled = false

    async function init() {
      const { gsap } = await import('gsap')
      if (cancelled) return

      if (prefersReduced) {
        titleRef.current?.querySelectorAll('.title-char').forEach(el => {
          ;(el as HTMLElement).style.opacity = '1'
          ;(el as HTMLElement).style.filter  = 'none'
        })
        if (subRef.current)  subRef.current.style.opacity  = '1'
        if (ctaRef.current)  ctaRef.current.style.opacity  = '1'
        statRef.current?.querySelectorAll('.stat-item').forEach(el => {
          ;(el as HTMLElement).style.opacity = '1'
        })
        return
      }

      ctx = gsap.context(() => {
        // Delay cut from 3.6 → 0.6 — content must appear quickly
        const tl = gsap.timeline({ delay: 0.6 })

        tl.fromTo(
          titleRef.current?.querySelectorAll('.title-char') ?? [],
          { opacity: 0, y: 20, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.025, ease: 'expo.out' }
        )
        .fromTo(subRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' },
          '-=0.4'
        )
        .fromTo(ctaRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
          '-=0.3'
        )
        .fromTo(
          statRef.current?.querySelectorAll('.stat-item') ?? [],
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'expo.out' },
          '-=0.3'
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
      aria-label="Layer 01: Core — Hero"
    >
      {/* Three.js atmosphere */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <SceneCore />
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 65% at 50% 50%, transparent 25%, rgba(2,2,4,0.78) 100%)' }}
        aria-hidden="true"
      />

      {/* Bottom blend */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{ height: '220px', background: 'linear-gradient(to top, var(--void) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* ── Top status bar ── */}
      <div
        className="relative z-[3] flex items-center justify-between flex-wrap"
        style={{ padding: 'var(--sp-5) var(--container-px)', gap: 'var(--sp-2)' }}
      >
        <div className="flex items-center" style={{ gap: 'var(--sp-2)' }}>
          <span className="dot-pulse" aria-hidden="true" />
          <span className="t-system" style={{ color: 'var(--pulse)' }}>L01 / CORE</span>
          <span className="wire-v" style={{ height: '12px' }} aria-hidden="true" />
          <span className="t-system">SYSTEM ONLINE</span>
        </div>
        <div className="flex items-center flex-wrap" style={{ gap: 'var(--sp-2)' }}>
          <span className="t-system">bader.os v2.0.4</span>
          <span className="wire-v" style={{ height: '12px' }} aria-hidden="true" />
          <span className="t-system">{identity.location.toUpperCase()}</span>
        </div>
      </div>

      {/* ── Main hero content ── */}
      <div
        className="relative z-[3] flex-1 flex flex-col justify-end"
        style={{ padding: '0 var(--container-px) var(--sp-7) var(--container-px)' }}
      >
        {/* Name */}
        <div ref={titleRef} style={{ marginBottom: 'var(--sp-4)' }}>
          {['BADER', 'BENNANI'].map((word, wi) => (
            <div key={wi} className="overflow-hidden">
              <h1
                className="t-display flex flex-wrap"
                aria-label={wi === 0 ? 'BADER BENNANI' : undefined}
              >
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

        {/* Positioning statement */}
        <div ref={subRef} style={{ opacity: 0, marginBottom: 'var(--sp-4)' }}>
          <p
            className="font-light"
            style={{
              maxWidth: '48rem',
              color: 'var(--text-1)',
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)',
              lineHeight: 1.65,
              marginBottom: 'var(--sp-3)',
            }}
          >
            Computer Engineering student at EILCO · Calais, France.
            I build production-oriented web systems — from secure REST APIs and
            Spring Boot microservices to full-stack Next.js applications and
            containerised deployments.
          </p>

          {/* Status badges */}
          <div className="flex items-center flex-wrap" style={{ gap: 'var(--sp-2)' }}>
            <div
              className="flex items-center"
              style={{
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(99,179,237,0.08)',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'rgba(99,179,237,0.2)',
                borderRightWidth: '1px',
                borderRightStyle: 'solid',
                borderRightColor: 'rgba(99,179,237,0.2)',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'rgba(99,179,237,0.2)',
                borderLeftWidth: '1px',
                borderLeftStyle: 'solid',
                borderLeftColor: 'rgba(99,179,237,0.2)',
              }}
            >
              <span className="dot-pulse" aria-hidden="true" />
              <span className="t-system" style={{ color: 'var(--pulse)' }}>
                COMPUTER ENGINEERING — EILCO
              </span>
            </div>

            <div
              className="flex items-center"
              style={{
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(72,187,120,0.07)',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'rgba(72,187,120,0.2)',
                borderRightWidth: '1px',
                borderRightStyle: 'solid',
                borderRightColor: 'rgba(72,187,120,0.2)',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'rgba(72,187,120,0.2)',
                borderLeftWidth: '1px',
                borderLeftStyle: 'solid',
                borderLeftColor: 'rgba(72,187,120,0.2)',
              }}
            >
              <span className="dot-active" aria-hidden="true" />
              <span className="t-system" style={{ color: 'var(--active)' }}>
                SEEKING ALTERNANCE · BACKEND / FULL-STACK
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div
          ref={ctaRef}
          style={{ opacity: 0, marginBottom: 'var(--sp-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', alignItems: 'center' }}
        >
          {/* Primary CTA — scroll to work */}
          <a
            href="#layer-systems"
            onClick={e => {
              e.preventDefault()
              document.getElementById('layer-systems')?.scrollIntoView({ behavior: 'smooth' })
            }}
            data-hover="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '6px',
              background: 'var(--pulse)',
              color: '#020204',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'background 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#90cdf4' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--pulse)' }}
          >
            View My Work
            <span aria-hidden="true">↓</span>
          </a>

          {/* Secondary CTA — résumé */}
          <a
            href={identity.resume}
            target="_blank"
            rel="noopener noreferrer"
            data-hover="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.04)',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'var(--wire-bright)',
              borderRightWidth: '1px',
              borderRightStyle: 'solid',
              borderRightColor: 'var(--wire-bright)',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'var(--wire-bright)',
              borderLeftWidth: '1px',
              borderLeftStyle: 'solid',
              borderLeftColor: 'var(--wire-bright)',
              color: 'var(--text-0)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderTopColor = 'rgba(99,179,237,0.4)'
              el.style.borderRightColor = 'rgba(99,179,237,0.4)'
              el.style.borderBottomColor = 'rgba(99,179,237,0.4)'
              el.style.borderLeftColor = 'rgba(99,179,237,0.4)'
              el.style.color = 'var(--pulse)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderTopColor = 'var(--wire-bright)'
              el.style.borderRightColor = 'var(--wire-bright)'
              el.style.borderBottomColor = 'var(--wire-bright)'
              el.style.borderLeftColor = 'var(--wire-bright)'
              el.style.color = 'var(--text-0)'
            }}
          >
            Download Résumé
            <span aria-hidden="true">↗</span>
          </a>

          {/* Tertiary links */}
          <div className="flex items-center" style={{ gap: 'var(--sp-2)', marginLeft: '4px' }}>
            {[
              { label: 'GitHub',   href: identity.github,                  },
              { label: 'LinkedIn', href: identity.linkedin,                 },
              { label: 'Email',    href: `mailto:${identity.email}`,        },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                data-hover="true"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-2)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-0)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-2)' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div ref={statRef} className="flex flex-wrap" style={{ gap: 'var(--sp-6)' }}>
          {systemStats.map((s) => (
            <div
              key={s.id}
              className="stat-item flex flex-col"
              style={{ gap: 'var(--sp-1)', opacity: 0 }}
            >
              <span
                className="tabular-nums font-thin leading-none"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
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
      </div>
    </section>
  )
}
