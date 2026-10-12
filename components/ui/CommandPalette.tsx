'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { LAYERS } from '@/system/layers'
import { identity } from '@/lib/content'
import { scrollToId } from '@/lib/lenis'

interface Cmd {
  id: string
  label: string
  desc: string
  action: () => void
}

const BODY_FONT = 'var(--font-body)'

const LAYER_DESCS: Record<string, string> = {
  core:         'Identity, stack overview, availability',
  memory:       'Education, internships, project timeline',
  knowledge:    'Technology graph and skill connections',
  systems:      'Engineered projects and architecture',
  process:      'Engineering workflow and methodology',
  intelligence: 'Metrics, capabilities, and impact',
  legacy:       'Contact and final transmission',
}

export default function CommandPalette() {
  const [open,   setOpen]   = useState(false)
  const [query,  setQuery]  = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  const ALL: Cmd[] = [
    ...LAYERS.map(l => ({
      id:     l.id,
      label:  `${String(l.index).padStart(2, '0')}  ${l.codename}`,
      desc:   LAYER_DESCS[l.id] ?? '',
      action: () => scrollToId(l.anchor, 0),
    })),
    {
      id:     'github',
      label:  'GitHub',
      desc:   identity.github.replace('https://', ''),
      action: () => window.open(identity.github, '_blank'),
    },
    {
      id:     'email',
      label:  'Send email',
      desc:   identity.email,
      action: () => window.open(`mailto:${identity.email}`),
    },
    {
      id:     'resume',
      label:  'Download résumé',
      desc:   'PDF · opens in new tab',
      action: () => window.open(identity.resume, '_blank'),
    },
    {
      id:     'top',
      label:  'Back to top',
      desc:   'Return to Layer 01 — CORE',
      action: () => scrollToId('layer-core', 0),
    },
  ]

  const filtered = ALL.filter(cmd => {
    const q = query.toLowerCase().trim()
    return !q || cmd.label.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q)
  })

  // Ensure cursor is always within bounds using useMemo
  const safeCursor = useMemo(() => {
    return cursor >= filtered.length ? Math.max(filtered.length - 1, 0) : cursor
  }, [cursor, filtered.length])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setCursor(0)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector('[data-active="true"]') as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [safeCursor])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(c => Math.min(c + 1, Math.max(filtered.length - 1, 0)))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(c => Math.max(c - 1, 0))
    }
    if (e.key === 'Enter' && filtered[safeCursor]) {
      filtered[safeCursor].action()
      close()
    }
  }

  /* ── Trigger button ── */
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette — Ctrl+K"
        data-hover="true"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '6px',
          background: 'rgba(5,5,10,0.92)',
          backdropFilter: 'blur(12px)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--wire-bright)',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: 'var(--wire-bright)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--wire-bright)',
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'var(--wire-bright)',
          color: 'var(--text-2)',
          fontFamily: BODY_FONT,
          fontSize: '0.6875rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          cursor: 'pointer',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>⌘K</span>
      </button>
    )
  }

  /* ── Panel ── */
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0 16px',
        paddingTop: 'clamp(80px, 12vh, 140px)',
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(2,2,4,0.75)',
          backdropFilter: 'blur(12px)',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '580px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'var(--surface-2)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--wire-bright)',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: 'var(--wire)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--wire)',
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'var(--wire)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        }}
      >
        {/* Search row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'var(--wire)',
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0, color: 'var(--text-3)' }}
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0) }}
            onKeyDown={onKeyDown}
            placeholder="Navigate system..."
            autoComplete="off"
            spellCheck={false}
            aria-label="Search"
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: BODY_FONT,
              fontSize: '0.8125rem',
              fontWeight: 400,
              letterSpacing: '0.01em',
              color: 'var(--text-0)',
            }}
          />

          <kbd
            aria-hidden="true"
            style={{
              flexShrink: 0,
              fontFamily: BODY_FONT,
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: 'var(--text-3)',
              background: 'rgba(255,255,255,0.04)',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'rgba(255,255,255,0.08)',
              borderRightWidth: '1px',
              borderRightStyle: 'solid',
              borderRightColor: 'rgba(255,255,255,0.08)',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'rgba(255,255,255,0.08)',
              borderLeftWidth: '1px',
              borderLeftStyle: 'solid',
              borderLeftColor: 'rgba(255,255,255,0.08)',
              borderRadius: '4px',
              padding: '3px 6px',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          role="listbox"
          aria-label="Results"
          style={{
            padding: '6px',
            maxHeight: '340px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                fontFamily: BODY_FONT,
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--text-3)',
                letterSpacing: '0.08em',
              }}
            >
              No results
            </div>
          ) : (
            filtered.map((cmd, i) => {
              const active = i === safeCursor
              return (
                <button
                  key={cmd.id}
                  type="button"
                  data-active={active}
                  data-hover="true"
                  onClick={() => { cmd.action(); close() }}
                  onMouseEnter={() => setCursor(i)}
                  aria-pressed={active}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: '5px',
                    background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                    borderTopWidth: '0',
                    borderTopStyle: 'solid',
                    borderTopColor: 'transparent',
                    borderRightWidth: '0',
                    borderRightStyle: 'solid',
                    borderRightColor: 'transparent',
                    borderBottomWidth: '0',
                    borderBottomStyle: 'solid',
                    borderBottomColor: 'transparent',
                    borderLeftWidth: '0',
                    borderLeftStyle: 'solid',
                    borderLeftColor: 'transparent',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background 0.1s ease',
                  }}
                >
                  <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color: active ? 'var(--text-0)' : 'var(--text-1)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap' as const,
                      }}
                    >
                      {cmd.label}
                    </span>
                    {cmd.desc && (
                      <span
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: '0.6875rem',
                          fontWeight: 400,
                          lineHeight: 1.4,
                          color: 'var(--text-3)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap' as const,
                        }}
                      >
                        {cmd.desc}
                      </span>
                    )}
                  </div>
                  {active && (
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        fontFamily: BODY_FONT,
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: 'var(--text-3)',
                      }}
                    >
                      ↵
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '10px 16px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'var(--wire)',
          }}
        >
          {(['↑↓ navigate', '↵ select', 'esc close'] as const).map(hint => (
            <span
              key={hint}
              className="t-system"
              style={{ whiteSpace: 'nowrap' as const }}
            >
              {hint}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        [role="listbox"]::-webkit-scrollbar       { width: 2px; }
        [role="listbox"]::-webkit-scrollbar-track { background: transparent; }
        [role="listbox"]::-webkit-scrollbar-thumb { background: var(--wire-bright); border-radius: 2px; }
        [role="listbox"] button:focus-visible      { outline: 1px solid var(--pulse); outline-offset: -1px; }
      `}</style>
    </div>
  )
}
