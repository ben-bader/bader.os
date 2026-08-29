'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.width = '100%'
    el.style.transform = 'scaleX(0)'
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div ref={ref} className="sys-progress" aria-hidden="true" />
}
