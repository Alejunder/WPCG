import type { z } from 'zod'
import type { ProjectCategorySchema, ProjectCardSchema } from '../schemas/project-card.schema'
import type { ProjectSchema } from '../schemas/project.schema'

/**
 * Derived from ProjectCategorySchema — single source of truth.
 * Values: 'office' | 'residential' | 'retail'
 */
export type ProjectCategory = z.infer<typeof ProjectCategorySchema>

/**
 * Partial type used in listing pages and related project cards.
 * Derived from ProjectCardSchema.
 */
export type ProjectCard = z.infer<typeof ProjectCardSchema>

/**
 * Full project document type. Derived from ProjectSchema.
 * description is z.array(PortableTextBlockSchema.catchall), which infers as
 * { _key: string; _type: string; [key: string]: unknown }[] —
 * compatible with @portabletext/react's PortableText component.
 */
export type Project = z.infer<typeof ProjectSchema>

/**
 * Single PortableText block — extracted from Project for convenience.
 * Use this as the element type when working with individual blocks.
 */
export type PortableTextBlock = NonNullable<Project['description']>[number]
