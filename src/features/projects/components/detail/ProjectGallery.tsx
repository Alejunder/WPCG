'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import ProjectLightbox from './ProjectLightbox'
import type { ProjectCategory } from '../../types'
import styles from './ProjectGallery.module.css'

interface GalleryImage {
  url: string
  alt: string
}

const CATEGORY_COLOR: Record<ProjectCategory, string> = {
  office: 'var(--color-category-office)',
  residential: 'var(--color-category-residential)',
  retail: 'var(--color-category-retail)',
}

interface ProjectGalleryProps {
  images: GalleryImage[]
  locale?: 'en' | 'es'
  category?: ProjectCategory
}

const HEADING: Record<'en' | 'es', string> = {
  en: 'Gallery',
  es: 'Galía',
}

const ARCH_EASE = [0.22, 1, 0.36, 1] as const

export default function ProjectGallery({ images, locale = 'en', category }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduce = useReducedMotion()

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
        delayChildren: 0.4,
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
    <section
      className={styles.gallery}
      style={category ? ({ '--category-color': CATEGORY_COLOR[category] } as React.CSSProperties) : undefined}
    >
      {/* Scroll-draw top separator — colour inherits --category-color from parent */}
      <AnimatedDivider className={styles.topDivider} />
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
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
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
  )
}

