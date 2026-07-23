'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ARCH_EASE } from './motion.config'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  className?: string
  enableExit?: boolean
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 24,
  className,
}: FadeInProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduce ? false : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: shouldReduce ? 0 : duration,
        ease: ARCH_EASE,
        delay: shouldReduce ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  )
}
