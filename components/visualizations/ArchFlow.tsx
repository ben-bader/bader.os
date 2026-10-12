'use client'

/**
 * ARCH FLOW — L04 / SYSTEMS
 *
 * Horizontal left-to-right architecture diagram. Services are arranged
 * in semantic lanes (Client → Gateway → Auth → Services → Queue → DB → Infra).
 * Connections are cubic bezier curves with animated request packets.
 * Hovering a service highlights all its paths; clicking shows the
 * full request journey animated in sequence.
 *
 * Visual language: consistent with the portfolio — glass cards, var(--pulse)
 * blue, monospace labels, glow on active elements.
 */

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import { projectSystems, type ProjectSystem } from '@/lib/content'

/* ─── types ──────────────────────────────────────────────────────────── */
interface ServiceNode {
  id: string; label: string; role: string
  color: string; status: string
  col: number   // horizontal column (0 = leftmost)
  row: number   // vertical row within column
}

interface FlowEdge {
  from: string; to: string
  type: 'sync' | 'async' | 'event' | 'data'
  label?: string
}

interface NodeRect { x: number; y: number; w: number; h: number }

/* ─── column assignment ──────────────────────────────────────────────── */
const COL_RANK: [RegExp, number][] = [
  [/client|webapp|web(?!$)|ui/i,        0],
  [/gateway|cdn|proxy/i,                1],
  [/auth|session|jwt/i,                 2],
  [/employee|payroll|leave|api(?!$)/i,  3],
  [/queue|broker|rabbit|kafka/i,        4],
  [/orm|prisma/i,                       4],
  [/^db$|postgres|mysql|sqlite|mongo/i, 5],
  [/docker|vercel|nginx|infra/i,        6],
]

function getCol(id: string): number {
  for (const [re, col] of COL_RANK) {
    if (re.test(id)) return col
  }
  return 3
}

/* ─── colors ─────────────────────────────────────────────────────────── */
const EDGE_COLOR: Record<string, string> = {
  sync:  '#63b3ed',
  async: '#9f7aea',
  event: '#f6ad55',
  data:  '#68d391',
}

const EDGE_DASH: Record<string, string> = {
  sync:  '',
  async: '5,3',
  event: '2,3',
  data:  '8,3',
}

/* ─── layout builder ─────────────────────────────────────────────────── */
function buildFlow(
  system: ProjectSystem,
  W: number,
  H: number
): { nodes: ServiceNode[]; edges: FlowEdge[]; rects: Map<string, NodeRect> } {
  // Assign columns
  const colMap = new Map<string, number>()
  system.nodes.forEach(n => colMap.set(n.id, getCol(n.id)))

  // Group by column
  const cols = new Map<number, string[]>()
  system.nodes.forEach(n => {
    const c = colMap.get(n.id)!
    if (!cols.has(c)) cols.set(c, [])
    cols.get(c)!.push(n.id)
  })

  const usedCols = Array.from(cols.keys()).sort()
  const numCols  = usedCols.length

  const padX  = 24
  const nodeW = Math.min(108, (W - padX * 2 - (numCols - 1) * 20) / numCols)
  const nodeH = 52
  const colW  = (W - padX * 2) / numCols

  const nodes: ServiceNode[] = []
  const rects = new Map<string, NodeRect>()

  usedCols.forEach((col, ci) => {
    const ids = cols.get(col)!
    ids.forEach((id, ri) => {
      const sysNode = system.nodes.find(n => n.id === id)!
      const totalH  = ids.length * nodeH + (ids.length - 1) * 12
      const startY  = (H - totalH) / 2

      const x = padX + ci * colW + (colW - nodeW) / 2
      const y = startY + ri * (nodeH + 12)

      nodes.push({
        id, col, row: ri,
        label:  sysNode.label,
        role:   sysNode.role,
        color:  sysNode.color ?? '#63b3ed',
        status: sysNode.status,
      })
      rects.set(id, { x, y, w: nodeW, h: nodeH })
    })
  })

  const edges: FlowEdge[] = system.edges.map(e => ({
    from: e.from, to: e.to, type: e.type, label: e.label,
  }))

  return { nodes, edges, rects }
}

