'use client'

import { useState, useCallback, useEffect, Fragment } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import Link from 'next/link'
import type { Locale } from '@/config/i18n'
import styles from './HeroSection.module.css'

interface HeroServiceLink {
  label: string
  href: string
}

interface HeroSectionProps {
  heroImages?: Array<{ url: string; alt: string }> | null
  locale: Locale
  heroServiceLinks?: HeroServiceLink[] | null
}

export default function HeroSection({ heroImages, locale, heroServiceLinks }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const shouldReduce = useReducedMotion()
  const t = useTranslations('HomePage')

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

  // Auto-advance every 7s. Resets on manual navigation (via `current` dep) and
  // is disabled when there is a single image or reduced motion is preferred.
  useEffect(() => {
    if (!hasMultiple || shouldReduce) return
    const id = setInterval(next, 7000)
    return () => clearInterval(id)
  }, [hasMultiple, shouldReduce, next, current])

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

  const renderCarouselNav = (navClassName: string) => (
    <div className={navClassName}>
      <button
        type="button"
        className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`}
        onClick={prev}
        aria-label={t('heroPrev')}
      >
        <span aria-hidden="true">←</span>
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
      <button
        type="button"
        className={`${styles.carouselBtn} ${styles.carouselBtnNext}`}
        onClick={next}
        aria-label={t('heroNext')}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  )

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

      {/* Brand lockup — centred on desktop/tablet */}
      <motion.div
        className={styles.brandOverlay}
        initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: ARCH_EASE, delay: 0.2 }}
      >
        <div className={styles.brandLockupWrapper}>
          <div className={styles.brandLockup}>
            <Image
              src="/images/wpcg-logo.png"
              alt="WPCG — Arquitectura y Construcción"
              width={480}
              height={148}
              priority
              sizes="(max-width: 390px) 50vw, (max-width: 639px) 46vw, (max-width: 767px) 52vw, (max-width: 1023px) 46vw, 26vw"
              className={styles.brandLogo}
            />
            <span className={styles.brandSubtitleExtra}>{t('heroSubtitleExtra')}</span>
            <Image
              src="/images/eco-logo.png"
              alt=""
              aria-hidden="true"
              width={669}
              height={373}
              className={styles.ecoLogo}
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom stack: services + CTAs */}
      <div className={styles.exitWrapper}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ARCH_EASE, delay: 0.3 }}
        >
          <div className={styles.heroCtaContainer}>
            {heroServiceLinks && heroServiceLinks.length > 0 && (
              <nav className={styles.serviceLinksRow} aria-label="Services">
                {heroServiceLinks.map((item, i) => (
                  <Fragment key={`${item.href}-${i}`}>
                    {i > 0 && (
                      <span className={styles.serviceSep} aria-hidden="true">|</span>
                    )}
                    <Link
                      href={`/${locale}${item.href}`}
                      className={styles.serviceLink}
                      transitionTypes={['nav-forward']}
                    >
                      {item.label}
                    </Link>
                  </Fragment>
                ))}
              </nav>
            )}

            <div className={styles.ctaGroup}>
              <Link href={`/${locale}/projects`} className={styles.ctaPrimary} transitionTypes={['nav-forward']}>
                {t('heroViewProjects')}
              </Link>
              <Link href={`/${locale}/contact`} className={styles.ctaSecondary} transitionTypes={['nav-forward']}>
                {t('heroContact')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Carousel navigation — desktop/tablet (absolute, viewport-centred) */}
      {hasMultiple && renderCarouselNav(styles.carouselNavDesktop)}

      {/* Scroll indicator */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </motion.section>
  )
}

