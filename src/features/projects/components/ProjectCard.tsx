'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import MotionImage from '@/features/shared/motion/MotionImage'
import TransitionLink from '@/features/shared/motion/TransitionLink'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import type { ProjectCard } from '@/features/projects/types'
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
  const { title, slug, category, heroImage } = project

  const imageSrc = heroImage.url || FALLBACK_IMAGE
  const imageAlt = heroImage.alt || title

  return (
    <motion.div
      className={styles.cardWrapper}
      whileHover={shouldReduce ? undefined : { scale: 1.015 }}
      transition={{ duration: 0.6, ease: ARCH_EASE }}
    >
      <TransitionLink
        href={`/${locale}/projects/${slug.current}`}
        className={styles.card}
        aria-label={t('viewProject', { title })}
      >
        <div className={styles.imageWrapper}>
          {/*
           * MotionImage wrapper overrides its default `position: relative`
           * via the `style` prop so it fills .imageWrapper absolutely.
           * The fill <Image> is then positioned relative to this wrapper.
           * The .overlay sits alongside (both absolute within .imageWrapper).
           */}
          <MotionImage
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className={styles.image}
            style={{ position: 'absolute', inset: 0 }}
          />
          <div className={styles.overlay} aria-hidden="true">
            <p className={styles.overlayTitle}>{title}</p>
            <p className={styles.overlayCategory}>{t(`categories.${category}`)}</p>
            <span className={styles.overlayArrow}>→</span>
          </div>
        </div>
      </TransitionLink>
    </motion.div>
  )
}
