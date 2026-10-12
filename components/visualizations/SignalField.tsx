'use client'

/**
 * SIGNAL FIELD — L03 / KNOWLEDGE
 *
 * Technologies exist as charged particles in an electromagnetic field.
 * Co-usage relationships manifest as field attraction — technologies that
 * appear in the same project pull toward each other, creating natural
 * clusters without any forced layout algorithm.
 *
 * Interaction model:
 *   Idle   — particles drift with faint field-line oscillation
 *   Hover  — hovered particle becomes the field origin; connected particles
 *             arc inward along signal-trace paths; others fade to background
 *             radiation. A readout panel decodes the signal.
 *   Leave  — field relaxes back to ambient state over ~800ms
 *
 * Visual language: oscilloscope, interference patterns, signal noise,
 * charged-particle physics — never a graph, never a chart.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { knowledgeNodes, type KnowledgeNode } from '@/lib/content'

/* ─── types ─────────────────────────────────────────────────────────── */
interface Particle extends KnowledgeNode {
  // current position
  x: number; y: number
  // velocity
  vx: number; vy: number
  // home position (equilibrium) — set once during layout
  hx: number; hy: number
  // signal phase offset (makes each particle's oscillation unique)
  phase: number
  // charge strength — derived from weight
  charge: number
}

interface SignalReadout {
  node: KnowledgeNode
  connected: string[]
  x: number; y: number   // canvas position for readout anchor
}

/* ─── constants ─────────────────────────────────────────────────────── */
const CAT_COLOR: Record<string, string> = {
  language:  '#f6ad55',
  framework: '#63b3ed',
  database:  '#9f7aea',
  devops:    '#68d391',
  concept:   '#fc8181',
  tool:      '#76e4f7',
}

// How strongly each category is drawn to the field origin on hover
const CAT_AFFINITY: Record<string, number> = {
  framework: 1.0,
  language:  0.85,
  database:  0.75,
  devops:    0.65,
  concept:   0.70,
  tool:      0.60,
}

/* ─── layout — organic, not symmetric ───────────────────────────────── */
function computeHomePositions(nodes: KnowledgeNode[], w: number, h: number): Map<string, { x: number; y: number }> {
  // Deterministic seeded random so positions are stable across renders
  const seed = (n: number) => { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x) }

  // Place nodes in loose orbital bands by weight (heavier = closer to center)
  // but with intentional irregularity — not rings, more like star formation
  const map = new Map<string, { x: number; y: number }>()
  const cx = w * 0.5, cy = h * 0.5

  nodes.forEach((node, i) => {
    // Base radius inversely proportional to weight — heavier techs near center
    const minR = 0.08, maxR = 0.42
    const t     = 1 - (node.weight - 1) / 10   // 0=heavy, 1=light
    const r     = (minR + t * (maxR - minR)) * Math.min(w, h)
    // Angular position: spread evenly but with seeded jitter
    const angle = (i / nodes.length) * Math.PI * 2 + seed(i * 13) * 0.6 - 0.3
    // Radial jitter — prevents perfect circles
    const rJit  = r * (0.8 + seed(i * 7) * 0.4)

    map.set(node.id, {
      x: cx + Math.cos(angle) * rJit,
      y: cy + Math.sin(angle) * rJit * 0.72, // vertical compression — feels more natural
    })
  })
  return map
}

