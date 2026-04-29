'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { ComponentProps } from 'react'
import { ARCH_EASE } from './motion.config'

type NextImageProps = ComponentProps<typeof Image>

interface MotionImageProps extends NextImageProps {
  /**
   * Adds a subtle scale-up on hover (1 → 1.03).
   * Keep `overflow: hidden` on the wrapper to contain the zoom.
   * @default false
   */
  hoverZoom?: boolean
  /** Class applied to the outer motion wrapper div. */
  wrapperClassName?: string
}

/**
 * A `next/image` wrapper with a built-in reveal animation.
 *
 * On mount the image fades in from opacity 0 and scales from 0.96 → 1,
 * creating a premium "materialise" effect. Optionally adds a subtle hover zoom.
 *
 * The animation is applied to a wrapper `div` (not the `Image` element itself)
 * to avoid ref-forwarding conflicts with `next/image` in React 19.
 *
 * @example
 * <MotionImage
 *   src={project.heroImage.url}
 *   alt={project.heroImage.alt}
 *   fill
 *   sizes="(max-width: 640px) 100vw, 50vw"
 *   hoverZoom
 *   wrapperClassName={styles.imageWrapper}
 * />
 */
export default function MotionImage({
  hoverZoom = false,
  wrapperClassName,
  style,
  ...imageProps
}: MotionImageProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={wrapperClassName}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      initial={shouldReduce ? false : { opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: shouldReduce ? 0 : 0.9,
        ease: ARCH_EASE,
      }}
      whileHover={
        hoverZoom && !shouldReduce ? { scale: 1.02 } : undefined
      }
    >
      <Image {...imageProps} />
    </motion.div>
  )
}
