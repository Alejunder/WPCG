'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useExitAnimation } from '@/features/shared/motion/useExitAnimation'
import type { ProjectCategory } from '../../types'
import styles from './ProjectHeader.module.css'

interface ProjectHeaderProps {
  title: string
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

const ARCH_EASE = [0.22, 1, 0.36, 1] as const

export default function ProjectHeader({ title, category, year, location, locale }: ProjectHeaderProps) {
  const t = LABELS[locale]
  const categoryLabel = CATEGORY_LABELS[locale][category]
  const shouldReduce = useReducedMotion()
  const exitControls = useExitAnimation('down')

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.08 } },
  }

  const categoryVariant = {
    hidden: { opacity: 0, x: shouldReduce ? 0 : -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ARCH_EASE } },
  }

  const titleVariant = {
    hidden: { opacity: 0, skewY: shouldReduce ? 0 : 1.5, y: shouldReduce ? 0 : 20 },
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
    <motion.div animate={exitControls}>
    <motion.section
      className={styles.header}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Category tag with horizontal dash */}
      <motion.div variants={categoryVariant} className={styles.categoryWrapper}>
        <span className={styles.categoryLine} aria-hidden="true" />
        <span className={styles.category}>{categoryLabel}</span>
      </motion.div>

      {/* Title with clip-mask skew reveal */}
      <div className={styles.titleWrapper}>
        <motion.h1 variants={titleVariant} className={styles.title}>
          {title}
        </motion.h1>
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
    </motion.div>
  )
}

