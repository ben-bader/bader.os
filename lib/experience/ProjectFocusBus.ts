export type ProjectFocusSnapshot = {
  id: string | null
  progress: number
  rect: { x: number; y: number; width: number; height: number } | null
}

let snapshot: ProjectFocusSnapshot = { id: null, progress: 0, rect: null }
const listeners = new Set<() => void>()

export const projectFocusBus = {
  getSnapshot: () => snapshot,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  set(id: string | null, progress: number, rect: ProjectFocusSnapshot['rect'] = null) {
    const changed = snapshot.id !== id || snapshot.progress !== progress
    snapshot = { id, progress, rect }
    if (!changed) return
    listeners.forEach(listener => listener())
  },
  shiftRect(deltaY: number) {
    if (snapshot.rect) snapshot = { ...snapshot, rect: { ...snapshot.rect, y: snapshot.rect.y + deltaY } }
  },
  updateRect(rect: ProjectFocusSnapshot['rect']) {
    snapshot = { ...snapshot, rect }
  },
  setProgress(progress: number) {
    snapshot = { ...snapshot, progress }
  },
}
