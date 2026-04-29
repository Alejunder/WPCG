'use client'

import { useEffect } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { useSafeSceneTransition } from './SceneTransitionContext'
import styles from './SceneWipe.module.css'

// ---------------------------------------------------------------------------
// Timing — must stay in sync with SceneTransitionContext constants
// ---------------------------------------------------------------------------

/** Delay before the wipe starts sweeping (ms). Short pause so exit animations begin first. */
const WIPE_OFFSET_S  = 0.1
/** Duration of the covering sweep (left → right, ms→s). */
const WIPE_SWEEP_S   = 0.6
/** Duration of the reveal retract (right → off-screen, ms→s). */
const WIPE_RETRACT_S = 0.55

/**
 * A sharp cubic-bezier that decelerates hard at the end,
 * making the panel feel heavy and deliberate — not a generic ease-out.
 */
const WIPE_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

/**
 * Full-viewport curtain overlay that crosses the screen during route transitions.
 *
 * Sequence:
 *  1. phase "exiting"  → wait WIPE_OFFSET, then sweep from x=-110% to x=0 (covers screen)
 *  2. phase "entering" → retract from x=0 to x=110% (reveals new page, right edge first)
 *  3. phase "idle"     → snap instantly back to x=-110% (ready for next transition)
 *
 * Placed once — in [locale]/layout.tsx — above all page content in z-order.
 * Automatically suppressed for users with prefers-reduced-motion.
 *
 * The subtle gradient on the right edge gives the leading face of the wipe
 * a warm bleed, softening what would otherwise be a hard cut.
 */
export default function SceneWipe() {
  const { phase } = useSafeSceneTransition()
  const shouldReduce = useReducedMotion()
  const controls = useAnimation()

  useEffect(() => {
    if (shouldReduce) return

    if (phase === 'exiting') {
      // Panel sweeps in from the left, delayed slightly so exit animations
      // have a fraction of a second to begin before the wipe obscures them
      void controls.start({
        x: '0%',
        transition: {
          delay: WIPE_OFFSET_S,
          duration: WIPE_SWEEP_S,
          ease: WIPE_EASE,
        },
      })
    } else if (phase === 'entering') {
      // Panel retracts to the right, revealing the newly-mounted page
      void controls.start({
        x: '110%',
        transition: {
          duration: WIPE_RETRACT_S,
          ease: WIPE_EASE,
        },
      })
    } else if (phase === 'idle') {
      // Snap silently back off-screen — no visual, just resets state
      controls.set({ x: '-110%' })
    }
  }, [phase, controls, shouldReduce])

  // Nothing rendered for reduced-motion users — their transitions are instant
  if (shouldReduce) return null

  return (
    <motion.div
      aria-hidden="true"
      className={styles.wipe}
      initial={{ x: '-110%' }}
      animate={controls}
    />
  )
}
