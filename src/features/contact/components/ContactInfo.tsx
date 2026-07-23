'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import type { ContactInfoData } from '../types'
import styles from './ContactInfo.module.css'
import logo from '@/assets/wpcg-removebg-preview.png'

interface ContactInfoProps {
  info: ContactInfoData | null
}

const slideIn = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export default function ContactInfo({ info }: ContactInfoProps) {
  const t = useTranslations('ContactInfo')

  return (
    <motion.aside
      className={styles.panel}
      variants={slideIn}
      initial="hidden"
      animate="visible"
      aria-label={t('ariaLabel')}
    >
      <div className={styles.brand}>
        <Image src={logo} alt="WPCG Logo" className={styles.logo} style={{ height: '85px', width: 'auto' }} loading="eager" priority />
      </div>

      {info?.address && (
        <div className={styles.group}>
          <p className={styles.groupLabel}>{t('labelAddress')}</p>
          <p className={styles.groupValue}>{info.address}</p>
        </div>
      )}

      {info?.email && (
        <div className={styles.group}>
          <p className={styles.groupLabel}>{t('labelEmail')}</p>
          <a href={`mailto:${info.email}`} className={styles.link}>
            {info.email}
          </a>
        </div>
      )}

      {info?.phone && (
        <div className={styles.group}>
          <p className={styles.groupLabel}>{t('labelPhone')}</p>
          <a href={`tel:${info.phone}`} className={styles.link}>
            {info.phone}
          </a>
        </div>
      )}

      {info?.workingHours && (
        <div className={styles.group}>
          <p className={styles.groupLabel}>{t('labelHours')}</p>
          <p className={styles.groupValue}>{info.workingHours}</p>
        </div>
      )}

      {info?.socialLinks && info.socialLinks.length > 0 && (
        <>
          {/* Scroll-draw divider above social links */}
          <AnimatedDivider className={styles.socialsDivider} />
          <div className={styles.socials}>
          {info.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.platform} — WPCG`}
            >
              {link.platform === 'linkedin' && (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.socialIcon}>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              )}
              {link.platform === 'instagram' && (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={styles.socialIcon}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              )}
              <span className={styles.socialLabel}>{link.platform}</span>
            </a>
          ))}
          </div>
        </>
      )}
    </motion.aside>
  )
}
