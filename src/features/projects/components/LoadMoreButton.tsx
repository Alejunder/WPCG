'use client'

import { motion } from 'framer-motion'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import styles from './LoadMoreButton.module.css'

interface Props {
  onClick: () => void
  loading?: boolean
  label?: string
  loadingLabel?: string
}

export default function LoadMoreButton({
  onClick,
  loading = false,
  label = 'Load more',
  loadingLabel = 'Loading…',
}: Props) {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: ARCH_EASE }}
    >
      <button
        type="button"
        className={styles.button}
        onClick={onClick}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? loadingLabel : label}
      </button>
    </motion.div>
  )
}
