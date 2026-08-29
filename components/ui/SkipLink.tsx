'use client'

export default function SkipLink() {
  return (
    <a
      href="#layer-core"
      className="skip-link"
      onFocus={e  => { e.currentTarget.style.transform = 'translateY(0)' }}
      onBlur={e   => { e.currentTarget.style.transform = 'translateY(-200%)' }}
    >
      Skip to content
    </a>
  )
}
