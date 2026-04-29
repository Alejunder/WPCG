'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import styles from './ProjectHero.module.css'

interface ProjectHeroProps {
  heroImage: {
    url: string
    alt: string
  }
}

export default function ProjectHero({ heroImage }: ProjectHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Image drifts 25% slower than scroll — parallax depth
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['0%', '25%'])
  // Subtle scale breath on entry
  const imageScale = useTransform(scrollYProgress, [0, 0.5], shouldReduce ? [1, 1] : [1.08, 1.0])
  // Content fades out as user scrolls away
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], shouldReduce ? [1, 1] : [1, 0])

  return (
    <motion.section
      ref={ref}
      className={styles.hero}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Parallax image layer */}
      <motion.div
        className={styles.imageWrapper}
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      </motion.div>

      {/* Depth overlays */}
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />

      {/* Scroll-fade content slot (title overlay if passed later) */}
      <motion.div className={styles.contentSlot} style={{ opacity: contentOpacity }} />
    </motion.section>
  )
}
