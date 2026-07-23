import type { ReactNode, HTMLAttributes } from 'react'
import styles from './SectionWrapper.module.css'

type Spacing = 'default' | 'sm' | 'none'
type Tag = 'section' | 'div' | 'article' | 'aside'

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** Semantic element to render. Defaults to 'section'. */
  as?: Tag
  /**
   * Vertical spacing variant:
   * - 'default' → var(--section-spacing) [10rem]
   * - 'sm'      → var(--section-spacing-sm) [5rem]
   * - 'none'    → no padding-block (caller's className handles it)
   */
  spacing?: Spacing
}

const spacingClass: Record<Spacing, string> = {
  default: styles.default,
  sm: styles.sm,
  none: styles.none,
}

/**
 * Semantic section wrapper with consistent vertical spacing.
 * Visual decoration (background, borders) belongs in the caller's className.
 */
export default function SectionWrapper({
  children,
  className,
  as: Tag = 'section',
  spacing = 'default',
  ...props
}: SectionWrapperProps) {
  const cn = [spacingClass[spacing], className].filter(Boolean).join(' ')
  return (
    <Tag className={cn} {...props}>
      {children}
    </Tag>
  )
}
