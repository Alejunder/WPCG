'use client'

import TransitionLink from '@/features/shared/motion/TransitionLink'
import { motion, useReducedMotion } from 'framer-motion'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import styles from './CtaBanner.module.css'

export type CtaBannerVariant = 'default' | 'compact'

interface CtaBannerProps {
  headline: string
  sub?: string
  buttonLabel: string
  href: string
  /** 'compact' — interior pages (dark navbar bg, outlined button, arrow). */
  variant?: CtaBannerVariant
}

/**
 * Shared full-width CTA banner.
 * Named common component per AGENTS.md § 16.
 * Props: headline, sub (optional), buttonLabel, href, variant (optional).
 */
export default function CtaBanner({ headline, sub, buttonLabel, href, variant = 'default' }: CtaBannerProps) {
  const shouldReduce = useReducedMotion()

  if (variant === 'compact') {
    return (
      <motion.section
        className={styles.sectionCompact}
        aria-label="Call to action"
        initial={{ opacity: shouldReduce ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.innerCompact}>
          <motion.div
            className={styles.textCompact}
            initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.1, ease: ARCH_EASE }}
          >
            <p className={styles.headlineCompact}>{headline}</p>
            {sub && <p className={styles.subCompact}>{sub}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.25, ease: ARCH_EASE }}
          >
            <TransitionLink href={href} className={styles.buttonCompact}>
              {buttonLabel}
              <span className={styles.buttonArrow} aria-hidden="true">→</span>
            </TransitionLink>
          </motion.div>
        </div>
      </motion.section>
    )
  }

  return (
    <section className={styles.section} aria-label="Call to action">
      {/* Decorative shimmer line */}
      <motion.div
        className={styles.shimmer}
        initial={{ scaleX: shouldReduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: ARCH_EASE }}
        aria-hidden="true"
      />

      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: ARCH_EASE, delay: 0.15 }}
      >
        <div className={styles.text}>
          <h2 className={styles.headline}>{headline}</h2>
          {sub && <p className={styles.sub}>{sub}</p>}
        </div>

        <TransitionLink href={href} className={styles.button}>
          {buttonLabel}
        </TransitionLink>
      </motion.div>

      {/* Decorative shimmer line (bottom) */}
      <motion.div
        className={styles.shimmer}
        initial={{ scaleX: shouldReduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: ARCH_EASE, delay: 0.1 }}
        aria-hidden="true"
      />
    </section>
  )
}
