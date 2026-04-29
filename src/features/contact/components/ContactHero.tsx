'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Breadcrumb from '@/features/shared/components/Breadcrumb'
import type { Locale } from '@/config/i18n'
import styles from './ContactHero.module.css'

interface ContactHeroProps {
  locale: Locale
}

export default function ContactHero({ locale }: ContactHeroProps) {
  const t = useTranslations('ContactPage')

  const breadcrumbItems = [
    { label: t('breadcrumbHome'), href: `/${locale}` },
    { label: t('breadcrumbContact') },
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
          {t('heroHeading')}
        </motion.h1>
        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {t('heroSub')}
        </motion.p>
      </div>
    </section>
  )
}
