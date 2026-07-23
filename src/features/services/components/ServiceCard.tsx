'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import type { Locale } from '@/config/i18n'
import type { ServiceCard } from '@/features/services/types'
import styles from './ServiceCard.module.css'

interface ServiceCardProps {
  service: ServiceCard
  locale: Locale
}

const CTA_LABEL: Record<Locale, string> = {
  en: 'Learn more',
  es: 'Más información',
}

export default function ServiceCard({ service, locale }: ServiceCardProps) {
  const shouldReduce = useReducedMotion()
  const { name, slug, shortDescription, icon, heroImage } = service

  return (
    <motion.div
      className={styles.cardWrapper}
      whileHover={shouldReduce ? undefined : { y: -4 }}
      transition={{ duration: 0.45, ease: ARCH_EASE }}
    >
      <Link
        href={`/${locale}/services/${slug.current}`}
        className={styles.card}
        aria-label={`${name} — ${CTA_LABEL[locale]}`}
      >
        {/* Image or accent icon */}
        {heroImage?.url ? (
          <div
            className={styles.imageWrapper}
            style={{ viewTransitionName: `service-hero-${slug.current}` }}
          >
            <Image
              src={heroImage.url}
              alt={heroImage.alt || name}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className={styles.image}
            />
            <div className={styles.imageOverlay} aria-hidden="true" />
            {icon && (
              <span className={styles.accentOverlay} aria-hidden="true">
                {icon}
              </span>
            )}
          </div>

        ) : (
          <div className={styles.accentWrapper} aria-hidden="true">
            <span className={styles.accent}>{icon ?? '—'}</span>
          </div>
        )}

        {/* Text content */}
        <div className={styles.body}>
          <h3
            className={styles.name}
            style={{ viewTransitionName: `service-title-${slug.current}` }}
          >{name}</h3>
          <p className={styles.description}>{shortDescription}</p>
          <span className={styles.cta} aria-hidden="true">
            {CTA_LABEL[locale]} →
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
