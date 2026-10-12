'use client'

/**
 * TECH MAP — L03 / KNOWLEDGE
 *
 * Stable, deterministic node layout. Positions never change.
 * Hover reveals connections via animated paths and fades unrelated nodes.
 * The mental map is always preserved. Nothing wanders.
 *
 * Layout: category lanes arranged in a loose grid, heavier nodes
 * placed nearer the center of their lane. Positions are computed once
 * from a deterministic seed and never updated again.
 *
 * Interaction:
 *   Idle   — all nodes visible at resting opacity; no movement
 *   Hover  — hovered node brightens, connected nodes highlight,
 *             edges draw as animated curved paths, rest dims to 15%
 *   Leave  — CSS transition returns all nodes to resting state
 */

import { useEffect, useRef, useState, useMemo } from 'react'
import { knowledgeNodes, type KnowledgeNode } from '@/lib/content'

/* ─── colors ─────────────────────────────────────────────────────────── */
const CAT_COLOR: Record<string, string> = {
  language:  '#f6ad55',
  framework: '#63b3ed',
  database:  '#9f7aea',
  devops:    '#68d391',
  concept:   '#fc8181',
  tool:      '#76e4f7',
}

/* ─── deterministic layout ───────────────────────────────────────────── */
function seed(n: number) {
  const x = Math.sin(n + 1.618) * 10000
  return x - Math.floor(x)
}

interface NodeLayout extends KnowledgeNode {
  x: number
  y: number
  r: number
}

function buildLayout(nodes: KnowledgeNode[], W: number, H: number): NodeLayout[] {
  // Place categories in defined screen regions — never symmetric, never centered
  const REGIONS: Record<string, { cx: number; cy: number; spread: number }> = {
    framework: { cx: 0.38, cy: 0.38, spread: 0.18 },
    language:  { cx: 0.62, cy: 0.30, spread: 0.20 },
    database:  { cx: 0.62, cy: 0.68, spread: 0.17 },
    devops:    { cx: 0.28, cy: 0.70, spread: 0.16 },
    concept:   { cx: 0.50, cy: 0.54, spread: 0.13 },
    tool:      { cx: 0.78, cy: 0.50, spread: 0.14 },
  }

  const catGroups: Record<string, KnowledgeNode[]> = {}
  nodes.forEach(n => {
    if (!catGroups[n.category]) catGroups[n.category] = []
    catGroups[n.category].push(n)
  })

  const result: NodeLayout[] = []

  Object.entries(catGroups).forEach(([cat, catNodes]) => {
    const region = REGIONS[cat] ?? { cx: 0.5, cy: 0.5, spread: 0.2 }

    // Sort by weight desc — heavier nodes get center slots
    const sorted = [...catNodes].sort((a, b) => b.weight - a.weight)

    sorted.forEach((node, i) => {
      const total = sorted.length
      // Evenly space around region center with deterministic jitter
      const angle = (i / total) * Math.PI * 2 + seed(node.id.charCodeAt(0) + i) * 0.8
      const dist  = region.spread * Math.min(W, H) * (0.3 + seed(i * 7 + node.id.length) * 0.7)
      const jx    = (seed(i * 3 + 1) - 0.5) * 0.04 * W
      const jy    = (seed(i * 5 + 2) - 0.5) * 0.04 * H

      result.push({
        ...node,
        x: region.cx * W + Math.cos(angle) * dist + jx,
        y: region.cy * H + Math.sin(angle) * dist * 0.75 + jy,
        r: 3.5 + node.weight * 1.05,
      })
    })
  })

  return result
}

/* ─── edge path — smooth cubic bezier ───────────────────────────────── */
function edgePath(ax: number, ay: number, bx: number, by: number): string {
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const cx1 = ax + (mx - ax) * 0.6 + (by - ay) * 0.12
  const cy1 = ay + (my - ay) * 0.6 - (bx - ax) * 0.12
  const cx2 = bx - (bx - mx) * 0.6 + (by - ay) * 0.12
  const cy2 = by - (by - my) * 0.6 - (bx - ax) * 0.12
  return `M ${ax} ${ay} C ${cx1} ${cy1} ${cx2} ${cy2} ${bx} ${by}`
}

/* ─── animated edge path component ──────────────────────────────────── */
function AnimEdge({ d, color, delay }: { d: string; color: string; delay: number }) {
  const ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const len = el.getTotalLength()
    el.style.strokeDasharray  = `${len}`
    el.style.strokeDashoffset = `${len}`
    el.style.transition       = 'none'
    // Force reflow then animate
    void el.getBoundingClientRect()
    el.style.transition       = `stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`
    el.style.strokeDashoffset = '0'

    return () => {
      el.style.transition = 'none'
    }
  }, [d, delay])

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity={0.7}
    />
  )
}

