'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { knowledgeNodes, type KnowledgeNode } from '@/lib/content'

type Point = { x: number; y: number }
type GraphEdge = { id: string; from: string; to: string; color: string; index: number }

const CATEGORY_TONES: Record<KnowledgeNode['category'], string> = {
  language: '#c6f36b',
  framework: '#a9c5b4',
  database: '#8cb6ac',
  devops: '#bac4bd',
  concept: '#b2a6c4',
  tool: '#d0dacd',
}

const PROJECT_NAMES: Record<string, string> = {
  atlashr: 'AtlasHR',
  'onee-sys': 'ONEE-SYS',
  homely: 'Homely',
  innovex: 'Innovex',
}

// Fixed normalized coordinates preserve the composition at every size.
const DESKTOP_LAYOUT: Record<string, Point> = {
  javascript: { x: 0.09, y: 0.43 }, python: { x: 0.08, y: 0.73 }, c: { x: 0.15, y: 0.9 },
  typescript: { x: 0.3, y: 0.33 }, java: { x: 0.27, y: 0.59 }, php: { x: 0.28, y: 0.82 }, sql: { x: 0.45, y: 0.88 },
  react: { x: 0.43, y: 0.19 }, nextjs: { x: 0.56, y: 0.28 }, springboot: { x: 0.43, y: 0.57 },
  laravel: { x: 0.48, y: 0.77 }, tailwind: { x: 0.59, y: 0.44 },
  postgresql: { x: 0.66, y: 0.61 }, mysql: { x: 0.71, y: 0.81 }, sqlite: { x: 0.86, y: 0.8 },
  mongodb: { x: 0.81, y: 0.13 }, oracle: { x: 0.79, y: 0.3 }, prisma: { x: 0.7, y: 0.2 },
  docker: { x: 0.84, y: 0.57 }, rabbitmq: { x: 0.91, y: 0.43 }, jwt: { x: 0.59, y: 0.74 },
  vercel: { x: 0.94, y: 0.15 }, git: { x: 0.92, y: 0.91 }, rest: { x: 0.67, y: 0.91 },
}

const categoryOrder: KnowledgeNode['category'][] = ['language', 'framework', 'database', 'devops', 'concept', 'tool']
const categoryRank = new Map(categoryOrder.map((category, index) => [category, index]))
const nodeIds = new Set(knowledgeNodes.map(node => node.id))
const safeNodes = knowledgeNodes.map(node => ({
  ...node,
  connections: [...new Set(node.connections.filter(id => nodeIds.has(id)))],
}))
const nodeById = new Map(safeNodes.map(node => [node.id, node]))

const edgeMap = new Map<string, Omit<GraphEdge, 'index'>>()
for (const node of safeNodes) {
  for (const targetId of node.connections) {
    const target = nodeById.get(targetId)
    if (!target || target.id === node.id) continue
    const [from, to] = [node.id, target.id].sort()
    const id = `${from}:${to}`
    const fromNode = nodeById.get(from)!
    const toNode = nodeById.get(to)!
    const colorOwner = (categoryRank.get(fromNode.category) ?? 0) <= (categoryRank.get(toNode.category) ?? 0)
      ? fromNode
      : toNode
    edgeMap.set(id, { id, from, to, color: CATEGORY_TONES[colorOwner.category] })
  }
}
const edges: GraphEdge[] = [...edgeMap.values()]
  .sort((a, b) => a.id.localeCompare(b.id))
  .map((edge, index) => ({ ...edge, index }))

const neighborsById = new Map(safeNodes.map(node => [node.id, new Set<string>()]))
for (const edge of edges) {
  neighborsById.get(edge.from)?.add(edge.to)
  neighborsById.get(edge.to)?.add(edge.from)
}
const categories = [...new Set(safeNodes.map(node => node.category))]

function nodePosition(nodeId: string, index: number, width: number, height: number, compact: boolean): Point {
  if (compact) {
    const columns = 4
    const column = index % columns
    const row = Math.floor(index / columns)
    const rows = Math.ceil(safeNodes.length / columns)
    return {
      x: width * ((column + 0.5) / columns),
      y: height * (0.34 + row * (0.5 / Math.max(rows - 1, 1))),
    }
  }

  const point = DESKTOP_LAYOUT[nodeId] ?? { x: 0.5, y: 0.5 }
  return { x: point.x * width, y: point.y * height }
}

function edgePath(from: Point, to: Point, index: number): string {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy) || 1
  const normalX = -dy / distance
  const normalY = dx / distance
  const side = index % 2 === 0 ? -1 : 1
  const bend = side * Math.min(82, 22 + distance * (index % 3 === 0 ? 0.2 : 0.13))
  const along = Math.min(0.38, 0.25 + (index % 4) * 0.025)
  const control1 = {
    x: from.x + dx * along + normalX * bend,
    y: from.y + dy * along + normalY * bend,
  }
  const control2 = {
    x: to.x - dx * along + normalX * bend,
    y: to.y - dy * along + normalY * bend,
  }
  return `M ${from.x} ${from.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${to.x} ${to.y}`
}

