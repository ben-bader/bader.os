'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { projects } from '@/content/data'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ProjectMotif } from '@/components/ui/ProjectMotif'
import { Tag } from '@/components/ui/Tag'
import { useReducedMotion } from '@/lib/reduced-motion'

type Project = (typeof projects)[number]

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reducedMotion = useReducedMotion()
  return <motion.article id={project.slug} className={`project-card project-card-${index}`} initial={reducedMotion ? false : { opacity: 0, y: 60 }} whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reducedMotion ? 0 : .7, ease: [0.16, 1, .3, 1] }} whileHover={reducedMotion ? {} : { y: -8 }}><GlassPanel className="project-panel"><ProjectMotif motif={project.motif} /><div className="project-content"><p className="eyebrow">{project.role}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="tag-list project-tags">{project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div><a className="project-link" href={`#${project.slug}`}>View Details <ArrowUpRight size={17} aria-hidden="true" /></a></div></GlassPanel></motion.article>
}
