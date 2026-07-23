import type { ContactFormData, ContactInfoData } from '../schemas/contact.schema'

export type { ContactFormData, ContactInfoData }

// ---------------------------------------------------------------------------
// Field-level validation errors, keyed by form field.
// Values are i18n keys (see ContactFormSchema) resolved on the client.
// ---------------------------------------------------------------------------

export type ContactFieldErrors = Partial<Record<keyof ContactFormData, string[]>>

// ---------------------------------------------------------------------------
// Top-level error message keys (resolved under the `ContactForm` namespace).
// The server action never returns raw error text — only these stable keys.
// ---------------------------------------------------------------------------

export type ContactErrorMessageKey =
  | 'errValidation'
  | 'errRateLimit'
  | 'errTurnstile'
  | 'errGeneric'

// ---------------------------------------------------------------------------
// Result contract returned by the `sendContact` server action and consumed by
// `useActionState` on the client. Fully type-safe, no `any`.
// ---------------------------------------------------------------------------

export type ContactResult =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: ContactErrorMessageKey; fieldErrors?: ContactFieldErrors }

// ---------------------------------------------------------------------------
// Typed domain error thrown by services (turnstile / resend / rate limit).
// Keeps internal failure detail on the server; the action maps it to a
// user-safe `ContactErrorMessageKey`.
// ---------------------------------------------------------------------------

export type ContactErrorCode =
  | 'VALIDATION'
  | 'TURNSTILE_FAILED'
  | 'RATE_LIMITED'
  | 'EMAIL_FAILED'
  | 'UNKNOWN'

export class ContactError extends Error {
  readonly code: ContactErrorCode

  constructor(code: ContactErrorCode, message?: string) {
    super(message ?? code)
    this.name = 'ContactError'
    this.code = code
  }
}
