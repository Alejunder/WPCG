'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView, useReducedMotion } from 'framer-motion'
import { ARCH_EASE, DURATION_FAST } from './motion.config'
import { useSafeSceneTransition } from './SceneTransitionContext'

interface FadeInProps {
  children: React.ReactNode
  /** Additional delay before the animation starts (seconds) */
  delay?: number
  /** Animation duration (seconds). Defaults to 0.6. */
  duration?: number
  /** Initial Y offset in px. The element animates from this value to 0. Defaults to 24. */
  yOffset?: number
  className?: string
  /**
   * When true, this element participates in the scene transition exit sequence.
   * It will animate out (opacity→0, y→-20) when the transition phase is "exiting",
   * but only if it has already entered (preventing false exits on newly-mounted pages).
   *
   * Switches from declarative `whileInView` to programmatic `useAnimation` + `useInView`.
   * @default false
   */
  enableExit?: boolean
}

/**
 * Scroll-triggered fade-in wrapper.
 *
 * Fires once when the element enters the viewport; respects `prefers-reduced-motion`.
 *
 * With `enableExit`, also participates in the scene transition exit sequence:
 * components animate out (upward, opacity 0) before the wipe covers them, and
 * back in when the wipe retracts on the next page.
 *
 * @example
 * // Basic usage — scroll reveal only
 * <FadeIn delay={0.2}>
 *   <h2>Our Projects</h2>
 * </FadeIn>
 *
 * @example
 * // With exit choreography
 * <FadeIn enableExit delay={0.2}>
 *   <h2>Our Projects</h2>
 * </FadeIn>
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 24,
  className,
  enableExit = false,
}: FadeInProps) {
  const shouldReduce = useReducedMotion()
  const { phase } = useSafeSceneTransition()

  // Always call hooks unconditionally — conditional logic lives inside effects
  const controls     = useAnimation()
  const ref          = useRef<HTMLDivElement>(null)
  const hasEntered   = useRef(false)
  const isInView     = useInView(ref, { once: true, margin: '-80px' })

  // --- Enter (exit-enabled mode only) ---
  useEffect(() => {
    if (!enableExit) return

    if (shouldReduce) {
      controls.set({ opacity: 1, y: 0 })
      hasEntered.current = true
      return
    }

    if (isInView && !hasEntered.current) {
      hasEntered.current = true
      void controls.start({
        opacity: 1,
        y: 0,
        transition: { duration, ease: ARCH_EASE, delay },
      })
    }
  }, [isInView, enableExit, shouldReduce, controls, duration, delay])

  // --- Exit (exit-enabled mode only) ---
  // Only fires if the component has already entered, preventing newly-mounted
  // components on the incoming page from incorrectly playing the exit animation.
  useEffect(() => {
    if (!enableExit) return
    if (shouldReduce) return
    if (phase === 'exiting' && hasEntered.current) {
      void controls.start({
        opacity: 0,
        y: -20,
        transition: { duration: DURATION_FAST, ease: ARCH_EASE },
      })
    }
  }, [phase, enableExit, shouldReduce, controls])

  // ---------------------------------------------------------------------------
  // Standard mode — declarative whileInView, no exit support
  // ---------------------------------------------------------------------------
  if (!enableExit) {
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

  // ---------------------------------------------------------------------------
  // Exit-enabled mode — programmatic control via useAnimation + useInView
  // ---------------------------------------------------------------------------
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}
