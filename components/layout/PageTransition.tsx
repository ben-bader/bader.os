'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/lib/reduced-motion'

export function PageTransition({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  return <AnimatePresence mode="wait"><motion.div key={pathname} initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={reducedMotion ? {} : { opacity: 0, scale: .98 }} transition={{ duration: reducedMotion ? 0 : .5, ease: 'easeOut' }}>{children}</motion.div></AnimatePresence>
}
