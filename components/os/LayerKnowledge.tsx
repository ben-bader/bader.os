import { projectSystems, techByCategory } from '@/lib/content'
import SectionHeading from './SectionHeading'

function projectEvidence(technology: string) {
  return projectSystems.filter(project => project.stack.includes(technology)).map(project => project.name)
}

export default function LayerKnowledge() {
  return (
    <section className="knowledge-section" id="layer-knowledge" aria-labelledby="knowledge-heading">
      <div className="page-wrap">
        <SectionHeading
          index="04"
          label="KNOWLEDGE / CAPABILITY MAP"
          title="Tools in context."
          description="The technologies below are grouped by role. Where a project association is recorded, it appears beside the technology."
          headingId="knowledge-heading"
        />
        <div className="knowledge-register">
          {Object.entries(techByCategory).map(([category, technologies], categoryIndex) => (
            <section className="knowledge-domain" key={category}>
              <h3><span>04.{categoryIndex + 1}</span>{category}</h3>
              <ul>
                {technologies.map(technology => {
                  const projects = projectEvidence(technology)
                  return (
                    <li key={technology}>
                      <span className="knowledge-name">{technology}</span>
                      <span className="knowledge-evidence">{projects.length ? projects.join(' · ') : 'Listed in CV; no project association recorded'}</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
