/**
 * Global Lenis singleton.
 * SystemOS sets this once on init; any component can call scrollTo().
 */

type LenisInstance = {
  scrollTo: (target: HTMLElement | number | string, opts?: Record<string, unknown>) => void
  raf:      (time: number) => void
  destroy:  () => void
}

let _lenis: LenisInstance | null = null

export function setLenis(instance: LenisInstance) {
  _lenis = instance
}

export function getLenis() {
  return _lenis
}

/**
 * Scroll to an element by DOM id.
 * Falls back to native scrollIntoView if Lenis isn't ready.
 */
export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id)
  if (!el) return

  if (_lenis) {
    _lenis.scrollTo(el, { offset, duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
