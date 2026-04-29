'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TransitionPhase = 'idle' | 'exiting' | 'entering'

interface SceneTransitionContextValue {
  phase: TransitionPhase
  isTransitioning: boolean
  startTransition: (href: string) => void
}

// ---------------------------------------------------------------------------
// Timing constants (ms)
// Sequence:
//   t=0    click → phase="exiting", exit animations start, wipe starts after WIPE_OFFSET
//   t=100  wipe begins sweeping (WIPE_OFFSET)
//   t=700  wipe fully covers screen (WIPE_COVERS)
//   t=780  80ms pause while screen is fully covered (premium beat)
//          → router.push fires + phase="entering" simultaneously
//          → wipe begins to retract, revealing the new page
//   t=1980 phase="idle", wipe fully off-screen, system unlocked
// ---------------------------------------------------------------------------

const WIPE_OFFSET    = 100   // ms before wipe starts sweeping (must match SceneWipe WIPE_OFFSET_S × 1000)
const WIPE_SWEEP     = 600   // ms for the wipe to cross the screen
const WIPE_COVERS    = WIPE_OFFSET + WIPE_SWEEP     // 700ms — wipe fully over screen
const COVERED_PAUSE  = 80                            // ms to hold before navigating
const EXIT_DURATION  = WIPE_COVERS + COVERED_PAUSE  // 780ms — navigate here

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const SceneTransitionContext =
  createContext<SceneTransitionContextValue | null>(null)

export function SceneTransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const router = useRouter()
  const isLocked = useRef(false)

  const startTransition = useCallback(
    (href: string) => {
      if (isLocked.current) return
      isLocked.current = true

      setPhase('exiting')

      // Navigate and switch to entering phase simultaneously, 80ms after the
      // wipe fully covers the screen — the brief pause adds weight to the beat.
      const coverTimer = window.setTimeout(() => {
        router.push(href)
        setPhase('entering')

        // Return to idle after enter animations complete
        const idleTimer = window.setTimeout(() => {
          setPhase('idle')
          isLocked.current = false
        }, 1200)

        return () => window.clearTimeout(idleTimer)
      }, EXIT_DURATION)

      return () => {
        window.clearTimeout(coverTimer)
      }
    },
    [router],
  )

  return (
    <SceneTransitionContext.Provider
      value={{ phase, isTransitioning: phase !== 'idle', startTransition }}
    >
      {children}
    </SceneTransitionContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Must be used inside <SceneTransitionProvider>. Throws if not. */
export function useSceneTransition(): SceneTransitionContextValue {
  const ctx = useContext(SceneTransitionContext)
  if (!ctx) {
    throw new Error(
      'useSceneTransition must be used inside <SceneTransitionProvider>',
    )
  }
  return ctx
}

/**
 * Safe version — returns an idle no-op context when used outside the provider.
 *
 * Use this inside base motion primitives (FadeIn, StaggerContainer) so they
 * work correctly even in tests or stories that don't wrap with the provider.
 */
export function useSafeSceneTransition(): SceneTransitionContextValue {
  const ctx = useContext(SceneTransitionContext)
  return ctx ?? {
    phase: 'idle',
    isTransitioning: false,
    startTransition: () => undefined,
  }
}
