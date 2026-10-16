import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[78svh] w-full max-w-page flex-col items-start justify-center px-page-gutter py-[60px]" id="main-content">
      <p className="m-0 flex items-center gap-3 text-copy-secondary font-portfolio-body text-[.7rem] font-medium leading-[1.5] tracking-[.075em] uppercase [&>span:first-child]:text-accent"><span>404</span> Nothing at this address</p>
      <h1 className="mt-[30px] mb-[35px] font-portfolio-display text-[clamp(4rem,9vw,8rem)] font-medium leading-[.9] tracking-[-.09em]">Let’s get<br /><em className="text-accent font-normal">back on track.</em></h1>
      <Link className="inline-flex min-h-12 items-center gap-[22px] rounded-control border border-transparent bg-accent px-4 text-accent-ink text-[.8rem] font-semibold no-underline transition-colors duration-fast hover:bg-accent-hover" href="/"><ArrowLeft aria-hidden="true" size={16} /> Return home</Link>
    </main>
  )
}
