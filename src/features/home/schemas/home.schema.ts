import { z } from 'zod'
import { ProjectCardSchema } from '@/features/projects/schemas/project-card.schema'

export const ClientLogoSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

export const HeroImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

export const HomePageSchema = z.object({
  heroImages: z.array(HeroImageSchema).nullable().default([]),
  aboutExcerpt: z.string().nullable().optional(),
  featuredProjects: z.array(ProjectCardSchema).nullable().default([]),
  clients: z.array(ClientLogoSchema).nullable().default([]),
})

export type ClientLogo = z.infer<typeof ClientLogoSchema>
export type HeroImage = z.infer<typeof HeroImageSchema>
export type HomePageData = z.infer<typeof HomePageSchema>
