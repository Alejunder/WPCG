'use client'

import { type CSSProperties } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import MotionImage from '@/features/shared/motion/MotionImage'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import type { ProjectCard, ProjectCategory } from '@/features/projects/types'
import type { Locale } from '@/types/locale'
import styles from './ProjectCard.module.css'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Static asset — must exist under public/images/.
 * Next.js serves files from /public at the root path, so this resolves to
 * public/images/project-placeholder.jpg at build time.
 */
const FALLBACK_IMAGE = '/images/project-placeholder.jpg' satisfies `/${string}`

/**
 * Maps each project category to the corresponding global CSS token.
 * The token is injected as --cat-color on the card wrapper and cascades
 * to chips, category label and arrow inside the overlay.
 */
const CATEGORY_COLOR: Record<ProjectCategory, string> = {
  residential: 'var(--color-category-residential)',
  retail: 'var(--color-category-retail)',
  office: 'var(--color-category-office)',
}

// ---------------------------------------------------------------------------
// Variants
// Variant name "hover" propagates automatically from the parent motion.div
// to all children that declare the same variant key.
// ---------------------------------------------------------------------------

const cardVariants: Variants = {
  rest: { scale: 1, y: 0, boxShadow: 'none', transition: { duration: 0.5, ease: ARCH_EASE } },
  hover: { scale: 1.02, y: -6, boxShadow: 'var(--shadow-card-hover)', transition: { duration: 0.5, ease: ARCH_EASE } },
}

const overlayVariants: Variants = {
  rest: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
  hover: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

const chipsContainerVariants: Variants = {
  rest: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
  hover: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const chipVariants: Variants = {
  rest: { opacity: 0, y: 10, transition: { duration: 0.15, ease: 'easeIn' } },
  hover: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  project: ProjectCard
  locale: Locale
}

export default function ProjectCard({ project, locale }: Props) {
  const t = useTranslations('ProjectCard')
  const shouldReduce = useReducedMotion()
  const { title, slug, category, heroImage, servicesInvolved, ecoFriendly } = project

  const href = `/${locale}/projects/${slug.current}`

  const imageSrc = heroImage.url || FALLBACK_IMAGE
  const imageAlt = heroImage.alt || title

  return (
    <motion.div
      className={styles.cardWrapper}
      style={{ '--cat-color': CATEGORY_COLOR[category] } as CSSProperties}
      variants={shouldReduce ? undefined : cardVariants}
      initial="rest"
      animate="rest"
      whileHover={shouldReduce ? undefined : 'hover'}
    >
      <Link
        href={href}
        className={styles.card}
        aria-label={t('viewProject', { title })}
      >
        <div
          className={styles.imageWrapper}
          style={{ contain: 'paint', viewTransitionName: `project-hero-${slug.current}` } as CSSProperties}
        >
          <MotionImage
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className={styles.image}
            style={{ position: 'absolute', inset: 0 }}
          />

          {/* Glassmorphism overlay — Framer Motion variant-driven */}
          <motion.div
            className={styles.overlay}
            variants={shouldReduce ? undefined : overlayVariants}
            aria-hidden="true"
          >
            {/* Service chips — staggered entrance */}
            {servicesInvolved.length > 0 && (
              <motion.ul
                className={styles.chips}
                variants={shouldReduce ? undefined : chipsContainerVariants}
              >
                {servicesInvolved.map((service) => (
                  <motion.li
                    key={service}
                    className={styles.chip}
                    variants={shouldReduce ? undefined : chipVariants}
                  >
                    {service}
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {/* Meta block — title, category, arrow */}
            <div className={styles.overlayMeta}>
              <p
                className={styles.overlayTitle}
                style={{ viewTransitionName: `project-title-${slug.current}` } as CSSProperties}
              >
                {title}
              </p>
              <p className={styles.overlayCategory}>{t(`categories.${category}`)}</p>
              <span className={styles.overlayArrow}>→</span>
            </div>
          </motion.div>
        </div>
      </Link>

      {/* Eco-friendly badge — outside <Link> to avoid overflow:hidden clipping */}
      {ecoFriendly && (
        <div className={styles.ecoBadgeWrapper} aria-label="Eco-friendly project">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/eco-friendly.png"
            alt="Eco-friendly"
            width={64}
            height={64}
            className={styles.ecoBadge}
          />
        </div>
      )}
    </motion.div>
  )
}