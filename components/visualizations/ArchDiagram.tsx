'use client'

import { useEffect, useRef, useState } from 'react'
import { type ProjectSystem } from '@/lib/content'

interface Props { system: ProjectSystem }

const STATUS_COLOR = { running: '#48bb78', idle: '#63b3ed', pending: '#f6ad55' }
const EDGE_STYLE = {
  sync:  { dash: [],      color: '#63b3edaa', label: 'sync'  },
  async: { dash: [6, 4],  color: '#9f7aeaaa', label: 'async' },
  event: { dash: [3, 3],  color: '#f6ad55aa', label: 'event' },
  data:  { dash: [8, 3],  color: '#68d391aa', label: 'data'  },
}

// Assign positions based on semantic role
// Nodes are placed in logical layers: client → gateway/auth → services → infra
function computeLayeredPositions(
  nodes: ProjectSystem['nodes'],
  w: number,
  h: number
): Record<string, { x: number; y: number }> {
  // Heuristic layers by id patterns
  const getLayer = (id: string): number => {
    if (/client|webapp|web|ui/.test(id))              return 0  // presentation
    if (/gateway|cdn/.test(id))                        return 1  // gateway
    if (/auth|session/.test(id))                       return 2  // auth
    if (/employee|payroll|leave|api|cache/.test(id))   return 3  // domain
    if (/queue|stripe|prisma/.test(id))                return 4  // middleware
    if (/db|pg|oracle|mongo|redis|notify/.test(id))    return 5  // persistence
    if (/docker|nginx|vercel/.test(id))                return 6  // infra
    return 3  // default: domain layer
  }

  // Group by layer
  const layers: string[][] = [[], [], [], [], [], [], []]
  nodes.forEach(n => layers[getLayer(n.id)].push(n.id))

  // Remove empty layers and re-index
  const activeLayers = layers.filter(l => l.length > 0)
  const layerCount   = activeLayers.length
  const padY         = 56
  const rowH         = (h - padY * 2) / Math.max(layerCount - 1, 1)

  const pos: Record<string, { x: number; y: number }> = {}
  activeLayers.forEach((layer, li) => {
    const y     = padY + li * rowH
    const padX  = 60
    const slotW = (w - padX * 2) / Math.max(layer.length, 1)
    layer.forEach((id, i) => {
      pos[id] = {
        x: padX + i * slotW + slotW / 2,
        y,
      }
    })
  })
  return pos
}

export default function ArchDiagram({ system }: Props) {
  const svgRef  = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [size,  setSize]  = useState({ w: 760, h: 460 })

  useEffect(() => {
    const el = svgRef.current?.parentElement
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width
      setSize({ w, h: Math.max(380, Math.min(520, w * 0.6)) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const positions  = computeLayeredPositions(system.nodes, size.w, size.h)

  const connectedTo: string[] = hover
    ? system.edges
        .filter(e => e.from === hover || e.to === hover)
        .flatMap(e => [e.from, e.to])
        .filter(id => id !== hover)
    : []

  const NODE_W = 108, NODE_H = 44

  return (
    <div
      className="relative w-full rounded-sm overflow-hidden"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--wire)' }}
    >
      <svg
        ref={svgRef}
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        className="w-full block"
        aria-label={`${system.name} architecture diagram`}
        role="img"
      >
        <defs>
          <pattern id={`ag-${system.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0L0 0 0 24" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
          </pattern>
          <marker id={`arr-${system.id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="rgba(99,179,237,0.5)"/>
          </marker>
        </defs>

        {/* Grid */}
        <rect width={size.w} height={size.h} fill={`url(#ag-${system.id})`} />

        {/* Edges */}
        {system.edges.map((edge, i) => {
          const fpos = positions[edge.from]
          const tpos = positions[edge.to]
          if (!fpos || !tpos) return null

          const isHov = hover === edge.from || hover === edge.to
          const dim   = hover !== null && !isHov
          const style = EDGE_STYLE[edge.type]

          // Control point for quadratic curve
          const mx  = (fpos.x + tpos.x) / 2
          const my  = (fpos.y + tpos.y) / 2 - Math.abs(tpos.x - fpos.x) * 0.15
          const d   = `M ${fpos.x} ${fpos.y} Q ${mx} ${my} ${tpos.x} ${tpos.y}`

          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={dim ? 'rgba(255,255,255,0.02)' : style.color}
                strokeWidth={isHov ? 1.5 : 0.9}
                strokeDasharray={style.dash.join(',')}
                markerEnd={`url(#arr-${system.id})`}
                style={(isHov && !dim ? { animation: 'flowDash 1.8s linear infinite' } : {}) as React.CSSProperties}
              />
              {isHov && edge.label && (
                <text
                  x={mx} y={my - 7}
                  textAnchor="middle"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fill: style.color, opacity: 0.95 }}
                >
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {system.nodes.map(node => {
          const pos    = positions[node.id]
          if (!pos) return null
          const color  = node.color ?? '#63b3ed'
          const isHov  = hover === node.id
          const isConn = connectedTo.includes(node.id)
          const dim    = hover !== null && !isHov && !isConn

          return (
            <g
              key={node.id}
              transform={`translate(${pos.x - NODE_W / 2}, ${pos.y - NODE_H / 2})`}
              onMouseEnter={() => setHover(node.id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'none' }}
            >
              {/* Glow ring */}
              {isHov && (
                <rect
                  x="-5" y="-5" width={NODE_W + 10} height={NODE_H + 10}
                  rx="5"
                  fill={color + '14'}
                  stroke={color + '44'}
                  strokeWidth="1"
                />
              )}
              {/* Box */}
              <rect
                width={NODE_W} height={NODE_H} rx="3"
                fill={dim ? 'rgba(255,255,255,0.02)' : isHov ? color + '20' : 'rgba(255,255,255,0.05)'}
                stroke={isHov ? color : isConn ? color + '70' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isHov ? 1.5 : 0.8}
              />
              {/* Status dot */}
              <circle
                cx="10" cy="10" r="3"
                fill={STATUS_COLOR[node.status]}
                opacity={dim ? 0.15 : 0.9}
              />
              {/* Service name */}
              <text
                x={NODE_W / 2} y={NODE_H / 2 - 3}
                textAnchor="middle"
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '9px',
                  fontWeight:    '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fill: dim ? 'rgba(255,255,255,0.12)' : isHov ? '#fff' : 'rgba(255,255,255,0.8)',
                }}
              >
                {node.label.length > 13 ? node.label.slice(0, 12) + '…' : node.label}
              </text>
              {/* Role */}
              <text
                x={NODE_W / 2} y={NODE_H / 2 + 10}
                textAnchor="middle"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize:   '7.5px',
                  fill: dim ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.28)',
                }}
              >
                {node.role}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div
        className="flex flex-wrap"
        style={{
          gap:        '16px',
          padding:    '10px 16px',
          borderTop:  '1px solid var(--wire)',
          background: 'rgba(5,5,10,0.4)',
        }}
      >
        {Object.entries(EDGE_STYLE).map(([type, style]) => (
          <div key={type} className="flex items-center" style={{ gap: '6px' }}>
            <svg width="20" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="20" y2="4" stroke={style.color} strokeWidth="1.2" strokeDasharray={style.dash.join(',')}/>
            </svg>
            <span className="t-system">{type}</span>
          </div>
        ))}
        <span className="t-system" style={{ color: 'var(--text-3)', marginLeft: 'auto' }}>
          hover to trace data flow
        </span>
      </div>
    </div>
  )
}
