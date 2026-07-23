'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { sendContact } from '../actions/sendContact'
import type { ContactFieldErrors, ContactResult } from '../types'
import styles from './ContactForm.module.css'

const INITIAL_STATE: ContactResult = { status: 'idle' }
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

// ---------------------------------------------------------------------------
// Field wrapper
// ---------------------------------------------------------------------------

interface FieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ id, label, error, required, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Contact form — renders UI and delegates all logic to the `sendContact`
// server action via `useActionState`.
// ---------------------------------------------------------------------------

export default function ContactForm() {
  const t = useTranslations('ContactForm')
  const locale = useLocale()

  const [state, formAction, isPending] = useActionState(sendContact, INITIAL_STATE)

  const [errors, setErrors] = useState<ContactFieldErrors>({})
  const [token, setToken] = useState('')
  const turnstileRef = useRef<TurnstileInstance>(null)

  // Sync field errors from the server result; reset the widget when the token
  // was consumed or rejected so a fresh challenge is available for a retry.
  useEffect(() => {
    if (state.status === 'error') {
      setErrors(state.fieldErrors ?? {})
      if (state.message === 'errTurnstile' || state.message === 'errGeneric') {
        turnstileRef.current?.reset()
        setToken('')
      }
    } else {
      setErrors({})
    }
  }, [state])

  function clearFieldError(name: string) {
    setErrors((prev) => (prev[name as keyof ContactFieldErrors] ? { ...prev, [name]: undefined } : prev))
  }

  function fieldError(name: keyof ContactFieldErrors): string | undefined {
    const key = errors[name]?.[0]
    return key ? t(key) : undefined
  }

  // -------------------------------------------------------------------------
  // Success state — replaces the form (natural reset)
  // -------------------------------------------------------------------------

  if (state.status === 'success') {
    return (
      <motion.div
        className={styles.success}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="status"
        aria-live="polite"
      >
        <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7 12.5l3.5 3.5 6-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className={styles.successHeadline}>{t('successHeadline')}</h2>
        <p className={styles.successSub}>{t('successSub')}</p>
      </motion.div>
    )
  }

  const showBanner = state.status === 'error'

  return (
    <form action={formAction} className={styles.form} noValidate aria-label={t('formAriaLabel')}>
      {/* Hidden context inputs */}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="turnstileToken" value={token} />

      {/* General error banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className={styles.errorBanner}
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {t(state.message)}
          </motion.div>
        )}
      </AnimatePresence>

      <Field id="name" label={t('labelName')} error={fieldError('name')} required>
        <input
          id="name"
          name="name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          onChange={() => clearFieldError('name')}
          placeholder={t('placeholderName')}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={errors.name ? true : undefined}
          aria-required="true"
          autoComplete="name"
          disabled={isPending}
          maxLength={120}
        />
      </Field>

      <Field id="email" label={t('labelEmail')} error={fieldError('email')} required>
        <input
          id="email"
          name="email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          onChange={() => clearFieldError('email')}
          placeholder={t('placeholderEmail')}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={errors.email ? true : undefined}
          aria-required="true"
          autoComplete="email"
          disabled={isPending}
          maxLength={200}
        />
      </Field>

      <div className={styles.row}>
        <div className={styles.rowItem}>
          <Field id="phone" label={t('labelPhone')} error={fieldError('phone')}>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              onChange={() => clearFieldError('phone')}
              placeholder={t('placeholderPhone')}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              aria-invalid={errors.phone ? true : undefined}
              autoComplete="tel"
              disabled={isPending}
              maxLength={40}
            />
          </Field>
        </div>

        <div className={styles.rowItem}>
          <Field id="company" label={t('labelCompany')} error={fieldError('company')}>
            <input
              id="company"
              name="company"
              type="text"
              className={`${styles.input} ${errors.company ? styles.inputError : ''}`}
              onChange={() => clearFieldError('company')}
              placeholder={t('placeholderCompany')}
              aria-describedby={errors.company ? 'company-error' : undefined}
              aria-invalid={errors.company ? true : undefined}
              autoComplete="organization"
              disabled={isPending}
              maxLength={120}
            />
          </Field>
        </div>
      </div>

      <Field id="subject" label={t('labelSubject')} error={fieldError('subject')} required>
        <input
          id="subject"
          name="subject"
          type="text"
          className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
          onChange={() => clearFieldError('subject')}
          placeholder={t('placeholderSubject')}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          aria-invalid={errors.subject ? true : undefined}
          aria-required="true"
          disabled={isPending}
          maxLength={160}
        />
      </Field>

      <Field id="message" label={t('labelMessage')} error={fieldError('message')} required>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          onChange={() => clearFieldError('message')}
          placeholder={t('placeholderMessage')}
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={errors.message ? true : undefined}
          aria-required="true"
          disabled={isPending}
          maxLength={5000}
        />
      </Field>

      <div>
        <div className={styles.checkboxField}>
          <input
            id="privacyAccepted"
            name="privacyAccepted"
            type="checkbox"
            className={styles.checkbox}
            onChange={() => clearFieldError('privacyAccepted')}
            aria-describedby={errors.privacyAccepted ? 'privacyAccepted-error' : undefined}
            aria-invalid={errors.privacyAccepted ? true : undefined}
            disabled={isPending}
          />
          <label htmlFor="privacyAccepted" className={styles.checkboxLabel}>
            {t('privacyPrefix')}{' '}
            <Link href={`/${locale}/privacy-policy`} className={styles.privacyLink}>
              {t('privacyLink')}
            </Link>
          </label>
        </div>
        {fieldError('privacyAccepted') && (
          <p id="privacyAccepted-error" className={styles.fieldError} role="alert">
            {fieldError('privacyAccepted')}
          </p>
        )}
      </div>

      {/* Cloudflare Turnstile — anti-spam challenge */}
      <div className={styles.turnstile}>
        <Turnstile
          ref={turnstileRef}
          siteKey={SITE_KEY}
          options={{ theme: 'auto', language: locale }}
          onSuccess={setToken}
          onExpire={() => setToken('')}
          onError={() => setToken('')}
        />
        {fieldError('turnstileToken') && (
          <p className={styles.fieldError} role="alert">
            {fieldError('turnstileToken')}
          </p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={isPending || !token}
        aria-busy={isPending}
      >
        {isPending ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            {t('submitting')}
          </>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  )
}
