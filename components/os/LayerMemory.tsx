'use client'

import { useCallback, useEffect, useState } from 'react'
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
   TIMELINE DATA  (chronological)
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
   DETERMINISTIC ROW SPACING
   Only bottom margin varies — no horizontal offsets.
   Horizontal offsets break connector alignment.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ROW_MARGINS = [72, 80, 68, 84, 76, 88, 64, 80, 72, 60]

function rowMargin(index: number): number {
  return ROW_MARGINS[index % ROW_MARGINS.length]
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HELPERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const MONO = "'SF Mono','Fira Code',monospace"

function statusLabel(status: 'current' | 'completed' | 'active'): string {
  if (status === 'current') return '● CURRENT'
  if (status === 'active')  return '● ACTIVE'
  return ''
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION HEADER
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
   TIMELINE CARD
   Border: all four sides use the same longhand
   properties — no shorthand mixing, no React warnings.
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
  const borderColor = isSelected
    ? 'rgba(255,255,255,0.18)'
    : 'rgba(255,255,255,0.07)'

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      data-hover="true"
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        /* Four-sided uniform border — never mix with border shorthand */
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: borderColor,
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: borderColor,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: borderColor,
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
        borderLeftColor: borderColor,
        background: isSelected ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.01)',
        borderRadius: '10px',
        padding: '16px 18px',
        cursor: 'pointer',
        color: 'var(--text-0)',
        transition: reduced ? 'none' : 'border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: isSelected ? '0 6px 20px rgba(0,0,0,0.2)' : 'none',
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

      {/* Date + status */}
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
        {statusLabel(event.status) && (
          <span style={{ color: event.status === 'current' ? 'var(--pulse)' : 'var(--active)' }}>
            {statusLabel(event.status)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: '0 0 6px',
          fontFamily: MONO,
          fontSize: '0.98rem',
          lineHeight: 1.3,
          color: 'var(--text-0)',
          fontWeight: 400,
        }}
      >
        {event.title}
      </h3>

      {/* Org / role */}
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
          {event.role         && <div>{event.role}</div>}
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

      {/* Stack tags */}
      {event.stack.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px', marginBottom: '12px' }}>
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

      {/* CTA */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: MONO,
          fontSize: '0.52rem',
          letterSpacing: '1.8px',
          textTransform: 'uppercase' as const,
          color: 'var(--pulse)',
          transition: reduced ? 'none' : 'opacity 0.2s ease',
          opacity: isSelected ? 0.6 : 1,
        }}
      >
        {isSelected ? 'Collapse' : 'View details'}{' '}
        <span aria-hidden="true">→</span>
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
}: Readonly<{ event: TimelineEvent; reduced: boolean }>) {
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
        background: 'rgba(8,8,18,0.88)',
        borderRadius: '10px',
        padding: '18px',
        animation: reduced ? 'none' : 'tlDetailsIn 0.3s ease forwards',
      }}
    >
      {/* Category + date */}
      <div
        style={{
          marginBottom: '10px',
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
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
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

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '12px' }} />

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

      {/* GitHub */}
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
   TIMELINE ROW

   Layout: 3-column CSS grid
     [card slot — ~45%] [center — 48px] [card slot — ~45%]

   The vertical timeline runs through the exact center
   of the middle column.  The connector SVG spans
   from the card edge to the marker.  No translateX
   offsets on cards — that breaks connector alignment.

   Even index  → card in LEFT  slot, right slot empty
   Odd  index  → card in RIGHT slot, left  slot empty
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
  const isLeft = index % 2 === 0

  const { ref: rowRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  })

  const cardAnim: React.CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'translateY(0)'
          : `translateY(12px)`,
        transition: 'opacity 0.4s ease 0.25s, transform 0.4s var(--ease-sys) 0.25s',
      }

  const markerAnim: React.CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transform: inView ? 'scale(1)' : 'scale(0.3)',
        transition: 'opacity 0.3s ease 0.1s, transform 0.3s var(--ease-sys) 0.1s',
      }

  /* Connector: horizontal SVG line bridging the gap between
     the card edge and the marker dot centre.
     We size it to exactly fill the gap between the card
     boundary and the marker (half of the 48px centre column). */
  const connectorAnim: React.CSSProperties = reduced
    ? {}
    : {
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.3s ease 0.15s',
      }

  return (
    <div
      ref={rowRef}
      style={{ marginBottom: `${rowMargin(index)}px` }}
    >
      {/* ── DESKTOP 3-column grid ── */}
      <div className="tl-row-desktop">

        {/* LEFT card slot */}
        <div className="tl-slot-left">
          {isLeft ? (
            <div className="tl-card-wrap" style={cardAnim}>
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
          ) : null}
        </div>

        {/* CENTER: connector + marker */}
        <div className="tl-center-col">
          {/* Connector line — spans from card edge to marker */}
          <div
            className={isLeft ? 'tl-connector-left' : 'tl-connector-right'}
            style={connectorAnim}
            aria-hidden="true"
          />
          {/* Marker dot */}
          <div
            className="tl-marker"
            style={{
              ...markerAnim,
              background: isSelected ? event.color : 'rgba(255,255,255,0.2)',
              /* Fixed size — never change width/height on selected to avoid
                 layout shift that misaligns the connector */
              width: '8px',
              height: '8px',
              transition: (reduced ? '' : 'opacity 0.3s ease 0.1s, transform 0.3s var(--ease-sys) 0.1s, ') +
                'background 0.25s ease',
            }}
            aria-hidden="true"
          />
        </div>

        {/* RIGHT card slot */}
        <div className="tl-slot-right">
          {!isLeft ? (
            <div className="tl-card-wrap" style={cardAnim}>
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
          ) : null}
        </div>
      </div>

      {/* ── MOBILE single-column ── */}
      <div className="tl-row-mobile">
        {/* Left strip: marker */}
        <div className="tl-mobile-strip" aria-hidden="true">
          <div
            className="tl-marker"
            style={{
              background: isSelected ? event.color : 'rgba(255,255,255,0.2)',
              width: '8px',
              height: '8px',
              transition: 'background 0.25s ease',
            }}
          />
        </div>
        {/* Card */}
        <div
          style={
            reduced
              ? {}
              : {
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
                }
          }
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
   VERTICAL SPINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function TimelineSpine({ reduced }: Readonly<{ reduced: boolean }>) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.02, once: true })
  return (
    <div ref={ref} className="tl-spine-wrap" aria-hidden="true">
      <div
        className="tl-spine"
        style={{
          transform: inView ? 'scaleY(1)' : 'scaleY(0)',
          transition: reduced ? 'none' : 'transform 0.8s var(--ease-sys)',
        }}
      />
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ROOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function LayerMemory() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setReduced(e.matches)
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
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
      <style>{`
        /* ─── Outer container ─── */
        .tl-outer {
          position: relative;
          max-width: 1040px;
          margin-inline: auto;
        }

        /* ─── Desktop row
             3-column:  [left card — 1fr]  [center — 48px]  [right card — 1fr]
             The centre column is exactly 48px.  The vertical spine is centred
             within it.  Connectors span exactly half of it (24px each side).
        ─── */
        .tl-row-desktop {
          display: grid;
          grid-template-columns: 1fr 48px 1fr;
          align-items: start;
        }
        .tl-row-mobile { display: none; }

        /* Card slots — card stays grid-flush, no translateX */
        .tl-slot-left  { display: flex; justify-content: flex-end;  padding-right: 16px; }
        .tl-slot-right { display: flex; justify-content: flex-start; padding-left: 16px; }
        .tl-card-wrap  { width: 100%; max-width: 480px; }

        /* ─── Centre column ─── */
        .tl-center-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          /* Push marker to vertically align with the card's top region */
          padding-top: 20px;
        }

        /* ─── Horizontal connector lines ─── */
        /*
          Each connector is a 1px tall div.
          Width = 24px = half of the 48px centre column.
          It sits absolutely in the centre column, stretching
          from the column edge to the marker centre.
        */
        .tl-connector-left,
        .tl-connector-right {
          position: absolute;
          top: 24px;          /* aligns with padding-top of centre col */
          height: 1px;
          width: 24px;
          background: rgba(255,255,255,0.1);
          pointer-events: none;
        }
        .tl-connector-left  { right: 50%; }   /* extends leftward  toward card */
        .tl-connector-right { left:  50%; }   /* extends rightward toward card */

        /* ─── Marker dot ─── */
        .tl-marker {
          position: relative;
          z-index: 3;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ─── Vertical spine ─── */
        .tl-spine-wrap {
          position: absolute;
          top: 0; bottom: 0;
          /* Centre it on the 48px centre column.
             The centre column starts at 50% - 24px of the outer container,
             so we place the spine at exactly 50% of the outer. */
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          z-index: 1;
          pointer-events: none;
        }
        .tl-spine {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255,255,255,0.07) 4%,
            rgba(255,255,255,0.07) 96%,
            transparent 100%
          );
          transform-origin: top center;
        }

        /* ─── Focus rings ─── */
        .tl-card-wrap button:focus-visible,
        .tl-row-mobile button:focus-visible {
          outline: 1px solid var(--pulse);
          outline-offset: 2px;
          border-radius: 10px;
        }
        .tl-card-wrap a:focus-visible {
          outline: 1px solid var(--pulse);
          outline-offset: 2px;
        }

        /* ─── Details entrance ─── */
        @keyframes tlDetailsIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        /* ─── Tablet ─── */
        @media (min-width: 640px) and (max-width: 900px) {
          .tl-card-wrap { max-width: 360px; }
          .tl-slot-left  { padding-right: 10px; }
          .tl-slot-right { padding-left:  10px; }
        }

        /* ─── Mobile ─── */
        @media (max-width: 639px) {
          .tl-row-desktop { display: none; }
          .tl-row-mobile {
            display: grid;
            grid-template-columns: 32px 1fr;
            gap: 0 12px;
            align-items: start;
          }
          .tl-mobile-strip {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 20px;
          }
          /* Mobile spine: left edge of the 32px strip column */
          .tl-outer::before {
            content: '';
            position: absolute;
            top: 0; bottom: 0;
            left: calc(var(--container-px) + 15px);
            width: 1px;
            background: rgba(255,255,255,0.06);
            pointer-events: none;
          }
          .tl-spine-wrap { display: none; }
        }

        /* ─── Reduced motion ─── */
        @media (prefers-reduced-motion: reduce) {
          .tl-spine,
          .tl-marker,
          .tl-connector-left,
          .tl-connector-right,
          .tl-card-wrap,
          .tl-row-mobile > div {
            animation: none !important;
            transition: background 0.01ms !important;
            opacity: 1 !important;
            transform: none !important;
          }
          @keyframes tlDetailsIn {
            from { opacity: 1; transform: none; }
            to   { opacity: 1; transform: none; }
          }
        }
      `}</style>

      <TimelineHeader />

      <div className="os-container" style={{ paddingBottom: 'var(--sp-7)' }}>
        <div className="tl-outer">
          <TimelineSpine reduced={reduced} />

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
