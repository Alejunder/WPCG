import 'server-only'
import { ContactError } from '../types'

// ---------------------------------------------------------------------------
// Cloudflare Turnstile server-side verification.
//
// Single responsibility: exchange a client token for a pass/fail verdict.
// - The SECRET key is read here (server-only) and never leaves the server.
// - A failed challenge is a normal negative result → `{ success: false }`.
// - An infrastructure failure (missing secret, network error, non-200) throws
//   `ContactError('TURNSTILE_FAILED')` so the caller can distinguish "you look
//   like a bot" from "our verification is temporarily down".
// ---------------------------------------------------------------------------

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<{ success: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    throw new ContactError('TURNSTILE_FAILED', 'Missing TURNSTILE_SECRET_KEY')
  }

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp)

  let response: Response
  try {
    response = await fetch(VERIFY_URL, { method: 'POST', body })
  } catch {
    throw new ContactError('TURNSTILE_FAILED', 'Turnstile verification request failed')
  }

  if (!response.ok) {
    throw new ContactError('TURNSTILE_FAILED', `Turnstile responded ${response.status}`)
  }

  const data = (await response.json()) as TurnstileVerifyResponse
  return { success: data.success === true }
}
