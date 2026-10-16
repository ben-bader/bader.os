import { ArrowUpRight } from 'lucide-react'
import { identity } from '@/lib/content'
import SectionIntro from '../SectionIntro'

export default function AboutSection() {
  return (
    <section className="about-section py-section max-mobile:py-16" id="about" aria-labelledby="about-title">
        <div className="mx-auto grid w-full max-w-page grid-cols-[minmax(0,1fr)] items-start gap-editorial-gap px-page-gutter wide:grid-cols-[minmax(0,1.15fr)_minmax(260px,.55fr)]">
      <div className="[&>div]:mb-[30px] [&>div>h2]:max-w-[700px]">
        <SectionIntro index="02" label="A little about me" title="Curious about the whole system." headingId="about-title" />
        <p className="mb-[15px] mt-0 max-w-[660px] text-copy-secondary text-[.96rem] leading-[1.8] max-mobile:text-[.88rem]">I’m studying computer engineering at EILCO in Calais, after completing a DUT in computer engineering in Meknès. I’m drawn to the path from a clear data model to reliable services and interfaces people can use.</p>
        <p className="mb-[15px] mt-0 max-w-[660px] text-copy-secondary text-[.96rem] leading-[1.8] max-mobile:text-[.88rem]">My project work and internships have taken me across backend services, web applications, databases, and the connections between them.</p>
      </div>
      <aside className="grid grid-cols-2 gap-x-6 gap-y-6 pt-1 max-tablet:max-w-[650px] wide:grid-cols-1 wide:gap-y-5" aria-label="Background">
        <div className="grid content-start gap-1"><span className="text-muted font-portfolio-body text-metadata tracking-[.06em] uppercase">Based in</span><strong className="text-[.85rem] font-medium">{identity.location}</strong></div>
        <div className="grid content-start gap-1"><span className="text-muted font-portfolio-body text-metadata tracking-[.06em] uppercase">Currently</span><strong className="text-[.85rem] font-medium">Computer Engineering · EILCO</strong></div>
        <div className="grid content-start gap-1"><span className="text-muted font-portfolio-body text-metadata tracking-[.06em] uppercase">Languages</span><strong className="text-[.85rem] font-medium">Arabic · French · English</strong></div>
        <a className="flex min-h-12 items-center justify-between gap-3 text-accent! no-underline hover:text-accent-hover wide:mt-1" href={identity.linkedin} target="_blank" rel="noreferrer">More about my background <ArrowUpRight aria-hidden="true" size={15} /></a>
      </aside>
        </div>
      </section>
  )
}
