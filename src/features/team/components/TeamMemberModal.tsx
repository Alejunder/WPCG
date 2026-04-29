'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { TeamMember } from '@/features/team/types'
import type { Locale } from '@/config/i18n'
import styles from './TeamMemberModal.module.css'

interface TeamMemberModalProps {
  member: TeamMember | null
  locale: Locale
  onClose: () => void
}

const CLOSE_LABEL: Record<Locale, string> = {
  en: 'Close',
  es: 'Cerrar',
}

const LINKEDIN_LABEL: Record<Locale, string> = {
  en: 'View LinkedIn profile of',
  es: 'Ver perfil de LinkedIn de',
}

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function TeamMemberModal({ member, locale, onClose }: TeamMemberModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const closeLabel = CLOSE_LABEL[locale]

  // ------------------------------------------------------------------
  // Focus management
  // ------------------------------------------------------------------

  useEffect(() => {
    if (member) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus the close button on open (first focusable element)
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS)
      firstFocusable?.focus()
    } else {
      previousFocusRef.current?.focus()
    }
  }, [member])

  // ------------------------------------------------------------------
  // ESC key + focus trap
  // ------------------------------------------------------------------

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!member) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [member, onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // ------------------------------------------------------------------
  // Prevent body scroll while open
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!member) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [member])

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {member && (
        <motion.div
          className={styles.backdrop}
          aria-hidden="false"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label={member.name}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            // Prevent backdrop click from closing when clicking inside the panel
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label={closeLabel}
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="20"
                height="20"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Avatar */}
            <div className={styles.avatarWrapper}>
              <Image
                src={member.image.url}
                alt={member.image.alt || member.name}
                fill
                sizes="160px"
                className={styles.avatar}
              />
            </div>

            {/* Identity */}
            <strong className={styles.name}>{member.name}</strong>
            <span className={styles.role}>{member.role}</span>

            {/* Full biography — no clamp */}
            <p className={styles.bio}>{member.bio}</p>

            {/* LinkedIn */}
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedin}
                aria-label={`${LINKEDIN_LABEL[locale]} ${member.name}`}
              >
                <svg
                  className={styles.linkedinIcon}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>LinkedIn</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
