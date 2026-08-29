'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { education, internships, projectSystems } from '@/lib/content'

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface TimelineEvent {
  readonly id: string
  readonly sortDate: string
  readonly displayDate: string
  readonly title: string
  readonly category: 'education' | 'internship' | 'project' | 'diploma'
  readonly categoryLabel: string
  readonly color: string
  readonly organization?: string
  readonly location?: string
  readonly role?: string
  readonly description: string
  readonly stack: string[]
  readonly responsibilities: string[]
  readonly github?: string
  readonly status: 'current' | 'completed' | 'active'
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIMELINE DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const TIMELINE: TimelineEvent[] = [
  {
    id: 'est-meknes',
    sortDate: '2024-01',
    displayDate: '2024 – 2026',
    title: 'DUT Génie Informatique',
    category: 'education',
    categoryLabel: 'Education',
    color: '#9f7aea',
    organization: 'École Supérieure de Technologie — Meknès',
    location: 'Meknès, Morocco',
    description: education[1].description,
    stack: ['Algorithms', 'OOP', 'Databases', 'Networks', 'Web Development'],
    responsibilities: [
      'Completed a two-year university technology diploma',
      'Built foundational software engineering knowledge',
      'Developed skills in web development and database design',
    ],
    status: 'completed',
  },
  {
    id: 'onee',
    sortDate: '2025-06',
    displayDate: 'June 2025',
    title: 'Software Engineering Intern',
    category: 'internship',
    categoryLabel: 'Internship',
    color: '#68d391',
    organization: 'ONEE – Branche Eau',
    location: 'Meknès, Morocco',
    role: 'Software Engineering Intern',
    description: internships[0].description,
    stack: internships[0].stack,
    responsibilities: internships[0].responsibilities,
    status: 'completed',
  },
  {
    id: 'innovex',
    sortDate: '2025-07',
    displayDate: '2025',
    title: 'Innovex',
    category: 'project',
    categoryLabel: 'Project',
    color: '#f6ad55',
    description: projectSystems.find(p => p.id === 'innovex')!.description,
    stack: projectSystems.find(p => p.id === 'innovex')!.stack,
    responsibilities: projectSystems.find(p => p.id === 'innovex')!.responsibilities,
    github: projectSystems.find(p => p.id === 'innovex')!.github,
    status: 'completed',
  },
  {
    id: 'onee-sys',
    sortDate: '2025-08',
    displayDate: '2025',
    title: 'ONEE-SYS',
    category: 'project',
    categoryLabel: 'Project',
    color: '#fc8181',
    description: projectSystems.find(p => p.id === 'onee-sys')!.description,
    stack: projectSystems.find(p => p.id === 'onee-sys')!.stack,
    responsibilities: projectSystems.find(p => p.id === 'onee-sys')!.responsibilities,
    github: projectSystems.find(p => p.id === 'onee-sys')!.github,
    status: 'completed',
  },
  {
    id: '2sis',
    sortDate: '2026-04',
    displayDate: 'April – June 2026',
    title: 'Full-Stack Developer Intern',
    category: 'internship',
    categoryLabel: 'Internship',
    color: '#48bb78',
    organization: '2SIS Technologies',
    location: 'Morocco',
    role: 'Full-Stack Developer Intern',
    description: internships[1].description,
    stack: internships[1].stack,
    responsibilities: internships[1].responsibilities,
    status: 'completed',
  },
  {
    id: 'diploma',
    sortDate: '2026-06',
    displayDate: '2026',
    title: 'Diploma Obtained',
    category: 'diploma',
    categoryLabel: 'Milestone',
    color: '#9f7aea',
    organization: 'DUT Génie Informatique',
    location: 'Meknès, Morocco',
    description:
      'Successfully completed the two-year DUT diploma in Computer Engineering. A foundation of software engineering principles, web development, databases, and networks.',
    stack: [],
    responsibilities: [
      'Completed comprehensive engineering diploma',
      'Demonstrated proficiency in core CS concepts',
      'Ready for advanced engineering studies',
    ],
    status: 'completed',
  },
  {
    id: 'eilco',
    sortDate: '2026-07',
    displayDate: '2026 – Present',
    title: 'Computer Engineering',
    category: 'education',
    categoryLabel: 'Education',
    color: '#63b3ed',
    organization: "EILCO — École d'Ingénieurs du Littoral Côte d'Opale",
    location: 'Calais, France',
    description: education[0].description,
    stack: ['Software Engineering', 'Full-Stack', 'Databases', 'Distributed Systems'],
    responsibilities: [
      'Currently pursuing engineering degree in Computer Engineering',
      'Building on DUT foundation with advanced studies',
      'Developing full-stack and distributed systems expertise',
    ],
    status: 'current',
  },
  {
    id: 'atlashr',
    sortDate: '2026-08',
    displayDate: '2026',
    title: 'AtlasHR',
    category: 'project',
    categoryLabel: 'Project',
    color: '#63b3ed',
    description: projectSystems.find(p => p.id === 'atlashr')!.description,
    stack: projectSystems.find(p => p.id === 'atlashr')!.stack,
    responsibilities: projectSystems.find(p => p.id === 'atlashr')!.responsibilities,
    github: projectSystems.find(p => p.id === 'atlashr')!.github,
    status: 'active',
  },
  {
    id: 'homely',
    sortDate: '2026-09',
    displayDate: '2026',
    title: 'Homely',
    category: 'project',
    categoryLabel: 'Project',
    color: '#76e4f7',
    description: projectSystems.find(p => p.id === 'homely')!.description,
    stack: projectSystems.find(p => p.id === 'homely')!.stack,
    responsibilities: projectSystems.find(p => p.id === 'homely')!.responsibilities,
    github: projectSystems.find(p => p.id === 'homely')!.github,
    status: 'active',
  },
  {
    id: 'portfolio',
    sortDate: '2026-10',
    displayDate: '2026',
    title: 'bader.os',
    category: 'project',
    categoryLabel: 'Project',
    color: '#e2e8f0',
    description:
      'Portfolio and personal developer OS — designed as a minimalist interface highlighting my education, internship experiences, and software projects.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Portfolio Design'],
    responsibilities: [
      'Portfolio architecture and design',
      'Career timeline presentation',
      'Project showcase',
    ],
    github: 'https://github.com/ben-bader',
    status: 'active',
  },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DETERMINISTIC LAYOUT CONFIG
   No Math.random(). All values fixed by index.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface EventLayout {
  side: 'left' | 'right'
  cardOffsetX: number   // px shift applied to card for organic feel
  marginBottom: number  // px
}

const EVENT_LAYOUTS: EventLayout[] = [
  { side: 'left',  cardOffsetX: -18, marginBottom: 72  },
  { side: 'right', cardOffsetX:  24, marginBottom: 88  },
  { side: 'left',  cardOffsetX: -8,  marginBottom: 66  },
  { side: 'right', cardOffsetX:  14, marginBottom: 84  },
  { side: 'left',  cardOffsetX: -28, marginBottom: 70  },
  { side: 'right', cardOffsetX:  20, marginBottom: 90  },
  { side: 'left',  cardOffsetX: -12, marginBottom: 64  },
  { side: 'right', cardOffsetX:  30, marginBottom: 80  },
  { side: 'left',  cardOffsetX: -20, marginBottom: 68  },
  { side: 'right', cardOffsetX:  16, marginBottom: 56  },
]

function getLayout(index: number): EventLayout {
  return EVENT_LAYOUTS[index % EVENT_LAYOUTS.length]
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONSTANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const MONO = "'SF Mono','Fira Code',monospace"

function getStatusLabel(status: 'current' | 'completed' | 'active'): string {
  if (status === 'current') return '● CURRENT'
  if (status === 'active')  return '● ACTIVE'
  return ''
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function TimelineHeader() {
  return (
    <div
      className="os-container relative z-10"
      style={{ paddingTop: 'var(--sp-7)', paddingBottom: 'var(--sp-4)' }}
    >
      <div className="layer-header" style={{ marginBottom: 'var(--sp-3)' }}>
        <span className="t-system" style={{ color: 'var(--pulse)' }}>L02 / MEMORY</span>
        <div className="wire-h" style={{ width: '42px' }} />
        <span className="t-system">{TIMELINE.length} MILESTONES</span>
      </div>

      <h2
        className="t-heading gradient-text layer-title"
        style={{ marginBottom: 'var(--sp-2)' }}
      >
        My journey.
      </h2>

      <p
        style={{
          maxWidth: '760px',
          margin: 0,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
          color: 'var(--text-2)',
          lineHeight: 1.7,
        }}
      >
        A chronological timeline of my education, internships, and software projects.
      </p>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIMELINE CARD (collapsed summary)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function TimelineCard({
  event,
  isSelected,
  onSelect,
  reduced,
}: Readonly<{
  event: TimelineEvent
  isSelected: boolean
  onSelect: () => void
  reduced: boolean
}>) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: isSelected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: isSelected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: isSelected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
        borderLeftWidth: '2px',
        borderLeftStyle: 'solid',
        borderLeftColor: isSelected ? event.color : `${event.color}55`,
        background: isSelected ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.01)',
        borderRadius: '10px',
        padding: '16px 18px',
        cursor: 'pointer',
        color: 'var(--text-0)',
        transition: reduced ? 'none' : 'all 0.3s ease',
        transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isSelected
          ? `0 8px 24px rgba(0,0,0,0.18), 0 0 0 1px ${event.color}22`
          : 'none',
      }}
    >
      {/* Category pill */}
      <div
        style={{
          display: 'inline-flex',
          marginBottom: '10px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: 'rgba(255,255,255,0.1)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'rgba(255,255,255,0.1)',
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'rgba(255,255,255,0.1)',
          borderRadius: '999px',
          padding: '3px 8px',
          fontFamily: MONO,
          fontSize: '0.5rem',
          letterSpacing: '1.6px',
          textTransform: 'uppercase' as const,
          color: 'var(--text-2)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {event.categoryLabel}
      </div>

      {/* Date + status row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '10px',
          fontFamily: MONO,
          fontSize: '0.55rem',
          letterSpacing: '2px',
          color: 'var(--text-3)',
          textTransform: 'uppercase' as const,
        }}
      >
        <span>{event.displayDate}</span>
        {getStatusLabel(event.status) && (
          <span style={{ color: event.status === 'current' ? 'var(--pulse)' : 'var(--active)' }}>
            {getStatusLabel(event.status)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontFamily: MONO,
          fontSize: '0.98rem',
          lineHeight: 1.3,
          color: 'var(--text-0)',
          fontWeight: 400,
          marginBottom: '6px',
        }}
      >
        {event.title}
      </h3>

      {/* Organization */}
      {(event.role || event.organization) && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: '0.54rem',
            letterSpacing: '1.2px',
            textTransform: 'uppercase' as const,
            color: 'var(--text-2)',
            marginBottom: '10px',
            lineHeight: 1.6,
          }}
        >
          {event.role && <div>{event.role}</div>}
          {event.organization && <div>{event.organization}</div>}
        </div>
      )}

      {/* Short description */}
      <p
        style={{
          margin: '0 0 12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.77rem',
          lineHeight: 1.65,
          color: 'var(--text-2)',
        }}
      >
        {event.description.length > 120
          ? `${event.description.slice(0, 120).trimEnd()}…`
          : event.description}
      </p>

      {/* Stack tags (up to 3) */}
      {event.stack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px', marginBottom: '10px' }}>
          {event.stack.slice(0, 3).map(tech => (
            <span
              key={tech}
              style={{
                fontFamily: MONO,
                fontSize: '0.5rem',
                letterSpacing: '1.2px',
                padding: '3px 7px',
                borderRadius: '4px',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'rgba(255,255,255,0.07)',
                borderRightWidth: '1px',
                borderRightStyle: 'solid',
                borderRightColor: 'rgba(255,255,255,0.07)',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'rgba(255,255,255,0.07)',
                borderLeftWidth: '1px',
                borderLeftStyle: 'solid',
                borderLeftColor: 'rgba(255,255,255,0.07)',
                color: 'var(--text-1)',
                background: 'rgba(255,255,255,0.01)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* View details CTA */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: MONO,
          fontSize: '0.52rem',
          letterSpacing: '1.8px',
          textTransform: 'uppercase' as const,
          color: isSelected ? event.color : 'var(--pulse)',
          transition: reduced ? 'none' : 'color 0.25s ease',
        }}
      >
        {isSelected ? 'Collapse' : 'View details'} <span aria-hidden="true">→</span>
      </span>
    </button>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DETAILS PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function DetailsPanel({
  event,
  reduced,
}: Readonly<{
  event: TimelineEvent
  reduced: boolean
}>) {
  return (
    <aside
      aria-live="polite"
      style={{
        width: '100%',
        minWidth: 0,
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
        background: 'rgba(8, 8, 18, 0.88)',
        borderRadius: '12px',
        padding: '18px 18px 16px',
        animation: reduced ? 'none' : 'detailsReveal 0.35s ease forwards',
      }}
    >
      {/* Category + date */}
      <div
        style={{
          marginBottom: '12px',
          fontFamily: MONO,
          fontSize: '0.54rem',
          letterSpacing: '2px',
          textTransform: 'uppercase' as const,
          color: event.color,
        }}
      >
        {event.categoryLabel} · {event.displayDate}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: '0 0 8px',
          fontFamily: MONO,
          fontSize: 'clamp(1rem, 2vw, 1.35rem)',
          lineHeight: 1.25,
          color: 'var(--text-0)',
          fontWeight: 400,
        }}
      >
        {event.title}
      </h3>

      {/* Meta */}
      {(event.role || event.organization || event.location) && (
        <div
          style={{
            marginBottom: '12px',
            fontFamily: MONO,
            fontSize: '0.54rem',
            letterSpacing: '1.8px',
            textTransform: 'uppercase' as const,
            color: 'var(--text-2)',
            display: 'grid',
            gap: '3px',
          }}
        >
          {event.role         && <div>{event.role}</div>}
          {event.organization && <div>{event.organization}</div>}
          {event.location     && <div>{event.location}</div>}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '12px' }} />

      {/* Description */}
      <p
        style={{
          margin: '0 0 16px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.78rem',
          lineHeight: 1.78,
          color: 'var(--text-2)',
        }}
      >
        {event.description}
      </p>

      {/* Highlights */}
      {event.responsibilities.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              marginBottom: '7px',
              fontFamily: MONO,
              fontSize: '0.52rem',
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
              color: 'var(--text-3)',
            }}
          >
            Highlights
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '7px' }}>
            {event.responsibilities.map((item, i) => (
              <li
                key={`${event.id}-r${i}`}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.74rem',
                  lineHeight: 1.6,
                  color: 'var(--text-2)',
                }}
              >
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: event.color,
                    marginTop: '7px',
                    flexShrink: 0,
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stack */}
      {event.stack.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              marginBottom: '7px',
              fontFamily: MONO,
              fontSize: '0.52rem',
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
              color: 'var(--text-3)',
            }}
          >
            Technology Stack
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
            {event.stack.map(tech => (
              <span
                key={tech}
                style={{
                  fontFamily: MONO,
                  fontSize: '0.52rem',
                  letterSpacing: '1.2px',
                  padding: '4px 7px',
                  borderRadius: '5px',
                  borderTopWidth: '1px',
                  borderTopStyle: 'solid',
                  borderTopColor: 'rgba(255,255,255,0.07)',
                  borderRightWidth: '1px',
                  borderRightStyle: 'solid',
                  borderRightColor: 'rgba(255,255,255,0.07)',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'rgba(255,255,255,0.07)',
                  borderLeftWidth: '1px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: 'rgba(255,255,255,0.07)',
                  color: 'var(--text-1)',
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* GitHub link */}
      {event.github && (
        <a
          href={event.github}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: MONO,
            fontSize: '0.54rem',
            letterSpacing: '1.8px',
            textTransform: 'uppercase' as const,
            color: 'var(--pulse)',
            textDecoration: 'none',
          }}
        >
          Source Repository ↗
        </a>
      )}
    </aside>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TIMELINE ROW — alternating left / right
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function TimelineRow({
  event,
  index,
  isSelected,
  onSelect,
  reduced,
}: Readonly<{
  event: TimelineEvent
  index: number
  isSelected: boolean
  onSelect: () => void
  reduced: boolean
}>) {
  const layout = getLayout(index)
  const isLeft = layout.side === 'left'

  const { ref: rowRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.12,
    once: true,
  })

  // Connector animation: draws from card edge toward the central dot
  // left side: connector extends rightward from card to center dot
  // right side: connector extends leftward from card to center dot

  return (
    <div
      ref={rowRef}
      style={{ marginBottom: `${layout.marginBottom}px`, position: 'relative' }}
      data-timeline-row
    >
      {/* ── DESKTOP: grid layout ── */}
      <div className="tl-row-desktop">
        {/* Left slot */}
        <div className="tl-slot tl-slot-left">
          {isLeft && (
            <div
              className="tl-card-wrap tl-card-left"
              style={{
                transform: inView
                  ? `translateX(${layout.cardOffsetX}px)`
                  : `translateX(${layout.cardOffsetX - 24}px)`,
                opacity: inView ? 1 : 0,
                transition: reduced
                  ? 'none'
                  : `opacity 0.45s ease 0.3s, transform 0.45s var(--ease-sys) 0.3s`,
              }}
            >
              <TimelineCard
                event={event}
                isSelected={isSelected}
                onSelect={onSelect}
                reduced={reduced}
              />
              {isSelected && (
                <div className="tl-details-inline" style={{ marginTop: '14px' }}>
                  <DetailsPanel event={event} reduced={reduced} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center column: connector + marker */}
        <div className="tl-center">
          {/* Connector line */}
          <svg
            className={`tl-connector tl-connector-${isLeft ? 'left' : 'right'}`}
            aria-hidden="true"
            style={{
              opacity: inView ? 1 : 0,
              transition: reduced ? 'none' : `opacity 0.3s ease ${0.15}s`,
            }}
          >
            <line
              x1={isLeft ? '100%' : '0%'}
              y1="50%"
              x2={isLeft ? '0%' : '100%'}
              y2="50%"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              className={inView && !reduced ? 'tl-connector-line-animate' : ''}
              style={{
                strokeDasharray: '100%',
                strokeDashoffset: inView && !reduced ? '0' : '100%',
                transition: reduced ? 'none' : `stroke-dashoffset 0.55s var(--ease-sys) ${0.2}s`,
              }}
            />
          </svg>

          {/* Marker dot */}
          <div
            className={`tl-marker ${isSelected ? 'tl-marker-active' : ''}`}
            style={{
              background: isSelected ? event.color : 'rgba(255,255,255,0.18)',
              boxShadow: isSelected ? `0 0 10px ${event.color}88` : 'none',
              opacity: inView ? 1 : 0,
              transform: inView ? 'scale(1)' : 'scale(0.4)',
              transition: reduced
                ? 'none'
                : `opacity 0.3s ease ${0.1}s, transform 0.35s var(--ease-sys) ${0.1}s, background 0.25s ease, box-shadow 0.25s ease`,
            }}
            aria-hidden="true"
          />
        </div>

        {/* Right slot */}
        <div className="tl-slot tl-slot-right">
          {!isLeft && (
            <div
              className="tl-card-wrap tl-card-right"
              style={{
                transform: inView
                  ? `translateX(${layout.cardOffsetX}px)`
                  : `translateX(${layout.cardOffsetX + 24}px)`,
                opacity: inView ? 1 : 0,
                transition: reduced
                  ? 'none'
                  : `opacity 0.45s ease 0.3s, transform 0.45s var(--ease-sys) 0.3s`,
              }}
            >
              <TimelineCard
                event={event}
                isSelected={isSelected}
                onSelect={onSelect}
                reduced={reduced}
              />
              {isSelected && (
                <div className="tl-details-inline" style={{ marginTop: '14px' }}>
                  <DetailsPanel event={event} reduced={reduced} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE: single column ── */}
      <div className="tl-row-mobile">
        {/* Marker + connector row */}
        <div className="tl-mobile-marker-row">
          <div
            className={`tl-marker ${isSelected ? 'tl-marker-active' : ''}`}
            style={{
              background: isSelected ? event.color : 'rgba(255,255,255,0.18)',
              boxShadow: isSelected ? `0 0 10px ${event.color}88` : 'none',
              transition: reduced ? 'none' : 'background 0.25s ease, box-shadow 0.25s ease',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Card */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(16px)',
            transition: reduced ? 'none' : 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
          }}
        >
          <TimelineCard
            event={event}
            isSelected={isSelected}
            onSelect={onSelect}
            reduced={reduced}
          />
          {isSelected && (
            <div style={{ marginTop: '12px' }}>
              <DetailsPanel event={event} reduced={reduced} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VERTICAL TIMELINE LINE (SVG, draws on mount)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function TimelineLine({ reduced }: Readonly<{ reduced: boolean }>) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.04, once: true })
  return (
    <div ref={ref} className="tl-line-wrap" aria-hidden="true">
      <div
        className="tl-line"
        style={{
          transform: inView ? 'scaleY(1)' : 'scaleY(0)',
          transition: reduced ? 'none' : 'transform 0.7s var(--ease-sys)',
        }}
      />
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ROOT EXPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function LayerMemory() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reduced, setReduced] = useState<boolean>(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setReduced(e.matches)
    handler(media)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(cur => (cur === id ? null : id))
  }, [])

  return (
    <section
      id="layer-memory"
      className="os-section"
      aria-label="Layer 02: Memory"
      style={{ background: 'var(--void)' }}
    >
      {/* ── Scoped styles ── */}
      <style>{`
        /* ── Timeline container ── */
        .tl-outer {
          position: relative;
          max-width: 1100px;
          margin-inline: auto;
        }

        /* ── Desktop row: 3-column grid ── */
        .tl-row-desktop {
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          align-items: center;
          gap: 0;
        }
        .tl-row-mobile {
          display: none;
        }

        /* Card slot constraints */
        .tl-slot {
          display: flex;
          min-width: 0;
        }
        .tl-slot-left  { justify-content: flex-end;  padding-right: 0; }
        .tl-slot-right { justify-content: flex-start; padding-left: 0; }

        .tl-card-wrap {
          width: 100%;
          max-width: 520px;
        }
        .tl-card-left  { margin-right: 0; }
        .tl-card-right { margin-left: 0;  }

        /* Hover nudge — slight outward nudge; override handled per-card via JS transform */
        .tl-card-left:hover  { filter: brightness(1.04); }
        .tl-card-right:hover { filter: brightness(1.04); }

        /* ── Center column ── */
        .tl-center {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          z-index: 2;
        }

        /* ── Connector SVG ── */
        .tl-connector {
          position: absolute;
          top: 50%;
          height: 1px;
          width: 56px;
          overflow: visible;
          pointer-events: none;
        }
        .tl-connector-left  { right: 50%; transform: translateY(-50%); }
        .tl-connector-right { left: 50%;  transform: translateY(-50%); }

        /* ── Marker dot ── */
        .tl-marker {
          position: relative;
          z-index: 3;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tl-marker-active {
          width: 11px;
          height: 11px;
        }

        /* ── Vertical timeline line ── */
        .tl-line-wrap {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          z-index: 1;
          pointer-events: none;
        }
        .tl-line {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255,255,255,0.08) 6%,
            rgba(255,255,255,0.08) 94%,
            transparent 100%
          );
          transform-origin: top center;
        }

        /* ── Details inline (desktop) ── */
        .tl-details-inline {
          width: 100%;
        }

        /* ── Mobile layout ── */
        @media (max-width: 767px) {
          .tl-row-desktop { display: none; }
          .tl-row-mobile {
            display: grid;
            grid-template-columns: 32px 1fr;
            gap: 0 12px;
            align-items: start;
          }
          .tl-mobile-marker-row {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 18px;
          }
          /* Mobile vertical line through center of marker column */
          .tl-outer::before {
            content: '';
            position: absolute;
            top: 0; bottom: 0;
            left: calc(var(--container-px) + 15px);
            width: 1px;
            background: rgba(255,255,255,0.06);
            pointer-events: none;
          }
          .tl-line-wrap { display: none; }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .tl-card-wrap { max-width: 420px; }
        }

        /* ── Detail panel entrance ── */
        @keyframes detailsReveal {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Focus rings ── */
        .tl-row-desktop button:focus-visible,
        .tl-row-mobile  button:focus-visible,
        .tl-details-inline a:focus-visible {
          outline: 2px solid var(--pulse);
          outline-offset: 3px;
        }

        /* ── Reduced motion override ── */
        @media (prefers-reduced-motion: reduce) {
          .tl-line,
          .tl-marker,
          .tl-connector,
          .tl-card-wrap,
          .tl-row-mobile > div {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            translate: none !important;
          }
          @keyframes detailsReveal {
            from { opacity: 1; transform: none; }
            to   { opacity: 1; transform: none; }
          }
        }
      `}</style>

      <TimelineHeader />

      <div className="os-container" style={{ paddingBottom: 'var(--sp-7)' }}>
        <div className="tl-outer">
          {/* Vertical center line */}
          <TimelineLine reduced={reduced} />

          {/* Events */}
          {TIMELINE.map((event, index) => (
            <TimelineRow
              key={event.id}
              event={event}
              index={index}
              isSelected={selectedId === event.id}
              onSelect={() => handleSelect(event.id)}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
