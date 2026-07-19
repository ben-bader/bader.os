import { profile } from '@/content/data'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Tag } from '@/components/ui/Tag'

export function About() {
  return <section id="about" className="section about-section" aria-labelledby="about-title"><div className="section-grid about-grid"><ScrollReveal direction="left"><p className="eyebrow">About</p><h2 id="about-title">Engineering with intent.</h2></ScrollReveal><ScrollReveal direction="right"><div className="about-copy">{profile.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="language-list">{profile.languages.map((language) => <Tag key={language.name}>{language.name} <span>— {language.level}</span></Tag>)}</div></ScrollReveal></div></section>
}
