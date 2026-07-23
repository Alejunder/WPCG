'use server'

import { headers } from 'next/headers'
import { locales, type Locale } from '@/config/i18n'
import { ContactFormSchema } from '../schemas/contact.schema'
import { isRateLimited } from '../services/rateLimit'
import { verifyTurnstileToken } from '../services/turnstile'
import { sendConfirmationEmail, sendNotificationEmail } from '../services/resend'
import { ContactError } from '../types'
import type { ContactFieldErrors, ContactResult } from '../types'

// ---------------------------------------------------------------------------
// Contact server action — the single server-side entrypoint for the form.
//
// Flow: Zod validation → rate limit → Turnstile → company email → customer
// email → typed result. It contains no JSX and no HTML. Internal failures are
// logged on the server and mapped to safe, localizable message keys.
// ---------------------------------------------------------------------------

const DEFAULT_LOCALE: Locale = 'en'

function resolveLocale(value: FormDataEntryValue | null): Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
    ? (value as Locale)
    : DEFAULT_LOCALE
}

function optionalField(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

async function getClientIp(): Promise<string> {
  const headerList = await headers()
  // Prefer the platform-set `x-real-ip` (not client-spoofable on Vercel) over
  // the left-most `x-forwarded-for`, which a client can forge.
  return (
    headerList.get('x-real-ip') ??
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

export async function sendContact(
  _prevState: ContactResult,
  formData: FormData,
): Promise<ContactResult> {
  const locale = resolveLocale(formData.get('locale'))

  // 1. Validate (Zod) — before any I/O.
  const parsed = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: optionalField(formData.get('phone')),
    company: optionalField(formData.get('company')),
    subject: formData.get('subject'),
    message: formData.get('message'),
    privacyAccepted: formData.get('privacyAccepted') === 'on',
    turnstileToken: (formData.get('turnstileToken') as string | null) ?? '',
  })

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'errValidation',
      fieldErrors: parsed.error.flatten().fieldErrors as ContactFieldErrors,
    }
  }

  const data = parsed.data

  try {
    const ip = await getClientIp()

    // 2. Rate limit (early abuse guard).
    if (await isRateLimited(ip)) {
      return { status: 'error', message: 'errRateLimit' }
    }

    // 3. Verify Turnstile — stop immediately on a failed challenge.
    const { success } = await verifyTurnstileToken(data.turnstileToken, ip)
    if (!success) {
      return { status: 'error', message: 'errTurnstile' }
    }

    // 4. Send company email, then 5. customer confirmation.
    const submittedAt = new Date()
    await sendNotificationEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      subject: data.subject,
      message: data.message,
      submittedAt,
    })
    await sendConfirmationEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      locale,
    })

    // 6. Typed success.
    return { status: 'success' }
  } catch (error) {
    // Never expose internals to the client — log server-side only.
    console.error('[contact.sendContact] failed', error)
    if (error instanceof ContactError && error.code === 'RATE_LIMITED') {
      return { status: 'error', message: 'errRateLimit' }
    }
    return { status: 'error', message: 'errGeneric' }
  }
}
