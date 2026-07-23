'use client'

import { motion } from 'framer-motion'
import Breadcrumb from '@/features/shared/components/Breadcrumb'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import type { Locale } from '@/config/i18n'
import styles from './LegalHero.module.css'

interface LegalHeroProps {
  locale: Locale
  title: string
  homeLabel: string
  currentLabel: string
}

export default function LegalHero({ locale, title, homeLabel, currentLabel }: LegalHeroProps) {
  const breadcrumbItems = [
    { label: homeLabel, href: `/${locale}` },
    { label: currentLabel },
  ]

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <Breadcrumb items={breadcrumbItems} />
        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
        </motion.h1>
      </div>
      <AnimatedDivider className={styles.bottomDivider} delay={0.4} />
    </section>
  )
}
