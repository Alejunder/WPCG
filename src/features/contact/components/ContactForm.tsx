'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ContactFormSchema } from '../schemas/contact.schema'
import type { ContactFormData, FormState } from '../types'
import styles from './ContactForm.module.css'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FieldErrors = Partial<Record<keyof ContactFormData, string[]>>

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: 'office',
  message: '',
  privacyAccepted: false,
}

// ---------------------------------------------------------------------------
// Sub-components
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
        {required && <span className={styles.required} aria-hidden="true"> *</span>}
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
// Main component
// ---------------------------------------------------------------------------

export default function ContactForm() {
  const t = useTranslations('ContactForm')

  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formState, setFormState] = useState<FormState>({ status: 'idle' })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Clear error on field change
    if (fieldErrors[name as keyof ContactFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Client-side validation
    const result = ContactFormSchema.safeParse(formData)
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors as FieldErrors)
      return
    }

    setFormState({ status: 'loading' })
    setFieldErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      const json = (await response.json()) as { success: boolean; error?: string; errors?: FieldErrors }

      if (response.ok && json.success) {
        setFormState({ status: 'success' })
        return
      }

      if (response.status === 422 && json.errors) {
        setFieldErrors(json.errors)
        setFormState({ status: 'idle' })
        return
      }

      if (response.status === 429) {
        setFormState({ status: 'error', message: t('errorRateLimit') })
        return
      }

      setFormState({ status: 'error', message: json.error ?? t('errorGeneric') })
    } catch {
      setFormState({ status: 'error', message: t('errorGeneric') })
    }
  }

  const isLoading = formState.status === 'loading'

  // ---------------------------------------------------------------------------
  // Success state
  // ---------------------------------------------------------------------------

  if (formState.status === 'success') {
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
          <path d="M7 12.5l3.5 3.5 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className={styles.successHeadline}>{t('successHeadline')}</h2>
        <p className={styles.successSub}>{t('successSub')}</p>
      </motion.div>
    )
  }

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
      aria-label={t('formAriaLabel')}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* General error banner */}
      <AnimatePresence>
        {formState.status === 'error' && (
          <motion.div
            className={styles.errorBanner}
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {formState.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <Field id="name" label={t('labelName')} error={fieldErrors.name?.[0]} required>
          <input
            id="name"
            name="name"
            type="text"
            className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder={t('placeholderName')}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            aria-required="true"
            autoComplete="name"
            disabled={isLoading}
          />
        </Field>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Field id="email" label={t('labelEmail')} error={fieldErrors.email?.[0]} required>
          <input
            id="email"
            name="email"
            type="email"
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder={t('placeholderEmail')}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            aria-required="true"
            autoComplete="email"
            disabled={isLoading}
          />
        </Field>
      </motion.div>

      <div className={styles.row}>
        <motion.div variants={itemVariants} className={styles.rowItem}>
          <Field id="phone" label={t('labelPhone')} error={fieldErrors.phone?.[0]}>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ''}`}
              value={formData.phone ?? ''}
              onChange={handleChange}
              placeholder={t('placeholderPhone')}
              aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
              autoComplete="tel"
              disabled={isLoading}
            />
          </Field>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.rowItem}>
          <Field id="company" label={t('labelCompany')} error={fieldErrors.company?.[0]}>
            <input
              id="company"
              name="company"
              type="text"
              className={`${styles.input} ${fieldErrors.company ? styles.inputError : ''}`}
              value={formData.company ?? ''}
              onChange={handleChange}
              placeholder={t('placeholderCompany')}
              aria-describedby={fieldErrors.company ? 'company-error' : undefined}
              autoComplete="organization"
              disabled={isLoading}
            />
          </Field>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Field id="projectType" label={t('labelProjectType')} error={fieldErrors.projectType?.[0]} required>
          <select
            id="projectType"
            name="projectType"
            className={`${styles.select} ${fieldErrors.projectType ? styles.inputError : ''}`}
            value={formData.projectType}
            onChange={handleChange}
            aria-describedby={fieldErrors.projectType ? 'projectType-error' : undefined}
            aria-required="true"
            disabled={isLoading}
          >
            <option value="office">{t('optionOffice')}</option>
            <option value="residential">{t('optionResidential')}</option>
            <option value="retail">{t('optionRetail')}</option>
            <option value="other">{t('optionOther')}</option>
          </select>
        </Field>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Field id="message" label={t('labelMessage')} error={fieldErrors.message?.[0]} required>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={`${styles.textarea} ${fieldErrors.message ? styles.inputError : ''}`}
            value={formData.message}
            onChange={handleChange}
            placeholder={t('placeholderMessage')}
            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
            aria-required="true"
            disabled={isLoading}
          />
        </Field>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className={styles.checkboxField}>
          <input
            id="privacyAccepted"
            name="privacyAccepted"
            type="checkbox"
            className={styles.checkbox}
            checked={formData.privacyAccepted}
            onChange={handleChange}
            aria-describedby={fieldErrors.privacyAccepted ? 'privacyAccepted-error' : undefined}
            disabled={isLoading}
          />
          <label htmlFor="privacyAccepted" className={styles.checkboxLabel}>
            {t('privacyPrefix')}{' '}
            <a href="/privacy-policy" className={styles.privacyLink} target="_blank" rel="noopener noreferrer">
              {t('privacyLink')}
            </a>
          </label>
        </div>
        {fieldErrors.privacyAccepted && (
          <p id="privacyAccepted-error" className={styles.fieldError} role="alert">
            {fieldErrors.privacyAccepted[0]}
          </p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <button
          type="submit"
          className={styles.submit}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </button>
      </motion.div>
    </motion.form>
  )
}
