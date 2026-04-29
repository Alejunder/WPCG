import { z } from 'zod'

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/**
 * PortableText blocks are open-ended objects. We validate the minimum required
 * fields and accept any additional properties via catchall.
 */
const PortableTextBlockSchema = z
  .object({ _key: z.string().min(1), _type: z.string().min(1) })
  .catchall(z.unknown())

export const ServiceImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const ServiceSchema = z.object({
  name: z.string().min(1),
  slug: z.object({ current: z.string().min(1) }),
  shortDescription: z.string().min(1),
  longDescription: z.array(PortableTextBlockSchema).nullable().default([]),
  highlights: z.array(z.string()).nullable().default([]),
  icon: z.string().nullable().optional(),
  image: ServiceImageSchema.nullable().optional(),
  order: z.number().nullable().optional(),
  featured: z.boolean().nullable().default(false),
})

export const ServiceCardSchema = z.object({
  name: z.string().min(1),
  slug: z.object({ current: z.string().min(1) }),
  shortDescription: z.string().min(1),
  icon: z.string().nullable().optional(),
  image: ServiceImageSchema.nullable().optional(),
})

// ---------------------------------------------------------------------------
// Process Step
// ---------------------------------------------------------------------------

export const ProcessStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
})

// ---------------------------------------------------------------------------
// Services Page
// ---------------------------------------------------------------------------

export const ServicesPageSchema = z.object({
  heroImage: ServiceImageSchema.nullable().optional(),
  title: z.string().nullable().optional(),
  intro: z.string().nullable().optional(),
  services: z.array(ServiceSchema).nullable().default([]),
  processSteps: z.array(ProcessStepSchema).nullable().default([]),
  cta: z
    .object({
      headline: z.string().nullable().optional(),
      sub: z.string().nullable().optional(),
      buttonLabel: z.string().nullable().optional(),
      href: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
})

// ---------------------------------------------------------------------------
// Inferred types (exported for type-only usage)
// ---------------------------------------------------------------------------

export type ServiceImage = z.infer<typeof ServiceImageSchema>
export type ServiceData = z.infer<typeof ServiceSchema>
export type ServiceCardData = z.infer<typeof ServiceCardSchema>
export type ProcessStep = z.infer<typeof ProcessStepSchema>
export type ServicesPageData = z.infer<typeof ServicesPageSchema>
