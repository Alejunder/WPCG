'use client'

import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ARCH_EASE } from './motion.config'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * Page-level route transition.
 *
 * Uses key={pathname} so React unmounts the old page immediately and mounts
 * the new one — this ensures scroll-linked hooks (e.g. useScroll in HeroSection)
 * see the correct document geometry from the first render.
 *
 * AnimatePresence mode="wait" was intentionally removed: it keeps both the
 * outgoing and incoming pages in the DOM simultaneously for the exit duration.
 * During that window, useScroll measures the hero's position relative to a
 * document that is temporarily twice as tall, producing a wrong scrollYProgress
 * value that drives contentOpacity to 0 — making all hero text invisible on
 * every client-side navigation until a hard refresh.
 *
 * Respects prefers-reduced-motion.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      key={pathname}
      style={{ position: 'relative' }}
      initial={shouldReduce ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduce ? 0 : 0.3, ease: ARCH_EASE }}
    >
      {children}
    </motion.div>
  )
}
