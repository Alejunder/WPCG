'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useExitAnimation } from '@/features/shared/motion/useExitAnimation'
import ProjectLightbox from './ProjectLightbox'
import styles from './ProjectGallery.module.css'

interface GalleryImage {
  url: string
  alt: string
}

interface ProjectGalleryProps {
  images: GalleryImage[]
  locale?: 'en' | 'es'
}

const HEADING: Record<'en' | 'es', string> = {
  en: 'Gallery',
  es: 'Galía',
}

const ARCH_EASE = [0.22, 1, 0.36, 1] as const

export default function ProjectGallery({ images, locale = 'en' }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduce = useReducedMotion()
  const exitControls = useExitAnimation('scale')

  if (images.length === 0) return null

  const total = images.length

  function open(index: number) {
    setActiveIndex(index)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function next() {
    setActiveIndex((i) => (i + 1) % total)
  }

  function prev() {
    setActiveIndex((i) => (i - 1 + total) % total)
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      rotateX: shouldReduce ? 0 : 8,
      scale: shouldReduce ? 1 : 0.96,
      y: shouldReduce ? 0 : 16,
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      scale: 1,
      y: 0,
      transition: { duration: 0.55, ease: ARCH_EASE },
    },
  }

  return (
    <motion.div animate={exitControls}>
    <section className={styles.gallery}>
      <p className={styles.heading}>{HEADING[locale]}</p>

      <motion.ul
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        style={{ perspective: 800 }}
      >
        {images.map((image, index) => (
          <motion.li
            key={`${image.url}-${index}`}
            className={styles.item}
            variants={itemVariants}
          >
            <button
              type="button"
              className={styles.thumb}
              aria-label={`Open image ${index + 1} of ${total}`}
              onClick={() => open(index)}
            >
              <Image
                src={image.url}
                alt={image.alt || `Project image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.image}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
              {/* Hover reveal overlay */}
              <span className={styles.thumbOverlay} aria-hidden="true">
                <span className={styles.thumbIcon}>⊕</span>
              </span>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <AnimatePresence>
        {isOpen && (
          <ProjectLightbox
            images={images}
            activeIndex={activeIndex}
            onClose={close}
            onNext={next}
            onPrev={prev}
          />
        )}
      </AnimatePresence>
    </section>
    </motion.div>
  )
}

