'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/features/shared/motion/motion.config'
import type { ProcessStep } from '@/features/services/types'
import styles from './ProcessSection.module.css'

interface ProcessSectionProps {
  steps: ProcessStep[]
  heading: string
}

export default function ProcessSection({ steps, heading }: ProcessSectionProps) {
  const shouldReduce = useReducedMotion()

  return (
    <section className={styles.section} aria-label={heading}>
      <div className={styles.inner}>
        <motion.h2
          className={styles.heading}
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          {heading}
        </motion.h2>

        <motion.ol
          className={styles.list}
          variants={shouldReduce ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          aria-label={heading}
        >
          {steps.map((step) => (
            <motion.li
              key={step.step}
              className={styles.step}
              variants={shouldReduce ? undefined : fadeInUp}
            >
              <span className={styles.stepNumber} aria-hidden="true">
                {String(step.step).padStart(2, '0')}
              </span>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                {step.description && (
                  <p className={styles.stepDescription}>{step.description}</p>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
