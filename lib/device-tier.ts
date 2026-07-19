export type DeviceTier = 'high' | 'medium' | 'low'

export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'low'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low'

  const cores = navigator.hardwareConcurrency ?? 2
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  const isMobile = window.matchMedia('(max-width: 767px)').matches
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2')
  if (!gl) return 'low'
  if (isMobile) return 'medium'
  if (cores >= 8 && memory >= 8) return 'high'
  if (cores >= 4 && memory >= 4) return 'medium'
  return 'low'
}
