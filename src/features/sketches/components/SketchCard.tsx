'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import type { Sketch } from '../types'
import styles from './SketchCard.module.css'

// Rotation: index % 3 gives -1°, 0°, or 1° — subtle tilt for organic placement
const tilt = (index: number) => (index % 3) - 1

interface Props {
  sketch: Sketch
  /** Position index in the grid — drives the tilt offset. */
  index: number
  /** Called when the user clicks the card to open the lightbox. */
  onClick: () => void
}

/**
 * A sketch displayed as a sheet of paper lying on the studio table.
 *
 * Design decisions:
 * - Renders as `<button>` for keyboard accessibility and native focus behaviour.
 * - `border: 8px solid white` simulates drawing-paper margins with no rounding.
 * - `filter: drop-shadow` is used instead of `box-shadow` because it follows
 *   the card's CSS rotation transform, casting the shadow at the correct angle
 *   as if the paper were physically tilted on the table surface.
 * - `object-fit: contain` keeps the full drawing visible without cropping.
 * - Framer Motion handles rotation and the hover lift; CSS transitions the shadow.
 */
export default function SketchCard({ sketch, index, onClick }: Props) {
  const shouldReduce = useReducedMotion()
  const rot = tilt(index)

  return (
    <motion.button
      className={styles.card}
      onClick={onClick}
      aria-label={
        sketch.title
          ? `Open sketch: ${sketch.title}`
          : 'Open sketch detail'
      }
      initial={shouldReduce ? {} : { rotate: rot }}
      animate={shouldReduce ? {} : { rotate: rot }}
      whileHover={
        shouldReduce
          ? {}
          : {
              rotate: 0,
              y: -4,
              transition: { duration: 0.3, ease: ARCH_EASE },
            }
      }
    >
      <div className={styles.imageWrapper}>
        <Image
          src={sketch.image.url}
          alt={sketch.image.alt}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
          className={styles.image}
        />
      </div>
      <p className={styles.caption}>{sketch.title ?? ''}</p>
    </motion.button>
  )
}
