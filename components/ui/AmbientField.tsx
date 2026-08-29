'use client'

import { useEffect, useRef } from 'react'

/**
 * A subtle mouse-reactive gradient mesh rendered on a fixed canvas.
 * Fills the void with intelligence — never decorative, always purposeful.
 */
export default function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0, h = 0
    let mx = 0, my = 0, tx = 0, ty = 0
    let t = 0, rafId: number

    const resize = () => {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
      tx = w / 2; ty = h / 2
      mx = w / 2; my = h / 2
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMouse = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    window.addEventListener('mousemove', onMouse, { passive: true })

    const draw = () => {
      t += 0.003
      mx += (tx - mx) * 0.035
      my += (ty - my) * 0.035

      ctx.clearRect(0, 0, w, h)

      // Mouse-following blue orb
      const g1 = ctx.createRadialGradient(mx, my, 0, mx, my, w * 0.5)
      g1.addColorStop(0, 'rgba(99,179,237,0.042)')
      g1.addColorStop(1, 'rgba(99,179,237,0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      // Slowly drifting purple
      const px = w * 0.7 + Math.sin(t * 0.7) * w * 0.1
      const py = h * 0.3 + Math.cos(t * 0.5) * h * 0.1
      const g2 = ctx.createRadialGradient(px, py, 0, px, py, w * 0.35)
      g2.addColorStop(0, 'rgba(159,122,234,0.035)')
      g2.addColorStop(1, 'rgba(159,122,234,0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      // Subtle bottom-left warm accent
      const cx2 = w * 0.12 + Math.cos(t * 0.4) * w * 0.06
      const cy2 = h * 0.78 + Math.sin(t * 0.6) * h * 0.07
      const g3 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, w * 0.22)
      g3.addColorStop(0, 'rgba(99,179,237,0.018)')
      g3.addColorStop(1, 'rgba(99,179,237,0)')
      ctx.fillStyle = g3
      ctx.fillRect(0, 0, w, h)

      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