/* ─── component ─────────────────────────────────────────────────────── */
export default function SignalField() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const particles   = useRef<Particle[]>([])
  const mouseRef    = useRef({ x: -9999, y: -9999 })
  const hoverId     = useRef<string | null>(null)
  const [size, setSize]       = useState({ w: 800, h: 520 })
  const [readout, setReadout] = useState<SignalReadout | null>(null)
  const rafRef      = useRef<number>(0)

  /* init / re-init particles */
  const initParticles = useCallback((w: number, h: number) => {
    const homes = computeHomePositions(knowledgeNodes, w, h)
    const seed  = (n: number) => { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x) }

    particles.current = knowledgeNodes.map((node, i) => {
      const home = homes.get(node.id) ?? { x: w / 2, y: h / 2 }
      return {
        ...node,
        x: home.x + (seed(i * 3) - 0.5) * 40,
        y: home.y + (seed(i * 5) - 0.5) * 40,
        vx: 0, vy: 0,
        hx: home.x, hy: home.y,
        phase: seed(i * 11) * Math.PI * 2,
        charge: 0.4 + (node.weight / 10) * 0.6,
      }
    })
  }, [])

  /* resize */
  useEffect(() => {
    const container = canvasRef.current?.parentElement
    if (!container) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      const h = Math.max(460, w * 0.58)
      setSize({ w, h })
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width  = size.w
      canvasRef.current.height = size.h
    }
    initParticles(size.w, size.h)
  }, [size, initParticles])

  /* main render loop */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let visible = true
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    obs.observe(canvas)

    const getHit = (): string | null => {
      const { x, y } = mouseRef.current
      for (const p of particles.current) {
        const r = 5 + p.weight * 1.4
        if (Math.hypot(p.x - x, p.y - y) < r + 10) return p.id
      }
      return null
    }

    const draw = (ts: number) => {
      rafRef.current = requestAnimationFrame(draw)
      if (!visible) return

      frame++
      const t     = ts * 0.001
      const W     = canvas.width
      const H     = canvas.height
      const pList = particles.current
      const hov   = hoverId.current

      /* ── physics ────────────────────────────────────────────────── */
      pList.forEach(p => {
        // Spring back to home
        const homeStr = hov ? 0.018 : 0.025
        p.vx += (p.hx - p.x) * homeStr
        p.vy += (p.hy - p.y) * homeStr

        if (hov) {
          const hovP = pList.find(q => q.id === hov)
          if (hovP) {
            const isConn = p.connections.includes(hov) || hovP.connections.includes(p.id)
            const isSelf = p.id === hov

            if (isSelf) {
              // Pull self to near-center with slight oscillation
              const ox = Math.sin(t * 1.8 + p.phase) * 8
              const oy = Math.cos(t * 1.4 + p.phase) * 5
              p.vx += (W * 0.5 + ox - p.x) * 0.04
              p.vy += (H * 0.45 + oy - p.y) * 0.04
            } else if (isConn) {
              // Pull connected particles toward origin — but not on top of it
              const aff   = CAT_AFFINITY[p.category] ?? 0.7
              const angle = Math.atan2(p.y - H * 0.45, p.x - W * 0.5)
              const dist  = Math.hypot(p.x - W * 0.5, p.y - H * 0.45)
              const targetDist = 60 + (1 - aff) * 80 + p.charge * 20
              const pull  = (dist - targetDist) * 0.015 * aff
              p.vx -= Math.cos(angle) * pull
              p.vy -= Math.sin(angle) * pull
            } else {
              // Push unrelated particles to periphery
              const angle = Math.atan2(p.y - H * 0.45, p.x - W * 0.5)
              const dist  = Math.hypot(p.x - W * 0.5, p.y - H * 0.45)
              const push  = Math.max(0, 180 - dist) * 0.008
              p.vx += Math.cos(angle) * push
              p.vy += Math.sin(angle) * push
            }
          }
        }

        // Ambient drift — gentle sinusoidal breathing
        if (!hov) {
          p.vx += Math.sin(t * 0.4 + p.phase) * 0.04
          p.vy += Math.cos(t * 0.3 + p.phase + 1) * 0.04
        }

        // Damping
        p.vx *= 0.88
        p.vy *= 0.88
        p.x  += p.vx
        p.y  += p.vy

        // Soft boundary
        const pad = 32
        if (p.x < pad)     p.vx += (pad - p.x) * 0.06
        if (p.x > W - pad) p.vx -= (p.x - (W - pad)) * 0.06
        if (p.y < pad)     p.vy += (pad - p.y) * 0.06
        if (p.y > H - pad) p.vy -= (p.y - (H - pad)) * 0.06
      })

      /* ── render ──────────────────────────────────────────────────── */
      ctx.clearRect(0, 0, W, H)

      // Background field texture — faint dot grid that breathes
      if (frame % 3 === 0) {
        ctx.save()
        const gridStep = 28
        for (let gx = 0; gx < W; gx += gridStep) {
          for (let gy = 0; gy < H; gy += gridStep) {
            const pulse = (Math.sin(t * 0.5 + gx * 0.02 + gy * 0.018) + 1) * 0.5
            ctx.beginPath()
            ctx.arc(gx, gy, 0.6, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(99,179,237,${0.012 + pulse * 0.018})`
            ctx.fill()
          }
        }
        ctx.restore()
      }

      const hovP = hov ? pList.find(q => q.id === hov) : null

      // Draw field lines from hovered particle to connected ones
      if (hovP) {
        hovP.connections.forEach(cid => {
          const cp = pList.find(q => q.id === cid)
          if (!cp) return
          const color = CAT_COLOR[hovP.category] ?? '#63b3ed'

          // Signal trace — oscilloscope-style waveform along the connection
          ctx.save()
          ctx.strokeStyle = color + '55'
          ctx.lineWidth   = 1
          ctx.beginPath()
          const steps = 48
          const dx = (cp.x - hovP.x) / steps
          const dy = (cp.y - hovP.y) / steps
          const perpX = -dy / Math.hypot(dx, dy + 0.001)
          const perpY =  dx / Math.hypot(dx, dy + 0.001)
          for (let s = 0; s <= steps; s++) {
            const prog  = s / steps
            const wave  = Math.sin(prog * Math.PI * 4 - t * 5 + cp.phase) * (8 * Math.sin(prog * Math.PI))
            const px    = hovP.x + dx * s + perpX * wave
            const py    = hovP.y + dy * s + perpY * wave
            if (s === 0) { ctx.moveTo(px, py) } else { ctx.lineTo(px, py) }
          }
          ctx.stroke()
          ctx.restore()

          // Animated signal pulse traveling along the trace
          const pulsePos = ((t * 0.8 + cp.phase * 0.3) % 1)
          const px = hovP.x + (cp.x - hovP.x) * pulsePos
          const py = hovP.y + (cp.y - hovP.y) * pulsePos
          const grd = ctx.createRadialGradient(px, py, 0, px, py, 6)
          grd.addColorStop(0, color + 'cc')
          grd.addColorStop(1, color + '00')
          ctx.beginPath()
          ctx.arc(px, py, 6, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        })
      }

      // Draw particles
      pList.forEach(p => {
        const color  = CAT_COLOR[p.category] ?? '#888'
        const isSelf = p.id === hov
        const isConn = hovP ? (p.connections.includes(hov!) || hovP.connections.includes(p.id)) : false
        const isDim  = hov !== null && !isSelf && !isConn

        const baseR  = 3.5 + p.weight * 1.1
        const r      = isSelf ? baseR * 1.6 : baseR

        // Ambient pulse ring
        if (!hov || isConn || isSelf) {
          const pulseT = (Math.sin(t * 1.2 + p.phase) + 1) * 0.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, r + 4 + pulseT * 4, 0, Math.PI * 2)
          ctx.strokeStyle = color + (isSelf ? '30' : '14')
          ctx.lineWidth   = 0.6
          ctx.stroke()
        }

        // Core glow
        if (!isDim) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5)
          grd.addColorStop(0, color + (isSelf ? '55' : '22'))
          grd.addColorStop(1, color + '00')
          ctx.beginPath()
          ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }

        // Particle core — diamond shape for character
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(Math.PI / 4 + t * (isSelf ? 0.8 : 0.15) + p.phase)
        const s2 = r * 0.85
        ctx.beginPath()
        ctx.rect(-s2 / 2, -s2 / 2, s2, s2)
        ctx.fillStyle = isDim
          ? 'rgba(255,255,255,0.04)'
          : isSelf
            ? color
            : isConn
              ? color + 'cc'
              : color + '70'
        ctx.fill()
        ctx.restore()

        // Label — shown for high-weight nodes and hovered/connected
        const showLabel = !isDim && (isSelf || isConn || (!hov && p.weight >= 8))
        if (showLabel) {
          ctx.font        = `${isSelf ? 500 : 400} 9px var(--font-code, monospace)`
          ctx.fillStyle   = isSelf ? '#fff' : color + 'cc'
          ctx.textAlign   = 'center'
          ctx.textBaseline= 'middle'
          // Position label so it doesn't overlap particle
          const labelY = p.y + r + 11
          ctx.fillText(p.label, p.x, labelY)
        }
      })

      // Hit detection → update readout state (throttled to every 6 frames)
      if (frame % 6 === 0) {
        const hit = getHit()
        if (hit !== hoverId.current) {
          hoverId.current = hit
          if (hit) {
            const hp = pList.find(q => q.id === hit)!
            setReadout({ node: hp, connected: hp.connections, x: hp.x, y: hp.y })
          } else {
            setReadout(null)
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      obs.disconnect()
    }
  }, [size])

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const onMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999 }
    hoverId.current  = null
    setReadout(null)
  }

  return (
    <div className="relative w-full" style={{ background: 'var(--surface-1)', borderRadius: '2px', border: '1px solid var(--wire)' }}>
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        className="w-full block"
        style={{ cursor: 'none' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        aria-label="Signal field — technology relationships"
        role="img"
      />

      {/* Signal readout panel — appears when a particle is hovered */}
      <div
        className="absolute glass rounded-sm"
        style={{
          top: 'var(--sp-3)', left: 'var(--sp-3)',
          width: '200px',
          padding: 'var(--sp-2)',
          opacity:   readout ? 1 : 0,
          transform: readout ? 'translateX(0)' : 'translateX(-6px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {readout && (() => {
          const color = CAT_COLOR[readout.node.category] ?? '#63b3ed'
          return (
            <>
              <div className="flex items-center" style={{ gap: '6px', marginBottom: '10px' }}>
                <span
                  style={{
                    width: '6px', height: '6px',
                    background: color, borderRadius: '1px',
                    transform: 'rotate(45deg)', display: 'inline-block',
                    boxShadow: `0 0 6px ${color}`,
                  }}
                />
                <span className="t-label" style={{ color }}>{readout.node.category}</span>
              </div>

              <div
                className="font-light"
                style={{ fontSize: 'var(--text-md)', color: 'var(--text-0)', marginBottom: '6px', letterSpacing: '-0.01em' }}
              >
                {readout.node.label}
              </div>

              <div className="t-system" style={{ marginBottom: '10px', color: 'var(--text-3)' }}>
                signal since {readout.node.since}
              </div>

              {readout.node.projects.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <div className="t-system" style={{ color: 'var(--text-3)', marginBottom: '4px' }}>active in</div>
                  {readout.node.projects.map(p => (
                    <div key={p} className="flex items-center" style={{ gap: '5px', marginBottom: '2px' }}>
                      <span style={{ width: 3, height: 3, background: color, borderRadius: '50%', flexShrink: 0 }} />
                      <span className="t-system" style={{ color }}>{p}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--wire)', paddingTop: '8px' }}>
                <div className="t-system" style={{ color: 'var(--text-3)' }}>
                  {readout.connected.length} connections
                </div>
              </div>
            </>
          )
        })()}
      </div>

      {/* Category legend — bottom left, minimal */}
      <div
        className="absolute flex flex-wrap"
        style={{ bottom: 'var(--sp-2)', right: 'var(--sp-2)', gap: '10px', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {Object.entries(CAT_COLOR).map(([cat, color]) => (
          <div key={cat} className="flex items-center" style={{ gap: '5px' }}>
            <span style={{
              width: 5, height: 5,
              background: color,
              display: 'inline-block',
              transform: 'rotate(45deg)',
              opacity: 0.7,
            }} />
            <span className="t-system" style={{ color: 'var(--text-3)' }}>{cat}</span>
          </div>
        ))}
      </div>

      {/* Ambient hint */}
      <div
        className="absolute t-system"
        style={{ bottom: 'var(--sp-2)', left: 'var(--sp-3)', color: 'var(--text-3)', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        hover a particle to read its signal
      </div>
    </div>
  )
}
