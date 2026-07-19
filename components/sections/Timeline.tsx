'use client'

import { motion } from 'framer-motion'
import { experience } from '@/content/data'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useReducedMotion } from '@/lib/reduced-motion'

export function Timeline() {
  const reducedMotion = useReducedMotion()
  return <section id="experience" className="section timeline-section" aria-labelledby="timeline-title"><ScrollReveal><div className="section-heading"><p className="eyebrow">Experience</p><h2 id="timeline-title">Learning in production.</h2></div></ScrollReveal><div className="timeline">{experience.map((entry, index) => <motion.article className="timeline-entry" key={entry.title} initial={reducedMotion ? false : { opacity: 0, x: 20 }} whileInView={reducedMotion ? {} : { opacity: 1, x: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: reducedMotion ? 0 : .5, delay: reducedMotion ? 0 : index * .08 }}><span className="timeline-dot" aria-hidden="true" /><p className="eyebrow">{entry.period}</p><h3>{entry.title}</h3><p className="timeline-org">{entry.organisation}</p><p>{entry.description}</p></motion.article>)}</div></section>
}
