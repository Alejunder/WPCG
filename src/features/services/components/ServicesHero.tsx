'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import type { Locale } from '@/config/i18n'
import type { ServiceImage } from '@/features/services/types'
import styles from './ServicesHero.module.css'

interface ServicesHeroProps {
  locale: Locale
  heroImage?: ServiceImage | null
  intro?: string | null
}

const CONTENT: Record<Locale, { home: string; services: string }> = {
  en: { home: 'Home', services: 'Services' },
  es: { home: 'Inicio', services: 'Servicios' },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

export default function ServicesHero({ locale, heroImage, intro }: ServicesHeroProps) {
  const shouldReduce = useReducedMotion()
  const c = CONTENT[locale]

  const safeContainerVariants = shouldReduce
    ? { hidden: {}, visible: {} }
    : containerVariants

  const safeItemVariants = shouldReduce
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : itemVariants

  return (
    <section className={styles.hero} aria-label={c.services}>
      {heroImage?.url && (
        <div className={styles.imageWrapper} aria-hidden="true">
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
          <div className={styles.overlay} />
        </div>
      )}

      <div className={styles.noise} aria-hidden="true" />

      <div className={styles.inner}>
        <motion.div
          variants={safeContainerVariants}
          initial="hidden"
          animate="visible"
          className={styles.content}
        >
          <motion.nav
            variants={safeItemVariants}
            aria-label="Breadcrumb"
            className={styles.breadcrumb}
          >
            <ol className={styles.breadcrumbList}>
              <li>
                <Link href={`/${locale}`} className={styles.breadcrumbLink}>
                  {c.home}
                </Link>
              </li>
              <li aria-hidden="true" className={styles.breadcrumbSep}>›</li>
              <li aria-current="page" className={styles.breadcrumbCurrent}>
                {c.services}
              </li>
            </ol>
          </motion.nav>

          {intro && (
            <motion.p
              variants={safeItemVariants}
              className={styles.intro}
              style={{ transitionDelay: shouldReduce ? '0ms' : undefined }}
            >
              {intro}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

ServicesHero.displayName = 'ServicesHero'

// Re-export ease for use in ARCH_EASE-dependant motion below (tree-shaken if unused)
export { ARCH_EASE }
