'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import { useReducedMotion } from '@/lib/reduced-motion'

gsap.registerPlugin(ScrollTrigger)

export function ScrollReveal({ children, className = '', direction = 'up' }: Readonly<{ children: React.ReactNode; className?: string; direction?: 'up' | 'left' | 'right' }>) {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  useGSAP(() => {
    if (!root.current || reducedMotion) return
    const axis = direction === 'up' ? { y: 48 } : { x: direction === 'left' ? -40 : 40 }
    gsap.from(root.current, { ...axis, opacity: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } })
  }, { scope: root, dependencies: [direction, reducedMotion] })
  return <div ref={root} className={className}>{children}</div>
}
