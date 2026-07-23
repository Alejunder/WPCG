'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import SketchCard from './SketchCard'
import SketchModal from './SketchModal'
import type { Sketch } from '../types'
import type { Locale } from '@/config/i18n'
import styles from './SketchCarousel.module.css'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  sketches: Sketch[]
  locale: Locale
}

// ---------------------------------------------------------------------------
// Animation variants
//
// WHY variant strings + AnimatePresence custom:
//   With inline `exit={â€¦}` objects, Framer Motion freezes the exit values at
//   the last render where the element existed â€” so `direction` state is always
//   one step stale when going backwards. Using variant STRINGS and passing
//   `custom={direction}` to AnimatePresence causes Framer Motion to call the
//   variant *functions* with the CURRENT direction at the moment of exit,
//   giving correct directional animation every time.
// ---------------------------------------------------------------------------

/**
 * Page container â€” orchestrates child stagger on enter and exit.
 * `staggerDirection` mirrors the navigation direction so on a forward swipe
 * the first card exits first (left-to-right sweep), and on a backward swipe
 * the last card exits first (right-to-left sweep).
 */
const pageVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
  exit: (dir: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      // dir 1 â†’ stagger forward (card 0 first); dir -1 â†’ stagger backward
      staggerDirection: dir as 1 | -1,
    },
  }),
}

/**
 * Individual card â€” "leaf blowing in the wind".
 *
 * ENTER: slides in from the direction the user navigated from.
 * EXIT:  blows *opposite* to the navigation direction â€” going right means
 *        the old sheets blow to the left, tilting as if caught in a gust.
 */
const cardVariants = {
  hidden: (dir: number) => ({
    opacity: 0,
    x: dir * 55,
    y: 18,
    scale: 0.93,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: ARCH_EASE },
  },
  exit: (dir: number) => ({
    opacity: 0,
    // Blow away from the direction of travel
    x: dir * -140,
    // Tilt like a leaf spinning into the wind
    rotate: dir * -18,
    y: -20,
    scale: 0.74,
    transition: { duration: 0.33, ease: 'easeOut' },
  }),
}

// Reduced-motion equivalents â€” cross-fade only, no movement.
const pageVariantsReduced = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 1 },
}
const cardVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

// ---------------------------------------------------------------------------

export default function SketchCarousel({ sketches, locale }: Props) {
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const shouldReduce = useReducedMotion()
  const isDragging = useRef(false)
  const pointerStartX = useRef<number | null>(null)

  // ---------------------------------------------------------------------------
  // Responsive items per page
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setItemsPerPage(w < 640 ? 1 : w < 1024 ? 2 : 3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(sketches.length / itemsPerPage) - 1)
    setPage(p => Math.min(p, maxPage))
  }, [itemsPerPage, sketches.length])

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const totalPages = Math.ceil(sketches.length / itemsPerPage)
  const pageStart = page * itemsPerPage
  const currentSketches = sketches.slice(pageStart, pageStart + itemsPerPage)

  const goTo = useCallback(
    (next: number) => {
      if (next === page || next < 0 || next >= totalPages) return
      setDirection(next > page ? 1 : -1)
      setPage(next)
    },
    [page, totalPages],
  )

  const goNext = useCallback(() => goTo(page + 1), [page, goTo])
  const goPrev = useCallback(() => goTo(page - 1), [page, goTo])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    },
    [goNext, goPrev],
  )

  const pVars = shouldReduce ? pageVariantsReduced : pageVariants
  const cVars = shouldReduce ? cardVariantsReduced : cardVariants

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className={styles.root}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={locale === 'es' ? 'Carrusel de bocetos' : 'Sketch carousel'}
    >
      {/*
       * Stage â€” persistent motion.div used as the drag target.
       * Keeping drag here (outside AnimatePresence) means the handler is
       * never torn down mid-animation when a page transition is in progress.
       */}
      <div
        className={styles.stage}
        onPointerDown={(e) => {
          pointerStartX.current = e.clientX
          isDragging.current = false
        }}
        onPointerMove={(e) => {
          if (pointerStartX.current !== null && Math.abs(e.clientX - pointerStartX.current) > 8) {
            isDragging.current = true
          }
        }}
        onPointerUp={(e) => {
          if (pointerStartX.current === null) return
          const delta = e.clientX - pointerStartX.current
          if (delta < -50) goNext()
          else if (delta > 50) goPrev()
          pointerStartX.current = null
          setTimeout(() => { isDragging.current = false }, 100)
        }}
        onPointerLeave={() => {
          pointerStartX.current = null
        }}
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={page}
            className={styles.page}
            custom={direction}
            variants={pVars}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {currentSketches.map((sketch, i) => {
              const globalIndex = pageStart + i
              return (
                <motion.div
                  key={sketch.id}
                  className={styles.item}
                  custom={direction}
                  variants={cVars}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SketchCard
                    sketch={sketch}
                    index={globalIndex}
                    onClick={() => {
                      if (!isDragging.current) setOpenIndex(globalIndex)
                    }}
                  />
                </motion.div>
              )
            })}
            {/* Ghost slots — keep the grid fixed when the last page is not full */}
            {Array.from({ length: itemsPerPage - currentSketches.length }, (_, i) => (
              <div key={`ghost-${i}`} className={styles.item} aria-hidden="true" />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* â”€â”€ Navigation controls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {totalPages > 1 && (
        <div className={styles.controls}>
          <button
            className={styles.navBtn}
            onClick={goPrev}
            disabled={page === 0}
            aria-label={locale === 'es' ? 'Bocetos anteriores' : 'Previous sketches'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            className={styles.dots}
            role="tablist"
            aria-label={locale === 'es' ? 'PÃ¡ginas del carrusel' : 'Carousel pages'}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={
                  i === page ? `${styles.dot} ${styles.dotActive}` : styles.dot
                }
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={i === page}
                aria-label={`${locale === 'es' ? 'PÃ¡gina' : 'Page'} ${i + 1} ${locale === 'es' ? 'de' : 'of'} ${totalPages}`}
              />
            ))}
          </div>

          <button
            className={styles.navBtn}
            onClick={goNext}
            disabled={page === totalPages - 1}
            aria-label={locale === 'es' ? 'Bocetos siguientes' : 'Next sketches'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* â”€â”€ Lightbox modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence>
        {openIndex !== null && (
          <SketchModal
            sketches={sketches}
            initialIndex={openIndex}
            locale={locale}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
