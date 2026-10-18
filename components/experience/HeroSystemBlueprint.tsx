'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  circuitNodes,
  circuitRoutes,
  circuitTraces,
  type CircuitNode,
  type CircuitRoute,
  type CircuitRouteStep,
} from './blueprint-data'

gsap.registerPlugin(useGSAP)

type Point = { x: number; y: number }
type TraceGeometry = {
  path: SVGPathElement
  length: number
}
type RouteSegment = {
  trace: TraceGeometry
  start: number
  end: number
  direction: 'forward' | 'reverse'
  node: string
  activate: boolean
}
type RouteGeometry = {
  segments: RouteSegment[]
  length: number
}

type SignalElements = {
  trail: SVGPathElement
}

function roundOrthogonalPath(path: string, radius = 5) {
  const tokens = path.match(/[A-Za-z]|-?\d+(?:\.\d+)?/g) ?? []
  const points: Point[] = []
  let point: Point = { x: 0, y: 0 }
  let index = 0

  while (index < tokens.length) {
    const command = tokens[index++]
    if (command !== 'M' && command !== 'H' && command !== 'V') {
      throw new Error(`Circuit traces must use M/H/V commands only; received ${command}`)
    }

    if (command === 'M') {
      point = { x: Number(tokens[index++]), y: Number(tokens[index++]) }
      points.push(point)
      continue
    }

    const next = command === 'H'
      ? { x: Number(tokens[index++]), y: point.y }
      : { x: point.x, y: Number(tokens[index++]) }
    points.push(next)
    point = next
  }

  if (points.length < 2) {
    throw new Error(`Circuit trace ${path} contains no segments`)
  }

  const format = (value: number) => value.toFixed(2)
  let rounded = `M${format(points[0].x)} ${format(points[0].y)}`

  for (let pointIndex = 1; pointIndex < points.length - 1; pointIndex += 1) {
    const previous = points[pointIndex - 1]
    const corner = points[pointIndex]
    const next = points[pointIndex + 1]
    const incomingLength = Math.hypot(corner.x - previous.x, corner.y - previous.y)
    const outgoingLength = Math.hypot(next.x - corner.x, next.y - corner.y)
    const incomingDirection = { x: (corner.x - previous.x) / incomingLength, y: (corner.y - previous.y) / incomingLength }
    const outgoingDirection = { x: (next.x - corner.x) / outgoingLength, y: (next.y - corner.y) / outgoingLength }

    if (incomingDirection.x === outgoingDirection.x || incomingDirection.y === outgoingDirection.y) {
      rounded += ` L${format(corner.x)} ${format(corner.y)}`
      continue
    }

    const bend = Math.min(radius, incomingLength / 2, outgoingLength / 2)
    const entry = { x: corner.x - incomingDirection.x * bend, y: corner.y - incomingDirection.y * bend }
    const exit = { x: corner.x + outgoingDirection.x * bend, y: corner.y + outgoingDirection.y * bend }
    rounded += ` L${format(entry.x)} ${format(entry.y)} Q${format(corner.x)} ${format(corner.y)} ${format(exit.x)} ${format(exit.y)}`
  }

  const end = points.at(-1)!
  return `${rounded} L${format(end.x)} ${format(end.y)}`
}

function parseOrthogonalTrace(path: SVGPathElement): TraceGeometry {
  const length = path.getTotalLength()
  if (!length) throw new Error(`Circuit trace ${path.dataset.trace ?? ''} contains no segments`)
  return { path, length }
}

function pointAtDistance(trace: TraceGeometry, distance: number): Point {
  const boundedDistance = gsap.utils.clamp(0, trace.length, distance)
  const point = trace.path.getPointAtLength(boundedDistance)
  return {
    x: point.x,
    y: point.y,
  }
}

function makeRouteGeometry(steps: CircuitRouteStep[], traces: Map<string, TraceGeometry>): RouteGeometry | null {
  let length = 0
  const segments = steps.flatMap((step) => {
    const trace = traces.get(step.trace)
    if (!trace) return []
    const segment = {
      trace,
      start: length,
      end: length + trace.length,
      direction: step.direction ?? 'forward',
      node: step.to,
      activate: step.activate !== false,
    }
    length = segment.end
    return [segment]
  })

  return length ? { segments, length } : null
}

