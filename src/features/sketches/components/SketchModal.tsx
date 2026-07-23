'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { Sketch } from '../types'
import type { Locale } from '@/config/i18n'
import styles from './SketchModal.module.css'

// ---------------------------------------------------------------------------
// Fade variants — pure opacity cross-fade, no positional slide.
// The user sees a gradual fade rather than a lateral movement, which
// matches the still, contemplative mood of viewing studio sketches.
// ---------------------------------------------------------------------------
const slideVariants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

const textVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.28, delay: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

// ---------------------------------------------------------------------------

interface Props {
  sketches: Sketch[]
  initialIndex: number
  locale: Locale
  onClose: () => void
}

/**
 * Lightbox dialog for viewing sketch detail.
 *
 * Features:
 * - Carousel through all sketches with slide transition.
 * - ESC key, ← / → arrow key navigation.
 * - Backdrop click to dismiss.
 * - Body scroll lock while open.
 * - Link to the associated project if `sketch.projectSlug` is set.
 * - Fade-in/out entry managed by the parent `AnimatePresence`.
 */
export default function SketchModal({ sketches, initialIndex, locale, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [direction, setDirection] = useState<1 | -1>(1)
  const closeRef = useRef<HTMLButtonElement>(null)

  const total = sketches.length
  const sketch = sketches[currentIndex]

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex(i => (i + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex(i => (i - 1 + total) % total)
  }, [total])

  // Keyboard: ESC closes, ← / → navigate
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, goNext, goPrev])

  // Scroll lock — restore original value on unmount
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Move focus to close button on mount for keyboard / screen-reader users
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  // ---------------------------------------------------------------------------
  // Localised labels
  // ---------------------------------------------------------------------------
  const l = locale === 'es'
  const labels = {
    close:       l ? 'Cerrar'    : 'Close',
    prev:        l ? 'Anterior'  : 'Previous',
    next:        l ? 'Siguiente' : 'Next',
    viewProject: l ? 'Ver proyecto' : 'View project',
    dialogLabel: l ? 'Detalle del boceto' : 'Sketch detail',
    page: (cur: number, tot: number) =>
      l ? `Página ${cur} de ${tot}` : `Page ${cur} of ${tot}`,
  }

  return (
    /* Backdrop ─────────────────────────────────────────────── */
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      {/* Panel ─────────────────────────────────────────────── */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={sketch.title ?? labels.dialogLabel}
        className={styles.panel}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{    opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close ─────────────────────────────────────────── */}
        <button
          ref={closeRef}
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={labels.close}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="15" y1="1" x2="1"  y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Content: image | text ──────────────────────────── */}
        <div className={styles.content}>

          {/* ── Image column ──────────────────────────────── */}
          <div className={styles.imageArea}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className={styles.imageWrapper}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <Image
                  src={sketch.image.url}
                  alt={sketch.image.alt || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Text column ───────────────────────────────── */}
          <div className={styles.textPanel}>
            {/* Counter */}
            <p className={styles.counter} aria-live="polite">
              {labels.page(currentIndex + 1, total)}
            </p>

            {/* Scrollable text body — grows and scrolls; controls live below */}
            <div className={styles.textBody}>
              {/* Animated text block — fades between sketches */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${currentIndex}`}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {sketch.title && (
                    <h2 className={styles.title}>{sketch.title}</h2>
                  )}
                  {sketch.image.alt && (
                    <p className={styles.description}>{sketch.image.alt}</p>
                  )}
                  {sketch.projectSlug && (
                    <Link
                      href={`/${locale}/projects/${sketch.projectSlug}`}
                      className={styles.projectLink}
                      onClick={onClose}
                    >
                      {labels.viewProject} →
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation ─────────────────────────────────── */}
            <div
              className={styles.controls}
              role="group"
              aria-label={l ? 'Navegación del carrusel' : 'Carousel navigation'}
            >
              <button
                className={styles.navBtn}
                onClick={goPrev}
                aria-label={labels.prev}
              >
                ← {labels.prev}
              </button>
              <button
                className={styles.navBtn}
                onClick={goNext}
                aria-label={labels.next}
              >
                {labels.next} →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
