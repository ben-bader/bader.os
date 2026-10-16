export type ProjectFocusSnapshot = {
  id: string | null
}

let snapshot: ProjectFocusSnapshot = { id: null }

export const projectFocusBus = {
  getSnapshot: () => snapshot,
  set(id: string | null) {
    snapshot = { id }
  },
}
