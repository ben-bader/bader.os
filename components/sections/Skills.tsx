'use client'

import { motion } from 'framer-motion'
import { skills } from '@/content/data'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Tag } from '@/components/ui/Tag'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useReducedMotion } from '@/lib/reduced-motion'

export function Skills() {
  const reducedMotion = useReducedMotion()
  return <section id="skills" className="section skills-section" aria-labelledby="skills-title"><ScrollReveal><div className="section-heading"><p className="eyebrow">Capabilities</p><h2 id="skills-title">Tools for the whole system.</h2></div></ScrollReveal><div className="skills-grid">{skills.map((group, index) => <ScrollReveal key={group.category} className="skill-reveal"><motion.div whileHover={reducedMotion ? {} : { scale: 1.02 }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20 }}><GlassPanel className={`skill-panel skill-panel-${index}`}><div className="wire-orb" aria-hidden="true"><i /><i /><i /></div><p className="eyebrow">{group.category}</p><div className="tag-list">{group.items.map((skill) => <Tag key={skill}>{skill}</Tag>)}</div></GlassPanel></motion.div></ScrollReveal>)}</div></section>
}
