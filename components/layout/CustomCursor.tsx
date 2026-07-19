'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/reduced-motion'

export function CustomCursor(): React.ReactElement | null {
  const [enabled, setEnabled] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(media.matches && !reducedMotion)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [reducedMotion])

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('has-custom-cursor')
    const dot = document.querySelector<HTMLElement>('[data-cursor-dot]')
    const ring = document.querySelector<HTMLElement>('[data-cursor-ring]')
    if (!dot || !ring) return
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let ringX = targetX
    let ringY = targetY
    let frame = 0
    const move = (event: PointerEvent) => { targetX = event.clientX; targetY = event.clientY; dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)` }
    const tick = () => { ringX += (targetX - ringX) * 0.15; ringY += (targetY - ringY) * 0.15; ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`; frame = requestAnimationFrame(tick) }
    const hover = (event: Event) => ring.classList.toggle('is-active', (event.target as HTMLElement).closest('a, button, [data-cursor-interactive]') !== null)
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', hover)
    frame = requestAnimationFrame(tick)
    return () => { document.body.classList.remove('has-custom-cursor'); window.removeEventListener('pointermove', move); document.removeEventListener('pointerover', hover); cancelAnimationFrame(frame) }
  }, [enabled])

  if (!enabled) return null
  return <div className="custom-cursor" aria-hidden="true"><span data-cursor-dot /><span data-cursor-ring /></div>
}
