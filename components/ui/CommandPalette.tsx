'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { LAYERS } from '@/system/layers'
import { projectSystems, identity } from '@/lib/content'
import { scrollToId } from '@/lib/lenis'

interface Cmd { id: string; label: string; desc?: string; action: () => void }

// Use lenis-aware scrollToId everywhere
function navTo(anchor: string) { scrollToId(anchor, 0) }

export default function CommandPalette() {
  const [open,   setOpen]   = useState(false)
  const [query,  setQuery]  = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const ALL: Cmd[] = [
    ...LAYERS.map(l => ({
      id:     l.id,
      label:  `→ ${l.codename}`,
      desc:   `Navigate to layer ${String(l.index).padStart(2, '0')}`,
      action: () => navTo(l.anchor),
    })),
    ...projectSystems.map(s => ({
      id:     `sys-${s.id}`,
      label:  s.name,
      desc:   s.subtitle,
      action: () => navTo('layer-systems'),
    })),
    { id: 'email',  label: 'Send email ↗',  desc: identity.email,  action: () => window.open(`mailto:${identity.email}`) },
    { id: 'github', label: 'GitHub ↗',      desc: identity.github, action: () => window.open(identity.github, '_blank') },
    { id: 'resume', label: 'Download résumé', desc: 'PDF resume', action: () => window.open(identity.resume, '_blank') },
    { id: 'top',    label: '↑ Back to top',  desc: 'Return to Layer 01', action: () => navTo('layer-core') },
  ]

  const filtered = ALL.filter(c => {
    const q = query.toLowerCase()
    return !q || c.label.toLowerCase().includes(q) || c.desc?.toLowerCase().includes(q)
  })

  const close = useCallback(() => { setOpen(false); setQuery(''); setCursor(0) }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(v => !v) }
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 40) }, [open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
    if (e.key === 'Enter' && filtered[cursor]) { filtered[cursor].action(); close() }
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-sm"
      style={{
        padding:      '7px 12px',
        background:   'rgba(5,5,10,0.9)',
        border:       '1px solid var(--wire-bright)',
        backdropFilter: 'blur(16px)',
        color:        'var(--text-2)',
        fontFamily:   'var(--font-mono)',
        fontSize:     '0.6rem',
        letterSpacing:'0.12em',
      }}
      aria-label="Open command palette — Ctrl+K"
      data-hover="true"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      ⌘K
    </button>
  )

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center"
      style={{ paddingTop: 'clamp(80px,14vh,140px)', paddingLeft: '16px', paddingRight: '16px' }}
      role="dialog" aria-modal="true" aria-label="Command palette"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(2,2,4,0.85)', backdropFilter: 'blur(20px)' }}
        onClick={close}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-[560px] rounded-sm"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--wire-bright)', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--wire)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: 'var(--text-2)', flexShrink: 0 }}>
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text" value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0) }}
            onKeyDown={onKeyDown}
            placeholder="Navigate system…"
            className="flex-1 bg-transparent focus:outline-none"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-0)', letterSpacing: '0.02em' }}
            autoComplete="off" spellCheck={false}
          />
          <kbd className="t-system px-1.5 py-0.5 rounded" style={{ border: '1px solid var(--wire)' }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '320px', overflowY: 'auto', overflowX: 'hidden' }}>
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center t-system">No results</div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => { cmd.action(); close() }}
                onMouseEnter={() => setCursor(i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left focus:outline-none"
                style={{
                  background:  i === cursor ? 'rgba(99,179,237,0.08)' : 'transparent',
                  borderLeft:  `2px solid ${i === cursor ? 'var(--pulse)' : 'transparent'}`,
                }}
                data-hover="true"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="t-mono" style={{ color: i === cursor ? 'var(--text-0)' : 'var(--text-1)' }}>
                    {cmd.label}
                  </span>
                  {cmd.desc && <span className="t-system">{cmd.desc}</span>}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-5 px-4 py-2" style={{ borderTop: '1px solid var(--wire)' }}>
          {['↑↓ navigate', '↵ select', 'esc close'].map(h => (
            <span key={h} className="t-system">{h}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
