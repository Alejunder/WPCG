import { useEffect } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import type { FilterCategory } from '../hooks/useProjectFilter'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import styles from './ProjectFilterBar.module.css'

// Maps each category to the global CSS token so the line colour matches the pill
const CATEGORY_LINE_COLOR: Record<FilterCategory, string> = {
  all: 'var(--color-category-all)',
  residential: 'var(--color-category-residential)',
  retail: 'var(--color-category-retail)',
  office: 'var(--color-category-office)',
}

interface Props {
  activeCategory: FilterCategory
  categories: FilterCategory[]
  labels: Record<FilterCategory, string>
  onSelect: (category: FilterCategory) => void
}

export default function ProjectFilterBar({ activeCategory, categories, labels, onSelect }: Props) {
  const shouldReduce = useReducedMotion()
  const lineControls = useAnimation()

  useEffect(() => {
    if (shouldReduce) {
      void lineControls.set({ scaleX: 1 })
      return
    }
    void lineControls.set({ scaleX: 0 })
    void lineControls.start({
      scaleX: 1,
      transition: { duration: 1.8, ease: ARCH_EASE },
    })
  }, [activeCategory, shouldReduce, lineControls])

  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      className={styles.bar}
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          data-category={category}
          className={`${styles.pill}${activeCategory === category ? ` ${styles.active}` : ''}`}
          aria-pressed={activeCategory === category}
          aria-label={labels[category]}
          onClick={() => onSelect(category)}
        >
          {labels[category]}
        </button>
      ))}
      {/* Drawn line — redraws on every category change */}
      <motion.div
        className={styles.divider}
        style={{ backgroundColor: CATEGORY_LINE_COLOR[activeCategory] }}
        initial={{ scaleX: 0 }}
        animate={lineControls}
        aria-hidden="true"
      />
    </div>
  )
}
