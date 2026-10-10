import { identity } from '@/lib/content'

export default function LayerCore() {
  return (
    <section className="core-section page-wrap" id="layer-core" aria-labelledby="core-title">
      <div className="core-overline"><span>01 / PROFILE</span><span>Calais · France</span></div>
      <div className="core-grid">
        <div className="core-identity">
          <p className="technical-label">SOFTWARE ENGINEERING / BACKEND / FULL-STACK</p>
          <h1 id="core-title">Bader<br /><span>Bennani</span><i>.</i></h1>
        </div>
        <div className="core-introduction">
          <p className="core-statement">I build software systems that are meant to be understood.</p>
          <p className="core-description">Computer Engineering student at EILCO, working across backend services, full-stack applications, and the interfaces around them.</p>
          <div className="core-actions">
            <a className="action-link action-primary" href="#layer-systems">View selected systems <span aria-hidden="true">↓</span></a>
            <a className="action-link action-secondary" href={identity.resume} target="_blank" rel="noreferrer">Résumé <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
      <dl className="core-specs" aria-label="Profile details">
        <div><dt className="spec-label">CURRENT STUDY</dt><dd>Computer Engineering · EILCO</dd></div>
        <div><dt className="spec-label">FOCUS</dt><dd>Backend systems · Full-stack</dd></div>
        <div><dt className="spec-label">AVAILABILITY</dt><dd>{identity.availability}</dd></div>
        <div><dt className="spec-label">LOCATION</dt><dd>{identity.location}</dd></div>
      </dl>
      <div className="core-bottom-rule"><span>ENGINEERING / INTERFACE / SYSTEMS</span><span>SCROLL TO INSPECT ↓</span></div>
    </section>
  )
}
