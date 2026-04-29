'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TransitionLink from '@/features/shared/motion/TransitionLink'
import styles from './ProjectsPageHero.module.css'

interface Props {
  locale: 'en' | 'es'
}

const CONTENT: Record<'en' | 'es', { title: string; home: string; projects: string }> = {
  en: { title: 'Our Projects', home: 'Home', projects: 'Projects' },
  es: { title: 'Nuestros Proyectos', home: 'Inicio', projects: 'Proyectos' },
}

export default function ProjectsPageHero({ locale }: Props) {
  const shouldReduce = useReducedMotion()
  const c = CONTENT[locale]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  }

  return (
    <section className={styles.hero} aria-label={c.title}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.inner}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={styles.content}
        >
          <motion.nav variants={itemVariants} aria-label="Breadcrumb" className={styles.breadcrumb}>
            <ol className={styles.breadcrumbList}>
              <li>
                <TransitionLink href={`/${locale}`} className={styles.breadcrumbLink}>
                  {c.home}
                </TransitionLink>
              </li>
              <li aria-hidden="true" className={styles.breadcrumbSep}>›</li>
              <li aria-current="page" className={styles.breadcrumbCurrent}>
                {c.projects}
              </li>
            </ol>
          </motion.nav>

          <motion.h1 variants={itemVariants} className={styles.title}>
            {c.title}
          </motion.h1>
        </motion.div>
      </div>
      <div className={styles.accentLine} aria-hidden="true" />
    </section>
  )
}
