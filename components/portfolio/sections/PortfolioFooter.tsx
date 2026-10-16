import { ArrowUpRight } from 'lucide-react'

export default function PortfolioFooter() {
  return (
    <footer className="mx-auto flex min-h-[78px] w-full max-w-page items-center justify-between gap-5 border-t border-border-subtle px-page-gutter max-mobile:min-h-[82px] max-mobile:flex-wrap max-mobile:py-[14px]"><a className="text-[.72rem] font-semibold no-underline" href="#home">Bader Bennani <span className="text-muted font-normal">· {new Date().getFullYear()}</span></a><p className="m-0 text-muted text-[.66rem] max-mobile:hidden">Designed around work that can be explored.</p><a className="inline-flex min-h-10 items-center gap-[6px] text-copy-secondary no-underline text-[.65rem] transition-colors duration-fast hover:text-accent" href="#home">Back to top <ArrowUpRight aria-hidden="true" size={13} /></a></footer>
  )
}
