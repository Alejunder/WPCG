import type { FilterCategory } from '../hooks/useProjectFilter'
import styles from './ProjectFilterBar.module.css'

interface Props {
  activeCategory: FilterCategory
  categories: FilterCategory[]
  labels: Record<FilterCategory, string>
  onSelect: (category: FilterCategory) => void
}

export default function ProjectFilterBar({ activeCategory, categories, labels, onSelect }: Props) {
  return (
    <div role="group" aria-label="Filter projects by category" className={styles.bar}>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`${styles.pill}${activeCategory === category ? ` ${styles.active}` : ''}`}
          aria-pressed={activeCategory === category}
          aria-label={labels[category]}
          onClick={() => onSelect(category)}
        >
          {labels[category]}
        </button>
      ))}
    </div>
  )
}
