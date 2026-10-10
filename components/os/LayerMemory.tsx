import { TIMELINE } from '@/lib/content'
import SectionHeading from './SectionHeading'

const chronology = [...TIMELINE].sort((a, b) => a.sortDate.localeCompare(b.sortDate))

export default function LayerMemory() {
  return (
    <section className="archive-section page-wrap" id="layer-memory" aria-labelledby="memory-heading">
      <SectionHeading
        index="03"
        label="MEMORY / TECHNICAL ARCHIVE"
        title="Study, work, iteration."
        description="A dated record of education and engineering experience."
        headingId="memory-heading"
      />
      <ol className="archive-timeline">
        {chronology.map(event => (
          <li className="archive-entry" key={event.id}>
            <time dateTime={event.sortDate}>{event.displayDate}</time>
            <div className="archive-entry-content">
              <div className="archive-meta"><span>{event.categoryLabel}</span>{event.status === 'current' && <span className="current-marker"><i aria-hidden="true" />CURRENT</span>}</div>
              <h3>{event.title}</h3>
              {event.organization && <p className="archive-organization">{event.organization}{event.location && ` · ${event.location}`}</p>}
              <p className="archive-description">{event.description}</p>
              <details className="archive-notes">
                <summary>Record details <span aria-hidden="true">＋</span></summary>
                <div>
                  <h4>Experience and study notes</h4>
                  <ul>{event.responsibilities.map((item, index) => <li key={`${event.id}-note-${index}`}>{item}</li>)}</ul>
                  {event.stack.length > 0 && <p className="archive-stack"><span>TOOLS / SUBJECTS</span>{event.stack.join(' · ')}</p>}
                </div>
              </details>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
