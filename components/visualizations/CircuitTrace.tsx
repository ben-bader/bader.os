'use client'

/**
 * CIRCUIT TRACE — L04 / SYSTEMS
 *
 * Each project is a printed circuit board. Services are solder pads.
 * Data flows are etched copper traces. When a project is selected,
 * the board "powers on": traces illuminate in propagation order,
 * showing exactly how a request travels through the architecture.
 *
 * Interaction model:
 *   Select project  — board assembles; traces are dark (unpowered)
 *   Hover service   — charge pulse originates from that pad, travels
 *                     all downstream traces in order, each pad lighting
 *                     up as the signal arrives
 *   Idle            — board breathes with a faint standby flicker on
 *                     all pads; traces carry ghost signals at low opacity
 *
 * Visual language: PCB manufacturing, oscilloscope traces,
 * signal propagation, electronic schematics — never a diagram.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { projectSystems, type ProjectSystem } from '@/lib/content'

/* ─── geometry ───────────────────────────────────────────────────────── */
// Convert the system's node/edge graph into orthogonal PCB traces.
// Traces route horizontally then vertically (L-shaped routing) — the
// hallmark of PCB layout, immediately recognizable, never generic.

interface Pad {
  id:    string
  label: string
  role:  string
  color: string
  x: number; y: number
  w: number; h: number
  status: string
}

interface Trace {
  from: string; to: string
  type: 'sync' | 'async' | 'event' | 'data'
  // polyline points for orthogonal routing
  pts: { x: number; y: number }[]
  // length in px — used for animation timing
  length: number
}

// Semantic layer assignment (vertical depth)
const LAYER_RANK: Record<string, number> = {
  client: 0, webapp: 0, web: 0, ui: 0,
  gateway: 1,
  auth: 2, session: 2,
  employee: 3, payroll: 3, leave: 3, api: 3,
  queue: 4, orm: 4, prisma: 4,
  db: 5, pg: 5,
  docker: 6, vercel: 6,
}

function getRank(id: string): number {
  for (const [key, rank] of Object.entries(LAYER_RANK)) {
    if (id.includes(key)) return rank
  }
  return 3
}

function buildLayout(system: ProjectSystem, W: number, H: number): { pads: Pad[]; traces: Trace[] } {
  // Group nodes by rank
  const groups = new Map<number, typeof system.nodes>()
  system.nodes.forEach(n => {
    const r = getRank(n.id)
    if (!groups.has(r)) groups.set(r, [])
    groups.get(r)!.push(n)
  })

  const ranks     = Array.from(groups.keys()).sort()
  const numRanks  = ranks.length
  const padW      = Math.min(120, (W - 80) / 3)
  const padH      = 38
  const rowH      = (H - 80) / Math.max(numRanks - 1, 1)
  const padMap    = new Map<string, Pad>()

  ranks.forEach((rank, ri) => {
    const nodes  = groups.get(rank)!
    const y      = 40 + ri * rowH
    const totalW = nodes.length * padW + (nodes.length - 1) * 24
    const startX = (W - totalW) / 2

    nodes.forEach((node, ni) => {
      const x = startX + ni * (padW + 24)
      const pad: Pad = {
        id:    node.id,
        label: node.label,
        role:  node.role,
        color: node.color ?? '#63b3ed',
        status: node.status,
        x, y, w: padW, h: padH,
      }
      padMap.set(node.id, pad)
    })
  })

  // Build orthogonal traces (L-shaped routing)
  const traces: Trace[] = system.edges.map(edge => {
    const from = padMap.get(edge.from)
    const to   = padMap.get(edge.to)
    if (!from || !to) return null

    // Exit from bottom-center of source pad, enter top-center of target
    const fx = from.x + from.w / 2
    const fy = from.y + from.h
    const tx = to.x + to.w / 2
    const ty = to.y

    // Mid-Y routing channel — halfway between rows
    const midY = fy + (ty - fy) * 0.5

    const pts = [
      { x: fx, y: fy },
      { x: fx, y: midY },
      { x: tx, y: midY },
      { x: tx, y: ty },
    ]

    // Compute total length for animation timing
    let length = 0
    for (let i = 1; i < pts.length; i++) {
      length += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y)
    }

    return { from: edge.from, to: edge.to, type: edge.type, pts, length }
  }).filter(Boolean) as Trace[]

  return { pads: Array.from(padMap.values()), traces }
}

/* ─── trace colors ───────────────────────────────────────────────────── */
const TRACE_COLOR = {
  sync:  '#63b3ed',
  async: '#9f7aea',
  event: '#f6ad55',
  data:  '#68d391',
}

