import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const lerp   = (a: number, b: number, t: number) => a + (b - a) * t
export const clamp  = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
export const map    = (v: number, a1: number, b1: number, a2: number, b2: number) =>
  a2 + ((v - a1) / (b1 - a1)) * (b2 - a2)
export const rand   = (min: number, max: number) => Math.random() * (max - min) + min
export const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
export const easeInOutExpo = (t: number) =>
  t === 0 ? 0 : t === 1 ? 1
    : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2

export const formatNum = (n: number) =>
  n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)

export const pad = (n: number, len = 2) => String(n).padStart(len, '0')

/** Pseudo-random but deterministic for SSR */
export const seededRand = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}
