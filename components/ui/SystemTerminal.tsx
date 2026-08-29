'use client'

import { useEffect, useRef, useState } from 'react'
import { AMBIENT_EVENTS, LOOP_EVENTS, type SystemEvent } from '@/system/events'

interface TerminalProps {
  maxLines?: number
  className?: string
}

export default function SystemTerminal({ maxLines = 12, className }: TerminalProps) {
  const [lines, setLines] = useState<SystemEvent[]>([])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let loopInterval: ReturnType<typeof setInterval> | null = null
    let loopIdx = 0

    // Initial sequence — schedule each event at its own delay
    AMBIENT_EVENTS.forEach((ev) => {
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, ev].slice(-maxLines))
      }, ev.delay ?? 0))
    })

    // Loop starts only AFTER the last initial event fires
    const lastDelay = Math.max(...AMBIENT_EVENTS.map(e => e.delay ?? 0))
    const loopStart = setTimeout(() => {
      loopInterval = setInterval(() => {
        const ev = LOOP_EVENTS[loopIdx % LOOP_EVENTS.length]
        setLines(prev => [...prev, ev].slice(-maxLines))
        loopIdx++
      }, 3500)
    }, lastDelay + 800)
    timers.push(loopStart)

    return () => {
      timers.forEach(clearTimeout)
      if (loopInterval !== null) clearInterval(loopInterval)
    }
  }, [maxLines])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [lines])

  return (
    <div
      className={`overflow-hidden ${className ?? ''}`}
      style={{ maxHeight: '180px' }}
      aria-label="System terminal" aria-live="polite"
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className={`terminal-line ${line.type}`}
          style={{
            opacity:   1 - ((lines.length - 1 - i) / maxLines) * 0.8,
            animation: 'termFade 0.3s ease both',
          }}
        >
          {line.message}
        </div>
      ))}
      <div ref={endRef} />
      <style>{`
        @keyframes termFade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
