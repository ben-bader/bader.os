'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { getCapabilityLevel, type CapabilityLevel } from '@/lib/experience/capabilities'
import { scrollBus } from '@/lib/experience/ScrollBus'
import { pointerBus } from '@/lib/experience/PointerBus'

const ExperienceCanvas = dynamic(() => import('./ExperienceCanvas'), {
  ssr: false,
  loading: () => null,
})
const MotionOrchestrator = dynamic(() => import('./MotionOrchestrator'), {
  ssr: false,
  loading: () => null,
})

export default function ExperienceRuntime() {
  const [level, setLevel] = useState<CapabilityLevel | null>(null)

  useEffect(() => {
    const disconnectScrollBus = scrollBus.connect()
    const move = (event: PointerEvent) => pointerBus.setTarget(event.clientX, event.clientY)
    const leave = () => pointerBus.reset()
    const visibility = () => document.hidden && pointerBus.reset()
    const update = () => setLevel(getCapabilityLevel())
    const fallback = () => setLevel('unavailable')
    let resizeTimer = 0
    const resize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(update, 140)
    }
    update()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', leave)
    document.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('resize', resize, { passive: true })
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    motion.addEventListener('change', update)
    window.addEventListener('portfolio:webgl-unavailable', fallback)
    return () => {
      disconnectScrollBus()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', leave)
      document.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('resize', resize)
      window.clearTimeout(resizeTimer)
      motion.removeEventListener('change', update)
      window.removeEventListener('portfolio:webgl-unavailable', fallback)
    }
  }, [])

  if (!level || level === 'reduced-motion') return null

  return (
    <>
      {level !== 'unavailable' && (
        <div className={`experience-canvas experience-canvas-${level}`} aria-hidden="true">
          <ExperienceCanvas level={level} />
        </div>
      )}
      <MotionOrchestrator />
    </>
  )
}
