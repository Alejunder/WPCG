import { z } from 'zod'
import { ProjectCardSchema } from '@/features/projects/schemas/project-card.schema'

/**
 * PortableText blocks are open-ended objects. We validate the minimum required
 * fields (_key, _type) and accept any additional properties via catchall so the
 * inferred type includes [key: string]: unknown — compatible with @portabletext/react.
 */
const PortableTextBlockSchema = z
  .object({ _key: z.string().min(1), _type: z.string().min(1) })
  .catchall(z.unknown())

export const ClientLogoSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

export const ClientSatisfactionStatSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
})

export const ClientSatisfactionSchema = z.object({
  heading: z.string().min(1),
  tagline: z.string().nullable().optional(),
  stats: z.array(ClientSatisfactionStatSchema).nullable().default([]),
})

export const HeroImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

export const HeroServiceLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

export const HomePageSchema = z.object({
  heroImages: z.array(HeroImageSchema).nullable().default([]),
  heroServiceLinks: z.array(HeroServiceLinkSchema).nullable().default([]),
  // PortableText (with the `highlight` mark) — the union keeps legacy plain-text
  // content valid until it is migrated in Sanity Studio.
  aboutExcerpt: z
    .union([z.string(), z.array(PortableTextBlockSchema)])
    .nullable()
    .optional(),
  featuredProjects: z.array(ProjectCardSchema).nullable().default([]),
  clients: z.array(ClientLogoSchema).nullable().default([]),
  clientSatisfaction: ClientSatisfactionSchema.nullable().optional(),
})

export type ClientLogo = z.infer<typeof ClientLogoSchema>
export type ClientSatisfactionStat = z.infer<typeof ClientSatisfactionStatSchema>
export type ClientSatisfactionData = z.infer<typeof ClientSatisfactionSchema>
export type HeroImage = z.infer<typeof HeroImageSchema>
export type HeroServiceLink = z.infer<typeof HeroServiceLinkSchema>
export type HomePageData = z.infer<typeof HomePageSchema>
