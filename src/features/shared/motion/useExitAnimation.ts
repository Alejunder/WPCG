'use client'

import { useEffect, useRef } from 'react'
import { useAnimation, type AnimationDefinition } from 'framer-motion'
import { useSafeSceneTransition } from './SceneTransitionContext'

// ---------------------------------------------------------------------------
// Exit duration — must be faster than enter durations (DURATION_BASE 0.6s)
// so the dismantling reads as intentional and abrupt.
// ---------------------------------------------------------------------------
const EXIT_DURATION = 0.4
const EXIT_EASE = [0.55, 0, 1, 0.45] as const  // Sharp deceleration at start, ease-in feel

/**
 * Variant controls the direction of the exit.
 *
 * - 'up'    Hero elements — slide upward, as if pulled offstage above.
 * - 'down'  Content blocks — slide downward, as if sinking before dissolving.
 * - 'scale' Grids — fade + slight scale-down, as if receding into depth.
 */
export type ExitVariant = 'up' | 'down' | 'scale'

const EXIT_TARGETS: Record<ExitVariant, AnimationDefinition> = {
  up: {
    opacity: 0,
    y: -20,
    transition: { duration: EXIT_DURATION, ease: EXIT_EASE },
  },
  down: {
    opacity: 0,
    y: 20,
    transition: { duration: EXIT_DURATION, ease: EXIT_EASE },
  },
  scale: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: EXIT_DURATION, ease: EXIT_EASE },
  },
}

/**
 * Returns Framer Motion `AnimationControls` that animate a section out during
 * a scene transition.
 *
 * Attach the returned controls to a `motion.*` element's `animate` prop.
 * The element exits according to `variant` when the global scene transition
 * enters "exiting" phase — but ONLY after the component has been visible
 * (i.e. it is not the incoming-page component mounting during a running transition).
 *
 * Safe to use outside `<SceneTransitionProvider>` — returns idle controls.
 *
 * @param variant Direction of exit. Defaults to 'up'.
 *
 * @example
 * const exitControls = useExitAnimation('down')
 * return <motion.div animate={exitControls}>{children}</motion.div>
 */
export function useExitAnimation(variant: ExitVariant = 'up') {
  const { phase } = useSafeSceneTransition()
  const hasEntered = useRef(false)
  const controls = useAnimation()

  useEffect(() => {
    if (phase !== 'exiting') {
      hasEntered.current = true
    } else if (hasEntered.current) {
      void controls.start(EXIT_TARGETS[variant])
    }
  }, [phase, controls, variant])

  return controls
}