function diamondPoints(center: Point, radius: number): string {
  return `${center.x},${center.y - radius} ${center.x + radius},${center.y} ${center.x},${center.y + radius} ${center.x - radius},${center.y}`
}

export default function KnowledgeGraph() {
  const frameRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const selectedRef = useRef<string | null>(null)
  const hoverClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [size, setSize] = useState({ width: 1000, height: 620 })
  const [compact, setCompact] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const activeNode = nodeById.get(activeId ?? '') ?? null
  const positionById = useMemo(() => new Map(safeNodes.map((node, index) => [
    node.id,
    nodePosition(node.id, index, size.width, size.height, compact),
  ])), [size, compact])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width <= 0 || height <= 0) return
      setSize(previous => previous.width === width && previous.height === height ? previous : { width, height })
      setCompact(width < 640)
    })
    resizeObserver.observe(frame)

    const visibilityObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 })
    visibilityObserver.observe(frame)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const onMotionChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    motionQuery.addEventListener('change', onMotionChange)
    const onVisibilityChange = () => {
      const bounds = frame.getBoundingClientRect()
      setVisible(!document.hidden && bounds.top < window.innerHeight && bounds.bottom > 0)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (hoverClearTimerRef.current !== null) clearTimeout(hoverClearTimerRef.current)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const selectNode = useCallback((id: string) => {
    const next = selectedRef.current === id ? null : id
    selectedRef.current = next
    setSelectedId(next)
    setActiveId(next)
  }, [])

  const clearSelection = useCallback(() => {
    if (hoverClearTimerRef.current !== null) clearTimeout(hoverClearTimerRef.current)
    hoverClearTimerRef.current = null
    selectedRef.current = null
    setSelectedId(null)
    setActiveId(null)
  }, [])

  const activateHover = (id: string) => {
    if (hoverClearTimerRef.current !== null) clearTimeout(hoverClearTimerRef.current)
    hoverClearTimerRef.current = null
    setActiveId(id)
  }

  const clearHover = () => {
    if (hoverClearTimerRef.current !== null) clearTimeout(hoverClearTimerRef.current)
    hoverClearTimerRef.current = setTimeout(() => {
      setActiveId(selectedRef.current)
      hoverClearTimerRef.current = null
    }, 140)
  }

  const animationActive = visible && !reducedMotion

  return (
    <div className="pt-2">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(230px,270px)] items-start gap-editorial-gap max-tablet:grid-cols-1">
        <div className="min-w-0">
          <div className="relative aspect-[20/13] w-full overflow-hidden bg-background-soft max-mobile:h-[clamp(520px,145vw,700px)] max-mobile:aspect-auto" ref={frameRef}>
            <svg
          className="knowledge-graph-svg absolute inset-0 block size-full overflow-visible"
          viewBox={`0 0 ${size.width} ${size.height}`}
          role="group"
          aria-label="Interactive technology relationship graph"
        >
          <g className="[fill:none]" aria-hidden="true">
            {edges.map(edge => {
              if (!activeId || (edge.from !== activeId && edge.to !== activeId)) return null
              const from = positionById.get(edge.from)
              const to = positionById.get(edge.to)
              if (!from || !to) return null
              const forward = edge.from === activeId
              const source = forward ? from : to
              const destination = forward ? to : from
              const path = edgePath(source, destination, edge.index)
              return (
                <g key={`${edge.id}:${activeId}`} className={`knowledge-edge${animationActive ? ' is-animating' : ''}${reducedMotion ? ' is-static' : ''}`}>
                  <path className="knowledge-edge-flow" d={path} pathLength="1" stroke={edge.color} />
                  {animationActive && !reducedMotion && (
                    <circle className="knowledge-edge-head" r="2.5" fill={edge.color}>
                      <animateMotion dur="900ms" path={path} fill="freeze" />
                      <animate attributeName="opacity" dur="900ms" values="1;1;0" keyTimes="0;0.82;1" fill="freeze" />
                    </circle>
                  )}
                </g>
              )
            })}
          </g>

          <g>
            {safeNodes.map((node, index) => {
              const center = positionById.get(node.id)
              if (!center) return null
              const radius = 7 + node.weight * 0.58
              const neighbors = neighborsById.get(node.id) ?? new Set<string>()
              const active = activeId
              const isActive = active === node.id
              const isConnected = active !== null && neighbors.has(active)
              const isDimmed = active !== null && !isActive && !isConnected
              const labelAbove = compact
                ? (Math.floor(index / 4) + index % 4) % 2 === 0
                : index % 2 === 0
              return (
                <g
                  key={node.id}
                  className={`knowledge-graph-node${isActive ? ' is-active' : ''}${isDimmed ? ' is-dimmed' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}, ${node.category}, ${node.connections.length} connections`}
                  aria-pressed={selectedId === node.id}
                  onPointerEnter={() => activateHover(node.id)}
                  onPointerLeave={clearHover}
                  onFocus={() => activateHover(node.id)}
                  onBlur={clearHover}
                  onClick={() => selectNode(node.id)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      selectNode(node.id)
                    }
                  }}
                >
                  <polygon
                    className="knowledge-graph-diamond"
                    points={diamondPoints(center, radius)}
                    stroke={CATEGORY_TONES[node.category]}
                  />
                  <text
                    className="knowledge-graph-label"
                    x={center.x}
                    y={center.y + (labelAbove ? -radius - 9 : radius + 15)}
                    textAnchor="middle"
                    dominantBaseline={labelAbove ? 'auto' : 'middle'}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </g>
            </svg>
          </div>

          <div className="mt-[14px] flex flex-wrap gap-x-[14px] gap-y-2 max-mobile:gap-x-[10px] max-mobile:gap-y-[7px]" aria-label="Technology categories">
            {categories.map(category => (
              <span className="inline-flex items-center gap-[6px] text-copy-secondary font-portfolio-code text-[.56rem] capitalize max-mobile:text-[.52rem]" key={category}>
                <i className="inline-block size-[7px] shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_TONES[category] }} />{category}
              </span>
            ))}
          </div>
          <p className="mt-3 mb-0 px-0 text-muted font-portfolio-code text-[.58rem] leading-[1.6] max-mobile:px-[2px]">Connections show technologies used together across projects.</p>
        </div>

        <aside
          ref={panelRef}
          className="w-full min-w-0 border-l border-border-subtle pl-editorial-gap max-tablet:border-l-0 max-tablet:border-t max-tablet:pt-editorial-space max-tablet:pl-0"
          aria-live={selectedId !== null ? 'polite' : 'off'}
          aria-atomic="true"
          aria-label="Technology details"
          onPointerEnter={() => {
            if (hoverClearTimerRef.current !== null) clearTimeout(hoverClearTimerRef.current)
            hoverClearTimerRef.current = null
          }}
          onPointerLeave={clearHover}
          onFocus={() => {
            if (hoverClearTimerRef.current !== null) clearTimeout(hoverClearTimerRef.current)
            hoverClearTimerRef.current = null
          }}
          onBlur={clearHover}
        >
          {activeNode ? (
            <>
              <div className="flex items-center gap-2 text-accent font-portfolio-code text-[.58rem] tracking-[.08em] uppercase">
                <span className="size-[7px] shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_TONES[activeNode.category] }} />
                <span>{activeNode.category}</span>
              </div>
              <h3 className="mt-[10px] mb-1 text-foreground font-portfolio-display text-[1.12rem] font-medium tracking-[-.035em] leading-[1.2] max-mobile:text-[.95rem]">{activeNode.label}</h3>
              <p className="m-0 text-muted font-portfolio-code text-[.6rem]">Used since {activeNode.since}</p>
              {activeNode.projects.length > 0 && (
                <div className="mt-3 grid gap-[5px] text-muted font-portfolio-code text-[.58rem] uppercase">
                  <span>Used in</span>
                  <ul className="m-0 flex list-none flex-wrap gap-x-[10px] gap-y-1 p-0 text-copy-secondary font-portfolio-body text-[.68rem] normal-case max-mobile:gap-x-[7px] max-mobile:gap-y-[3px]">{activeNode.projects.map(id => <li key={id}>{PROJECT_NAMES[id] ?? id}</li>)}</ul>
                </div>
              )}
              <p className="mt-3 mb-0 text-muted font-portfolio-code text-[.6rem]">{activeNode.connections.length} connections</p>
              <button className="my-[5px] -mb-[5px] min-h-9 cursor-pointer border-0 bg-transparent p-0 text-accent text-[.65rem] underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[3px]" type="button" onClick={clearSelection}>Clear selection</button>
            </>
          ) : (
            <p className="m-0 text-muted font-portfolio-code text-[.66rem] leading-[1.7]">Hover, focus, or select a diamond to inspect a technology.</p>
          )}
        </aside>
      </div>
      <div className="h-editorial-space" aria-hidden="true" />
      <details className="mx-auto w-full max-w-[980px]">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-copy-secondary text-[.82rem] tracking-[.04em] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[3px] border-y border-muted px-4">Browse technologies with keyboard <span className='text-accent'>+</span></summary>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-4 gap-y-1 p-0 py-4">
          {safeNodes.map(node => (
          <li key={node.id}>
            <button className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 border border-border-subtle bg-transparent px-2 py-1.25 text-left text-sm! text-copy-secondary hover:border-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[3px] aria-pressed:border-accent aria-pressed:text-foreground" type="button" aria-pressed={selectedId === node.id} onClick={() => selectNode(node.id)}>
              {node.label}<span className="text-muted font-portfolio-code text-[.55rem] capitalize">{node.category}</span>
            </button>
          </li>
        ))}</ul>
      </details>
    </div>
  )
}