/* ─── component ─────────────────────────────────────────────────────── */
export default function CircuitTrace() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const [size, setSize]       = useState({ w: 800, h: 480 })
  const [activeId, setActiveId] = useState<string>(projectSystems[0].id)
  const [hoveredPad, setHoveredPad] = useState<string | null>(null)

  // Pulse state — maps padId → activation time (ms)
  const pulseRef    = useRef<Map<string, number>>(new Map())
  const traceFrontRef = useRef<Map<string, number>>(new Map()) // traceKey → front 0..1
  const mouseRef    = useRef({ x: -1, y: -1 })
  const rafRef      = useRef<number>(0)
  const layoutRef   = useRef<{ pads: Pad[]; traces: Trace[] } | null>(null)

  const system  = projectSystems.find(s => s.id === activeId) ?? projectSystems[0]

  /* resize */
  useEffect(() => {
    const container = canvasRef.current?.parentElement
    if (!container) return
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width
      const h = Math.max(420, Math.round(w * 0.55))
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
    layoutRef.current = buildLayout(system, size.w, size.h)
    pulseRef.current.clear()
    traceFrontRef.current.clear()
  }, [size, system, activeId])

  /* hit test */
  const getHitPad = useCallback((): string | null => {
    if (!layoutRef.current) return null
    const { x, y } = mouseRef.current
    for (const pad of layoutRef.current.pads) {
      if (x >= pad.x && x <= pad.x + pad.w && y >= pad.y && y <= pad.y + pad.h) {
        return pad.id
      }
    }
    return null
  }, [])

  /* fire signal from pad — BFS through edges, stagger delay by hop */
  const fireSignal = useCallback((padId: string) => {
    if (!layoutRef.current) return
    const { traces } = layoutRef.current
    const now = performance.now()

    // BFS
    const visited  = new Set<string>()
    const queue: { id: string; delay: number }[] = [{ id: padId, delay: 0 }]

    while (queue.length) {
      const { id, delay } = queue.shift()!
      if (visited.has(id)) continue
      visited.add(id)
      pulseRef.current.set(id, now + delay)

      const outgoing = traces.filter(t => t.from === id)
      outgoing.forEach((tr, i) => {
        const traceKey = `${tr.from}→${tr.to}`
        traceFrontRef.current.set(traceKey, now + delay)
        queue.push({ id: tr.to, delay: delay + tr.length * 0.7 + i * 40 })
      })
    }
  }, [])

  /* render loop */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let visible = true
    let lastHit: string | null = null
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    obs.observe(canvas)

    // Auto-fire idle ghost signals
    let idleTimer = 0

    const render = (ts: number) => {
      rafRef.current = requestAnimationFrame(render)
      if (!visible) return

      const W     = canvas.width
      const H     = canvas.height
      const now   = ts

      if (!layoutRef.current) return
      const { pads, traces } = layoutRef.current

      // Idle ghost pulses — fire from a random pad every 3.5s when not hovered
      if (!hoveredPad && now - idleTimer > 3500) {
        const rndPad = pads[Math.floor(Math.random() * pads.length)]
        fireSignal(rndPad.id)
        idleTimer = now
      }

      /* ── background ─────────────────────────────────────────────── */
      ctx.clearRect(0, 0, W, H)

      // PCB substrate texture — dark green tint, subtle grain
      ctx.fillStyle = 'rgba(6,10,8,0.98)'
      ctx.fillRect(0, 0, W, H)

      // Fine grid — PCB routing grid
      ctx.save()
      for (let gx = 0; gx < W; gx += 16) {
        for (let gy = 0; gy < H; gy += 16) {
          ctx.beginPath()
          ctx.arc(gx, gy, 0.5, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(80,120,80,0.12)'
          ctx.fill()
        }
      }
      ctx.restore()

      /* ── traces ──────────────────────────────────────────────────── */
      traces.forEach(tr => {
        const traceKey = `${tr.from}→${tr.to}`
        const activatedAt = traceFrontRef.current.get(traceKey) ?? null
        const color = TRACE_COLOR[tr.type]

        // Draw base trace (etched copper — very dim)
        ctx.save()
        ctx.strokeStyle = `rgba(80,100,80,0.2)`
        ctx.lineWidth   = 1.5
        ctx.lineCap     = 'round'
        ctx.lineJoin    = 'round'
        ctx.beginPath()
        tr.pts.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y))
        ctx.stroke()
        ctx.restore()

        if (activatedAt !== null) {
          const elapsed   = now - activatedAt
          const SPEED     = 0.22  // px/ms
          const frontPx   = elapsed * SPEED  // how far signal has traveled

          // Draw illuminated portion of trace up to frontPx
          ctx.save()
          ctx.strokeStyle = color + 'cc'
          ctx.lineWidth   = 2
          ctx.lineCap     = 'round'
          ctx.lineJoin    = 'round'
          ctx.shadowColor = color
          ctx.shadowBlur  = 8

          let accum = 0
          let drawn = false
          ctx.beginPath()
          for (let i = 0; i < tr.pts.length - 1; i++) {
            const ax = tr.pts[i].x, ay = tr.pts[i].y
            const bx = tr.pts[i+1].x, by = tr.pts[i+1].y
            const segLen = Math.hypot(bx - ax, by - ay)
            if (accum >= frontPx) break

            const segRemain = Math.min(frontPx - accum, segLen)
            const frac = segRemain / segLen
            const ex = ax + (bx - ax) * frac
            const ey = ay + (by - ay) * frac

            if (!drawn) { ctx.moveTo(ax, ay); drawn = true }
            ctx.lineTo(ex, ey)
            accum += segLen
          }
          ctx.stroke()
          ctx.restore()

          // Pulse dot at front
          if (frontPx < tr.length + 40) {
            let accPx2 = 0
            let frontX = tr.pts[0].x, frontY = tr.pts[0].y
            for (let i = 0; i < tr.pts.length - 1; i++) {
              const ax = tr.pts[i].x, ay = tr.pts[i].y
              const bx = tr.pts[i+1].x, by = tr.pts[i+1].y
              const segLen = Math.hypot(bx - ax, by - ay)
              if (accPx2 + segLen >= frontPx) {
                const frac = (frontPx - accPx2) / segLen
                frontX = ax + (bx - ax) * frac
                frontY = ay + (by - ay) * frac
                break
              }
              accPx2 += segLen
            }
            const grd = ctx.createRadialGradient(frontX, frontY, 0, frontX, frontY, 10)
            grd.addColorStop(0, color + 'ff')
            grd.addColorStop(1, color + '00')
            ctx.beginPath()
            ctx.arc(frontX, frontY, 4, 0, Math.PI * 2)
            ctx.fillStyle = grd
            ctx.fill()
          }
        }
      })

      /* ── pads ────────────────────────────────────────────────────── */
      pads.forEach(pad => {
        const activatedAt = pulseRef.current.get(pad.id) ?? null
        const isHov       = hoveredPad === pad.id
        const elapsed     = activatedAt !== null ? now - activatedAt : -1
        const lit         = elapsed >= 0 && elapsed < 2400

        // Pad glow when lit
        if (lit || isHov) {
          const intensity = isHov ? 1 : Math.max(0, 1 - (elapsed / 2400) ** 0.5)
          ctx.save()
          ctx.shadowColor = pad.color
          ctx.shadowBlur  = 20 * intensity
          ctx.fillStyle   = pad.color + Math.round(12 * intensity).toString(16).padStart(2, '0')
          ctx.fillRect(pad.x - 3, pad.y - 3, pad.w + 6, pad.h + 6)
          ctx.restore()
        }

        // Pad body — solder mask
        ctx.save()
        const alpha = lit || isHov ? 1 : 0.55
        ctx.fillStyle = `rgba(8,14,10,${alpha})`
        ctx.strokeStyle = lit || isHov ? pad.color : `rgba(80,120,80,0.35)`
        ctx.lineWidth   = lit || isHov ? 1.5 : 0.8
        ctx.beginPath()
        ctx.roundRect(pad.x, pad.y, pad.w, pad.h, 3)
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // Pin markers — small squares at pad edges (PCB aesthetic)
        ctx.fillStyle = lit || isHov ? pad.color + '80' : 'rgba(80,120,80,0.3)'
        const pinSize = 3
        ctx.fillRect(pad.x - pinSize, pad.y + pad.h / 2 - pinSize / 2, pinSize, pinSize)
        ctx.fillRect(pad.x + pad.w, pad.y + pad.h / 2 - pinSize / 2, pinSize, pinSize)

        // Status dot
        const dotColor = pad.status === 'running' ? '#48bb78' : pad.status === 'idle' ? '#63b3ed' : '#f6ad55'
        ctx.beginPath()
        ctx.arc(pad.x + 10, pad.y + 10, 3, 0, Math.PI * 2)
        ctx.fillStyle = lit ? dotColor : dotColor + '55'
        ctx.fill()
        if (lit || isHov) {
          ctx.beginPath()
          ctx.arc(pad.x + 10, pad.y + 10, 5, 0, Math.PI * 2)
          ctx.fillStyle = dotColor + '22'
          ctx.fill()
        }

        // Label — service name
        ctx.font         = `600 8.5px var(--font-mono, monospace)`
        ctx.fillStyle    = lit || isHov ? '#fff' : 'rgba(160,180,160,0.55)'
        ctx.textAlign    = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(pad.label.toUpperCase().slice(0, 12), pad.x + pad.w / 2, pad.y + pad.h / 2 - 4)

        // Role — smaller
        ctx.font      = `400 7.5px var(--font-mono, monospace)`
        ctx.fillStyle = lit || isHov ? pad.color + 'aa' : 'rgba(100,140,100,0.35)'
        ctx.fillText(pad.role.slice(0, 16), pad.x + pad.w / 2, pad.y + pad.h / 2 + 7)
      })

      // Hit detection (every frame — pads are larger targets)
      const hit = getHitPad()
      if (hit !== lastHit) {
        lastHit = hit
        setHoveredPad(hit)
        if (hit) fireSignal(hit)
      }
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(rafRef.current)
      obs.disconnect()
    }
  }, [size, system, hoveredPad, fireSignal, getHitPad])

  /* mouse */
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const onMouseLeave = () => {
    mouseRef.current = { x: -1, y: -1 }
  }

  const currentSystem = projectSystems.find(s => s.id === activeId) ?? projectSystems[0]

  return (
    <div className="relative w-full flex flex-col" style={{ gap: 'var(--sp-3)' }}>
      {/* Project selector */}
      <div className="flex flex-wrap" style={{ gap: 'var(--sp-1)' }}>
        {projectSystems.map(s => {
          const on = s.id === activeId
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveId(s.id)
                setHoveredPad(null)
                pulseRef.current.clear()
                traceFrontRef.current.clear()
              }}
              className="flex items-center rounded-sm"
              style={{
                gap:        '8px',
                padding:    '8px 14px',
                background: on ? 'rgba(99,179,237,0.08)' : 'rgba(6,10,8,0.9)',
                border:     `1px solid ${on ? 'rgba(99,179,237,0.35)' : 'rgba(80,120,80,0.3)'}`,
                color:      on ? 'var(--text-0)' : 'var(--text-2)',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-sans)',
                fontSize:   '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
              data-hover="true"
            >
              {on && <span style={{ width: 5, height: 5, background: '#63b3ed', display: 'inline-block', transform: 'rotate(45deg)', boxShadow: '0 0 5px #63b3ed' }} />}
              {s.name}
            </button>
          )
        })}
      </div>

      {/* Board */}
      <div style={{ position: 'relative', border: '1px solid rgba(80,120,80,0.25)', borderRadius: '3px', overflow: 'hidden' }}>
        {/* PCB edge marking */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          boxShadow: 'inset 0 0 0 2px rgba(80,120,80,0.15)',
          borderRadius: '3px',
        }} />

        <canvas
          ref={canvasRef}
          width={size.w}
          height={size.h}
          className="w-full block"
          style={{ cursor: 'none', display: 'block' }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          aria-label={`Circuit board — ${currentSystem.name} architecture`}
          role="img"
        />

        {/* Corner fiducials — PCB registration marks */}
        {[
          { top: 8, left: 8 }, { top: 8, right: 8 },
          { bottom: 8, left: 8 }, { bottom: 8, right: 8 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos,
            width: 12, height: 12,
            border: '1px solid rgba(80,120,80,0.25)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 3, height: 3,
              background: 'rgba(80,120,80,0.35)',
              borderRadius: '50%',
            }} />
          </div>
        ))}

        {/* Board label */}
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontFamily: 'var(--font-sans)',
          fontSize: '0.625rem',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: 'rgba(80,120,80,0.3)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          {currentSystem.id.toUpperCase()} REV.A · BADER.OS
        </div>
      </div>

      {/* Trace legend */}
      <div className="flex flex-wrap" style={{ gap: '14px' }}>
        {(Object.entries(TRACE_COLOR) as [string, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center" style={{ gap: '7px' }}>
            <svg width="20" height="6" aria-hidden="true">
              <line x1="0" y1="3" x2="20" y2="3"
                stroke={color} strokeWidth="1.5"
                strokeDasharray={type === 'async' ? '4 3' : type === 'event' ? '2 2' : ''}
              />
            </svg>
            <span className="t-system" style={{ color: 'rgba(120,160,120,0.7)' }}>{type}</span>
          </div>
        ))}
        <span className="t-system" style={{ color: 'var(--text-3)', marginLeft: 'auto' }}>
          hover a pad to fire a signal
        </span>
      </div>
    </div>
  )
}
