'use client'

import { Check, Copy, Mail, Phone } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { useState } from 'react'
import { profile, socials } from '@/content/data'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => { await navigator.clipboard.writeText(profile.email); setCopied(true); window.setTimeout(() => setCopied(false), 1600) }
  return <section id="contact" className="section contact-section" aria-labelledby="contact-title"><ScrollReveal><div className="contact-heading"><p className="eyebrow">Get in touch</p><h2 id="contact-title">Let&apos;s build something.</h2><p>For a role, an internship, or a thoughtfully engineered collaboration — I&apos;d be glad to hear from you.</p></div></ScrollReveal><ScrollReveal><GlassPanel className="contact-panel"><div className="contact-row"><Mail size={18} aria-hidden="true" /><a href={`mailto:${profile.email}`}>{profile.email}</a><button type="button" className="copy-button" onClick={copyEmail} aria-label="Copy email address">{copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}</button></div><div className="contact-row"><Phone size={18} aria-hidden="true" /><a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a></div><div className="contact-socials"><a href={socials.github.url} target="_blank" rel="noreferrer"><FaGithub aria-hidden="true" />GitHub</a><a href={socials.linkedin.url} target="_blank" rel="noreferrer"><FaLinkedin aria-hidden="true" />LinkedIn</a></div></GlassPanel></ScrollReveal></section>
}
