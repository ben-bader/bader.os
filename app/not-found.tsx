import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="not-found page-wrap" id="main-content">
      <p className="eyebrow"><span>404</span> Nothing at this address</p>
      <h1>Let’s get<br /><em>back on track.</em></h1>
      <Link className="button button-primary" href="/"><ArrowLeft aria-hidden="true" size={16} /> Return home</Link>
    </main>
  )
}
