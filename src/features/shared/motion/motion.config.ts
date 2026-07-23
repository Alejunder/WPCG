import type { Variants, Transition } from 'framer-motion'

// Shared cubic-bezier — architectural, elastic feel
// Used inline across 12+ components; centralised here as the single source of truth
export const ARCH_EASE = [0.25, 1, 0.5, 1] as const

// Duration scale — compose transitions from these rather than bare numbers
// Exit animations must use DURATION_FAST so dismantling feels abrupt and intentional.
// Enter animations should use DURATION_BASE or DURATION_SLOW — construction feels deliberate.
export const DURATION_FAST = 0.4
export const DURATION_BASE = 0.6
export const DURATION_SLOW = 0.9

// ---------------------------------------------------------------------------
// Spring presets
// ---------------------------------------------------------------------------

/** Relaxed spring for lift-on-hover and subtle position nudges */
export const SPRING_GENTLE: Transition = { type: 'spring', stiffness: 100, damping: 20 }

/** Snappy spring for quick interactive responses */
export const SPRING_SNAPPY: Transition = { type: 'spring', stiffness: 300, damping: 30 }

// ---------------------------------------------------------------------------
// Transition presets
// ---------------------------------------------------------------------------

/** Default content transition: 0.6s, ARCH_EASE */
export const defaultTransition: Transition = {
  duration: DURATION_BASE,
  ease: ARCH_EASE,
}

/** Slower reveal for large hero elements: 0.9s */
export const slowTransition: Transition = {
  duration: DURATION_SLOW,
  ease: ARCH_EASE,
}

/** Fast route-change transition: 0.4s — pages feel responsive, sections feel luxurious */
export const fastTransition: Transition = {
  duration: 0.4,
  ease: ARCH_EASE,
}

/** Divider line drawing transition: 1.8s, easeOut — slow deliberate draw, clearly visible */
export const dividerTransition: Transition = {
  duration: 1.8,
  ease: 'easeOut',
}

// ---------------------------------------------------------------------------
// Variant presets
// ---------------------------------------------------------------------------

/** Fade + upward slide — the primary scroll-reveal pattern */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
}

/** Pure opacity fade, no movement */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
}

/**
 * Parent variant for staggered lists/grids.
 * Apply to the container; add `staggerItem` to each child.
 * `exit` orchestrates reverse stagger (last child exits first).
 * Default stagger 0.08 — for grids use 0.1–0.12 inline.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.06, staggerDirection: -1 },
  },
}

/**
 * Child variant for staggered lists.
 * Pair with `staggerContainer` on the parent.
 * Includes an `exit` state for use with enableExit StaggerContainer / FadeIn.
 */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
  exit:    { opacity: 0, y: -20, transition: fastTransition },
}

/**
 * Fade + slide for exit animations during scene transitions.
 * Lighter and faster than the enter counterpart.
 * Use with FadeIn enableExit or as a direct animate target.
 */
export const exitUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
  exit:    { opacity: 0, y: -20, transition: fastTransition },
}

/**
 * Image reveal: slight scale-up from 0.96 → 1 as it fades in.
 * Applied to the wrapper div, not the Image element itself.
 */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: slowTransition,
  },
}
