'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const coreRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: -100, y: -100 })
  const raf     = useRef<number>(0)

  useEffect(() => {
    const core = coreRef.current
    const ring = ringRef.current
    if (!core || !ring) return

    let ringX = -100, ringY = -100

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      core.style.left = `${e.clientX}px`
      core.style.top  = `${e.clientY}px`
    }
    const onDown = () => { core.classList.add('clicking'); ring.classList.add('clicking') }
    const onUp   = () => { core.classList.remove('clicking'); ring.classList.remove('clicking') }
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const hoverable = t.dataset.hover === 'true' || !!t.closest('[data-hover="true"]')
        || t.tagName === 'A' || t.tagName === 'BUTTON'
        || !!t.closest('a') || !!t.closest('button')
      ring.classList.toggle('hovering', hoverable)
    }

    const tick = () => {
      ringX += (mouse.current.x - ringX) * 0.1
      ringY += (mouse.current.y - ringY) * 0.1
      ring.style.left = `${ringX}px`
      ring.style.top  = `${ringY}px`
      raf.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)
    document.addEventListener('mouseover', onOver, { passive: true })
    raf.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup',   onUp)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={coreRef} className="cursor-core" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
