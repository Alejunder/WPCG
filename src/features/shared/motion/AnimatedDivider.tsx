'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ARCH_EASE } from './motion.config'

interface AnimatedDividerProps {
  /** 'horizontal' animates scaleX from left; 'vertical' animates scaleY from top. */
  orientation?: 'horizontal' | 'vertical'
  /** Extra delay before the animation starts (seconds). */
  delay?: number
  /** Animation duration (seconds). Defaults to 1.8. */
  duration?: number
  /** Additional class name forwarded to the element. */
  className?: string
  /** aria-hidden is true by default; override if the divider has semantic meaning. */
  ariaHidden?: boolean
}

/**
 * A thin architectural divider that is 'drawn' progressively as it enters
 * the viewport. Uses scaleX (horizontal) or scaleY (vertical) to create
 * the line-drawing effect without any bounce or overshoot.
 *
 * @example
 * // Horizontal section separator
 * <AnimatedDivider className={styles.separator} />
 *
 * @example
 * // Vertical rule with delay
 * <AnimatedDivider orientation="vertical" delay={0.2} className={styles.rule} />
 */
export default function AnimatedDivider({
  orientation = 'horizontal',
  delay = 0,
  duration = 1.8,
  className,
  ariaHidden = true,
}: AnimatedDividerProps) {
  const shouldReduce = useReducedMotion()
  const isHorizontal = orientation === 'horizontal'

  return (
    <motion.div
      className={className}
      aria-hidden={ariaHidden}
      initial={shouldReduce ? false : { [isHorizontal ? 'scaleX' : 'scaleY']: 0 }}
      whileInView={{ [isHorizontal ? 'scaleX' : 'scaleY']: 1 }}
      viewport={{ once: true, margin: '-30% 0px -30% 0px' }}
      transition={{ duration, delay, ease: ARCH_EASE }}
      style={{
        transformOrigin: isHorizontal ? 'left' : 'top',
      }}
    />
  )
}
