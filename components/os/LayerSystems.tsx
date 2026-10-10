import { projectSystems } from '@/lib/content'
import ProjectRecord from './ProjectRecord'
import SectionHeading from './SectionHeading'

export default function LayerSystems() {
  return (
    <section className="systems-section" id="layer-systems" aria-labelledby="systems-heading">
      <div className="page-wrap">
        <div className="systems-heading-row">
          <SectionHeading
            index="02"
            label="SYSTEMS / SELECTED WORK"
            title="Software, in context."
            description="Project records: the problem, the system, my contribution, and the relationships between its parts."
            dark
            headingId="systems-heading"
          />
        </div>
        <div className="project-records">
          {projectSystems.map((project, index) => <ProjectRecord key={project.id} project={project} index={index} />)}
        </div>
      </div>
    </section>
  )
}
