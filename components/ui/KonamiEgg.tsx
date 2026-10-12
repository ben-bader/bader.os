'use client'

import { useEffect, useState } from 'react'

const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export default function KonamiEgg() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let progress: string[] = []
    const onKey = (e: KeyboardEvent) => {
      progress = [...progress, e.key].slice(-SEQ.length)
      if (progress.length === SEQ.length && progress.every((k, i) => k === SEQ[i])) {
        setActive(true)
        progress = []
        setTimeout(() => setActive(false), 5000)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ background: 'linear-gradient(135deg, var(--pulse), var(--signal), var(--active))', animation: 'konamiHue 1s linear infinite' }}
      />
      <div className="relative text-center">
        <p
          className="font-semibold leading-none"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(2rem,8vw,6rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--pulse)',
            animation: 'konamiBounce 0.5s ease infinite alternate',
            filter: 'drop-shadow(0 0 20px var(--pulse))',
          }}
        >
          ↑↑↓↓←→←→BA
        </p>
        <p className="t-system mt-4" style={{ color: 'var(--text-2)' }}>
          You found the easter egg.
        </p>
      </div>
      <style>{`
        @keyframes konamiHue    { to { filter: hue-rotate(360deg); } }
        @keyframes konamiBounce { to { transform: scale(1.04); } }
      `}</style>
    </div>
  )
}
