import { z } from 'zod'

// ---------------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------------

export const TeamImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

// ---------------------------------------------------------------------------
// Team Member
// ---------------------------------------------------------------------------

export const TeamMemberSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  image: TeamImageSchema,
  linkedinUrl: z.string().url().nullable().optional(),
  order: z.number().int(),
  featured: z.boolean().default(false),
})

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

export const TeamMembersSchema = z.array(TeamMemberSchema)

// ---------------------------------------------------------------------------
// Team Page singleton
// ---------------------------------------------------------------------------

/**
 * PortableText blocks are open-ended objects. We validate the minimum required
 * fields (_key, _type) and accept any additional properties via catchall so the
 * inferred type includes [key: string]: unknown — compatible with @portabletext/react.
 */
const PortableTextBlockSchema = z
  .object({ _key: z.string().min(1), _type: z.string().min(1) })
  .catchall(z.unknown())

export const TeamPageImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

export const TeamPageSchema = z.object({
  title: z.string().nullable().optional(),
  heroImage: TeamPageImageSchema.nullable().optional(),
  cultureText: z.array(PortableTextBlockSchema).nullable().default([]),
  pullQuote: z.string().nullable().optional(),
})
