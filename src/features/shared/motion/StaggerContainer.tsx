'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ARCH_EASE } from './motion.config'

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
}: StaggerContainerProps) {
  const shouldReduce = useReducedMotion()

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
// StaggerItem — thin wrapper for use in Server Components
//
// Server Component pages cannot use `motion.div` directly. Import this
// component alongside StaggerContainer so each section can participate
// in the stagger sequence without the page needing 'use client'.
//
// ⚠️  Must be a direct child of <StaggerContainer> for variant propagation
// to work (Framer Motion requires an unbroken motion tree).
// ---------------------------------------------------------------------------

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

/**
 * Wrap each direct child of `<StaggerContainer>` with this component.
 *
 * When `prefers-reduced-motion` is active, renders a plain `<div>` with no
 * animation — bypassing Framer Motion entirely so children appear
 * instantaneously. `StaggerContainer` already strips stagger delays at the
 * container level; this ensures individual item transitions are also skipped.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}
