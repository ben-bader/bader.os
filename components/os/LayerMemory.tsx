'use client'

import { useCallback, useEffect, useState } from 'react'
import { education, internships, projectSystems } from '@/lib/content'

interface TimelineEvent {
  readonly id: string
  readonly sortDate: string  // YYYY-MM for sorting
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

// Chronological timeline: 2024 education → 2025 internship/projects → 2026 internship/diploma/education/projects
const TIMELINE: TimelineEvent[] = [
  // 2024 – Started DUT
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
      'Developed skills in web development and database design'
    ],
    status: 'completed',
  },

  // 2025 – June: ONEE Internship
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

  // 2025 – Innovex Project
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

  // 2025 – ONEE-SYS Project
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

  // 2026 – April-June: 2SIS Internship
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

  // 2026 – June: DUT Diploma Obtained
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
    description: 'Successfully completed the two-year DUT diploma in Computer Engineering. A foundation of software engineering principles, web development, databases, and networks.',
    stack: [],
    responsibilities: [
      'Completed comprehensive engineering diploma',
      'Demonstrated proficiency in core CS concepts',
      'Ready for advanced engineering studies'
    ],
    status: 'completed',
  },

  // 2026 – Started EILCO
  {
    id: 'eilco',
    sortDate: '2026-07',
    displayDate: '2026 – Present',
    title: 'Computer Engineering',
    category: 'education',
    categoryLabel: 'Education',
    color: '#9f7aea',
    organization: 'EILCO — École d\'Ingénieurs du Littoral Côte d\'Opale',
    location: 'Calais, France',
    description: education[0].description,
    stack: ['Software Engineering', 'Full-Stack', 'Databases', 'Distributed Systems'],
    responsibilities: [
      'Currently pursuing engineering degree in Computer Engineering',
      'Building on DUT foundation with advanced studies',
      'Developing full-stack and distributed systems expertise'
    ],
    status: 'current',
  },

  // 2026 – AtlasHR Project
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

  // 2026 – Homely Project
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

  // 2026 – Portfolio
  {
    id: 'portfolio',
    sortDate: '2026-10',
    displayDate: '2026',
    title: 'bader.os',
    category: 'project',
    categoryLabel: 'Project',
    color: '#e2e8f0',
    description: 'Portfolio and personal developer OS — designed as a minimalist interface highlighting my education, internship experiences, and software projects.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Portfolio Design'],
    responsibilities: ['Portfolio architecture and design', 'Career timeline presentation', 'Project showcase'],
    github: 'https://github.com/ben-bader',
    status: 'active',
  },
]

const MONO = "'SF Mono','Fira Code',monospace"

function getStatusLabel(status: 'current' | 'completed' | 'active'): string {
  if (status === 'current') return '● CURRENT'
  if (status === 'active') return '● ACTIVE'
  return ''
}

function TimelineHeader() {
  return (
    <div className="os-container relative z-10" style={{ paddingTop: 'var(--sp-7)', paddingBottom: 'var(--sp-4)' }}>
      <div className="layer-header" style={{ marginBottom: 'var(--sp-3)' }}>
        <span className="t-system" style={{ color: 'var(--pulse)' }}>L02 / MEMORY</span>
        <div className="wire-h" style={{ width: '42px' }} />
        <span className="t-system">{TIMELINE.length} MILESTONES</span>
      </div>

      <h2 className="t-heading gradient-text layer-title" style={{ marginBottom: 'var(--sp-2)' }}>
        My journey.
      </h2>

      <p style={{
        maxWidth: '760px',
        margin: 0,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
        color: 'var(--text-2)',
        lineHeight: 1.7,
      }}>
        A chronological timeline of my education, internships, and software projects.
      </p>
    </div>
  )
}

