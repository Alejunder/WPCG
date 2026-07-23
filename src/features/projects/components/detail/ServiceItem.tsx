'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useServiceHover } from './ServiceHoverContext'
import styles from './ServiceItem.module.css'

// ---------------------------------------------------------------------------
// Variants — parent whileHover propagates to children by variant name
// ---------------------------------------------------------------------------

const textVariants = {
  rest: { opacity: 0.42 },
  hover: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
}

const underlineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

const tooltipVariants = {
  rest: { opacity: 0, y: 4 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut', delay: 0.06 },
  },
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ServiceItemProps {
  name: string
  tooltipLabel: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ServiceItem({ name, tooltipLabel }: ServiceItemProps) {
  const shouldReduce = useReducedMotion()
  const { setHoveredService } = useServiceHover()

  return (
    <motion.li
      className={styles.item}
      initial="rest"
      animate="rest"
      whileHover={shouldReduce ? undefined : 'hover'}
      onMouseEnter={() => setHoveredService(name)}
      onMouseLeave={() => setHoveredService(null)}
    >
      {/* Text — fades to full opacity on hover */}
      <motion.span
        className={styles.text}
        variants={shouldReduce ? undefined : textVariants}
      >
        {name}
      </motion.span>

      {!shouldReduce && (
        <>
          {/* Animated underline — draws from left to right via scaleX */}
          <motion.span
            className={styles.underline}
            variants={underlineVariants}
            aria-hidden="true"
          />

          {/* Floating tooltip — fades in with slight upward drift */}
          <motion.span
            className={styles.tooltip}
            variants={tooltipVariants}
            role="tooltip"
          >
            {tooltipLabel}
          </motion.span>
        </>
      )}
    </motion.li>
  )
}
