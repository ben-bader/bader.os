import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { identity } from '@/lib/content'
import HeroSystemBlueprint from '@/components/experience/HeroSystemBlueprint'

export default function HeroSection() {
  return (
    <section className="relative mx-auto flex min-h-[min(700px,calc(100svh-78px))] w-full max-w-page items-center px-page-gutter pt-[clamp(36px,4vw,56px)] pb-[clamp(44px,5.5vw,76px)] max-mobile:min-h-[min(680px,calc(100svh-112px))] max-mobile:items-start max-mobile:pt-[205px] max-mobile:pb-[60px]" id="home" aria-labelledby="hero-title">
        <div className="relative z-content w-[min(760px,62%)] py-3 max-tablet:w-[72%] max-mobile:w-full max-mobile:pt-[10px]">
      <p className="m-0 flex items-center gap-[10px] text-copy-secondary font-portfolio-body text-[.7rem] font-medium leading-[1.5] tracking-[.075em] uppercase max-mobile:max-w-[280px] max-mobile:flex-wrap max-mobile:text-[.58rem]"><span className="size-[7px] rounded-full bg-accent shadow-[0_0_16px_rgba(198,243,107,.6)]" aria-hidden="true" />Computer engineering student <i className="text-accent not-italic">·</i> Calais, France</p>
      <h1 className="mt-[clamp(20px,2.8vw,34px)] mb-0 max-w-[850px] font-portfolio-display text-[clamp(3rem,15vw,5.8rem)] mobile:text-[clamp(4.5rem,9.3vw,9.5rem)] font-medium leading-[.87] tracking-[-.095em] max-mobile:mt-5 max-mobile:leading-[.87]" id="hero-title">Software,<br /><em className="text-accent font-normal">made</em> to<br />make sense.</h1>
      <div className="mt-[clamp(16px,2vw,28px)] flex w-[min(100%,710px)] flex-col items-start justify-center gap-[clamp(10px,1.4vw,16px)] max-tablet:mt-5 max-tablet:gap-[14px] max-mobile:mt-[18px]">
        <p className="m-0 max-w-[310px] text-muted text-base leading-[1.7] max-mobile:max-w-[320px] max-mobile:text-[.9rem]">I’m Bader. I build full-stack software and explore how its moving parts fit together.</p>
        <div className="flex min-w-0 flex-row flex-wrap items-center gap-x-[14px] gap-y-[10px] max-mobile:gap-x-[18px]">
          <a className="button button-primary min-h-12 gap-[22px] px-4 text-[.8rem] max-mobile:min-h-[46px]" href="#work">Explore selected work <ArrowDownRight aria-hidden="true" size={17} /></a>
          <a className="inline-flex min-h-10 items-center gap-2 text-copy-secondary no-underline text-[.76rem] transition-colors duration-fast hover:text-accent" href={identity.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight aria-hidden="true" size={15} /></a>
        </div>
      </div>
        </div>
      <div className="pointer-events-none absolute right-[2%] top-1/2 z-0 aspect-[25/16] w-[min(49vw,780px)] -translate-y-[52%] max-tablet:right-[2%] max-tablet:top-1/2 max-tablet:w-[min(56vw,580px)] max-tablet:opacity-[.25] max-mobile:top-1/2 max-mobile:right-0 max-mobile:bottom-auto max-mobile:w-screen max-mobile:max-w-[440px] max-mobile:-translate-y-1/2 max-mobile:opacity-[.58]">
        <HeroSystemBlueprint />
        <span className="hero-letter-fallback" aria-hidden="true">B</span>
      </div>
        <a className="absolute bottom-[34px] left-page-gutter inline-flex items-center gap-3 text-muted font-portfolio-body text-[.63rem] tracking-[.05em] uppercase no-underline max-mobile:hidden" href="#work"><span>Scroll to explore</span><ArrowDownRight className="text-accent" aria-hidden="true" size={15} /></a>
      </section>
  )
}
