'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ARCH_EASE } from './motion.config'

interface SlowZoomProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /**
   * Initial scale on mount (before the slow-zoom-in resolves).
   * @default 1.08
   */
  initialScale?: number
}

/**
 * Ken Burns–style slow zoom effect.
 *
 * On mount the element starts at `initialScale` (default 1.08) and eases
 * down to 1.0 over 1.2 s, giving a premium "breathing" quality to hero images.
 *
 * While the element is in the viewport, scroll progress also contracts the
 * scale slightly (1.0 → 0.94), creating a secondary parallax depth cue
 * as the user scrolls past.
 *
 * When `useReducedMotion()` returns true, both the mount animation and the
 * scroll-linked scale are disabled — the element renders at scale 1 with no
 * motion.
 *
 * Pair with `<ParallaxLayer>` for layered depth:
 * ```tsx
 * <ParallaxLayer speed="25%">
 *   <SlowZoom>
 *     <Image src={hero.url} alt={hero.alt} fill />
 *   </SlowZoom>
 * </ParallaxLayer>
 * ```
 */
export default function SlowZoom({
  children,
  className,
  style,
  initialScale = 1.08,
}: SlowZoomProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const scrollScale = useTransform(
    scrollYProgress,
    [0, 0.5],
    shouldReduce ? [1, 1] : [1.0, 0.94]
  )

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale: scrollScale, ...style }}
      initial={shouldReduce ? false : { scale: initialScale }}
      animate={shouldReduce ? undefined : { scale: 1 }}
      transition={{ duration: 1.2, ease: ARCH_EASE }}
    >
      {children}
    </motion.div>
  )
}
