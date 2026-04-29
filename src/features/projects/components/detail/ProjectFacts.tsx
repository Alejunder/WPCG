'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useExitAnimation } from '@/features/shared/motion/useExitAnimation'
import styles from './ProjectFacts.module.css'

interface ProjectFactsProps {
  surfaceArea?: number | null
  duration?: string | null
  services: string[]
  locale: 'en' | 'es'
}

const LABELS: Record<'en' | 'es', { heading: string; surface: string; duration: string; services: string }> = {
  en: { heading: 'Project Details', surface: 'Surface area', duration: 'Duration', services: 'Services involved' },
  es: { heading: 'Datos del Proyecto', surface: 'Superficie', duration: 'Duración', services: 'Servicios' },
}

const ARCH_EASE = [0.22, 1, 0.36, 1] as const

export default function ProjectFacts({ surfaceArea, duration, services, locale }: ProjectFactsProps) {
  const t = LABELS[locale]
  const shouldReduce = useReducedMotion()
  const exitControls = useExitAnimation('down')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduce ? 0 : 0.1, delayChildren: 0.05 },
    },
  }

  const rowVariant = {
    hidden: { opacity: 0, x: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ARCH_EASE } },
  }

  const rows: { label: string; value: React.ReactNode }[] = [
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
            value: (
              <ul className={styles.services}>
                {services.map((service, index) => (
                  <li key={`${service}-${index}`}>{service}</li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
  ]

  return (
    <motion.div animate={exitControls}>
    <motion.section
      className={styles.facts}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <p className={styles.heading}>{t.heading}</p>

      <dl className={styles.list}>
        {rows.map((row) => (
          <motion.div key={row.label} className={styles.row} variants={rowVariant}>
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </motion.div>
        ))}
      </dl>
    </motion.section>
    </motion.div>
  )
}

