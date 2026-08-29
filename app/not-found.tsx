'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center sys-grid"
      style={{ background: 'var(--void)' }}
    >
      <div className="flex flex-col items-center gap-8 px-8 text-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="dot-warn" aria-hidden="true" />
          <span className="t-system" style={{ color: 'var(--warn)' }}>ERROR 404</span>
        </div>
        <span
          className="font-thin tabular-nums"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(6rem,20vw,16rem)',
            letterSpacing: '-0.06em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.08)',
          }}
          aria-hidden="true"
        >
          404
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-light" style={{ color: 'var(--text-1)' }}>
            Layer not found.
          </h1>
          <p className="t-system">This node does not exist in the current system.</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-sm transition-all duration-300"
          style={{
            border: '1px solid var(--wire-accent)',
            color: 'var(--pulse)',
            background: 'rgba(99,179,237,0.06)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
          data-hover="true"
        >
          ← Return to system
        </Link>
      </div>
    </main>
  )
}
