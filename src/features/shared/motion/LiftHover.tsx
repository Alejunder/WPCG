'use client'

import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SPRING_GENTLE } from './motion.config'

interface LiftHoverProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /**
   * Y-axis lift distance in pixels.
   * @default -6
   */
  liftY?: number
}

/**
 * Wraps children in a `motion.div` that lifts them on hover.
 *
 * On hover:
 * - Translates up by `liftY` pixels (default −6 px)
 * - Applies `--shadow-card-hover` box-shadow from globals.css
 *
 * Uses `SPRING_GENTLE` for a relaxed, premium feel.
 * Animation is disabled when `useReducedMotion()` returns true.
 *
 * @example
 * <LiftHover>
 *   <ProjectCard project={project} locale={locale} />
 * </LiftHover>
 */
export default function LiftHover({ children, className, style, liftY = -6 }: LiftHoverProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={style}
      whileHover={
        shouldReduce
          ? undefined
          : { y: liftY, boxShadow: 'var(--shadow-card-hover)' }
      }
      transition={SPRING_GENTLE}
    >
      {children}
    </motion.div>
  )
}
