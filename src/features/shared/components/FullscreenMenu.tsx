'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import logo from '@/assets/wpcg-removebg-preview.png'
import { AnimatePresence, motion } from 'framer-motion'
import type { Locale } from '@/config/i18n'
import { ARCH_EASE } from '@/features/shared/motion/motion.config'
import TransitionLink from '@/features/shared/motion/TransitionLink'
import styles from './FullscreenMenu.module.css'

interface FullscreenMenuProps {
  id: string
  isOpen: boolean
  onClose: () => void
  locale: Locale
}

interface NavLink {
  key: string
  href: string
  label: Record<Locale, string>
}

function buildLinks(locale: Locale): NavLink[] {
  return [
    { key: 'home',     href: `/${locale}`,          label: { en: 'Home',     es: 'Inicio' } },
    { key: 'projects', href: `/${locale}/projects`,  label: { en: 'Projects', es: 'Proyectos' } },
    { key: 'about',    href: `/${locale}/about`,     label: { en: 'About',    es: 'Nosotros' } },
    { key: 'services', href: `/${locale}/services`,  label: { en: 'Services', es: 'Servicios' } },
    { key: 'team',     href: `/${locale}/team`,      label: { en: 'Team',     es: 'Equipo' } },
    { key: 'contact',  href: `/${locale}/contact`,   label: { en: 'Contact',  es: 'Contacto' } },
  ]
}

const CURTAIN_EASE = ARCH_EASE

// Root container — no visual animation; keeps DOM alive until children finish exiting
const rootVariants = {
  hidden:  {},
  visible: {},
  exit:    { transition: { when: 'afterChildren' } },
} as const

// Left curtain — slides in from off-screen left
const panelLeftVariants = {
  hidden:  { x: '-101%' },
  visible: { x: '0%',    transition: { duration: 0.7,  ease: CURTAIN_EASE } },
  exit:    { x: '-101%', transition: { duration: 0.55, ease: CURTAIN_EASE, delay: 0.15 } },
}

// Right curtain — slides in from off-screen right
const panelRightVariants = {
  hidden:  { x: '101%' },
  visible: { x: '0%',   transition: { duration: 0.7,  ease: CURTAIN_EASE } },
  exit:    { x: '101%', transition: { duration: 0.55, ease: CURTAIN_EASE, delay: 0.15 } },
}

// List stagger — small delayChildren since list only animates after panels close
const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.1 } },
  exit:    { transition: { staggerChildren: 0.04,  staggerDirection: -1 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.5,  ease: ARCH_EASE } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.22, ease: ARCH_EASE } },
}

export default function FullscreenMenu({ id, isOpen, onClose, locale }: FullscreenMenuProps) {
  const pathname = usePathname()
  const links    = buildLinks(locale)

  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const dialogRef   = useRef<HTMLDivElement>(null)

  // Phase 2 gate — true only after curtain panels have finished closing
  const [panelsClosed, setPanelsClosed] = useState(false)

  // Reset phase whenever the menu is closed
  useEffect(() => {
    if (!isOpen) setPanelsClosed(false)
  }, [isOpen])

  // Focus the close button when menu opens
  useEffect(() => {
    if (!isOpen) return
    const t = setTimeout(() => closeBtnRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [isOpen])

  // ESC closes the menu
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Focus trap — keep Tab cycling inside the dialog
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const el = dialogRef.current
    if (!el) return
    const focusable = Array.from(
      el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus()
    }
  }, [])

  function isActive(href: string): boolean {
    if (href === `/${locale}`) return pathname === href
    return pathname.startsWith(href)
  }

  const altLocaleHref =
    locale === 'en'
      ? pathname.replace(/^\/en/, '/es')
      : pathname.replace(/^\/es/, '/en')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={id}
          ref={dialogRef}
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          variants={rootVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onKeyDown={handleKeyDown}
        >
          {/* ── Curtain panels ── */}
          <motion.div className={styles.panelLeft}  variants={panelLeftVariants}  aria-hidden="true" />
          <motion.div
            className={styles.panelRight}
            variants={panelRightVariants}
            aria-hidden="true"
            onAnimationComplete={(def) => {
              if (def === 'visible') setPanelsClosed(true)
            }}
          />

          {/* ── Menu content — rendered only after panels are fully closed ── */}
          <motion.div
            className={styles.menuContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: panelsClosed ? 1 : 0 }}
            transition={{ duration: 0.35, ease: ARCH_EASE }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >

            {/* Top bar */}
            <div className={styles.header}>
              <Image
                src={logo}
                alt="WPCG — Arquitectura y Construcción"
                height={38}
                className={styles.logoImage}
              />

              <button
                ref={closeBtnRef}
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close navigation"
              >
                <span className={styles.closeBar} />
                <span className={styles.closeBar} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className={styles.nav} aria-label="Site navigation">
              <motion.ul
                className={styles.navList}
                role="list"
                variants={listVariants}
                initial="hidden"
                animate={panelsClosed ? 'visible' : 'hidden'}
                exit="exit"
              >
                {links.map((link) => (
                  <motion.li key={link.key} className={styles.navItem} variants={itemVariants}>
                    <TransitionLink
                      href={link.href}
                      className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
                      onClick={onClose}
                      tabIndex={isOpen ? 0 : -1}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      {link.label[locale]}
                    </TransitionLink>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            {/* Footer: locale switch */}
            <div className={styles.footer}>
              <TransitionLink
                href={altLocaleHref}
                className={styles.localeSwitch}
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
                aria-label={locale === 'en' ? 'Cambiar a español' : 'Switch to English'}
              >
                {locale === 'en' ? 'ES — Español' : 'EN — English'}
              </TransitionLink>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