/* ─── bezier path between two rects ─────────────────────────────────── */
function flowPath(from: NodeRect, to: NodeRect): string {
  // Exit right-center, enter left-center for horizontal flow
  // If same column, exit bottom-center, enter top-center
  const fx = from.x + from.w, fy = from.y + from.h / 2
  const tx = to.x,            ty = to.y + to.h / 2

  if (Math.abs(fx - tx) > 20) {
    // Horizontal — cubic with horizontal control tangents
    const cx = (fx + tx) / 2
    return `M ${fx} ${fy} C ${cx} ${fy} ${cx} ${ty} ${tx} ${ty}`
  } else {
    // Same-column vertical connection
    const fby = from.y + from.h, tty = to.y
    const my  = (fby + tty) / 2
    return `M ${from.x + from.w / 2} ${fby} C ${from.x + from.w / 2} ${my} ${to.x + to.w / 2} ${my} ${to.x + to.w / 2} ${tty}`
  }
}

/* ─── packet animation along a path ─────────────────────────────────── */
function AnimPacket({
  pathD, color, duration, delay, repeat,
}: { pathD: string; color: string; duration: number; delay: number; repeat: boolean }) {
  const ref  = useRef<SVGCircleElement>(null)
  const pRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const circle = ref.current
    const path   = pRef.current
    if (!circle || !path) return

    let rafId: number
    let startTime: number | null = null
    const totalLen = path.getTotalLength()

    const animate = (ts: number) => {
      if (startTime === null) startTime = ts
      const elapsed = ts - startTime - delay * 1000
      if (elapsed < 0) { rafId = requestAnimationFrame(animate); return }

      const t = (elapsed % (duration * 1000)) / (duration * 1000)
      if (!repeat && elapsed > duration * 1000) {
        circle.style.opacity = '0'
        return
      }

      const pt = path.getPointAtLength(t * totalLen)
      circle.setAttribute('cx', String(pt.x))
      circle.setAttribute('cy', String(pt.y))
      circle.style.opacity = t > 0.95 ? String(1 - (t - 0.95) / 0.05) : '1'
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [pathD, duration, delay, repeat])

  return (
    <>
      <path ref={pRef} d={pathD} fill="none" stroke="none" />
      <circle ref={ref} r="3" fill={color} opacity="0"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </>
  )
}

