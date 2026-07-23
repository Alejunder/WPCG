'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import type { ProjectCard as ProjectCardData } from '@/features/projects/types'
import type { Locale } from '@/types/locale'
import ProjectCard from './ProjectCard'
import styles from './ProjectGrid.module.css'

interface Props {
  projects: ProjectCardData[]
  locale: Locale
}

export default function ProjectGrid({ projects, locale }: Props) {
  const shouldReduce = useReducedMotion()

  if (projects.length === 0) {
    return (
      <section aria-label="Projects list" className={styles.empty}>
        <p>No projects found.</p>
      </section>
    )
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: shouldReduce
        ? {}
        : { staggerChildren: 0.12, delayChildren: 0.4 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: ARCH_EASE },
    },
  }

  return (
    <motion.ul
      className={styles.grid}
      aria-label="Projects list"
      role="list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project, index) => (
        <motion.li
          key={project.slug.current || index}
          className={styles.item}
          variants={itemVariants}
        >
          <ProjectCard project={project} locale={locale} />
        </motion.li>
      ))}
    </motion.ul>
  )
}
