import type { ProjectSystem } from '@/lib/content'
import TechnicalFlow from './TechnicalFlow'

function Contributions({ items }: { items: string[] }) {
  return (
    <ul className="contribution-list">
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  )
}

export default function ProjectRecord({ project, index }: { project: ProjectSystem; index: number }) {
  const featured = index < 2

  return (
    <article className={`project-record${featured ? ' project-record-featured' : ' project-record-supporting'} project-record-${index + 1}`} aria-labelledby={`project-${project.id}`}>
      <div className="project-record-index">
        <span>PROJECT / {String(index + 1).padStart(2, '0')}</span>
        <span>{project.year}</span>
      </div>
      <div className="project-record-content">
        <div className="project-record-heading">
          <div>
            <p className="project-domain">{project.domain}</p>
            <h3 id={`project-${project.id}`}>{project.name}</h3>
            <p className="project-subtitle">{project.subtitle}</p>
          </div>
          <span className={`project-status ${project.status.toLowerCase().includes('development') ? 'project-status-pending' : ''}`}>
            <i aria-hidden="true" />{project.status}
          </span>
        </div>

        {featured ? (
          <>
            <div className="project-brief-grid">
              <section><h4>Problem</h4><p>{project.problem}</p></section>
              <section><h4>System</h4><p>{project.solution}</p></section>
            </div>
            <div className="project-evidence-grid">
              <section className="project-contributions"><h4>Contribution</h4><Contributions items={project.responsibilities} /></section>
              <TechnicalFlow project={project} />
            </div>
            <p className="project-stack"><span>TECHNOLOGY</span>{project.stack.join(' · ')}</p>
          </>
        ) : (
          <>
            <p className="supporting-problem">{project.problem}</p>
            <p className="project-stack"><span>TECHNOLOGY</span>{project.stack.join(' · ')}</p>
            <details className="supporting-details">
              <summary>Open project record <span aria-hidden="true">＋</span></summary>
              <div className="supporting-detail-grid">
                <section><h4>System</h4><p>{project.solution}</p></section>
                <section><h4>Contribution</h4><Contributions items={project.responsibilities} /></section>
                <TechnicalFlow project={project} compact />
              </div>
            </details>
          </>
        )}
      </div>
    </article>
  )
}
