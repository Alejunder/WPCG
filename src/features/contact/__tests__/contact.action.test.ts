import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mocks — hoisted before the action module is imported.
// Mocking the services also avoids loading their `server-only` / heavy deps.
// ---------------------------------------------------------------------------

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers({ 'x-real-ip': '203.0.113.5' })),
}))
vi.mock('../services/rateLimit', () => ({ isRateLimited: vi.fn() }))
vi.mock('../services/turnstile', () => ({ verifyTurnstileToken: vi.fn() }))
vi.mock('../services/resend', () => ({
  sendNotificationEmail: vi.fn(),
  sendConfirmationEmail: vi.fn(),
}))

import { sendContact } from '../actions/sendContact'
import { isRateLimited } from '../services/rateLimit'
import { verifyTurnstileToken } from '../services/turnstile'
import { sendNotificationEmail, sendConfirmationEmail } from '../services/resend'
import type { ContactResult } from '../types'

const rateLimited = vi.mocked(isRateLimited)
const verifyToken = vi.mocked(verifyTurnstileToken)
const notify = vi.mocked(sendNotificationEmail)
const confirm = vi.mocked(sendConfirmationEmail)

const IDLE: ContactResult = { status: 'idle' }

function buildFormData(overrides: Record<string, string | undefined> = {}): FormData {
  const base: Record<string, string | undefined> = {
    locale: 'en',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+34 600 000 000',
    company: 'Acme Corp',
    subject: 'Office refurbishment',
    message: 'Tell us about your project requirements in detail please.',
    privacyAccepted: 'on',
    turnstileToken: 'tok_abc',
    ...overrides,
  }
  const fd = new FormData()
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined) fd.set(key, value)
  }
  return fd
}

describe('sendContact server action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    rateLimited.mockResolvedValue(false)
    verifyToken.mockResolvedValue({ success: true })
    notify.mockResolvedValue()
    confirm.mockResolvedValue()
  })

  it('returns success and sends both emails on a valid submission', async () => {
    const result = await sendContact(IDLE, buildFormData())
    expect(result).toEqual({ status: 'success' })
    expect(notify).toHaveBeenCalledOnce()
    expect(confirm).toHaveBeenCalledOnce()
  })

  it('returns a validation error with field errors and performs no I/O', async () => {
    const result = await sendContact(IDLE, buildFormData({ email: 'bad', message: 'short' }))
    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.message).toBe('errValidation')
      expect(result.fieldErrors?.email).toContain('errEmailInvalid')
      expect(result.fieldErrors?.message).toContain('errMessageShort')
    }
    expect(rateLimited).not.toHaveBeenCalled()
    expect(verifyToken).not.toHaveBeenCalled()
    expect(notify).not.toHaveBeenCalled()
  })

  it('returns a rate-limit error before verifying turnstile', async () => {
    rateLimited.mockResolvedValue(true)
    const result = await sendContact(IDLE, buildFormData())
    expect(result).toEqual({ status: 'error', message: 'errRateLimit' })
    expect(verifyToken).not.toHaveBeenCalled()
    expect(notify).not.toHaveBeenCalled()
  })

  it('returns a turnstile error on a failed challenge', async () => {
    verifyToken.mockResolvedValue({ success: false })
    const result = await sendContact(IDLE, buildFormData())
    expect(result).toEqual({ status: 'error', message: 'errTurnstile' })
    expect(notify).not.toHaveBeenCalled()
  })

  it('returns a generic error (no internals) when email sending throws', async () => {
    notify.mockRejectedValue(new Error('resend down'))
    const result = await sendContact(IDLE, buildFormData())
    expect(result).toEqual({ status: 'error', message: 'errGeneric' })
  })

  it('rejects when the privacy policy is not accepted', async () => {
    const fd = buildFormData()
    fd.delete('privacyAccepted')
    const result = await sendContact(IDLE, fd)
    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.message).toBe('errValidation')
      expect(result.fieldErrors?.privacyAccepted).toBeDefined()
    }
  })
})
