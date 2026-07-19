'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function Preloader({ sceneReady, onComplete }: { sceneReady: boolean; onComplete: () => void }): React.ReactElement | null {
  const [complete, setComplete] = useState(false)
  const finished = useRef(false)
  const startedAt = useRef(0)

  useEffect(() => {
    if (!startedAt.current) startedAt.current = performance.now()
    const finish = () => {
      if (finished.current) return
      finished.current = true
      window.setTimeout(() => { setComplete(true); window.setTimeout(onComplete, 600) }, Math.max(0, 600 - (performance.now() - startedAt.current)))
    }
    const timeout = window.setTimeout(finish, 4000)
    document.fonts.ready.then(() => { if (sceneReady) finish() })
    if (sceneReady) document.fonts.ready.then(finish)
    return () => window.clearTimeout(timeout)
  }, [onComplete, sceneReady])

  return <AnimatePresence>{!complete && <motion.div className="preloader" initial={{ y: 0 }} exit={{ y: '-100%' }} animate={{ y: 0 }} transition={{ duration: .6, ease: [0.77, 0, 0.175, 1] }}><p>Bader Bennani</p><span className="preloader-line" /></motion.div>}</AnimatePresence>
}
