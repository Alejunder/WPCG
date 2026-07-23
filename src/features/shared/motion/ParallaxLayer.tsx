'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface ParallaxLayerProps {
  children: ReactNode
  /**
   * Parallax strength as a percentage string for the y-axis offset at
   * the bottom of the scroll range. Positive values drift down; negative
   * values drift up (element moves slower than scroll = natural parallax).
   * @default '25%'
   */
  speed?: string
  className?: string
  style?: CSSProperties
}

/**
 * Scroll-linked parallax wrapper.
 *
 * Maps the element's scroll progress from `[start start]` to `[end start]`
 * (i.e. while the element is in the viewport from top to exit) onto a Y
 * translate range of `['0%', speed]`. This makes the element appear to move
 * at a different rate than the page — the classic parallax depth cue.
 *
 * When `useReducedMotion()` returns true, the Y value is locked at `'0%'`
 * so the layout is static and accessible.
 *
 * @example
 * <ParallaxLayer speed="30%">
 *   <Image src={hero.url} alt={hero.alt} fill />
 * </ParallaxLayer>
 */
export default function ParallaxLayer({
  children,
  speed = '25%',
  className,
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['0%', speed])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, ...style }}
    >
      {children}
    </motion.div>
  )
}
