import { ArrowUpRight } from 'lucide-react'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Bader Bennani, home">
        <span className="wordmark-mark" aria-hidden="true">b.</span>
        <span>Bader Bennani<small>Computer engineering</small></span>
      </a>
      <a className="header-cta" href="#contact">Let’s talk <ArrowUpRight aria-hidden="true" size={15} /></a>
    </header>
  )
}
