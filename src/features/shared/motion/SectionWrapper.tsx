'use client'

import type { ElementType, ReactNode, CSSProperties } from 'react'
import FadeIn from './FadeIn'

interface SectionWrapperProps {
  children: ReactNode
  /** Extra class names forwarded to the root element. */
  className?: string
  /**
   * Semantic HTML element to render.
   * @default 'section'
   */
  as?: ElementType
  /**
   * Wrap the children in a `FadeIn` scroll-reveal animation.
   * Set to `false` for sections that animate their own children
   * (e.g., a hero with a custom stagger).
   * @default true
   */
  fadeIn?: boolean
  /** FadeIn delay in seconds. Only used when `fadeIn` is `true`. */
  delay?: number
}

/**
 * Consistent vertical spacing wrapper for page sections.
 *
 * Applies `padding-block: var(--space-xl)` so every section has identical
 * top/bottom rhythm without per-component CSS. Optionally wraps content
 * in a `FadeIn` scroll-reveal.
 *
 * @example
 * // With fade-in (default)
 * <SectionWrapper>
 *   <h2>Featured Projects</h2>
 *   ...
 * </SectionWrapper>
 *
 * @example
 * // Without fade-in (section manages its own animations)
 * <SectionWrapper fadeIn={false} as="div" className={styles.hero}>
 *   <HeroContent />
 * </SectionWrapper>
 */
export default function SectionWrapper({
  children,
  className,
  as: Tag = 'section',
  fadeIn = true,
  delay,
}: SectionWrapperProps) {
  const sectionStyle: CSSProperties = {
    paddingBlock: 'var(--space-xl)',
  }

  const content = fadeIn ? (
    <FadeIn delay={delay}>
      {children}
    </FadeIn>
  ) : (
    children
  )

  return (
    <Tag style={sectionStyle} className={className}>
      {content}
    </Tag>
  )
}
