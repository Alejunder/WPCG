import { describe, it, expect } from 'vitest'
import { ContactFormSchema, ContactInfoSchema } from '../schemas/contact.schema'

// ---------------------------------------------------------------------------
// Shared fixture
// ---------------------------------------------------------------------------

const valid = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+34 600 000 000',
  company: 'Acme Corp',
  projectType: 'office' as const,
  message: 'Tell us about your project requirements in detail.',
  privacyAccepted: true,
}

// ---------------------------------------------------------------------------
// ContactFormSchema
// ---------------------------------------------------------------------------

describe('ContactFormSchema', () => {
  it('accepts a fully valid payload', () => {
    expect(ContactFormSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts a valid payload without optional fields (phone, company)', () => {
    const { phone, company, ...minimal } = valid
    expect(ContactFormSchema.safeParse(minimal).success).toBe(true)
  })

  it('accepts all projectType values', () => {
    for (const projectType of ['office', 'residential', 'retail', 'other'] as const) {
      expect(ContactFormSchema.safeParse({ ...valid, projectType }).success).toBe(true)
    }
  })

  it('rejects required fields when missing or too short', () => {
    expect(ContactFormSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false)
    expect(ContactFormSchema.safeParse({ ...valid, name: undefined }).success).toBe(false)
    expect(ContactFormSchema.safeParse({ ...valid, email: undefined }).success).toBe(false)
    expect(ContactFormSchema.safeParse({ ...valid, projectType: undefined }).success).toBe(false)
    expect(ContactFormSchema.safeParse({ ...valid, message: undefined }).success).toBe(false)
  })

  it('rejects an invalid email format', () => {
    expect(ContactFormSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
    expect(ContactFormSchema.safeParse({ ...valid, email: 'missing@' }).success).toBe(false)
  })

  it('rejects message shorter than 10 characters', () => {
    expect(ContactFormSchema.safeParse({ ...valid, message: 'Too short' }).success).toBe(false)
  })

  it('rejects an unknown projectType value', () => {
    expect(ContactFormSchema.safeParse({ ...valid, projectType: 'warehouse' }).success).toBe(false)
  })

  it('rejects privacyAccepted: false', () => {
    const result = ContactFormSchema.safeParse({ ...valid, privacyAccepted: false })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.privacyAccepted).toBeDefined()
    }
  })

  it('rejects when privacyAccepted is missing', () => {
    const { privacyAccepted, ...without } = valid
    expect(ContactFormSchema.safeParse(without).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// ContactInfoSchema
// ---------------------------------------------------------------------------

describe('ContactInfoSchema', () => {
  it('accepts a fully populated info object', () => {
    const result = ContactInfoSchema.safeParse({
      address: 'Calle Gran Vía 1, Madrid',
      email: 'info@wpcg.es',
      phone: '+34 91 000 00 00',
      workingHours: 'Mon–Fri 09:00–18:00',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/company/wpcg' },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('accepts an empty object and defaults socialLinks to []', () => {
    const result = ContactInfoSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.socialLinks).toEqual([])
  })

  it('accepts null values for optional fields', () => {
    expect(
      ContactInfoSchema.safeParse({ address: null, email: null, phone: null, workingHours: null }).success,
    ).toBe(true)
  })

  it('rejects a socialLink with an invalid URL', () => {
    expect(
      ContactInfoSchema.safeParse({ socialLinks: [{ platform: 'linkedin', url: 'not-a-url' }] }).success,
    ).toBe(false)
  })

  it('rejects a socialLink with an unknown platform', () => {
    expect(
      ContactInfoSchema.safeParse({ socialLinks: [{ platform: 'twitter', url: 'https://twitter.com/wpcg' }] }).success,
    ).toBe(false)
  })

  it('rejects an invalid email value', () => {
    expect(ContactInfoSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })
})
