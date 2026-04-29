import { z } from 'zod'

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const ProjectTypeEnum = z.enum(['office', 'residential', 'retail', 'other'])

// ---------------------------------------------------------------------------
// Contact Form Schema (shared client + server)
// ---------------------------------------------------------------------------

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: ProjectTypeEnum,
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the Privacy Policy to continue.',
  }),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

// ---------------------------------------------------------------------------
// Contact Info Schema (CMS data)
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