/* ─── tech logos (inline SVG paths — no external fetches) ────────────── */
const TECH_LOGO: Record<string, ReactNode> = {
  'Next.js':    <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 004.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 01.233-.296c.096-.05.13-.054.499-.054z" fill="currentColor" />,
  'React':      <path d="M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.236-2.236 2.236 2.236 0 012.235 2.236zm-6.54 0c0-2.38 1.922-4.31 4.305-4.31 2.38 0 4.304 1.93 4.304 4.31 0 2.38-1.924 4.305-4.304 4.305-2.383 0-4.305-1.925-4.305-4.305zm-3.9 0C3.79 5.876 7.7 2.19 12 2.19c4.3 0 8.21 3.686 8.21 9.814 0 6.13-3.91 9.814-8.21 9.814-4.3 0-8.21-3.684-8.21-9.814z" fill="none" stroke="currentColor" strokeWidth="1.2" />,
  'Spring Boot':<g fill="currentColor"><path d="M20.205 16.392c-2.469 3.289-7.741 2.179-11.122 2.338 0 0-.599.034-1.201.133 0 0 .228-.097.519-.198 2.374-.821 3.496-.986 4.939-1.727 2.71-1.388 5.408-4.413 5.957-7.555-1.032 3.022-4.17 5.623-7.027 6.679-1.955.722-5.492 1.424-5.505 1.424a5.28 5.28 0 01-.143-.076C5.002 16.33 4.869 14.756 6.96 13.1c1.047-.838 2.446-1.298 3.706-1.687.697-.214 1.411-.41 2.107-.652.842-.29 1.604-.703 2.239-1.356.584-.601.951-1.377 1.06-2.233.199-1.573-.476-3.084-1.543-4.195 3.076 1.717 5.01 5.061 5.676 8.415z"/><path d="M15.008 1.047A9.998 9.998 0 0112 1a10 10 0 100 20 10 10 0 0010-10 9.998 9.998 0 01-6.992-9.953z" opacity=".6"/></g>,
  'Docker':     <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.187-.186V6.29a.186.186 0 00-.187-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.135a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.187-.185V9.006a.186.186 0 00-.187-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" fill="currentColor" />,
  'PostgreSQL': <path d="M17.128 0a10.134 10.134 0 00-2.755.403l-.063.02A10.922 10.922 0 0013.007.12C11.775.04 10.511.45 9.583 1.422c-.16.167-.304.35-.432.545A.5.5 0 009.1 2.19c-1.17.11-2.34.42-3.14 1.12-1.03.9-1.36 2.22-1.42 3.38-.06 1.16.04 2.42.04 3.8 0 1.38-.1 2.6-.04 3.8.06 1.16.39 2.48 1.42 3.38.8.7 1.97 1.01 3.14 1.12a.5.5 0 00.05.123c.128.195.272.378.432.545.928.972 2.192 1.382 3.424 1.302.42-.027.85-.1 1.303-.283l.063.02a10.135 10.135 0 002.755.403c1.88 0 3.84-.49 5.28-1.84 1.3-1.22 1.99-3.01 1.99-5.36V7.2c0-2.35-.69-4.14-1.99-5.36C20.968.49 19.008 0 17.128 0zm0 1.5c1.6 0 3.2.42 4.34 1.47 1.01.95 1.63 2.4 1.63 4.43v5.2c0 2.03-.62 3.48-1.63 4.43-1.14 1.05-2.74 1.47-4.34 1.47a8.63 8.63 0 01-2.35-.34 3.33 3.33 0 01-.46.05c-1.18.06-2.34-.33-3.1-1.13-.19-.2-.36-.42-.49-.65-1.03-.1-2.04-.37-2.73-.96-.8-.7-1.07-1.77-1.12-2.82C6.83 13.1 6.93 11.9 6.93 10.6c0-1.3-.1-2.5-.04-3.6.05-1.05.32-2.12 1.12-2.82.69-.59 1.7-.86 2.73-.96.13-.23.3-.45.49-.65.76-.8 1.92-1.19 3.1-1.13.16.01.31.03.46.05.74-.22 1.52-.34 2.35-.34z" fill="currentColor" />,
  'RabbitMQ':   <g fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="3" opacity=".2"/><path d="M20 9h-2V7a1 1 0 00-1-1h-2a1 1 0 00-1 1v2h-2V7a1 1 0 00-1-1H9a1 1 0 00-1 1v2H6a1 1 0 00-1 1v7a1 1 0 001 1h14a1 1 0 001-1v-7a1 1 0 00-1-1zm-9 6H9v-4h2v4zm5 0h-2v-4h2v4z"/></g>,
  'TypeScript': <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="currentColor" />,
  'JavaScript': <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" fill="currentColor" />,
  'Laravel':    <path d="M23.642 5.43a.364.364 0 01.014.1v5.149a.392.392 0 01-.192.332l-4.31 2.49v4.934a.39.39 0 01-.19.33l-9.004 5.197a.369.369 0 01-.108.04.411.411 0 01-.1.01.399.399 0 01-.106-.012.423.423 0 01-.1-.04L.254 18.73a.398.398 0 01-.2-.342V3.195a.38.38 0 01.014-.1.293.293 0 01.022-.058.3.3 0 01.025-.05l.038-.043.053-.039.04-.02L4.1.083a.393.393 0 01.39 0l3.862 2.23a.4.4 0 01.193.332v4.865l3.876-2.24a.4.4 0 01.39 0l4.293 2.478.014.009zm-4.708 8.41v-4.165l-1.817 1.05v4.165zm-8.963-3.116v4.17l1.81 1.044 2.05-1.182v-4.168zm9.543-4.94l-1.83 1.058 1.818 1.05 1.83-1.058zm-4.283 2.478l-1.835-1.062-1.835 1.063 1.835 1.062z" fill="currentColor" />,
  'Tailwind CSS':<path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="currentColor" />,
  'Git':        <path d="M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.658 2.66a1.838 1.838 0 11-1.103 1.098L12.718 9.05v6.105a1.835 1.835 0 11-1.503-.18V8.96a1.834 1.834 0 01-.997-2.406l-2.71-2.71-7.16 7.161a1.55 1.55 0 000 2.188l10.48 10.477a1.55 1.55 0 002.187 0l10.532-10.53a1.55 1.55 0 000-2.187" fill="currentColor" />,
  'Prisma':     <path d="M21.807 18.285L13.553.756a1.582 1.582 0 00-1.129-.755 1.584 1.584 0 00-1.332.53L2.332 11.2a1.581 1.581 0 00-.275 1.519l3.11 8.208a1.583 1.583 0 001.448.937h13.48a1.583 1.583 0 001.496-1.051 1.574 1.574 0 00-.784-1.528zM12.6 3.397l6.802 14.86H8.087z" fill="currentColor" />,
  'Vercel':     <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />,
  'MongoDB':    <g fill="currentColor"><path d="M17.193 9.555c-1.264-5.58-4.252-7.243-4.562-8.309-.369-1.249-.37-1.249-.372-1.249-.38 1.332-.157 2.046.393 3.35.76 1.805 2.168 3.532 2.168 7.29 0 3.72-2.38 6.4-5.69 6.4-3.31 0-5.6-2.68-5.6-6.4 0-4.32 2.14-6.97 4.4-8.98l.01-.008C8.25 1.348 8.68.88 8.98.365c.22.63.64 1.164 1.12 1.62 1.46 1.364 2.48 3.246 2.48 5.71 0 2.78-1.83 4.45-3.97 4.45" opacity=".5"/><path d="M12.68 12.12c0-2.46 1.01-4.34 2.48-5.71.48-.456.9-.99 1.12-1.62.3.515.73.983.84 1.283l.01.008c2.26 2.01 4.4 4.66 4.4 8.98 0 3.72-2.29 6.4-5.6 6.4-3.31 0-5.69-2.68-5.69-6.4 0-3.758 1.408-5.485 2.168-7.29.55-1.304.773-2.018.393-3.35 0 0-.002 0-.372 1.249-.31 1.066-3.298 2.729-4.562 8.309"/></g>,
}

