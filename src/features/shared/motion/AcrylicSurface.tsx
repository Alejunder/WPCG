import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import styles from './AcrylicSurface.module.css'

interface AcrylicSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  style?: CSSProperties
  className?: string
}

/**
 * Frosted-glass surface using `backdrop-filter`.
 *
 * Applies a semi-transparent dark fill with blur + saturation so
 * content behind the surface is visible but softened. CSS-only — no
 * Framer Motion dependency. Degrades gracefully where backdrop-filter
 * is unsupported (solid surface fallback via the rgba fill).
 *
 * Uses `--color-surface-rgb` from globals.css. The consumer wraps any
 * element that should appear frosted (Navbar scrolled state, modals, etc.).
 *
 * @example
 * <AcrylicSurface className={styles.navScrolled}>
 *   {children}
 * </AcrylicSurface>
 */
export default function AcrylicSurface({ children, className, style, ...rest }: AcrylicSurfaceProps) {
  return (
    <div
      className={[styles.acrylic, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}
