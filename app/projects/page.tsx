import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProjectCard from '@/components/projects/ProjectCard'
import { getAllProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: "Browse Bader Bennani's software projects, applications, and frontend experiments.",
}

export default function ProjectsPage() {
  const projects = getAllProjects()
  return (
    <main id="main-content" className="projects-page page-wrap">
      <Link className="projects-back-link" href="/"><ArrowLeft aria-hidden="true" size={15} /> Back to portfolio</Link>
      <header className="projects-page-header">
        <p className="eyebrow"><span>Project archive</span> {String(projects.length).padStart(2, '0')} projects</p>
        <h1>Work, experiments<br />&amp; <em>systems.</em></h1>
        <p>Applications and interface experiments across web development, engineering, and product design.</p>
      </header>
      {projects.length ? <div className="project-catalog-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div> : <p className="projects-empty">No projects have been added to the catalog yet.</p>}
    </main>
  )
}