function TechIcon({ name, size = 14, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const path = TECH_LOGO[name]
  if (!path) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ color, flexShrink: 0 }}>
      {path}
    </svg>
  )
}

/* ─── main component ─────────────────────────────────────────────────── */
export default function ArchFlow() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const svgRef        = useRef<SVGSVGElement>(null)
  const [size, setSize]   = useState({ w: 860, h: 320 })
  const [activeId, setActiveId] = useState(projectSystems[0].id)
  const [hovered, setHovered] = useState<string | null>(null)

  const system = projectSystems.find(s => s.id === activeId) ?? projectSystems[0]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width
      setSize({ w, h: Math.max(260, Math.round(w * 0.36)) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { nodes, edges, rects } = useMemo(
    () => buildFlow(system, size.w, size.h),
    [system, size]
  )

  const connEdges = useMemo(() => {
    if (!hovered) return new Set<string>()
    return new Set(edges.filter(e => e.from === hovered || e.to === hovered).map(e => `${e.from}→${e.to}`))
  }, [hovered, edges])
  const connIds = useMemo(() => {
    if (!hovered) return new Set<string>()
    const s = new Set<string>([hovered])
    edges.forEach(e => { if (e.from === hovered) s.add(e.to); if (e.to === hovered) s.add(e.from) })
    return s
  }, [hovered, edges])

  const switchProject = useCallback((id: string) => {
    if (id === activeId) return
    setHovered(null)
    setActiveId(id)
  }, [activeId])

  return (
    <div className="relative w-full flex flex-col" style={{ gap: 'var(--sp-2)' }}>

      {/* Project tabs */}
      <div className="flex flex-wrap" style={{ gap: '8px' }}>
        {projectSystems.map(s => {
          const on = s.id === activeId
          return (
            <button
              key={s.id}
              onClick={() => switchProject(s.id)}
              className="flex items-center rounded-sm"
              style={{
                gap: '8px', padding: '7px 13px',
                background: on ? 'rgba(99,179,237,0.09)' : 'rgba(10,10,20,0.6)',
                border: `1px solid ${on ? 'rgba(99,179,237,0.35)' : 'var(--wire)'}`,
                color: on ? 'var(--text-0)' : 'var(--text-2)',
                fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
              data-hover="true"
            >
              {on && <span style={{ width: 5, height: 5, background: 'var(--pulse)', display: 'inline-block', transform: 'rotate(45deg)', boxShadow: '0 0 5px var(--pulse)' }} />}
              {s.name}
            </button>
          )
        })}

        <div className="flex items-center flex-wrap" style={{ gap: '12px', marginLeft: 'auto' }}>
          {Object.entries(EDGE_COLOR).map(([type, color]) => (
            <div key={type} className="flex items-center" style={{ gap: '5px' }}>
              <svg width="18" height="6" aria-hidden="true">
                <line x1="0" y1="3" x2="18" y2="3" stroke={color} strokeWidth="1.4"
                  strokeDasharray={EDGE_DASH[type] || undefined} />
              </svg>
              <span className="t-system" style={{ color: 'var(--text-3)' }}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diagram */}
      <div
        ref={containerRef}
        className="relative rounded-sm overflow-hidden"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--wire)' }}
      >
        <svg
          ref={svgRef}
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="w-full block"
          style={{ cursor: 'none' }}
          aria-label={`${system.name} architecture flow`}
          role="img"
        >
          <defs>
            <pattern id="afGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="0.5" fill="rgba(99,179,237,0.06)" />
            </pattern>
            <marker id="afArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,1 L5,3 L0,5 Z" fill="rgba(99,179,237,0.5)" />
            </marker>
            {Object.entries(EDGE_COLOR).map(([type, color]) => (
              <marker key={type} id={`afArr-${type}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,1 L5,3 L0,5 Z" fill={color} opacity="0.7" />
              </marker>
            ))}
            <filter id="afGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <rect width={size.w} height={size.h} fill="url(#afGrid)" />

          {/* Resting edges */}
          {edges.map(e => {
            const fr = rects.get(e.from), tr = rects.get(e.to)
            if (!fr || !tr) return null
            const d      = flowPath(fr, tr)
            const color  = EDGE_COLOR[e.type]
            const isHov  = connEdges.has(`${e.from}→${e.to}`)
            const isDim  = hovered !== null && !isHov
            return (
              <g key={`${e.from}→${e.to}`}>
                <path d={d} fill="none"
                  stroke={isDim ? 'rgba(255,255,255,0.03)' : isHov ? color : color + '40'}
                  strokeWidth={isHov ? 1.8 : 0.9}
                  strokeDasharray={EDGE_DASH[e.type] || undefined}
                  markerEnd={isHov ? `url(#afArr-${e.type})` : undefined}
                  style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
                />
                {isHov && e.label && (() => {
                  const fr2 = rects.get(e.from)!, tr2 = rects.get(e.to)!
                  const mx = (fr2.x + fr2.w + tr2.x) / 2
                  const my = (fr2.y + fr2.h / 2 + tr2.y + tr2.h / 2) / 2 - 8
                  return (
                    <text x={mx} y={my} textAnchor="middle"
                      style={{ fontFamily: 'var(--font-code)', fontSize: '8px', fill: color, opacity: 0.9, letterSpacing: '0.05em' }}>
                      {e.label}
                    </text>
                  )
                })()}
              </g>
            )
          })}

          {/* Animated packets — idle continuous flow */}
          {edges.map((e, i) => {
            const fr = rects.get(e.from), tr = rects.get(e.to)
            if (!fr || !tr) return null
            const isHov = connEdges.has(`${e.from}→${e.to}`)
            const isDim = hovered !== null && !isHov
            if (isDim) return null
            return (
              <AnimPacket
                key={`pkt-${activeId}-${e.from}→${e.to}`}
                pathD={flowPath(fr, tr)}
                color={EDGE_COLOR[e.type]}
                duration={2.2 + i * 0.3}
                delay={i * 0.45}
                repeat={true}
              />
            )
          })}

          {/* Service nodes */}
          {nodes.map(node => {
            const rect   = rects.get(node.id)
            if (!rect) return null
            const isSelf = node.id === hovered
            const isConn = hovered ? connIds.has(node.id) : false
            const isDim  = hovered !== null && !isSelf && !isConn

            return (
              <g key={node.id}
                transform={`translate(${rect.x}, ${rect.y})`}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'none' }}
              >
                {/* Glow bg */}
                {(isSelf || isConn) && (
                  <rect width={rect.w} height={rect.h} rx="3"
                    fill={node.color + '18'}
                    style={{ filter: `drop-shadow(0 0 8px ${node.color}60)` }}
                  />
                )}

                {/* Card */}
                <rect width={rect.w} height={rect.h} rx="3"
                  fill={isDim ? 'rgba(10,10,20,0.4)' : 'rgba(10,10,20,0.85)'}
                  stroke={isSelf ? node.color : isConn ? node.color + '70' : isDim ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.09)'}
                  strokeWidth={isSelf ? 1.5 : 0.8}
                  style={{ transition: 'all 0.2s ease' }}
                  filter={isSelf ? 'url(#afGlow)' : undefined}
                />

                {/* Status dot */}
                <circle cx="10" cy="10" r="2.5"
                  fill={node.status === 'running' ? '#48bb78' : '#63b3ed'}
                  opacity={isDim ? 0.2 : 0.9}
                />

                {/* Tech icon */}
                {TECH_LOGO[node.label] && (
                  <foreignObject x={rect.w - 20} y={6} width={14} height={14}>
                    <div style={{ color: isDim ? 'rgba(255,255,255,0.12)' : node.color + 'aa', lineHeight: 0 }}>
                      <TechIcon name={node.label} size={14} />
                    </div>
                  </foreignObject>
                )}

                {/* Label */}
                <text x={rect.w / 2} y={rect.h / 2 - 3}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '8.5px', fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    fill: isDim ? 'rgba(255,255,255,0.15)' : isSelf ? '#fff' : 'rgba(255,255,255,0.8)',
                    transition: 'fill 0.2s ease',
                  }}>
                  {node.label.length > 12 ? node.label.slice(0, 11) + '…' : node.label}
                </text>

                {/* Role */}
                <text x={rect.w / 2} y={rect.h / 2 + 9}
                  textAnchor="middle"
                  style={{
                    fontFamily: 'var(--font-code)', fontSize: '7.5px',
                    fill: isDim ? 'rgba(255,255,255,0.07)' : node.color + '88',
                    transition: 'fill 0.2s ease',
                  }}>
                  {node.role.length > 16 ? node.role.slice(0, 15) + '…' : node.role}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Column headers */}
        <div className="absolute inset-0 pointer-events-none" style={{ padding: '6px 12px' }}>
          {/* Rendered via JS so they follow column positions */}
        </div>
      </div>

      {/* Project description */}
      <div className="glass rounded-sm" style={{ padding: 'var(--sp-3)', marginTop: '4px' }}>
        <div className="flex items-start justify-between flex-wrap" style={{ gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
          <div>
            <span className="t-label" style={{ color: 'var(--pulse)' }}>{system.name}</span>
            <span className="t-system" style={{ marginLeft: '12px', color: 'var(--text-3)' }}>{system.year}</span>
          </div>
          <span className="t-system" style={{ color: system.status === 'Live' ? 'var(--active)' : 'var(--text-2)' }}>
            {system.status.toUpperCase()}
          </span>
        </div>
        <p className="font-light" style={{ fontSize: 'var(--text-base)', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 'var(--sp-2)' }}>
          {system.description}
        </p>
        <div className="flex flex-wrap items-center" style={{ gap: '6px' }}>
          {system.stack.map(tech => (
            <span key={tech} className="flex items-center gap-1 t-system rounded-sm"
              style={{ padding: '2px 8px', border: '1px solid var(--wire-accent)', color: 'var(--pulse)', background: 'rgba(99,179,237,0.05)' }}>
              {TECH_LOGO[tech] && <TechIcon name={tech} size={10} color="currentColor" />}
              {tech}
            </span>
          ))}
          <a href={system.github} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center"
            style={{ gap: '5px', marginLeft: 'auto', color: 'var(--text-2)', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--pulse)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-2)' }}
            data-hover="true">
            Source
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
