'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ARCH_EASE } from './motion.config'
import { useSafeSceneTransition } from './SceneTransitionContext'

// ---------------------------------------------------------------------------
// Exported child variant — import this in any `motion.*` child
// so you don't need to couple the child to the parent component.
// Includes an `exit` state for use with enableExit StaggerContainer.
// ---------------------------------------------------------------------------

/** Apply to each `motion.*` child inside a `<StaggerContainer>`. */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ARCH_EASE } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.4, ease: ARCH_EASE } },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface StaggerContainerProps {
  children: React.ReactNode
  /**
   * Delay between each child animation (seconds).
   * @default 0.1
   */
  staggerDelay?: number
  /** Optional initial delay before the first child animates (seconds). */
  delayChildren?: number
  className?: string
  /**
   * When true, participates in the scene transition exit sequence.
   * Children animate out in reverse DOM order (last child exits first)
   * when phase is "exiting", but only after the container has already entered.
   *
   * Switches from declarative `whileInView` to programmatic `useAnimation`.
   * Requires children to use the exported `staggerItem` variant (or any variant
   * that defines `hidden`, `visible`, and `exit` states).
   * @default false
   */
  enableExit?: boolean
}

/**
 * Scroll-triggered stagger wrapper for lists and grids.
 *
 * Wrap a list/grid with this component and apply the exported `staggerItem`
 * variant to each `motion.*` child. Children animate in sequence as the
 * container enters the viewport.
 *
 * With `enableExit`, children animate out in **reverse** order when a scene
 * transition begins — the last item exits first, the first item exits last.
 *
 * @example
 * import StaggerContainer, { staggerItem } from '@/features/shared/motion/StaggerContainer'
 *
 * <StaggerContainer>
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={staggerItem}>
 *       <ProjectCard project={item} />
 *     </motion.li>
 *   ))}
 * </StaggerContainer>
 */
export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  delayChildren = 0.1,
  className,
  enableExit = false,
}: StaggerContainerProps) {
  const shouldReduce = useReducedMotion()
  const { phase }    = useSafeSceneTransition()

  // Always call hooks unconditionally
  const controls   = useAnimation()
  const ref        = useRef<HTMLDivElement>(null)
  const hasEntered = useRef(false)
  const isInView   = useInView(ref, { once: true, margin: '-60px' })

  // --- Enter (exit-enabled mode only) ---
  useEffect(() => {
    if (!enableExit) return

    if (shouldReduce) {
      controls.set('visible')
      hasEntered.current = true
      return
    }

    if (isInView && !hasEntered.current) {
      hasEntered.current = true
      void controls.start('visible')
    }
  }, [isInView, enableExit, shouldReduce, controls])

  // --- Exit (exit-enabled mode only) ---
  // Reverse stagger: staggerDirection -1 makes the last child exit first.
  // Guard on hasEntered prevents newly-mounted incoming-page components
  // from incorrectly firing the exit animation.
  useEffect(() => {
    if (!enableExit) return
    if (shouldReduce) return
    if (phase === 'exiting' && hasEntered.current) {
      void controls.start('exit')
    }
  }, [phase, enableExit, shouldReduce, controls])

  // ---------------------------------------------------------------------------
  // Standard mode — declarative whileInView, no exit support
  // ---------------------------------------------------------------------------
  if (!enableExit) {
    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: shouldReduce
          ? {}
          : { staggerChildren: staggerDelay, delayChildren },
      },
    }

    return (
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {children}
      </motion.div>
    )
  }

  // ---------------------------------------------------------------------------
  // Exit-enabled mode — programmatic control via useAnimation + useInView
  // ---------------------------------------------------------------------------
  const exitContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: shouldReduce
        ? {}
        : { staggerChildren: staggerDelay, delayChildren },
    },
    exit: {
      transition: shouldReduce
        ? {}
        : { staggerChildren: 0.06, staggerDirection: -1 },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={exitContainerVariants}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  )
}
