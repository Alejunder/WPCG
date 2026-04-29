'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, animate } from 'framer-motion'
import type { ProjectCard as ProjectCardData } from '../types'
import type { Locale } from '@/types/locale'
import ProjectCard from './ProjectCard'
import styles from './ProjectCarousel.module.css'

interface Props {
  projects: ProjectCardData[]
  locale: Locale
}

export default function ProjectCarousel({ projects, locale }: Props) {
  const [current, setCurrent] = useState(0)
  const shouldReduce = useReducedMotion()
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const total = projects.length
  if (total === 0) return null

  function getSlideWidth(): number {
    return containerRef.current?.offsetWidth ?? 0
  }

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(index, total - 1))
    setCurrent(clamped)
    const width = getSlideWidth()
    if (shouldReduce) {
      x.set(-clamped * width)
    } else {
      animate(x, -clamped * width, { type: 'spring', stiffness: 300, damping: 35 })
    }
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    const threshold = getSlideWidth() * 0.3
    if (info.offset.x < -threshold) goTo(current + 1)
    else if (info.offset.x > threshold) goTo(current - 1)
    else goTo(current) // snap back
  }

  return (
    <div className={styles.carousel} aria-label="Projects carousel" aria-roledescription="carousel">
      {/* Track */}
      <div className={styles.viewport} ref={containerRef}>
        <motion.div
          className={styles.track}
          style={{ x }}
          drag={shouldReduce ? false : 'x'}
          dragConstraints={{ left: -(total - 1) * (containerRef.current?.offsetWidth ?? 0), right: 0 }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
        >
          {projects.map((project, index) => (
            <div
              key={project.slug.current}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}`}
            >
              <ProjectCard project={project} locale={locale} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation arrows */}
      <button
        type="button"
        className={`${styles.navBtn} ${styles.prev}`}
        aria-label="Previous project"
        onClick={() => goTo(current - 1)}
        disabled={current === 0}
      >
        ←
      </button>

      <button
        type="button"
        className={`${styles.navBtn} ${styles.next}`}
        aria-label="Next project"
        onClick={() => goTo(current + 1)}
        disabled={current === total - 1}
      >
        →
      </button>

      {/* Counter */}
      <p className={styles.counter} aria-live="polite" aria-atomic="true">
        <span className={styles.counterCurrent}>{current + 1}</span>
        <span className={styles.counterSep}> / </span>
        <span className={styles.counterTotal}>{total}</span>
      </p>

      {/* Dot indicators */}
      <div className={styles.dots} role="tablist" aria-label="Slide indicators">
        {projects.map((project, index) => (
          <button
            key={project.slug.current}
            type="button"
            role="tab"
            aria-selected={index === current}
            aria-label={`Go to project ${index + 1}`}
            className={`${styles.dot}${index === current ? ` ${styles.dotActive}` : ''}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
