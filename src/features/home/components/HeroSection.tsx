'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import TransitionLink from '@/features/shared/motion/TransitionLink'
import { useExitAnimation } from '@/features/shared/motion/useExitAnimation'
import type { Locale } from '@/config/i18n'
import styles from './HeroSection.module.css'

interface HeroSectionProps {
  heroImages?: Array<{ url: string; alt: string }> | null
  locale: Locale
}

export default function HeroSection({ heroImages, locale }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const shouldReduce = useReducedMotion()
  const t = useTranslations('HomePage')
  const exitControls = useExitAnimation('up')

  const images = heroImages ?? []
  const hasImages = images.length > 0
  const hasMultiple = images.length > 1

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
  }, [])

  const prev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length, -1)
  }, [current, images.length, goTo])

  const next = useCallback(() => {
    goTo((current + 1) % images.length, 1)
  }, [current, images.length, goTo])

  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduce ? 0 : dir * 80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: ARCH_EASE },
    },
    exit: (dir: number) => ({
      x: shouldReduce ? 0 : dir * -80,
      opacity: 0,
      transition: { duration: 0.5, ease: ARCH_EASE },
    }),
  }

  return (
    <motion.section className={styles.hero} aria-label="Hero">
      {/* Carousel images */}
      <AnimatePresence initial={false} custom={direction}>
        {hasImages ? (
          <motion.div
            key={current}
            className={styles.imageWrapper}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Image
              src={images[current].url}
              alt={images[current].alt}
              fill
              priority={current === 0}
              loading={current === 0 ? 'eager' : 'lazy'}
              sizes="100vw"
              className={styles.image}
            />
          </motion.div>
        ) : (
          <div className={styles.imageFallback} />
        )}
      </AnimatePresence>

      {/* Overlay */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* CTA group — participates in scene exit */}
      <motion.div animate={exitControls} className={styles.exitWrapper}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ARCH_EASE, delay: 0.3 }}
        >
          <div className={styles.ctaGroup}>
            <TransitionLink href={`/${locale}/projects`} className={styles.ctaPrimary}>
              {t('heroViewProjects')}
            </TransitionLink>
            <TransitionLink href={`/${locale}/contact`} className={styles.ctaSecondary}>
              {t('heroContact')}
            </TransitionLink>
          </div>
        </motion.div>
      </motion.div>

      {/* Carousel navigation */}
      {hasMultiple && (
        <>
          <button
            type="button"
            className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`}
            onClick={prev}
            aria-label={t('heroPrev')}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className={`${styles.carouselBtn} ${styles.carouselBtnNext}`}
            onClick={next}
            aria-label={t('heroNext')}
          >
            <span aria-hidden="true">→</span>
          </button>
          <div className={styles.dots} role="tablist" aria-label="Hero images">
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Image ${i + 1} of ${images.length}`}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => goTo(i, i > current ? 1 : -1)}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </motion.section>
  )
}

