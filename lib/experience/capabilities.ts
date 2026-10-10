export type CapabilityLevel = 'high' | 'medium' | 'low' | 'reduced-motion' | 'unavailable'

type NavigatorWithHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

export function getCapabilityLevel(): CapabilityLevel {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced-motion'

  const canvas = document.createElement('canvas')
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
  try {
    gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
  } catch {
    return 'unavailable'
  }
  if (!gl) return 'unavailable'
  const loseContext = gl.getExtension('WEBGL_lose_context')
  loseContext?.loseContext()

  const device = navigator as NavigatorWithHints
  const narrow = window.matchMedia('(max-width: 700px)').matches
  const limited = device.connection?.saveData
    || (device.deviceMemory !== undefined && device.deviceMemory <= 2)
    || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)

  if (narrow || limited) return 'low'
  if ((device.deviceMemory ?? 4) >= 8 && navigator.hardwareConcurrency >= 8) return 'high'
  return 'medium'
}
