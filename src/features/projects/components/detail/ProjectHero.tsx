'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ViewTransition } from 'react'
import ParallaxLayer from '@/features/shared/motion/ParallaxLayer'
import SlowZoom from '@/features/shared/motion/SlowZoom'
import styles from './ProjectHero.module.css'

interface ProjectHeroProps {
  heroImage: {
    url: string
    alt: string
  }
  slug: string
}

export default function ProjectHero({ heroImage, slug }: ProjectHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Content fades out as user scrolls away
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], shouldReduce ? [1, 1] : [1, 0])

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Morph + parallax + slow-zoom image layer.
          MorphElement provides the VT snapshot rect (contain:paint clips to its bounds).
          ParallaxLayer and SlowZoom fill it completely so the image covers the full area. */}
      <ViewTransition name={`project-hero-${slug}`}>
      <div className={styles.imageWrapper}>
        <ParallaxLayer speed="25%" style={{ position: 'absolute', inset: 0 }}>
          <SlowZoom style={{ position: 'absolute', inset: 0 }}>
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              priority
              loading="eager"
              sizes="100vw"
              className={styles.image}
            />
          </SlowZoom>
        </ParallaxLayer>
      </div>
      </ViewTransition>

      {/* Depth overlays */}
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />

      {/* Scroll-fade content slot (title overlay if passed later) */}
      <motion.div className={styles.contentSlot} style={{ opacity: contentOpacity }} />
    </section>
  )
}

