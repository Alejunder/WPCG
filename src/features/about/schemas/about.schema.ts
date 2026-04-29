import { z } from 'zod'

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

const PortableTextBlockSchema = z
  .object({ _key: z.string().min(1), _type: z.string().min(1) })
  .catchall(z.unknown())

export const AboutImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

// ---------------------------------------------------------------------------
// Value
// ---------------------------------------------------------------------------

export const AboutValueSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
})

// ---------------------------------------------------------------------------
// About Page
// ---------------------------------------------------------------------------

export const AboutPageSchema = z.object({
  heroImage: AboutImageSchema.nullable().optional(),
  title: z.string().nullable().optional(),
  intro: z.string().nullable().optional(),
  content: z.array(PortableTextBlockSchema).default([]),
  values: z.array(AboutValueSchema).default([]),
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