function routePathData(route: RouteGeometry) {
  let path = ''

  route.segments.forEach((segment) => {
    const divisions = Math.max(1, Math.ceil(segment.trace.length / 4))
    for (let index = 0; index <= divisions; index += 1) {
      const progress = index / divisions
      const distance = segment.direction === 'forward'
        ? progress * segment.trace.length
        : (1 - progress) * segment.trace.length
      const point = pointAtDistance(segment.trace, distance)
      path += `${path ? ' L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    }
  })

  return path
}

function renderComponent(node: CircuitNode) {
  switch (node.kind) {
    case 'client':
      return (
        <>
          <circle data-outline="" className="fill-[#101315] stroke-[#879180] stroke-[1.4] [vector-effect:non-scaling-stroke]" r="10" />
          <path className="fill-none stroke-[#879180] stroke-[1] [vector-effect:non-scaling-stroke]" d="M-6 0h12" />
          <circle data-indicator={node.id} className="fill-[#879180]" r="2.4" opacity=".42" />
        </>
      )
    case 'gateway':
      return (
        <>
          <rect data-outline="" className="fill-[#101315] stroke-[#879180] stroke-[1.35] [vector-effect:non-scaling-stroke]" x="-18" y="-17" width="36" height="34" />
          <path className="fill-none stroke-[#687466] stroke-[1] [vector-effect:non-scaling-stroke]" d="M-9-7h18M-9 0h12M-9 7h7" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="10" cy="8" r="2.3" opacity=".42" />
        </>
      )
    case 'router':
      return (
        <>
          <path data-outline="" className="fill-[#151a1c] stroke-[#a0aa97] stroke-[1.35] [vector-effect:non-scaling-stroke]" d="m0-16 16 16-16 16-16-16z" />
          <path className="fill-none stroke-[#879180] stroke-[1] [vector-effect:non-scaling-stroke]" d="M-8 0h16M0-8v16" />
          <circle data-indicator={node.id} className="fill-[#879180]" r="2.3" opacity=".4" />
        </>
      )
    case 'auth':
      return (
        <>
          <rect data-outline="" className="fill-[#151a1c] stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" x="-16" y="-16" width="32" height="32" />
          <path className="fill-none stroke-[#879180] stroke-[1.15] [vector-effect:non-scaling-stroke]" d="M-7-2v-4a7 7 0 0 1 14 0v4M-9-2h18v12H-9z" />
          <circle data-indicator={node.id} className="fill-[#879180]" cy="3" r="2" opacity=".4" />
        </>
      )
    case 'validation':
      return (
        <>
          <path data-outline="" className="fill-[#151a1c] stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" d="m0-16 16 16-16 16-16-16z" />
          <path className="fill-none stroke-[#879180] stroke-[1.4] [vector-effect:non-scaling-stroke]" d="m-7 0 5 5 9-10" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="10" cy="-10" r="2" opacity=".35" />
        </>
      )
    case 'service':
      return (
        <>
          <rect data-outline="" className="fill-[#151a1c] stroke-[#9ca892] stroke-[1.45] [vector-effect:non-scaling-stroke]" x="-21" y="-16" width="42" height="32" />
          <path className="fill-none stroke-[#879180] stroke-[1] [vector-effect:non-scaling-stroke]" d="M-13-6h26M-13 0h26M-13 6h26" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="14" cy="-6" r="2.2" opacity=".4" />
        </>
      )
    case 'cache':
      return (
        <>
          <rect data-outline="" className="fill-[#151a1c] stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" x="-19" y="-14" width="38" height="28" />
          <path className="fill-none stroke-[#687466] stroke-[1] [vector-effect:non-scaling-stroke]" d="M-11-5h22M-11 3h13" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="11" cy="5" r="2" opacity=".38" />
        </>
      )
    case 'database':
      return (
        <>
          <path data-outline="" className="fill-[#151a1c] stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" d="M-21-17 a21 5 0 0 1 42 0 v34 a21 5 0 0 1 -42 0 z" />
          <path className="fill-none stroke-[#879180] stroke-[1] [vector-effect:non-scaling-stroke]" d="M-21-17 a21 5 0 0 0 42 0 M-21-6 a21 5 0 0 0 42 0 M-21 5 a21 5 0 0 0 42 0" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="14" cy="-12" r="2.2" opacity=".38" />
        </>
      )
    case 'queue':
      return (
        <>
          <rect data-outline="" className="fill-[#151a1c] stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" x="-24" y="-16" width="48" height="32" />
          <rect data-queue-slot="1" className="fill-[#c6f36b]" x="-15" y="-6" width="7" height="12" opacity=".22" />
          <rect data-queue-slot="2" className="fill-[#a0aa97]" x="-3" y="-6" width="7" height="12" opacity=".3" />
          <rect data-queue-slot="3" className="fill-[#a0aa97]" x="9" y="-6" width="7" height="12" opacity=".3" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="18" cy="-11" r="2" opacity=".38" />
        </>
      )
    case 'worker':
      return (
        <>
          <rect data-outline="" className="fill-[#151a1c] stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" x="-20" y="-19" width="40" height="38" />
          <path className="fill-none stroke-[#879180] stroke-[1] [vector-effect:non-scaling-stroke]" d="M-11-7h15M-11 0h22M-11 7h10" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="11" cy="-9" r="2.2" opacity=".38" />
        </>
      )
    case 'completion':
      return (
        <>
          <circle data-outline="" className="fill-[#151a1c] stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" r="12" />
          <path className="fill-none stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" d="m-5 0 3 3 7-7" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="7" cy="-7" r="2" opacity=".38" />
        </>
      )
    case 'observability':
      return (
        <>
          <rect data-outline="" className="fill-[#151a1c] stroke-[#879180] stroke-[1.3] [vector-effect:non-scaling-stroke]" x="-23" y="-15" width="46" height="30" />
          <path className="fill-none stroke-[#879180] stroke-[1] [vector-effect:non-scaling-stroke]" d="M-15 7v-6l7-4 6 6 7-11 6 4" />
          <circle data-indicator={node.id} className="fill-[#879180]" cx="15" cy="-8" r="2" opacity=".38" />
        </>
      )
    default:
      return null
  }
}

function CircuitComponent({ node }: { node: CircuitNode }) {
  if (!node.kind) return null

  return (
    <g
      className={`circuit-component${node.mobile === false ? ' max-mobile:hidden' : ''}`}
      data-node={node.id}
      data-mobile-hidden={node.mobile === false ? '' : undefined}
      transform={`translate(${node.x} ${node.y})`}
    >
      {renderComponent(node)}
      <text
        className="circuit-label fill-[#9ba596] font-portfolio-code text-[15px] tracking-[.13em] max-mobile:text-[23px]"
        x="0"
        y={node.labelY}
        textAnchor="middle"
      >
        {node.label}
      </text>
    </g>
  )
}

function routeSteps(route: CircuitRoute, mobile: boolean) {
  return mobile ? route.mobileSteps ?? route.steps : route.steps
}

function makeNodePulse(svg: SVGSVGElement, nodeId: string) {
  const component = svg.querySelector<SVGGElement>(`[data-node="${nodeId}"]`)
  const indicator = component?.querySelector<SVGElement>('[data-indicator], [data-junction-core]')
  const outline = component?.querySelector<SVGElement>('[data-outline]')
  const queueSlot = nodeId === 'queue' ? svg.querySelector<SVGRectElement>('[data-queue-slot="1"]') : null
  const timeline = gsap.timeline({ paused: true })

  if (indicator) {
    timeline.to(indicator, {
      opacity: 1,
      scale: 1.22,
      fill: '#c6f36b',
      transformOrigin: 'center center',
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power1.out',
    }, 0)
  }
  if (outline) {
    timeline.to(outline, { stroke: '#c6f36b', duration: 0.1, yoyo: true, repeat: 1 }, 0)
  }
  if (queueSlot) {
    timeline.to(queueSlot, { opacity: 1, duration: 0.12, yoyo: true, repeat: 1 }, 0)
  }
  if (nodeId === 'worker') {
    const slot = svg.querySelector<SVGRectElement>('[data-queue-slot="1"]')
    if (slot) timeline.to(slot, { opacity: 0.22, duration: 0.12 }, 0)
  }

  return timeline.getChildren().length ? timeline : null
}

function makeContinuousRoute(
  route: CircuitRoute,
  steps: CircuitRouteStep[],
  traces: Map<string, TraceGeometry>,
  signal: SignalElements,
  nodePulses: Map<string, gsap.core.Timeline>,
) {
  const geometry = makeRouteGeometry(steps, traces)
  if (!geometry) return null

  const checkpoints = geometry.segments
    .filter((segment) => segment.activate)
    .map((segment) => ({ distance: segment.end, node: segment.node }))
  signal.trail.setAttribute('d', routePathData(geometry))
  const pathLength = signal.trail.getTotalLength()
  if (!pathLength) return null

  const startProgress = gsap.utils.wrap(0, 1, route.phase / route.duration)
  const trailLength = gsap.utils.clamp(18, 44, pathLength * 0.025)
  const motion = { value: startProgress }
  let previousDistance = startProgress * geometry.length
  signal.trail.setAttribute('stroke-dasharray', `${trailLength.toFixed(2)} ${(pathLength - trailLength).toFixed(2)}`)
  signal.trail.setAttribute('stroke-dashoffset', `${(-startProgress * pathLength).toFixed(2)}`)
  signal.trail.setAttribute('opacity', '0.88')

  return gsap.to(motion, {
    value: startProgress + 1,
    duration: route.duration * 1.25 * gsap.utils.random(0.96, 1.04),
    ease: 'none',
    repeat: -1,
    onUpdate: () => {
      const progress = gsap.utils.wrap(0, 1, motion.value)
      signal.trail.setAttribute('stroke-dashoffset', `${(-progress * pathLength).toFixed(2)}`)
      const distance = progress * geometry.length

      const wrapped = distance < previousDistance
      checkpoints.forEach((checkpoint) => {
        const crossed = wrapped
          ? checkpoint.distance > previousDistance || checkpoint.distance <= distance
          : checkpoint.distance > previousDistance && checkpoint.distance <= distance
        if (crossed) nodePulses.get(checkpoint.node)?.restart()
      })
      previousDistance = distance
    },
  })
}

export default function HeroSystemBlueprint() {
  const svgRef = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const svg = svgRef.current
    if (!svg) return

    const media = gsap.matchMedia(svg)
    const setupMotion = (mobile: boolean) => () => {
      const visible = <T extends Element>(element: T) =>
        !mobile || !element.hasAttribute('data-mobile-hidden')
      const nodes = gsap.utils.toArray<SVGGElement>('.circuit-component, .circuit-junction', svg).filter(visible)
      const labels = gsap.utils.toArray<SVGTextElement>('.circuit-label', svg).filter((label) =>
        !mobile || !label.closest('[data-mobile-hidden]'),
      )
      const traceGeometry = new Map<string, TraceGeometry>()

      svg.querySelectorAll<SVGPathElement>('.circuit-trace').forEach((path) => {
        if (visible(path)) traceGeometry.set(path.dataset.trace ?? '', parseOrthogonalTrace(path))
      })

      const signalElements = new Map<string, SignalElements>()
      circuitRoutes.forEach((route) => {
        const trail = svg.querySelector<SVGPathElement>(`[data-signal-trail="${route.id}"]`)
        if (trail) signalElements.set(route.id, { trail })
      })

      const nodePulses = new Map<string, gsap.core.Timeline>()
      nodes.forEach((node) => {
        const id = node.dataset.node
        if (!id) return
        const pulse = makeNodePulse(svg, id)
        if (pulse) nodePulses.set(id, pulse)
      })

      const routes = circuitRoutes.flatMap((route) => {
        const steps = routeSteps(route, mobile)
        const signal = signalElements.get(route.id)
        if (!steps?.length || !signal) return []
        const motion = makeContinuousRoute(route, steps, traceGeometry, signal, nodePulses)
        return motion ? [motion] : []
      })

      let isVisible = true
      const observer = typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting
            routes.forEach((motion) => {
              if (isVisible) motion.play()
              else motion.pause()
            })
          })
      observer?.observe(svg)

      const entrance = gsap.timeline({ defaults: { ease: 'power2.out' } })
      entrance.fromTo(nodes, { opacity: 0.5 }, { opacity: 1, duration: 0.55, stagger: 0.035 }, '-=0.1')
      entrance.fromTo(labels, { opacity: 0.55 }, { opacity: 1, duration: 0.5, stagger: 0.025 }, '-=0.08')
      const trails = [...signalElements.values()].map(({ trail }) => trail)

      return () => {
        observer?.disconnect()
        entrance.kill()
        routes.forEach((motion) => motion.kill())
        nodePulses.forEach((pulse) => pulse.kill())
        trails.forEach((trail) => {
          trail.setAttribute('d', '')
          trail.setAttribute('stroke-dasharray', '')
          trail.setAttribute('stroke-dashoffset', '0')
          trail.setAttribute('opacity', '0')
        })
      }
    }

    media.add('(min-width: 641px) and (prefers-reduced-motion: no-preference)', setupMotion(false))
    media.add('(max-width: 640px) and (prefers-reduced-motion: no-preference)', setupMotion(true))
    return () => media.revert()
  }, { scope: svgRef })

  return (
    <svg
      ref={svgRef}
      className="block h-full w-full overflow-visible"
      viewBox="0 0 1000 650"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="system-circuit-title system-circuit-description"
    >
      <title id="system-circuit-title">A living software system circuit</title>
      <desc id="system-circuit-description">
        A software request travels from a client through an API gateway, router, authentication and validation,
        into a service bus. The service reads a database and cache, queues work for a worker, and sends events
        to observability. Responses travel back along connected traces.
      </desc>

      <g aria-hidden="true">
        {circuitTraces.map((trace) => (
          <path
            key={trace.id}
            className={`circuit-trace fill-none [vector-effect:non-scaling-stroke] [stroke-linecap:butt] [stroke-linejoin:miter] ${trace.active ? 'stroke-[#687565] stroke-[1.3] opacity-80' : 'stroke-[#3f4941] stroke-[1.05] opacity-70'}${trace.mobile === false ? ' max-mobile:hidden' : ''}`}
            data-trace={trace.id}
            data-mobile-hidden={trace.mobile === false ? '' : undefined}
            d={roundOrthogonalPath(trace.d)}
          />
        ))}

        {circuitNodes.filter((node) => !node.kind).map((node) => (
          <g
            key={node.id}
            className={`circuit-junction${node.mobile === false ? ' max-mobile:hidden' : ''}`}
            data-node={node.id}
            data-mobile-hidden={node.mobile === false ? '' : undefined}
            transform={`translate(${node.x} ${node.y})`}
          >
            <circle className="fill-[#101315] stroke-[#667261] stroke-[1] [vector-effect:non-scaling-stroke]" r="4" />
            <circle data-junction-core="" className="fill-[#9da895]" r="1.35" />
          </g>
        ))}

        {circuitNodes.filter((node) => node.kind).map((node) => (
          <CircuitComponent key={node.id} node={node} />
        ))}

        {circuitRoutes.map((route) => (
          <path
            key={route.id}
            data-signal-trail={route.id}
            className="fill-none stroke-[#c6f36b] [vector-effect:non-scaling-stroke] [stroke-linecap:round] [stroke-linejoin:round] stroke-[2.8]"
            d=""
            opacity="0"
            aria-hidden="true"
          />
        ))}
      </g>
    </svg>
  )
}
