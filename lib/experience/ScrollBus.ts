import { projectFocusBus } from './ProjectFocusBus'

export type PortfolioSection =
  | 'home'
  | 'work'
  | 'about'
  | 'capabilities'
  | 'journey'
  | 'contact'

export type ScrollSnapshot = {
  scrollTop: number
  limit: number
  progress: number
  velocity: number
  direction: -1 | 0 | 1
  viewportHeight: number
  section: PortfolioSection
}

let snapshot: ScrollSnapshot = {
  scrollTop: 0,
  limit: 0,
  progress: 0,
  velocity: 0,
  direction: 0,
  viewportHeight: 0,
  section: 'home',
}
let previousTop = 0
let previousTime = 0
let smoothedVelocity = 0
const listeners = new Set<() => void>()
let disconnect: (() => void) | null = null

function sectionAtReadingLine(): PortfolioSection {
  const line = Math.round(window.innerHeight * 0.34)
  const element = document.elementFromPoint(Math.round(window.innerWidth * 0.5), line)
  const id = element?.closest('section[id], footer[id]')?.id
  const anchors = {
    home: 'home',
    work: 'work',
    about: 'about',
    capabilities: 'capabilities',
    journey: 'journey',
    contact: 'contact',
  } as const
  return (id && anchors[id as keyof typeof anchors]) || snapshot.section
}

export const scrollBus = {
  getSnapshot: () => snapshot,
  connect() {
    if (disconnect) return disconnect
    previousTop = window.scrollY
    previousTime = performance.now()
    smoothedVelocity = 0
    const read = () => {
      const now = performance.now()
      const deltaSeconds = previousTime ? Math.max(0.001, (now - previousTime) / 1000) : 0
      previousTime = now
      scrollBus.update(window.scrollY, window.innerHeight, deltaSeconds, sectionAtReadingLine())
    }
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read, { passive: true })
    read()
    disconnect = () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
      smoothedVelocity = 0
      snapshot = { ...snapshot, velocity: 0 }
      disconnect = null
    }
    return disconnect
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  update(scrollTop: number, viewportHeight: number, deltaSeconds: number, section: PortfolioSection) {
    const limit = Math.max(0, document.documentElement.scrollHeight - viewportHeight)
    const delta = scrollTop - previousTop
    if (delta !== 0) projectFocusBus.shiftRect(-delta)
    const rawVelocity = deltaSeconds > 0 ? delta / deltaSeconds : 0
    const attack = 1 - Math.exp(-deltaSeconds * 18)
    smoothedVelocity += (rawVelocity - smoothedVelocity) * attack
    const next: ScrollSnapshot = {
      scrollTop,
      limit,
      progress: limit > 0 ? Math.min(1, Math.max(0, scrollTop / limit)) : 0,
      velocity: smoothedVelocity,
      direction: delta === 0 ? snapshot.direction : delta > 0 ? 1 : -1,
      viewportHeight,
      section,
    }
    previousTop = scrollTop

    const changed = next.section !== snapshot.section
    snapshot = next
    if (changed) listeners.forEach(listener => listener())
  },
  tick(deltaSeconds: number) {
    if (Math.abs(smoothedVelocity) < 2) {
      smoothedVelocity = 0
      if (snapshot.velocity !== 0) snapshot = { ...snapshot, velocity: 0 }
      return
    }
    smoothedVelocity *= Math.exp(-Math.max(deltaSeconds, 0) * 3.2)
    snapshot = { ...snapshot, velocity: smoothedVelocity }
  },
}
