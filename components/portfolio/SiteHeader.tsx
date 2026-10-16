import { ArrowUpRight } from 'lucide-react'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-header flex min-h-[78px] items-center justify-between gap-6 border-b border-border-subtle bg-[rgba(16,19,21,.84)] px-page-gutter backdrop-blur-[18px] max-mobile:min-w-0 max-mobile:min-h-[68px] max-mobile:gap-[10px]">
      <a className="inline-flex w-fit items-center gap-[11px] font-portfolio-body text-[.85rem] font-semibold tracking-[-.02em] no-underline" href="#home" aria-label="Bader Bennani, home">
        <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-ink text-[1.1rem] font-bold tracking-[-.08em]" aria-hidden="true">b.</span>
        <span className="grid leading-[1.25]">Bader Bennani<small className="mt-1 text-muted text-[.64rem] font-normal tracking-[.025em]">Computer engineering</small></span>
      </a>
      <a className="inline-flex min-h-11 items-center gap-[7px] rounded-control border border-border-strong px-[14px] text-[.78rem] font-medium no-underline transition-[color,border-color] duration-fast hover:text-accent max-mobile:px-[10px] max-mobile:text-[.7rem]" href="#contact">Let’s talk <ArrowUpRight aria-hidden="true" size={15} /></a>
    </header>
  )
}
