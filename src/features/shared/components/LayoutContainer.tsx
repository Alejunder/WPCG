import type { ReactNode, HTMLAttributes } from 'react'
import styles from './LayoutContainer.module.css'

interface LayoutContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * Centers content with a consistent max-width and horizontal padding.
 * Consumes: --max-width, --padding-x.
 * Pass className for additional layout (flex, gap, etc.) from the caller's CSS module.
 */
export default function LayoutContainer({ children, className, ...props }: LayoutContainerProps) {
  const cn = [styles.container, className].filter(Boolean).join(' ')
  return (
    <div className={cn} {...props}>
      {children}
    </div>
  )
}
