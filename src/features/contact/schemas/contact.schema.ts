import { z } from 'zod'

// ---------------------------------------------------------------------------
// Contact Form Schema (shared validation boundary)
//
// Validation messages are i18n *keys* (resolved by the client under the
// `ContactForm` namespace), not literal copy — so field errors render in the
// user's locale. All string fields have upper bounds to prevent oversized
// payloads reaching the email layer.
// ---------------------------------------------------------------------------

export const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'errNameShort' })
    .max(120, { message: 'errNameLong' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'errEmailRequired' })
    .email({ message: 'errEmailInvalid' })
    .max(200, { message: 'errEmailLong' }),
  phone: z.string().trim().max(40, { message: 'errPhoneLong' }).optional(),
  company: z.string().trim().max(120, { message: 'errCompanyLong' }).optional(),
  subject: z
    .string()
    .trim()
    .min(3, { message: 'errSubjectShort' })
    .max(160, { message: 'errSubjectLong' }),
  message: z
    .string()
    .trim()
    .min(20, { message: 'errMessageShort' })
    .max(5000, { message: 'errMessageLong' }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'errPrivacy',
  }),
  turnstileToken: z.string().min(1, { message: 'errTurnstileRequired' }),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

// ---------------------------------------------------------------------------
// Contact Info Schema (CMS data — unchanged)
// ---------------------------------------------------------------------------

const SocialPlatformSchema = z.enum(['linkedin', 'instagram'])

const SocialLinkSchema = z.object({
  platform: SocialPlatformSchema,
  url: z.string().url(),
})

export const ContactInfoSchema = z.object({
  address: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  workingHours: z.string().nullable().optional(),
  socialLinks: z.array(SocialLinkSchema).nullable().default([]),
})

export type ContactInfoData = z.infer<typeof ContactInfoSchema>
