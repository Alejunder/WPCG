'use client'

import { motion } from 'framer-motion'
import { staggerItem } from '@/features/shared/motion/StaggerContainer'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import type { AboutValue } from '@/features/about/types'
import styles from './AboutValues.module.css'

interface AboutValuesProps {
  values: AboutValue[] | null
  heading?: string
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1, ease: ARCH_EASE } },
}

export default function AboutValues({ values, heading }: AboutValuesProps) {
  const items = values ?? []

  if (items.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="about-values-heading">
      <div className={styles.inner}>
        {heading && (
          <h2 id="about-values-heading" className={styles.sectionHeading}>
            {heading}
          </h2>
        )}

        <motion.ol
          className={styles.list}
          aria-label="Our values"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {items.map((value, index) => {
            const num = String(index + 1).padStart(2, '0')
            return (
              <motion.li key={value.title} className={styles.item} variants={staggerItem}>
                {/* Scroll-draw top separator for each item */}
                <AnimatedDivider className={styles.itemDivider} delay={index * 0.06} />
                <span className={styles.number} aria-hidden="true">
                  {num}
                </span>
                <div className={styles.body}>
                  <h3 className={styles.title}>{value.title}</h3>
                  {value.description && (
                    <p className={styles.description}>{value.description}</p>
                  )}
                </div>
              </motion.li>
            )
          })}
        </motion.ol>
        {/* Scroll-draw bottom border after the last item */}
        <AnimatedDivider className={styles.listEndDivider} delay={items.length * 0.06} />
      </div>
    </section>
  )
}
