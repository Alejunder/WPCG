import 'server-only'
import { createElement } from 'react'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import type { Locale } from '@/config/i18n'
import { ContactError } from '../types'
import ContactNotificationEmail from '../emails/ContactNotificationEmail'
import ConfirmationEmail from '../emails/ConfirmationEmail'

// ---------------------------------------------------------------------------
// Resend delivery service.
//
// Single responsibility: send transactional email. It owns the Resend client
// and renders React Email templates to HTML + plain text. It contains NO inline
// HTML — all markup lives in `../emails/*`.
//
// Env (server-only):
//   RESEND_API_KEY       — Resend API key
//   CONTACT_EMAIL        — company inbox (recipient of enquiries / reply-to of confirmations)
//   CONTACT_EMAIL_FROM   — verified Resend sender, e.g. "WPCG <hello@wpcg.es>"
// ---------------------------------------------------------------------------

let client: Resend | null = null

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new ContactError('EMAIL_FAILED', 'Missing RESEND_API_KEY')
  client ??= new Resend(apiKey)
  return client
}

function requireEnv(name: 'CONTACT_EMAIL' | 'CONTACT_EMAIL_FROM'): string {
  const value = process.env[name]
  if (!value) throw new ContactError('EMAIL_FAILED', `Missing ${name}`)
  return value
}

export interface NotificationInput {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  submittedAt: Date
}

/** Internal enquiry email delivered to the company inbox. */
export async function sendNotificationEmail(input: NotificationInput): Promise<void> {
  const resend = getClient()
  const to = requireEnv('CONTACT_EMAIL')
  const from = requireEnv('CONTACT_EMAIL_FROM')

  const element = createElement(ContactNotificationEmail, input)
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ])

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `New enquiry — ${input.subject}`,
    html,
    text,
  })

  if (error) throw new ContactError('EMAIL_FAILED', error.message)
}

export interface ConfirmationInput {
  name: string
  email: string
  subject: string
  locale: Locale
}

/** Automatic confirmation email delivered to the customer. */
export async function sendConfirmationEmail(input: ConfirmationInput): Promise<void> {
  const resend = getClient()
  const from = requireEnv('CONTACT_EMAIL_FROM')
  const replyTo = requireEnv('CONTACT_EMAIL')

  const element = createElement(ConfirmationEmail, {
    name: input.name,
    subject: input.subject,
    locale: input.locale,
  })
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ])

  const subject =
    input.locale === 'es'
      ? 'Hemos recibido tu mensaje — WPCG'
      : 'We’ve received your message — WPCG'

  const { error } = await resend.emails.send({
    from,
    to: input.email,
    replyTo,
    subject,
    html,
    text,
  })

  if (error) throw new ContactError('EMAIL_FAILED', error.message)
}
