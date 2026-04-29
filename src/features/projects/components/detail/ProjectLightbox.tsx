'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ProjectLightbox.module.css'

interface ProjectLightboxProps {
  images: { url: string; alt: string }[]
  activeIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function ProjectLightbox({
  images,
  activeIndex,
  onClose,
  onNext,
  onPrev,
}: ProjectLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const image = images[activeIndex]

  // Scroll lock
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [])

  // Focus on mount — restore on unmount
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    return () => {
      trigger?.focus()
    }
  }, [])

  // Keyboard handling
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') { onNext(); return }
      if (e.key === 'ArrowLeft') { onPrev(); return }
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return }

      if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (!nodes || nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, onNext, onPrev])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].screenX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX.current - e.changedTouches[0].screenX
    if (delta > 50) onNext()
    else if (delta < -50) onPrev()
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={image.alt || `Image ${activeIndex + 1}`}
        tabIndex={-1}
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Close lightbox"
          onClick={onClose}
        >
          ✕
        </button>

        <button
          type="button"
          className={`${styles.nav} ${styles.prev}`}
          aria-label="Previous image"
          onClick={onPrev}
        >
          ‹
        </button>

        {/* Crossfade between images — key on activeIndex triggers AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className={styles.imageWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Image
              src={image.url}
              alt={image.alt || `Image ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className={styles.image}
              priority
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          className={`${styles.nav} ${styles.next}`}
          aria-label="Next image"
          onClick={onNext}
        >
          ›
        </button>

        <p className={styles.counter}>
          {activeIndex + 1} / {images.length}
        </p>
      </div>
    </motion.div>
  )
}