/* ─── component ─────────────────────────────────────────────────────── */
export default function TechMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize]       = useState({ w: 800, h: 500 })
  const [hovered, setHovered] = useState<string | null>(null)

  /* resize — update size, never reinit positions */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      const h = Math.max(440, Math.round(w * 0.60))
      setSize({ w, h })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* layout is derived from size + node data — always deterministic */
  const nodes = useMemo(() => buildLayout(knowledgeNodes, size.w, size.h), [size])

  const hovNode    = hovered ? nodes.find(n => n.id === hovered) : null
  const connIds    = useMemo(() => {
    if (!hovNode) return new Set<string>()
    return new Set([
      hovNode.id,
      ...hovNode.connections,
      // also nodes that connect TO this one
      ...nodes.filter(n => n.connections.includes(hovNode.id)).map(n => n.id),
    ])
  }, [hovNode, nodes])

  /* edges to draw when hovering */
  const activeEdges = useMemo(() => {
    if (!hovNode) return []
    const edges: { d: string; color: string; delay: number; key: string }[] = []
    let i = 0

    hovNode.connections.forEach(cid => {
      const cn = nodes.find(n => n.id === cid)
      if (!cn) return
      edges.push({
        key:   `${hovNode.id}→${cid}`,
        d:     edgePath(hovNode.x, hovNode.y, cn.x, cn.y),
        color: CAT_COLOR[hovNode.category] ?? '#63b3ed',
        delay: i++ * 0.055,
      })
    })
    // Reverse edges — nodes that connect to hovered
    nodes.forEach(n => {
      if (n.connections.includes(hovNode.id) && n.id !== hovNode.id) {
        edges.push({
          key:   `${n.id}→${hovNode.id}`,
          d:     edgePath(n.x, n.y, hovNode.x, hovNode.y),
          color: CAT_COLOR[n.category] ?? '#63b3ed',
          delay: i++ * 0.055,
        })
      }
    })
    return edges
  }, [hovNode, nodes])

  /* resting edges — always visible at low opacity, never drawn during hover */
  const restingEdges = useMemo(() => {
    const seen = new Set<string>()
    const result: { d: string; color: string; key: string }[] = []
    nodes.forEach(a => {
      a.connections.forEach(bid => {
        const key = [a.id, bid].sort().join('|')
        if (seen.has(key)) return
        seen.add(key)
        const b = nodes.find(n => n.id === bid)
        if (!b) return
        result.push({
          key,
          d:     edgePath(a.x, a.y, b.x, b.y),
          color: CAT_COLOR[a.category] ?? '#63b3ed',
        })
      })
    })
    return result
  }, [nodes])

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        background: 'var(--surface-1)',
        border:     '1px solid var(--wire)',
        borderRadius: '2px',
        overflow:   'hidden',
      }}
    >
      <svg
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        className="w-full block"
        style={{ cursor: 'none' }}
        aria-label="Technology map"
        role="img"
      >
        {/* Fine dot grid */}
        <defs>
          <pattern id="tmgrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="0" cy="0" r="0.6" fill="rgba(99,179,237,0.07)" />
          </pattern>
          {/* Glow filter for hovered node */}
          <filter id="tmglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={size.w} height={size.h} fill="url(#tmgrid)" />

        {/* Resting edges — always present, very dim */}
        <g opacity={hovered ? 0 : 1} style={{ transition: 'opacity 0.3s ease' }}>
          {restingEdges.map(e => (
            <path key={e.key} d={e.d} fill="none" stroke={e.color} strokeWidth="0.7" opacity="0.08" />
          ))}
        </g>

        {/* Active animated edges — only during hover */}
        {hovered && (
          <g>
            {activeEdges.map(e => (
              <AnimEdge key={e.key + hovered} d={e.d} color={e.color} delay={e.delay} />
            ))}
          </g>
        )}

        {/* Nodes */}
        {nodes.map(node => {
          const color   = CAT_COLOR[node.category] ?? '#888'
          const isSelf  = node.id === hovered
          const isConn  = hovered ? connIds.has(node.id) : false
          const isDim   = hovered !== null && !isSelf && !isConn

          const opacity = isDim ? 0.12 : 1
          const scale   = isSelf ? 1.5 : 1

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              style={{
                cursor:     'none',
                transition: 'opacity 0.25s ease',
                opacity,
              }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Glow ring — only self */}
              {isSelf && (
                <circle
                  r={node.r * 2.8}
                  fill={color + '18'}
                  style={{ transition: 'r 0.3s ease' }}
                />
              )}

              {/* Outer pulse ring */}
              <circle
                r={node.r + (isSelf ? 5 : isConn ? 3 : 0)}
                fill="none"
                stroke={color}
                strokeWidth="0.8"
                opacity={isSelf ? 0.5 : isConn ? 0.3 : 0.15}
                style={{ transition: 'all 0.25s ease' }}
              />

              {/* Core node — diamond */}
              <rect
                x={-node.r * 0.75 * scale}
                y={-node.r * 0.75 * scale}
                width={node.r * 1.5 * scale}
                height={node.r * 1.5 * scale}
                rx="1.5"
                fill={isSelf ? color : isConn ? color + 'cc' : color + '70'}
                style={{
                  transform: 'rotate(45deg)',
                  transition: 'all 0.25s ease',
                }}
                filter={isSelf ? 'url(#tmglow)' : undefined}
              />

              {/* Label */}
              {(isSelf || isConn || (!hovered && node.weight >= 8)) && (
                <text
                  y={node.r + 13}
                  textAnchor="middle"
                  style={{
                    fontFamily:    'var(--font-code)',
                    fontSize:      isSelf ? '10px' : '8.5px',
                    fontWeight:    isSelf ? 600 : 400,
                    fill:          isSelf ? '#fff' : color + 'cc',
                    letterSpacing: '0.06em',
                    transition:    'all 0.25s ease',
                    userSelect:    'none',
                  }}
                >
                  {node.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Info panel — fixed position, never overlaps canvas */}
      <div
        className="absolute glass rounded-sm"
        style={{
          top:     'var(--sp-3)',
          left:    'var(--sp-3)',
          width:   '192px',
          padding: 'var(--sp-2)',
          opacity:   hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {hovNode && (() => {
          const color = CAT_COLOR[hovNode.category] ?? '#63b3ed'
          const allConns = [
            ...hovNode.connections,
            ...nodes.filter(n => n.connections.includes(hovNode.id) && n.id !== hovNode.id).map(n => n.id),
          ]
          return (
            <>
              <div className="flex items-center" style={{ gap: '6px', marginBottom: '8px' }}>
                <span style={{
                  width: 6, height: 6, background: color, display: 'inline-block',
                  transform: 'rotate(45deg)', borderRadius: '1px',
                  boxShadow: `0 0 5px ${color}`,
                }} />
                <span className="t-label" style={{ color }}>{hovNode.category}</span>
              </div>

              <div
                className="font-light"
                style={{ fontSize: 'var(--text-md)', color: 'var(--text-0)', marginBottom: '4px', letterSpacing: '-0.01em' }}
              >
                {hovNode.label}
              </div>

              <div className="t-system" style={{ color: 'var(--text-3)', marginBottom: '8px' }}>
                since {hovNode.since}
              </div>

              {hovNode.projects.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <div className="t-system" style={{ color: 'var(--text-3)', marginBottom: '3px' }}>used in</div>
                  {hovNode.projects.map(p => (
                    <div key={p} className="flex items-center" style={{ gap: '4px', marginBottom: '2px' }}>
                      <span style={{ width: 3, height: 3, background: color, borderRadius: '50%', flexShrink: 0 }} />
                      <span className="t-system" style={{ color }}>{p}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--wire)', paddingTop: '6px' }}>
                <span className="t-system" style={{ color: 'var(--text-3)' }}>
                  {allConns.length} connection{allConns.length !== 1 ? 's' : ''}
                </span>
              </div>
            </>
          )
        })()}
      </div>

      {/* Legend */}
      <div
        className="absolute flex flex-wrap"
        style={{ bottom: 'var(--sp-2)', right: 'var(--sp-2)', gap: '10px', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {Object.entries(CAT_COLOR).map(([cat, color]) => (
          <div key={cat} className="flex items-center" style={{ gap: '5px' }}>
            <span style={{
              width: 5, height: 5, background: color,
              display: 'inline-block', transform: 'rotate(45deg)', borderRadius: '1px', opacity: 0.8,
            }} />
            <span className="t-system" style={{ color: 'var(--text-3)' }}>{cat}</span>
          </div>
        ))}
      </div>

      <div
        className="absolute t-system"
        style={{ bottom: 'var(--sp-2)', left: 'var(--sp-3)', color: 'var(--text-3)', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        hover to explore connections
      </div>
    </div>
  )
}
