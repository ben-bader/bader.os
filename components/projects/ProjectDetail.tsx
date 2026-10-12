import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react'
import type { Project } from '@/types/project'

function DetailSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null
  return <section className="project-detail-section"><h2>{title}</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></section>
}

export default function ProjectDetail({ project, allProjects }: { project: Project; allProjects: Project[] }) {
  const index = allProjects.findIndex(item => item.id === project.id)
  const previous = index > 0 ? allProjects[index - 1] : undefined
  const next = index < allProjects.length - 1 ? allProjects[index + 1] : undefined
  return (
    <main id="main-content" className="project-detail page-wrap">
      <nav className="project-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/projects">Projects</Link><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span>
      </nav>
      <header className="project-detail-header">
        <p className="eyebrow"><span>{project.category}</span>{project.status && <><i aria-hidden="true">·</i>{project.status.replace('-', ' ')}</>}</p>
        <h1>{project.title}</h1>
        <p className="project-detail-lede">{project.summary}</p>
        <div className="project-detail-actions">
          {project.repositoryUrl && <a className="button button-primary" href={project.repositoryUrl} target="_blank" rel="noreferrer">View repository <ExternalLink aria-hidden="true" size={16} /></a>}
          {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Open live project <ArrowUpRight aria-hidden="true" size={15} /></a>}
        </div>
      </header>

      <div className="project-detail-grid">
        <div className="project-detail-main">
          <section className="project-detail-section"><h2>Overview</h2><p>{project.description}</p></section>
          <DetailSection title="Highlights" items={project.highlights} />
          <DetailSection title="Features" items={project.features} />
          <DetailSection title="Architecture" items={project.architecture ?? []} />
          <DetailSection title="Challenges" items={project.challenges ?? []} />
          <DetailSection title="What I learned" items={project.learnings ?? []} />
          {project.role && <section className="project-detail-section"><h2>My role</h2><p>{project.role}</p></section>}
          {project.team && <section className="project-detail-section"><h2>Team</h2><p>{project.team}</p></section>}
          {project.images.length > 0 && <section className="project-detail-section"><h2>Project images</h2><div className="project-image-grid">{project.images.map(image => <figure key={image.src}><Image src={image.src} alt={image.alt} width={1200} height={800} sizes="(max-width: 700px) 100vw, 70vw" /><figcaption>{image.alt}</figcaption></figure>)}</div></section>}
        </div>
        <aside className="project-detail-aside">
          <div><h2>Technology</h2><ul className="catalog-tech">{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></div>
          <Link className="catalog-detail-link" href="/projects">Browse all projects <ArrowRight aria-hidden="true" size={15} /></Link>
        </aside>
      </div>

      {allProjects.length > 1 && <nav className="project-neighbors" aria-label="Other projects">
        {previous ? <Link href={`/projects/${previous.id}`}><span><ArrowLeft aria-hidden="true" size={14} /> Previous</span><strong>{previous.title}</strong></Link> : <span />}
        {next && <Link href={`/projects/${next.id}`}><span>Next <ArrowRight aria-hidden="true" size={14} /></span><strong>{next.title}</strong></Link>}
      </nav>}
    </main>
  )
}
