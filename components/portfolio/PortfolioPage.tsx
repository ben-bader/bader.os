import { ArrowDownRight, ArrowUpRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { identity, internships, projectSystems, TIMELINE } from '@/lib/content'
import { getFeaturedProjects, getProjectById } from '@/lib/projects'
import SiteHeader from './SiteHeader'

const featuredProjects = getFeaturedProjects().flatMap(record => {
  const system = projectSystems.find(project => project.id === record.id)
  return system ? [{ ...system, name: record.title, description: record.summary, domain: record.category, status: record.status ?? system.status, github: record.repositoryUrl ?? '', stack: record.technologies, responsibilities: record.role ? [record.role] : system.responsibilities }] : []
})
const supportingProjects = projectSystems.slice(2).flatMap(system => {
  const record = getProjectById(system.id)
  return record ? [{ ...system, name: record.title, description: record.summary, domain: record.category, status: record.status ?? system.status, github: record.repositoryUrl ?? '', stack: record.technologies }] : []
})
const chronology = [...TIMELINE]
  .filter(event => event.id !== 'diploma')
  .sort((a, b) => b.sortDate.localeCompare(a.sortDate))

function SectionIntro({
  index,
  label,
  title,
  description,
  headingId,
}: {
  index: string
  label: string
  title: string
  description?: string
  headingId: string
}) {
  return (
    <div className="section-intro">
      <p className="eyebrow"><span>{index}</span>{label}</p>
      <h2 id={headingId}>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}

function SystemMap({ projectId }: { projectId: string }) {
  const project = projectSystems.find(item => item.id === projectId)
  if (!project) return null

  return (
    <div className="system-map technical-flow" role="group" aria-label={`${project.name} documented system relationships`}>
      <div className="map-topline"><span>System map</span><span>{project.nodes.length} components · {project.edges.length} relationships</span></div>
      <div className="map-nodes">
        {project.nodes.map((node, index) => (
          <div className="map-node" key={node.id}>
            <span className="map-node-index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{node.label}</strong>
            <span>{node.role}</span>
          </div>
        ))}
      </div>
      <ul className="map-links">
        {project.edges.map(edge => {
          const source = project.nodes.find(node => node.id === edge.from)
          const target = project.nodes.find(node => node.id === edge.to)
          if (!source || !target) return null
          return (
            <li key={`${edge.from}-${edge.to}`}>
              <span>{source.label}</span><ArrowRight aria-hidden="true" size={14} />
              <span>{target.label}</span><small>{edge.label ?? edge.type}</small>
            </li>
          )
        })}
      </ul>
      <p className="map-note">Components reflect the repository or project documentation.</p>
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <section className="hero page-wrap" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="signal-dot" aria-hidden="true" />Computer engineering student <i>·</i> Calais, France</p>
            <h1 id="hero-title">Software,<br /><em>made</em> to<br />make sense.</h1>
            <div className="hero-bottom">
              <p>I’m Bader. I build full-stack software and explore how its moving parts fit together.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">Explore selected work <ArrowDownRight aria-hidden="true" size={17} /></a>
                <a className="text-link" href={identity.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight aria-hidden="true" size={15} /></a>
              </div>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit art-orbit-one" />
            <div className="art-orbit art-orbit-two" />
            <div className="art-core"><code><span>const</span> build =<br />() =&gt; <span>&quot;B&quot;</span>;</code></div>
            <span className="hero-letter-fallback">B</span>
            <span className="art-caption">A system is more<br />than its parts.</span>
            <span className="art-coordinate">01 / 06</span>
          </div>
          <a className="scroll-cue" href="#work"><span>Scroll to explore</span><ArrowDownRight aria-hidden="true" size={15} /></a>
        </section>

        <section className="work-section page-wrap" id="work" aria-labelledby="work-title">
          <SectionIntro index="01" label="Selected work" title="Real work. Clear connections." description="A closer look at the systems I’ve helped build, the choices behind them, and my part in the work." headingId="work-title" />
          <div className="featured-work">
            {featuredProjects.map((project, index) => {
              const internship = internships.find(item => item.id === (project.id === 'atlashr' ? '2sis' : 'onee'))
              return (
                <article className={`work-entry work-entry-${index + 1} project-record`} key={project.id}>
                  <div className={`work-visual${project.nodes.length > 4 ? ' work-visual-dense' : ''}`}>
                    <div className="visual-heading"><span>PROJECT / {String(index + 1).padStart(2, '0')}</span><span>{project.year}</span></div>
                    <SystemMap projectId={project.id} />
                    <span className="visual-watermark" aria-hidden="true">{project.name.slice(0, 2)}</span>
                  </div>
                  <div className="work-copy">
                    <div className="work-meta"><span>{project.domain}</span><span className="status-label"><i aria-hidden="true" />{project.status}</span></div>
                    <h3 id={`project-${project.id}`}>{project.name}</h3>
                    <p className="work-summary">{project.description}</p>
                    
                    {internship && <p className="work-context">{internship.role} · {internship.company}{internship.location ? `, ${internship.location}` : ''}</p>}
                    {project.responsibilities.length > 0 && <details className="contribution-details">
                      <summary>What I worked on <span aria-hidden="true">+</span></summary>
                      <ul>{project.responsibilities.map(item => <li key={item}>{item}</li>)}</ul>
                    </details>}
                    <ul className="tech-list" aria-label={`${project.name} technologies`}>
                      {project.stack.map(technology => <li key={technology}>{technology}</li>)}
                    </ul>
                    <Link className="project-detail-home-link" href={`/projects/${project.id}`}>View details <ArrowRight aria-hidden="true" size={14} /></Link>
                    {project.github && <a className="project-repository" href={project.github} target="_blank" rel="noreferrer">View repository <ArrowUpRight aria-hidden="true" size={14} /></a>}
                  </div>
                </article>
              )
            })}
          </div>
          <div className="supporting-work">
            <div className="supporting-heading"><p className="eyebrow"><span>Also</span> In progress &amp; explorations</p><p>More projects from the same practice.</p></div>
            <div className="supporting-list">
              {supportingProjects.map(project => (
                <article className="supporting-entry" key={project.id}>
                  <div><p className="supporting-domain">{project.domain} <span>·</span> {project.year}</p><h3>{project.name}</h3></div>
                  <div><p>{project.description}</p><ul className="tech-list">{project.stack.slice(0, 5).map(technology => <li key={technology}>{technology}</li>)}</ul><Link className="project-detail-home-link" href={`/projects/${project.id}`}>View details <ArrowRight aria-hidden="true" size={14} /></Link>{project.github && <a className="project-repository" href={project.github} target="_blank" rel="noreferrer">View repository <ArrowUpRight aria-hidden="true" size={14} /></a>}</div>
                  <span className="supporting-status">{project.status}</span>
                </article>
              ))}
            </div>
            <div className="projects-catalog-cta"><p>The full archive also includes smaller web projects and experiments.</p><Link className="button button-primary" href="/projects">More projects <ArrowRight aria-hidden="true" size={16} /></Link></div>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="page-wrap about-grid">
            <div>
              <SectionIntro index="02" label="A little about me" title="Curious about the whole system." headingId="about-title" />
              <p className="about-copy">I’m studying computer engineering at EILCO in Calais, after completing a DUT in computer engineering in Meknès. I’m drawn to the path from a clear data model to reliable services and interfaces people can use.</p>
              <p className="about-copy">My project work and internships have taken me across backend services, web applications, databases, and the connections between them.</p>
            </div>
            <aside className="about-aside" aria-label="Background">
              <div><span>Based in</span><strong>{identity.location}</strong></div>
              <div><span>Currently</span><strong>Computer Engineering · EILCO</strong></div>
              <div><span>Languages</span><strong>Arabic · French · English</strong></div>
              <a href={identity.linkedin} target="_blank" rel="noreferrer">More about my background <ArrowUpRight aria-hidden="true" size={15} /></a>
            </aside>
          </div>
        </section>

        <section className="capabilities-section page-wrap" id="capabilities" aria-labelledby="capabilities-title">
          <SectionIntro index="03" label="What I work with" title="Tools with a job to do." description="Grouped by the kind of work they support, with technologies drawn from my documented projects and studies." headingId="capabilities-title" />
          <div className="capability-list">
            {[
              { title: 'Build interfaces', items: ['TypeScript', 'React', 'Next.js', 'Laravel', 'Blade'] },
              { title: 'Build services', items: ['Java', 'Spring Boot', 'PHP', 'REST APIs', 'JWT'] },
              { title: 'Work with data', items: ['PostgreSQL', 'SQLite', 'Prisma', 'SQL'] },
              { title: 'Connect & ship', items: ['RabbitMQ', 'Docker', 'Git', 'GitHub'] },
            ].map(group => <div className="capability-row" key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}
          </div>
          <p className="capability-note">These are tools I’ve used in coursework, projects, and internships; they aren’t proficiency ratings.</p>
        </section>

        <section className="journey-section" id="journey" aria-labelledby="journey-title">
          <div className="page-wrap">
            <SectionIntro index="04" label="Journey" title="Learning by building." description="Education and internship experience, in the order it happened." headingId="journey-title" />
            <ol className="journey-list">
              {chronology.map(event => (
                <li key={event.id}>
                  <time dateTime={event.sortDate}>{event.displayDate}</time>
                  <span className="journey-marker" aria-hidden="true" />
                  <div><p className="journey-category">{event.categoryLabel}{event.status === 'current' && <span>Current</span>}</p><h3>{event.title}</h3>{event.organization && <p className="journey-org">{event.organization}{event.location ? ` · ${event.location}` : ''}</p>}<p className="journey-description">{event.description}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="contact-section page-wrap" id="contact" aria-labelledby="contact-title">
          <p className="eyebrow"><span>05</span>Contact</p>
          <div className="contact-main"><h2 id="contact-title">Have a good<br /><em>problem</em> to solve?</h2><a className="contact-email" href={`mailto:${identity.email}`}>{identity.email}<ArrowUpRight aria-hidden="true" size={17} /></a></div>
          <div className="contact-bottom"><p>Currently open to opportunities.</p><div className="contact-links"><a href={identity.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight aria-hidden="true" size={14} /></a><a href={identity.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" size={14} /></a><a href={identity.resume} target="_blank" rel="noreferrer">Résumé <ArrowUpRight aria-hidden="true" size={14} /></a></div></div>
        </section>
      </main>

      <footer className="site-footer page-wrap"><a className="footer-mark" href="#home">Bader Bennani <span>· {new Date().getFullYear()}</span></a><p>Designed around work that can be explored.</p><a href="#home">Back to top <ArrowUpRight aria-hidden="true" size={13} /></a></footer>
    </>
  )
}
