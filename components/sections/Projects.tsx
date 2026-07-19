import { projects } from '@/content/data'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ProjectCard } from '@/components/ui/ProjectCard'

export function Projects() {
  return <section id="projects" className="section projects-section" aria-labelledby="projects-title"><ScrollReveal><div className="section-heading projects-heading"><p className="eyebrow">Selected work</p><h2 id="projects-title">Built for people.<br />Structured for scale.</h2></div></ScrollReveal><div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div></section>
}
