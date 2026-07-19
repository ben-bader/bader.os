'use client'

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createContext, useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/reduced-motion'

gsap.registerPlugin(ScrollTrigger)

export const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null)

export function LenisProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const lenis = useRef<Lenis | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const instance = new Lenis({ lerp: 0.1, duration: 1.2, smoothWheel: true, touchMultiplier: 1.5 })
    const update = () => ScrollTrigger.update()
    const frame = (time: number) => instance.raf(time * 1000)
    instance.on('scroll', update)
    gsap.ticker.add(frame)
    gsap.ticker.lagSmoothing(0)
    lenis.current = instance
    return () => {
      instance.off('scroll', update)
      instance.destroy()
      gsap.ticker.remove(frame)
      lenis.current = null
    }
  }, [reducedMotion])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
