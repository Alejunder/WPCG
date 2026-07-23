import { type CSSProperties } from 'react'
import Link from 'next/link'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Shared generic breadcrumb.
 * Named common component per AGENTS.md § 16.
 *
 * @example
 * <Breadcrumb items={[
 *   { label: 'Home', href: '/en' },
 *   { label: 'Projects', href: '/en/projects' },
 *   { label: 'Project Name' },
 * ]} />
 */
export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`${styles.nav}${className ? ` ${className}` : ''}`}
      style={{ viewTransitionName: 'page-breadcrumb' } as CSSProperties}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          return (
            <li key={item.label} className={styles.item}>
              {!isFirst && (
                <span className={styles.sep} aria-hidden="true">›</span>
              )}
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined} className={styles.current}>
                  {item.label}
                </span>
              ) : (
              <Link href={item.href} className={styles.link}>
                  {item.label}
              </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
