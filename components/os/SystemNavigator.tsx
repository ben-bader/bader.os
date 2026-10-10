'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import { LAYERS } from '@/system/layers'
import { scrollBus } from '@/lib/experience/ScrollBus'

const sections = LAYERS.map(layer => ({
  id: layer.anchor,
  label: layer.codename[0] + layer.codename.slice(1).toLowerCase(),
}))

export default function SystemNavigator() {
  const activeSection = useSyncExternalStore(
    scrollBus.subscribe,
    () => scrollBus.getSnapshot().section,
    () => 'core',
  )
  const active = activeSection === 'contact' ? 'layer-legacy' : `layer-${activeSection}`
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  function followLink() {
    setOpen(false)
    if (window.matchMedia('(max-width: 780px)').matches) toggleRef.current?.focus()
  }

  return (
    <header className="workbench-header">
      <a className="site-mark" href="#layer-core" aria-label="Bader Bennani, beginning">
        <span className="site-mark-symbol">BB</span>
        <span className="site-mark-name">BADER.OS<small>ENGINEERING PORTFOLIO</small></span>
      </a>

      <button
        ref={toggleRef}
        className="index-toggle"
        type="button"
        aria-label={`Section index, ${open ? 'close' : 'open'}`}
        aria-expanded={open}
        aria-controls="section-index"
        onClick={() => setOpen(value => !value)}
      >
        <span>INDEX</span><span className="index-current">{String(sections.findIndex(section => section.id === active) + 1).padStart(2, '0')} / 07</span>
        <span className="index-toggle-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <nav
        id="section-index"
        className={`section-index-nav${open ? ' is-open' : ''}`}
        aria-label="Page sections"
        onKeyDown={event => {
          if (event.key === 'Escape' && open) {
            setOpen(false)
            toggleRef.current?.focus()
          }
        }}
      >
        {sections.map((section, index) => (
          <a
            href={`#${section.id}`}
            key={section.id}
            aria-current={active === section.id ? 'location' : undefined}
            onClick={followLink}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>{section.label}
          </a>
        ))}
      </nav>

      <a className="header-contact" href="#layer-legacy">CONTACT <span aria-hidden="true">↗</span></a>
    </header>
  )
}
