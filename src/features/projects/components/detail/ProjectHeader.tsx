'use client'

import { ViewTransition } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { ProjectCategory } from '../../types'
import styles from './ProjectHeader.module.css'

interface ProjectHeaderProps {
  title: string
  slug: string
  category: ProjectCategory
  year?: number | null
  location?: string | null
  locale: 'en' | 'es'
}

const LABELS: Record<'en' | 'es', { year: string; location: string }> = {
  en: { year: 'Year', location: 'Location' },
  es: { year: 'Año', location: 'Ubicación' },
}

const CATEGORY_LABELS: Record<'en' | 'es', Record<ProjectCategory, string>> = {
  en: { office: 'Offices', residential: 'Residential', retail: 'Retail' },
  es: { office: 'Oficinas', residential: 'Residencial', retail: 'Comercial' },
}

// Maps each category to its global design-token so the detail page inherits
// the same colour identity as the filter bar and card chips.
const CATEGORY_COLOR: Record<ProjectCategory, string> = {
  office: 'var(--color-category-office)',
  residential: 'var(--color-category-residential)',
  retail: 'var(--color-category-retail)',
}

const ARCH_EASE = [0.22, 1, 0.36, 1] as const

export default function ProjectHeader({ title, slug, category, year, location, locale }: ProjectHeaderProps) {
  const t = LABELS[locale]
  const categoryLabel = CATEGORY_LABELS[locale][category]
  const categoryColor = CATEGORY_COLOR[category]
  const shouldReduce = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.08 } },
  }

  const categoryLineVariant = {
    hidden: { scaleX: shouldReduce ? 1 : 0 },
    visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.1, ease: ARCH_EASE } },
  }

  const categoryVariant = {
    hidden: { opacity: 0, x: shouldReduce ? 0 : -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ARCH_EASE } },
  }

  const titleVariant = {
    // opacity: 1 in hidden — the h1 must be visible in the VT "after" snapshot.
    // The ViewTransition wrapper applies view-transition-name to this element
    // during React's commit-phase startViewTransition call. If the h1 is at
    // opacity: 0, the browser captures a transparent snapshot and the morph
    // is invisible. The skewY + y transforms provide the entrance animation
    // without hiding the element.
    hidden: { opacity: 1, skewY: shouldReduce ? 0 : 1.5, y: shouldReduce ? 0 : 20 },
    visible: {
      opacity: 1,
      skewY: 0,
      y: 0,
      transition: { duration: 0.7, ease: ARCH_EASE },
    },
  }

  const accentBarVariant = {
    hidden: { scaleX: 0, originX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.6, delay: 0.25, ease: ARCH_EASE } },
  }

  const metaVariant = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  }

  return (
    <motion.section
      className={styles.header}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      style={{ '--category-color': categoryColor } as React.CSSProperties}
    >
      {/* Category tag with horizontal dash */}
      <motion.div variants={categoryVariant} className={styles.categoryWrapper}>
        {/* Scroll-draw dash — scaleX via parent stagger variant propagation */}
        <motion.span
          className={styles.categoryLine}
          aria-hidden="true"
          variants={categoryLineVariant}
          style={{ transformOrigin: 'left' }}
        />
        <span className={styles.category}>{categoryLabel}</span>
      </motion.div>

      {/* Title with clip-mask skew reveal */}
      <div className={styles.titleWrapper}>
        {/*
         * <ViewTransition> pairs this <h1> with the overlay title <p> in the
         * ProjectCard (which carries a matching static viewTransitionName style)
         * so React can morph between them when navigating card → detail.
         *
         * The h1 must be at opacity: 1 during the VT snapshot (see titleVariant)
         * so the "after" state is fully visible. Any opacity:0 initial state here
         * would make the VT snapshot transparent and the morph invisible.
         *
         * ⚠️  Do NOT reuse this name on any other element in this page tree.
         * Duplicate view-transition-name values within the same document are
         * invalid and will silently break the morph.
         */}
        <ViewTransition name={`project-title-${slug}`}>
        <motion.h1 variants={titleVariant} className={styles.title}>
          {title}
        </motion.h1>
        </ViewTransition>
      </div>

      {/* Gold accent bar — animates scaleX from left */}
      <motion.div variants={accentBarVariant} className={styles.accentBar} aria-hidden="true" />

      {/* Meta facts */}
      <motion.dl variants={metaVariant} className={styles.meta}>
        {year != null && (
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>{t.year}</dt>
            <dd className={styles.metaValue}>{year}</dd>
          </div>
        )}
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>{t.location}</dt>
          <dd className={styles.metaValue}>{location || '—'}</dd>
        </div>
      </motion.dl>
    </motion.section>
  )
}

