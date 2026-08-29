'use client'

import { useEffect, useRef } from 'react'
import { identity } from '@/lib/content'

const LINKS = [
  { label: 'GitHub',   href: identity.github,              external: true,  desc: 'Source code & open source' },
  { label: 'LinkedIn', href: identity.linkedin,             external: true,  desc: 'Professional network'       },
  { label: 'Email',    href: `mailto:${identity.email}`,   external: false, desc: identity.email               },
  { label: 'Résumé',   href: identity.resume,              external: true,  desc: 'Download PDF'               },
]

const MESSAGE = "Let's build something worth shipping."

export default function LayerLegacy() {
  const sectionRef = useRef<HTMLElement>(null)
  const msgRef     = useRef<HTMLParagraphElement>(null)

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
      if (prefersReduced) {
        el.querySelectorAll<HTMLElement>('.leg-reveal').forEach(e => { e.style.opacity = '1' })
        el.querySelectorAll<HTMLElement>('.end-char').forEach(e => { e.style.opacity = '1'; e.style.filter = 'none' })
        return
      }
      ctx = gsap.context(() => {
        gsap.fromTo(el.querySelectorAll('.end-char'),
          { opacity: 0, filter: 'blur(5px)', y: 6 },
          { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.0, stagger: 0.025, ease: 'expo.out', scrollTrigger: { trigger: msgRef.current, start: 'top 82%' } }
        )
        gsap.fromTo(el.querySelectorAll('.leg-reveal'),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 78%' } }
        )
      }, el)
    }
    init()
    return () => { cancelled = true; ctx?.revert(); ctx = null }
  }, [])

  return (
    <section
      id="layer-legacy"
      ref={sectionRef}
      className="os-section"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}
      aria-label="Layer 07: Legacy"
    >
      {/* Very faint grid fades out */}
      <div className="absolute inset-0 sys-grid pointer-events-none" style={{ opacity: 0.06 }} aria-hidden="true" />

      {/* Soft center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 55%, rgba(99,179,237,0.03) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="os-container relative z-10">
        {/* Layer label */}
        <div className="leg-reveal layer-header" style={{ marginBottom: 'var(--sp-8)' }}>
          <span className="t-system" style={{ color: 'var(--text-3)' }}>L07 / LEGACY</span>
          <div className="wire-h" style={{ width: '48px' }} aria-hidden="true" />
          <span className="t-system" style={{ color: 'var(--text-3)' }}>END OF TRANSMISSION</span>
        </div>

        {/* The final message — assembles slowly */}
        <p
          ref={msgRef}
          className="font-light flex flex-wrap"
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      'clamp(1.5rem, 4.5vw, 3.75rem)',
            letterSpacing: '-0.04em',
            lineHeight:    1.1,
            color:         'var(--text-1)',
            marginBottom:  'var(--sp-8)',
          }}
          aria-label={MESSAGE}
        >
          {MESSAGE.split('').map((char, i) => (
            <span
              key={i}
              className="end-char inline-block"
              style={{
                opacity:    0,
                whiteSpace: char === ' ' ? 'pre' : 'normal',
              }}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </p>

        {/* Availability */}
        <div className="leg-reveal flex items-center flex-wrap" style={{ gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
          <span className="dot-active" aria-hidden="true" />
          <span className="t-system" style={{ color: 'var(--active)' }}>
            {identity.availability.toUpperCase()}
          </span>
          <div className="wire-h" style={{ width: '64px' }} aria-hidden="true" />
          <span className="t-system" style={{ color: 'var(--text-3)' }}>{identity.location.toUpperCase()}</span>
        </div>

        {/* Contact cards */}
        <div
          className="flex items-center justify-start gap-2"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,200px),1fr))', gap: 'var(--sp-2)' }}
        >
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="glass rounded-sm flex flex-col group"
              style={{
                padding: 'var(--sp-4)',
                textDecoration: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,179,237,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--wire)' }}
              data-hover="true"
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-2)' }}>
                <span
                  className="font-light transition-colors duration-300"
                  style={{ fontSize: 'var(--text-base)', color: 'var(--text-0)' }}
                >
                  {link.label}
                </span>
                {link.external && (
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    aria-hidden="true"
                    className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: 'var(--text-3)' }}
                  >
                    <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="t-system">{link.desc}</span>
            </a>
          ))}
        </div>

        {/* Signature */}
        <div
          className="leg-reveal flex items-center justify-between flex-wrap"
          style={{
            gap:        'var(--sp-5)',
            marginTop:  'var(--sp-8)',
            paddingTop: 'var(--sp-5)',
            borderTop:  '1px solid var(--wire)',
          }}
        >
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <span className="t-system" style={{ color: 'var(--text-3)' }}>bader.os v2.0.4</span>
            <span className="t-system" style={{ color: 'var(--text-3)' }}>
              © {new Date().getFullYear()} {identity.name}
            </span>
          </div>
          <div className="flex items-center flex-wrap" style={{ gap: 'var(--sp-3)' }}>
            <span className="t-system" style={{ color: 'var(--text-3)' }}>built with</span>
            {['Next.js', 'Three.js', 'GSAP', 'D3'].map((tech, i, arr) => (
              <span key={tech}>
                <span className="t-system" style={{ color: 'var(--text-2)' }}>{tech}</span>
                {i < arr.length - 1 && (
                  <span className="t-system" style={{ color: 'var(--text-3)', marginLeft: 'var(--sp-3)' }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
