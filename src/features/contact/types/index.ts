import type { ContactFormData, ContactInfoData } from '../schemas/contact.schema'

export type { ContactFormData, ContactInfoData }

export type FormState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string }
