'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { knowledgeNodes, type KnowledgeNode } from '@/lib/content'

interface NodePos extends KnowledgeNode {
  x: number
  y: number
  vx: number
  vy: number
}

interface ActiveInfo {
  node:      KnowledgeNode
  connected: string[]
}

const CATEGORY_COLOR: Record<string, string> = {
  language:  '#f6ad55',
  framework: '#63b3ed',
  database:  '#9f7aea',
  devops:    '#68d391',
  concept:   '#fc8181',
  tool:      '#76e4f7',
}

export default function KnowledgeGraph() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const nodesRef   = useRef<NodePos[]>([])
  const mouseRef   = useRef({ x: -999, y: -999 })
  const [active, setActive] = useState<ActiveInfo | null>(null)
  const [size, setSize]     = useState({ w: 800, h: 560 })

  // Init nodes with random positions + force-directed layout
  const initNodes = useCallback((w: number, h: number) => {
    const nodes: NodePos[] = knowledgeNodes.map((n) => ({
      ...n,
      x:  w * 0.1 + Math.random() * w * 0.8,
      y:  h * 0.1 + Math.random() * h * 0.8,
      vx: 0,
      vy: 0,
    }))
    nodesRef.current = nodes
  }, [])

  useEffect(() => {
    const container = canvasRef.current?.parentElement
    if (!container) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      const h = Math.max(480, w * 0.65)
      setSize({ w, h })
      if (canvasRef.current) {
        canvasRef.current.width  = w
        canvasRef.current.height = h
      }
      initNodes(w, h)
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [initNodes])

  useEffect(() => {
    initNodes(size.w, size.h)
  }, [size, initNodes])

  // Force simulation + rendering — gated by visibility
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let tick = 0
    let visible = true

    // Stop rendering when not visible (saves CPU/battery)
    const obsVis = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0 }
    )
    obsVis.observe(canvas)

    const getActive = (): string | null => {
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const nodes = nodesRef.current
      for (const n of nodes) {
        const r = 6 + n.weight * 1.2
        if (Math.hypot(n.x - mx, n.y - my) < r + 8) return n.id
      }
      return null
    }

    const draw = () => {
      if (!visible) {
        animFrame = requestAnimationFrame(draw)
        return
      }
      tick++
      const nodes = nodesRef.current
      const w = canvas.width
      const h = canvas.height

      // Force simulation (lite)
      if (tick < 300) {
        nodes.forEach((a) => {
          // repulsion
          nodes.forEach((b) => {
            if (a.id === b.id) return
            const dx = a.x - b.x, dy = a.y - b.y
            const d  = Math.max(Math.hypot(dx, dy), 1)
            const f  = Math.min(600 / (d * d), 1.5)
            a.vx += (dx / d) * f
            a.vy += (dy / d) * f
          })
          // attraction to connections
          a.connections.forEach((bid) => {
            const b = nodes.find(n => n.id === bid)
            if (!b) return
            const dx = b.x - a.x, dy = b.y - a.y
            const d  = Math.hypot(dx, dy)
            a.vx += (dx / d) * 0.5
            a.vy += (dy / d) * 0.5
          })
          // center gravity
          a.vx += (w / 2 - a.x) * 0.001
          a.vy += (h / 2 - a.y) * 0.001
          // damp
          a.vx *= 0.85
          a.vy *= 0.85
          a.x = Math.max(40, Math.min(w - 40, a.x + a.vx))
          a.y = Math.max(40, Math.min(h - 40, a.y + a.vy))
        })
      }

      // Clear
      ctx.clearRect(0, 0, w, h)

      const hoverId = getActive()

      // Draw edges
      nodes.forEach((a) => {
        a.connections.forEach((bid) => {
          const b = nodes.find(n => n.id === bid)
          if (!b) return
          const isHighlighted = hoverId === a.id || hoverId === b.id

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = isHighlighted
            ? CATEGORY_COLOR[a.category] + 'aa'
            : 'rgba(255,255,255,0.04)'
          ctx.lineWidth = isHighlighted ? 1.2 : 0.7

          if (!isHighlighted) {
            ctx.setLineDash([3, 5])
          } else {
            ctx.setLineDash([])
          }
          ctx.stroke()
          ctx.setLineDash([])
        })
      })

      // Draw nodes
      nodes.forEach((n) => {
        const r     = 4 + n.weight * 1.3
        const color = CATEGORY_COLOR[n.category] ?? '#888'
        const isHov = hoverId === n.id
        const isConn= hoverId !== null && (
          n.id === hoverId ||
          nodesRef.current.find(a => a.id === hoverId)?.connections.includes(n.id)
        )
        const dim   = hoverId !== null && !isConn

        // Glow
        if (isHov) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2)
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r + 12)
          grd.addColorStop(0,   color + '44')
          grd.addColorStop(1,   color + '00')
          ctx.fillStyle = grd
          ctx.fill()
        }

        // Node circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = isHov
          ? color
          : isConn
            ? color + 'cc'
            : dim
              ? 'rgba(255,255,255,0.06)'
              : color + '70'
        ctx.fill()

        // Label
        if (isHov || isConn || n.weight >= 9) {
          ctx.font = `${isHov ? 500 : 400} 10px var(--font-mono, monospace)`
          ctx.fillStyle = isHov ? '#fff' : dim ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)'
          ctx.textAlign = 'center'
          ctx.fillText(n.label, n.x, n.y - r - 5)
        }
      })

      // Update active state for panel — only when the hovered node actually changes
      const hNode = nodes.find(n => n.id === hoverId) ?? null
      setActive(prev => {
        if (hNode === null && prev === null) return prev
        if (hNode !== null && prev !== null && hNode.id === prev.node.id) return prev
        return hNode ? { node: hNode, connected: hNode.connections } : null
      })

      animFrame = requestAnimationFrame(draw)
    }

    animFrame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animFrame)
      obsVis.disconnect()
    }
  }, [size])

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const onMouseLeave = () => { mouseRef.current = { x: -999, y: -999 } }

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        className="w-full block rounded-sm"
        style={{ background: 'var(--surface-1)', cursor: 'none' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        aria-label="Interactive knowledge graph"
        role="img"
      />

      {/* Info panel */}
      <div
        className="absolute top-4 right-4 glass rounded-sm p-4 w-56 transition-all duration-300"
        style={{
          opacity:    active ? 1 : 0,
          transform:  active ? 'translateX(0)' : 'translateX(8px)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {active && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: CATEGORY_COLOR[active.node.category] ?? '#888' }}
              />
              <span className="t-label" style={{ color: CATEGORY_COLOR[active.node.category] }}>
                {active.node.category}
              </span>
            </div>
            <div className="text-sm font-light mb-2" style={{ color: 'var(--text-0)' }}>
              {active.node.label}
            </div>
            <div className="t-system mb-3">since {active.node.since}</div>
            {active.node.projects.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="t-system mb-1" style={{ color: 'var(--text-3)' }}>used in</div>
                {active.node.projects.map(p => (
                  <span key={p} className="t-system" style={{ color: 'var(--pulse)' }}>{p}</span>
                ))}
              </div>
            )}
            <div className="wire-h my-3" />
            <div className="t-system" style={{ color: 'var(--text-3)' }}>
              {active.connected.length} connections
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
        {Object.entries(CATEGORY_COLOR).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <span className="t-system">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
