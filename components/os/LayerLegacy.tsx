import { identity } from '@/lib/content'

const links = [
  { label: 'GitHub', href: identity.github },
  { label: 'LinkedIn', href: identity.linkedin },
  { label: 'Résumé', href: identity.resume },
]

export default function LayerLegacy() {
  return (
    <footer className="handoff-section" id="layer-legacy" aria-labelledby="handoff-heading">
      <div className="page-wrap">
        <div className="handoff-meta"><span>07 / LEGACY — CONTACT</span><span>{identity.location}</span></div>
        <div className="handoff-grid">
          <div>
            <p className="technical-label">SOFTWARE ENGINEERING · BACKEND · FULL-STACK</p>
            <h2 id="handoff-heading">Continue the<br /><em>conversation.</em></h2>
          </div>
          <div className="handoff-contact">
            <span className="handoff-availability"><i aria-hidden="true" />{identity.availability}</span>
            <a className="handoff-email" href={`mailto:${identity.email}`}>{identity.email}<span aria-hidden="true">↗</span></a>
            <ul>{links.map(link => (
              <li key={link.label}><a href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a></li>
            ))}</ul>
          </div>
        </div>
        <div className="handoff-footer"><span>BADER BENNANI</span><span>© {new Date().getFullYear()} · ENGINEERING, IN CONTEXT</span><a href="#layer-core">RETURN TO CORE ↑</a></div>
      </div>
    </footer>
  )
}
