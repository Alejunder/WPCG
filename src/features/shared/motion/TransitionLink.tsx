'use client'

import { type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { useSceneTransition } from './SceneTransitionContext'

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

/**
 * Drop-in anchor element that triggers the scene transition system
 * instead of routing immediately.
 *
 * - Intercepts internal paths (starting with `/`)
 * - Passes through modifier clicks (Cmd/Ctrl/Shift/Alt — for "open in new tab")
 * - Passes through external links unmodified
 * - Is a no-op if a transition is already in flight
 * - Is a no-op if already on the target route (avoids self-transitions)
 *
 * Use this anywhere you currently use `<Link>` or `<a>` for internal navigation
 * and want the full wipe/exit choreography.
 *
 * @example
 * <TransitionLink href={`/${locale}/projects/${slug}`} className={styles.cta}>
 *   View project
 * </TransitionLink>
 */
export default function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: TransitionLinkProps) {
  const { startTransition, isTransitioning } = useSceneTransition()
  const pathname = usePathname()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Modifier keys mean "open in new tab / window" — don't intercept
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    // External links — let the browser handle them normally
    if (!href.startsWith('/')) return
    // Don't start a second transition over a running one
    if (isTransitioning) return
    // Already on this route — no point animating to the same page
    const targetPath = href.split('?')[0].split('#')[0]
    if (pathname === targetPath) return

    e.preventDefault()
    onClick?.(e)
    startTransition(href)
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
