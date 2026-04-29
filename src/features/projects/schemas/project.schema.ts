import { z } from 'zod'
import {
  ProjectCardSchema,
  ProjectCategorySchema,
  ProjectImageSchema,
} from './project-card.schema'

/**
 * PortableText blocks are open-ended objects. We validate the minimum required
 * fields (_key, _type) and accept any additional properties via catchall so the
 * inferred type includes [key: string]: unknown — compatible with @portabletext/react.
 */
const PortableTextBlockSchema = z
  .object({ _key: z.string().min(1), _type: z.string().min(1) })
  .catchall(z.unknown())

export const ProjectSchema = z.object({
  title: z.string().min(1),
  /** Sanity slug object — use `.current` to get the URL-safe string. */
  slug: z.object({ current: z.string().min(1) }),
  category: ProjectCategorySchema,
  year: z.number().int().positive().nullable().optional(),
  location: z.string().nullable().optional(),
  description: z.array(PortableTextBlockSchema).nullable().default([]),
  heroImage: ProjectImageSchema,
  gallery: z.array(ProjectImageSchema).nullable().default([]),
  surfaceArea: z.number().positive().nullable().optional(),
  duration: z.string().nullable().optional(),
  servicesInvolved: z.array(z.string()).nullable().default([]),
  relatedProjects: z.array(ProjectCardSchema).max(3).nullable().default([]),
  featured: z.boolean().nullable().default(false),
})
