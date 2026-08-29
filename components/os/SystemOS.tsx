'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import LayerCore         from './LayerCore'
import LayerMemory       from './LayerMemory'
import LayerKnowledge    from './LayerKnowledge'
import LayerSystems      from './LayerSystems'
import LayerProcess      from './LayerProcess'
import LayerIntelligence from './LayerIntelligence'
import LayerLegacy       from './LayerLegacy'
import { setLenis }      from '@/lib/lenis'

const Cursor          = dynamic(() => import('./Cursor'),                        { ssr: false })
const SystemNavigator = dynamic(() => import('./SystemNavigator'),               { ssr: false })
const ScrollProgress  = dynamic(() => import('@/components/ui/ScrollProgress'), { ssr: false })
const Loader          = dynamic(() => import('@/components/ui/OSLoader'),        { ssr: false })
const CommandPalette  = dynamic(() => import('@/components/ui/CommandPalette'), { ssr: false })
const KonamiEgg       = dynamic(() => import('@/components/ui/KonamiEgg'),      { ssr: false })
const AmbientField    = dynamic(() => import('@/components/ui/AmbientField'),   { ssr: false })

export default function SystemOS() {
  const [loaded, setLoaded] = useState(false)
  const lenisCleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Disable browser scroll restoration so a page refresh never auto-scrolls
    // back to a previously remembered position. The user owns scroll position
    // entirely. On every load the page starts at the top — which is correct
    // for a portfolio that begins with a hero — and stays wherever the user
    // leaves it. The browser will not interfere.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    let cancelled = false

    async function initLenis() {
      const LenisModule   = await import('lenis')
      const gsapModule    = await import('gsap')
      const stModule      = await import('gsap/ScrollTrigger')
      if (cancelled) return

      const Lenis         = LenisModule.default
      const gsap          = gsapModule.gsap
      const ScrollTrigger = stModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration:           1.4,
        easing:             (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation:        'vertical',
        gestureOrientation: 'vertical',
        smoothWheel:        true,
        touchMultiplier:    2,
      })

      // Connect Lenis to ScrollTrigger — they share one scroll source of truth.
      // Without this, ScrollTrigger polls window.scrollY independently and
      // fires refresh() to correct itself, causing scroll position to jump.
      const onScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onScroll)

      // Register with global singleton — cast through unknown to bridge
      // the LenisInstance type (which only exposes what consumers need)
      // and the actual Lenis class type (which has overloaded on/off).
      setLenis(lenis as unknown as Parameters<typeof setLenis>[0])

      let rafId: number
      const tick = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(tick) }
      rafId = requestAnimationFrame(tick)

      lenisCleanupRef.current = () => {
        cancelAnimationFrame(rafId)
        lenis.off('scroll', onScroll)
        lenis.destroy()
        setLenis(null as never)
      }
    }

    initLenis()
    return () => {
      cancelled = true
      lenisCleanupRef.current?.()
      lenisCleanupRef.current = null
    }
  }, [])

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <Cursor />
      <ScrollProgress />
      <SystemNavigator />
      <CommandPalette />
      <KonamiEgg />
      <AmbientField />
      <div className="scanline" aria-hidden="true" />
      <div className="noise"    aria-hidden="true" />
      <main
        id="top"
        style={{
          opacity:    loaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <LayerCore />
        <LayerMemory />
        <LayerKnowledge />
        <LayerSystems />
        <LayerProcess />
        <LayerIntelligence />
        <LayerLegacy />
      </main>
    </>
  )
}
