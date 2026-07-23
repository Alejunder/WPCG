'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import SketchCard from './SketchCard'
import SketchModal from './SketchModal'
import type { Sketch } from '../types'
import type { Locale } from '@/config/i18n'
import styles from './SketchGallery.module.css'

// ---------------------------------------------------------------------------
// Vertical scatter palette — breaks the grid baseline organically.
// Values are pixels of translateY; alternating sign keeps items clustered
// close to the row midline while avoiding a machine-regular pattern.
// ---------------------------------------------------------------------------
const V_OFFSETS = [10, -18, 6, -22, 14, -8, 20, -12, 4, -16] as const

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
}

// Each child receives its own vertical offset via the `custom` prop.
// Framer Motion calls variant functions with `custom` when the variant
// is a function — this gives per-card scatter without hard-coding offsets
// in the JSX.
const itemVariants: Variants = {
  hidden: (offset: number) => ({ opacity: 0, y: offset + 24 }),
  visible: (offset: number) => ({
    opacity: 1,
    y: offset,
    transition: { duration: 0.65, ease: ARCH_EASE },
  }),
}

// ---------------------------------------------------------------------------

interface Props {
  sketches: Sketch[]
  locale: Locale
}

/**
 * Client component: scatter moodboard grid + sketch lightbox.
 *
 * Replaces the server-side `MoodboardGrid` because opening a modal requires
 * `useState`. The `sketches` array is serialised as a server → client prop.
 *
 * Layout strategy:
 * - CSS Grid with `auto-fill / minmax(240px, 1fr)` for a fluid column count.
 * - Per-card `translateY` offsets (V_OFFSETS) break the baseline, giving each
 *   row an organic, hand-placed quality.
 * - Featured sketches span two columns.
 * - Framer Motion `whileInView` stagger triggers as the grid scrolls into view.
 * - On hover, the parent item raises `z-index` so the card overlaps neighbours.
 */
export default function SketchGallery({ sketches, locale }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const shouldReduce = useReducedMotion()

  return (
    <>
      <motion.div
        className={styles.grid}
        variants={shouldReduce ? {} : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        role="list"
        aria-label={locale === 'es' ? 'Galería de bocetos' : 'Sketch gallery'}
      >
        {sketches.map((sketch, index) => {
          const offset = shouldReduce ? 0 : V_OFFSETS[index % V_OFFSETS.length]

          return (
            <motion.div
              key={sketch.id}
              role="listitem"
              className={styles.item}
              custom={offset}
              variants={shouldReduce ? {} : itemVariants}
            >
              <SketchCard
                sketch={sketch}
                index={index}
                onClick={() => setOpenIndex(index)}
              />
            </motion.div>
          )
        })}
      </motion.div>

      <AnimatePresence>
        {openIndex !== null && (
          <SketchModal
            key="sketch-modal"
            sketches={sketches}
            initialIndex={openIndex}
            locale={locale}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
