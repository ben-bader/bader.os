'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ArrowDownRight, Download } from 'lucide-react'
import { useRef } from 'react'
import { profile } from '@/content/data'
import { useReducedMotion } from '@/lib/reduced-motion'

export function Hero({ revealed }: { revealed: boolean }) {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  useGSAP(() => { if (!revealed || reducedMotion) return; gsap.from('[data-hero-character]', { opacity: 0, y: 34, duration: .8, stagger: .02, ease: 'power3.out', delay: .3 }); gsap.from('[data-hero-action]', { opacity: 0, y: 20, duration: .5, stagger: .1, ease: 'power3.out', delay: .9 }) }, { scope: root, dependencies: [revealed, reducedMotion] })
  return <section ref={root} className="hero" aria-labelledby="hero-title"><div className="hero-content"><p className="eyebrow">{profile.eyebrow}</p><h1 id="hero-title" className="hero-name" aria-label={profile.name}>{[...profile.name].map((char, index) => <span data-hero-character key={`${char}-${index}`}>{char === ' ' ? '\u00A0' : char}</span>)}</h1><p className="hero-statement">{profile.headline}</p><div className="hero-actions"><a data-hero-action className="button button-primary" href="#projects">View Projects <ArrowDownRight size={17} aria-hidden="true" /></a><a data-hero-action className="button button-secondary" href={profile.cv} download>Download CV <Download size={16} aria-hidden="true" /></a></div><p data-hero-action className="availability"><span aria-hidden="true" />{profile.availability}</p></div></section>
}
