import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Mock sendContactEmail before the route module is loaded.
// vi.mock is hoisted by Vitest, so this executes before any imports below.
// ---------------------------------------------------------------------------

vi.mock('@/lib/email/sendContactEmail', () => ({
  sendContactEmail: vi.fn(),
}))

import { sendContactEmail } from '@/lib/email/sendContactEmail'
import { POST } from '@/app/api/contact/route'

// ---------------------------------------------------------------------------
// Typed mock handle
// ---------------------------------------------------------------------------

const sendEmailMock = vi.mocked(sendContactEmail)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const validPayload = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  projectType: 'office',
  message: 'Tell us about your project requirements in detail.',
  privacyAccepted: true,
}

let ipCounter = 0

/** Each call returns a unique IP so rate-limit state never leaks between tests. */
function makeRequest(body: unknown, ip?: string): NextRequest {
  const resolvedIp = ip ?? `10.0.${Math.floor(ipCounter / 255)}.${(ipCounter++ % 255) + 1}`
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': resolvedIp,
    },
    body: JSON.stringify(body),
  })
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ---- Success ----

  it('returns 200 { success: true } on a valid submission', async () => {
    sendEmailMock.mockResolvedValueOnce(undefined)

    const response = await POST(makeRequest(validPayload))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true })
    expect(sendEmailMock).toHaveBeenCalledOnce()
  })

  // ---- Validation errors ----

  it('returns 422 with field errors on invalid input', async () => {
    const response = await POST(makeRequest({ name: 'A', email: 'bad', projectType: 'office' }))
    const body = await response.json()

    expect(response.status).toBe(422)
    expect(body.success).toBe(false)
    expect(body.error).toBe('Validation failed.')
    expect(body.errors).toBeDefined()
    expect(sendEmailMock).not.toHaveBeenCalled()
  })

  it('returns 422 when privacyAccepted is false', async () => {
    const response = await POST(makeRequest({ ...validPayload, privacyAccepted: false }))
    const body = await response.json()

    expect(response.status).toBe(422)
    expect(body.error).toBe('Validation failed.')
    expect(body.errors?.privacyAccepted).toBeDefined()
  })

  it('returns 400 when the body is not valid JSON', async () => {
    const ip = `10.1.0.${(ipCounter++ % 255) + 1}`
    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
      body: 'not json {{{',
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  // ---- Rate limiting ----

  it('returns 429 after 5 requests from the same IP', async () => {
    sendEmailMock.mockResolvedValue(undefined)

    const ip = '192.168.55.55' // dedicated IP — not shared with other tests

    for (let i = 0; i < 5; i++) {
      const r = await POST(makeRequest(validPayload, ip))
      expect(r.status).toBe(200)
    }

    const blocked = await POST(makeRequest(validPayload, ip))
    expect(blocked.status).toBe(429)
    expect((await blocked.json()).success).toBe(false)
  })

  // ---- Email failure ----

  it('returns 500 when sendContactEmail throws', async () => {
    sendEmailMock.mockRejectedValueOnce(new Error('Resend API unavailable'))

    const response = await POST(makeRequest(validPayload))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.success).toBe(false)
    expect(body.error).toBeDefined()
  })
})
