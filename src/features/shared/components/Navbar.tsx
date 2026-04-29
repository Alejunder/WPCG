'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import TransitionLink from '@/features/shared/motion/TransitionLink'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/config/i18n'
import logo from '@/assets/wpcg-removebg-preview.png'
import FullscreenMenu from './FullscreenMenu'
import styles from './Navbar.module.css'

interface NavbarProps {
  locale: Locale
}

interface NavItem {
  key: string
  href: string
  label: Record<Locale, string>
}

function buildLinks(locale: Locale): NavItem[] {
  return [
    { key: 'home',     href: `/${locale}`,          label: { en: 'Home',     es: 'Inicio' } },
    { key: 'projects', href: `/${locale}/projects`,  label: { en: 'Projects', es: 'Proyectos' } },
    { key: 'about',    href: `/${locale}/about`,     label: { en: 'About',    es: 'Nosotros' } },
    { key: 'services', href: `/${locale}/services`,  label: { en: 'Services', es: 'Servicios' } },
    { key: 'team',     href: `/${locale}/team`,      label: { en: 'Team',     es: 'Equipo' } },
    { key: 'contact',  href: `/${locale}/contact`,   label: { en: 'Contact',  es: 'Contacto' } },
  ]
}

export default function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname()
  const links    = buildLinks(locale)
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Scroll show/hide background
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body scroll lock while menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function isActive(href: string): boolean {
    if (href === `/${locale}`) return pathname === href
    return pathname.startsWith(href)
  }

  const altLocaleHref =
    locale === 'en'
      ? pathname.replace(/^\/en/, '/es')
      : pathname.replace(/^\/es/, '/en')

  return (
    <>
      <header
        className={`${styles.navbar} ${scrolled && !isOpen ? styles.navbarScrolled : ''}`}
      >
        <div className={styles.inner}>
          {/* Logo */}
          <TransitionLink href={`/${locale}`} className={styles.logo} aria-label="WPCG — Home">
            <Image
              src={logo}
              alt=""
              height={38}
              className={styles.logoImage}
              priority
            />
          </TransitionLink>

          {/* Desktop navigation — center */}
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            <ul className={styles.navList} role="list">
              {links.map((link) => (
                <li key={link.key}>
                  <TransitionLink
                    href={link.href}
                    className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label[locale]}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop right cluster: CTA + locale switcher */}
          <div className={styles.rightCluster}>
            <TransitionLink
              href={`/${locale}/contact`}
              className={styles.ctaDesktop}
            >
              {locale === 'en' ? "Let's Talk" : 'Hablemos'}
            </TransitionLink>
            <TransitionLink
              href={altLocaleHref}
              className={styles.localeSwitcherDesktop}
              aria-label={locale === 'en' ? 'Cambiar a español' : 'Switch to English'}
            >
              {locale === 'en' ? 'ES' : 'EN'}
            </TransitionLink>
          </div>

          {/* Mobile: locale switch + hamburger */}
          <div className={styles.right}>
            <TransitionLink
              href={altLocaleHref}
              className={styles.localeSwitcher}
              aria-label={locale === 'en' ? 'Cambiar a español' : 'Switch to English'}
            >
              {locale === 'en' ? 'ES' : 'EN'}
            </TransitionLink>

            <button
              type="button"
              className={styles.menuBtn}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="fullscreen-menu"
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className={`${styles.menuBar} ${isOpen ? styles.menuBarTopOpen : ''}`} />
              <span className={`${styles.menuBar} ${isOpen ? styles.menuBarMidOpen : ''}`} />
              <span className={`${styles.menuBar} ${isOpen ? styles.menuBarBotOpen : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <FullscreenMenu
        id="fullscreen-menu"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        locale={locale}
      />
    </>
  )
}