function TimelineEvent({
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
  const transition = reduced ? 'none' : 'all 0.35s ease'

  return (
    <div key={event.id} className="timeline-event">
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={onSelect}
        className="timeline-card"
        style={{
          textAlign: 'left',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
          borderLeftWidth: '2px',
          borderLeftStyle: 'solid',
          borderLeftColor: `${event.color}80`,
          background: isSelected ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
          borderRadius: '10px',
          padding: '16px 18px',
          cursor: 'pointer',
          color: 'var(--text-0)',
          transition,
          transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
          opacity: isSelected ? 1 : 0.96,
          boxShadow: isSelected ? '0 10px 24px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div style={{
          display: 'inline-flex',
          marginBottom: '12px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'rgba(255,255,255,0.12)',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: 'rgba(255,255,255,0.12)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'rgba(255,255,255,0.12)',
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'rgba(255,255,255,0.12)',
          borderRadius: '999px',
          padding: '4px 8px',
          fontFamily: MONO,
          fontSize: '0.52rem',
          letterSpacing: '1.6px',
          textTransform: 'uppercase',
          color: 'var(--text-2)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          {event.categoryLabel}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
          fontFamily: MONO,
          fontSize: '0.57rem',
          letterSpacing: '2px',
          color: 'var(--text-3)',
          textTransform: 'uppercase',
        }}>
          <span>{event.displayDate}</span>
          <span>{getStatusLabel(event.status)}</span>
        </div>

        <h3 style={{
          margin: 0,
          fontFamily: MONO,
          fontSize: '1.02rem',
          lineHeight: 1.3,
          color: 'var(--text-0)',
          fontWeight: 400,
          marginBottom: '8px',
        }}>
          {event.title}
        </h3>

        {(event.role || event.organization) && (
          <div style={{
            fontFamily: MONO,
            fontSize: '0.56rem',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: 'var(--text-2)',
            marginBottom: '12px',
          }}>
            {event.role && <div>{event.role}</div>}
            {event.organization && <div>{event.organization}</div>}
          </div>
        )}

        <p style={{
          marginTop: '0',
          marginBottom: '14px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.8rem',
          lineHeight: 1.7,
          color: 'var(--text-2)',
        }}>
          {event.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {event.stack.slice(0, 4).map(tech => (
            <span
              key={tech}
              style={{
                fontFamily: MONO,
                fontSize: '0.54rem',
                letterSpacing: '1.2px',
                padding: '4px 7px',
                borderRadius: '4px',
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
                color: 'var(--text-1)',
                background: 'rgba(255,255,255,0.01)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: MONO,
          fontSize: '0.56rem',
          letterSpacing: '1.8px',
          textTransform: 'uppercase',
          color: 'var(--pulse)',
        }}>
          View details <span aria-hidden="true">→</span>
        </span>
      </button>

      {isSelected && (
        <div className="timeline-details">
          <TimelineDetails event={event} reduced={reduced} />
        </div>
      )}
    </div>
  )
}

function TimelineDetails({
  event,
  reduced,
}: Readonly<{
  event: TimelineEvent
  reduced: boolean
}>) {
  const transition = reduced ? 'none' : 'opacity 0.35s ease, transform 0.35s ease'

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
        background: 'rgba(11, 12, 20, 0.85)',
        borderRadius: '12px',
        padding: '18px 18px 16px',
        transition,
        opacity: 1,
        transform: 'translateY(0)',
      }}
    >
      <div style={{
        marginBottom: '14px',
        fontFamily: MONO,
        fontSize: '0.56rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: event.color,
      }}>
        {event.categoryLabel} · {event.displayDate}
      </div>

      <h3 style={{
        margin: '0 0 10px',
        fontFamily: MONO,
        fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
        lineHeight: 1.25,
        color: 'var(--text-0)',
        fontWeight: 400,
      }}>
        {event.title}
      </h3>

      {(event.role || event.organization || event.location) && (
        <div style={{
          marginBottom: '14px',
          fontFamily: MONO,
          fontSize: '0.56rem',
          letterSpacing: '1.8px',
          textTransform: 'uppercase',
          color: 'var(--text-2)',
          display: 'grid',
          gap: '4px',
        }}>
          {event.role && <div>{event.role}</div>}
          {event.organization && <div>{event.organization}</div>}
          {event.location && <div>{event.location}</div>}
        </div>
      )}

      <div style={{
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
        marginBottom: '14px',
      }} />

      <p style={{
        margin: '0 0 18px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.8rem',
        lineHeight: 1.8,
        color: 'var(--text-2)',
      }}>
        {event.description}
      </p>

      {event.responsibilities.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            marginBottom: '8px',
            fontFamily: MONO,
            fontSize: '0.54rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
          }}>
            Highlights
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
            {event.responsibilities.map((item, index) => (
              <li
                key={`${event.id}-resp-${index}`}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.76rem',
                  lineHeight: 1.6,
                  color: 'var(--text-2)',
                }}
              >
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: event.color,
                  marginTop: '7px',
                  flexShrink: 0,
                }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {event.stack.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <div style={{
            marginBottom: '8px',
            fontFamily: MONO,
            fontSize: '0.54rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
          }}>
            Technology Stack
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {event.stack.map(tech => (
              <span
                key={tech}
                style={{
                  fontFamily: MONO,
                  fontSize: '0.54rem',
                  letterSpacing: '1.2px',
                  lineHeight: 1.5,
                  padding: '5px 8px',
                  borderRadius: '6px',
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

      {event.github && (
        <a
          href={event.github}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: MONO,
            fontSize: '0.56rem',
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
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
export default function LayerMemory() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (event: MediaQueryListEvent | MediaQueryList) => setReduced(event.matches)
    handler(media)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(current => current === id ? null : id)
  }, [])

  return (
    <section id="layer-memory" className="os-section" aria-label="Layer 02: Memory" style={{ background: 'var(--void)' }}>
      <style>{`
        .timeline-container {
          display: block;
          max-width: 1200px;
          margin-inline: auto;
        }

        .timeline-event {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          margin-bottom: 48px;
        }

        .timeline-card {
          width: 100%;
          max-width: 600px;
        }

        .timeline-details {
          width: 100%;
        }

        .timeline-event button:focus-visible,
        .timeline-details a:focus-visible {
          outline: 2px solid var(--pulse);
          outline-offset: 3px;
        }

        @media (max-width: 768px) {
          .timeline-event {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 32px;
          }

          .timeline-card {
            max-width: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <TimelineHeader />

      <div className="os-container" style={{ paddingBottom: 'var(--sp-7)' }}>
        <div className="timeline-container">
          {TIMELINE.map(event => (
            <TimelineEvent
              key={event.id}
              event={event}
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
