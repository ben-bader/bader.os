'use client'

import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { projectFocusBus } from '@/lib/experience/ProjectFocusBus'
import { pointerBus } from '@/lib/experience/PointerBus'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function MotionOrchestrator() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let frame = 0
    const activate = () => {
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => setHydrated(true))
      })
    }

    if (document.readyState === 'complete') activate()
    else window.addEventListener('load', activate, { once: true })

    return () => {
      window.removeEventListener('load', activate)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  useGSAP(() => {
    if (!hydrated) return

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const chapters = gsap.utils.toArray<HTMLElement>('#main-content > section, #layer-legacy')
      chapters.forEach(chapter => {
        const heading = chapter.querySelector<HTMLElement>('h1, h2')
        const description = chapter.querySelector<HTMLElement>('.section-description')
        // Keep the initially visible, server-rendered hero heading untouched
        // until hydration has completed. GSAP's inline transform can otherwise
        // race React's hydration and produce an attribute mismatch.
        if (!heading || heading.id === 'hero-title') return

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: 'top 76%',
            once: true,
          },
        })
        timeline.fromTo(heading, { y: 18 }, { y: 0, duration: 0.64, ease: 'power2.out', immediateRender: false })
        if (description) {
          timeline.fromTo(description, { y: 10 }, { y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, '-=0.38')
        }
      })

      gsap.utils.toArray<HTMLElement>('.project-record').forEach(record => {
        gsap.fromTo(record, { y: 14 }, {
          y: 0,
          duration: 0.62,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: record, start: 'top 84%', once: true },
        })
      })
    })
    return () => media.revert()
  }, { dependencies: [hydrated], revertOnUpdate: true })

  useEffect(() => {
    const records = Array.from(document.querySelectorAll<HTMLElement>('.project-record'))
    let focusTween: gsap.core.Tween | null = null
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tween = (record: HTMLElement, active: boolean) => {
      const hover = active ? 1 : 0
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        record.style.setProperty('--project-hover', String(hover))
      } else {
        gsap.to(record, {
          '--project-hover': hover,
          duration: active ? 0.32 : 0.2,
          ease: active ? 'power2.out' : 'power1.out',
          overwrite: 'auto',
        })
      }
      const heading = record.querySelector('h3')
      const id = heading?.id ?? null
      if (!active) {
        if (projectFocusBus.getSnapshot().id !== id) return
        if (reducedMotion) {
          projectFocusBus.set(null)
          return
        }
        focusTween?.kill()
        focusTween = gsap.delayedCall(0.24, () => projectFocusBus.set(null))
        return
      }
      focusTween?.kill()
      projectFocusBus.set(id)
    }

    const enter = (event: Event) => {
      const target = event.target as HTMLElement | null
      const record = target?.closest<HTMLElement>('.project-record')
      const relatedTarget = event instanceof PointerEvent || event instanceof FocusEvent ? event.relatedTarget : null
      if (record && !record.contains(relatedTarget as Node | null)) tween(record, true)
    }
    const leave = (event: Event) => {
      const target = event.target as HTMLElement | null
      const record = target?.closest<HTMLElement>('.project-record')
      if (!record || (event instanceof FocusEvent && record.contains(event.relatedTarget as Node | null))) return
      if (event instanceof PointerEvent && record.contains(event.relatedTarget as Node | null)) return
      if (event instanceof PointerEvent && record.matches(':focus-within')) return
      const pointer = pointerBus.getSnapshot()
      if (pointer.inside) {
        const clientX = ((pointer.x + 1) / 2) * window.innerWidth
        const clientY = ((1 - pointer.y) / 2) * window.innerHeight
        if (document.elementFromPoint(clientX, clientY)?.closest('.project-record') === record) return
      }
      tween(record, false)
    }
    const updateSurfacePoint = () => {
      const pointer = pointerBus.getSnapshot()
      if (!pointer.inside) return
      const clientX = ((pointer.x + 1) / 2) * window.innerWidth
      const clientY = ((1 - pointer.y) / 2) * window.innerHeight
      const record = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>('.project-record')
      if (!record) return
      const bounds = record.getBoundingClientRect()
      record.style.setProperty('--pointer-x', `${((clientX - bounds.left) / Math.max(bounds.width, 1)) * 100}%`)
      record.style.setProperty('--pointer-y', `${((clientY - bounds.top) / Math.max(bounds.height, 1)) * 100}%`)
    }
    document.addEventListener('pointerover', enter)
    document.addEventListener('pointerout', leave)
    document.addEventListener('focusin', enter)
    document.addEventListener('focusout', leave)
    const unsubscribePointer = pointerBus.subscribe(updateSurfacePoint)
    return () => {
      document.removeEventListener('pointerover', enter)
      document.removeEventListener('pointerout', leave)
      document.removeEventListener('focusin', enter)
      document.removeEventListener('focusout', leave)
      unsubscribePointer()
      records.forEach(record => gsap.killTweensOf(record))
      focusTween?.kill()
    }
  }, [])

  return null
}
