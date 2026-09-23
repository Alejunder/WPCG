'use client'

import { motion, useReducedMotion } from 'framer-motion'
import ServiceItem from './ServiceItem'
import styles from './ProjectFacts.module.css'

import type { ProjectCategory } from '../../types'

interface ProjectFactsProps {
  surfaceArea?: number | null
  duration?: string | null
  services: string[]
  locale: 'en' | 'es'
  category?: ProjectCategory
  ecoFriendly?: boolean | null
}

const CATEGORY_COLOR: Record<ProjectCategory, string> = {
  office: 'var(--color-category-office)',
  residential: 'var(--color-category-residential)',
  retail: 'var(--color-category-retail)',
}

const LABELS: Record<
  'en' | 'es',
  { heading: string; surface: string; duration: string; services: string; serviceTooltip: string }
> = {
  en: {
    heading: 'Project Details',
    surface: 'Surface area',
    duration: 'Duration',
    services: 'Services involved',
    serviceTooltip: 'See more about this service',
  },
  es: {
    heading: 'Datos del Proyecto',
    surface: 'Superficie',
    duration: 'Duración',
    services: 'Servicios',
    serviceTooltip: 'Ver más sobre este servicio',
  },
}

const ARCH_EASE = [0.22, 1, 0.36, 1] as const

export default function ProjectFacts({ surfaceArea, duration, services, locale, category, ecoFriendly }: ProjectFactsProps) {
  const t = LABELS[locale]
  const categoryColor = category ? CATEGORY_COLOR[category] : undefined
  const shouldReduce = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduce ? 0 : 0.1, delayChildren: 0.4 },
    },
  }

  const rowVariant = {
    hidden: { opacity: 0, x: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ARCH_EASE } },
  }

  const rows: { label: string; value: React.ReactNode; stack?: boolean }[] = [
    {
      label: t.surface,
      value: surfaceArea != null ? `${surfaceArea.toLocaleString(locale)} m²` : '—',
    },
    {
      label: t.duration,
      value: duration || '—',
    },
    ...(services.length > 0
      ? [
          {
            label: t.services,
            stack: true,
            value: (
              <ul className={styles.services}>
                {services.map((service, index) => (
                  <ServiceItem
                    key={`${service}-${index}`}
                    name={service}
                    tooltipLabel={t.serviceTooltip}
                  />
                ))}
              </ul>
            ),
          },
        ]
      : []),
  ]

  return (
    <motion.section
      className={styles.facts}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={categoryColor ? ({ '--category-color': categoryColor } as React.CSSProperties) : undefined}
    >
      <p className={styles.heading}>{t.heading}</p>
      {/* Scroll-draw divider below the heading */}
      <motion.div
        className={styles.headingDivider}
        initial={shouldReduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-30% 0px -30% 0px' }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
        aria-hidden="true"
      />

      <dl className={styles.list}>
        {rows.map((row, index) => (
          <motion.div
            key={row.label}
            className={`${styles.row}${row.stack ? ` ${styles.rowStacked}` : ''}`}
            variants={rowVariant}
          >
            {/* Animated top separator on the first row only */}
            {index === 0 && (
              <motion.div
                className={styles.rowTopLine}
                initial={shouldReduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-30% 0px -30% 0px' }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
                aria-hidden="true"
              />
            )}
            {/* Animated bottom separator for every row */}
            <motion.div
              className={styles.rowBottomLine}
              initial={shouldReduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-30% 0px -30% 0px' }}
              transition={{ duration: 1.8, ease: 'easeOut', delay: index * 0.08 }}
              style={{ transformOrigin: 'left' }}
              aria-hidden="true"
            />
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </motion.div>
        ))}
      </dl>

      {/* Eco-friendly badge — bottom right of the details panel */}
      {ecoFriendly && (
        <div className={styles.ecoBadgeWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/eco-logo.png"
            alt="Eco-friendly project"
            width={669}
            height={373}
            className={styles.ecoBadge}
          />
        </div>
      )}
    </motion.section>
  )
}

