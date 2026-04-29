'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import styles from './ServiceHero.module.css'

interface ServiceHeroProps {
  name: string
  image?: { url: string; alt: string } | null
  icon?: string | null
}

export default function ServiceHero({ name, image, icon }: ServiceHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['0%', '25%'])

  return (
    <motion.section
      ref={ref}
      className={styles.hero}
      aria-label={name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {image?.url ? (
        <motion.div className={styles.imageWrapper} style={{ y: imageY }}>
          <Image
            src={image.url}
            alt={image.alt || name}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        </motion.div>
      ) : (
        <div className={styles.fallback} aria-hidden="true">
          <span className={styles.fallbackAccent}>{icon ?? '—'}</span>
        </div>
      )}

      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />
    </motion.section>
  )
}
