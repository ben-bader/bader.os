export type PointerSnapshot = {
  x: number
  y: number
  smoothX: number
  smoothY: number
  inside: boolean
  velocity: number
}

let snapshot: PointerSnapshot = {
  x: 0,
  y: 0,
  smoothX: 0,
  smoothY: 0,
  inside: false,
  velocity: 0,
}
let targetX = 0
let targetY = 0
let previousX = 0
let previousY = 0
const listeners = new Set<() => void>()

export const pointerBus = {
  getSnapshot: () => snapshot,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setTarget(clientX: number, clientY: number, inside = true) {
    targetX = inside ? (clientX / Math.max(window.innerWidth, 1)) * 2 - 1 : 0
    targetY = inside ? 1 - (clientY / Math.max(window.innerHeight, 1)) * 2 : 0
    snapshot = { ...snapshot, x: targetX, y: targetY, inside }
    listeners.forEach(listener => listener())
  },
  reset() {
    targetX = 0
    targetY = 0
    snapshot = { ...snapshot, x: 0, y: 0, inside: false }
    listeners.forEach(listener => listener())
  },
  update(deltaSeconds: number) {
    const blend = 1 - Math.exp(-Math.max(deltaSeconds, 0) * 5.5)
    const smoothX = snapshot.smoothX + (targetX - snapshot.smoothX) * blend
    const smoothY = snapshot.smoothY + (targetY - snapshot.smoothY) * blend
    const dx = smoothX - previousX
    const dy = smoothY - previousY
    previousX = smoothX
    previousY = smoothY
    snapshot = {
      ...snapshot,
      smoothX,
      smoothY,
      velocity: Math.hypot(dx, dy) / Math.max(deltaSeconds, 0.001),
    }
  },
}
