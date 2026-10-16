/**
 * Global Lenis singleton.
 * ExperienceRuntime sets this once on init; any component can call scrollTo().
 */

type LenisInstance = {
  scrollTo: (target: HTMLElement | number | string, opts?: Record<string, unknown>) => void
  raf:      (time: number) => void
  destroy:  () => void
}

let _lenis: LenisInstance | null = null

export function setLenis(instance: LenisInstance | null) {
  _lenis = instance
}

export function getLenis(): LenisInstance | null {
  return _lenis
}

/**
 * Scroll to an element by DOM id.
 * Falls back to native scrollIntoView if Lenis isn't ready.
 */
