'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import styles from './ProjectsPageHero.module.css'

interface Props {
  locale: 'en' | 'es'
  title?: string | null
  subtitle?: string | null
}

const CONTENT: Record<'en' | 'es', { title: string; home: string; projects: string }> = {
  en: { title: 'Our Projects', home: 'Home', projects: 'Projects & construction works' },
  es: { title: 'Nuestros Proyectos', home: 'Inicio', projects: 'Proyectos y obras' },
}

export default function ProjectsPageHero({ locale, title, subtitle }: Props) {
  const shouldReduce = useReducedMotion()
  const c = CONTENT[locale]
  const resolvedTitle = title ?? c.title

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
                <Link href={`/${locale}`} className={styles.breadcrumbLink}>
                  {c.home}
                </Link>
              </li>
              <li aria-hidden="true" className={styles.breadcrumbSep}>›</li>
              <li aria-current="page" className={styles.breadcrumbCurrent}>
                {c.projects}
              </li>
            </ol>
          </motion.nav>

          <motion.h1 variants={itemVariants} className={styles.title}>
            {resolvedTitle}
          </motion.h1>

          {subtitle && (
            <motion.p variants={itemVariants} className={styles.subtitle}>
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
      <motion.div
        className={styles.accentLine}
        aria-hidden="true"
        initial={{ scaleX: shouldReduce ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
      />
    </section>
  )
}
