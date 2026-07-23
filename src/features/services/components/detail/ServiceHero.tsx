'use client'

import { useRef } from 'react'
import { ViewTransition } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import styles from './ServiceHero.module.css'

interface ServiceHeroProps {
  name: string
  slug: string
  heroImage?: { url: string; alt: string } | null
  icon?: string | null
}

export default function ServiceHero({ name, slug, heroImage, icon }: ServiceHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['0%', '25%'])

  return (
    <section
      ref={ref}
      className={styles.hero}
      aria-label={name}
    >
      {heroImage?.url ? (
        <ViewTransition name={`service-hero-${slug}`}>
        <motion.div
          className={styles.imageWrapper}
          style={{ y: imageY }}
        >
          <Image
            src={heroImage.url}
            alt={heroImage.alt || name}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        </motion.div>
        </ViewTransition>
      ) : (
        <div className={styles.fallback} aria-hidden="true">
          <span className={styles.fallbackAccent}>{icon ?? '—'}</span>
        </div>
      )}

      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  )
}
