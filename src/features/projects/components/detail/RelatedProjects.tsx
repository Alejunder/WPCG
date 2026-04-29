'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ProjectCard as ProjectCardData } from '../../types'
import ProjectCard from '../ProjectCard'
import styles from './RelatedProjects.module.css'

interface RelatedProjectsProps {
  projects: ProjectCardData[]
  locale: 'en' | 'es'
}

const HEADINGS: Record<'en' | 'es', string> = {
  en: 'You might also like',
  es: 'También te puede interesar',
}

export default function RelatedProjects({ projects, locale }: RelatedProjectsProps) {
  const shouldReduce = useReducedMotion()
  if (projects.length === 0) return null

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const, delay: shouldReduce ? 0 : i * 0.1 },
    }),
  }

  return (
    <section className={styles.section} aria-label="Related projects">
      <h2 className={styles.heading}>{HEADINGS[locale]}</h2>
      <ul className={styles.grid} role="list">
        {projects.map((project, index) => (
          <motion.li
            key={project.slug.current}
            className={styles.item}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <ProjectCard project={project} locale={locale} />
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
