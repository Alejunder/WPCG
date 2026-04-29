'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/features/shared/motion/motion.config'
import type { Locale } from '@/config/i18n'
import type { ServiceCard } from '@/features/services/types'
import ServiceCardComponent from './ServiceCard'
import styles from './ServicesGrid.module.css'

interface ServicesGridProps {
  services: ServiceCard[]
  locale: Locale
  emptyMessage?: string
}

const EMPTY: Record<'en' | 'es', string> = {
  en: 'No services found.',
  es: 'No se encontraron servicios.',
}

export default function ServicesGrid({ services, locale, emptyMessage }: ServicesGridProps) {
  const shouldReduce = useReducedMotion()
  const message = emptyMessage ?? EMPTY[locale]

  if (services.length === 0) {
    return (
      <div className={styles.empty} role="status">
        {message}
      </div>
    )
  }

  return (
    <motion.ul
      className={styles.grid}
      aria-label="Services"
      variants={shouldReduce ? undefined : staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {services.map((service) => (
        <motion.li
          key={service.slug.current}
          className={styles.item}
          variants={shouldReduce ? undefined : fadeInUp}
        >
          <ServiceCardComponent service={service} locale={locale} />
        </motion.li>
      ))}
    </motion.ul>
  )
}
