import { z } from 'zod'

/**
 * Normalises the value to lowercase before matching against the enum so that
 * data inconsistencies in the CMS (e.g. "Office" vs "office") do not cause
 * validation failures at runtime.
 */
export const ProjectCategorySchema = z
  .string()
  .transform((s) => s.toLowerCase())
  .pipe(z.enum(['office', 'residential', 'retail']))

export const ProjectImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().default(''),
})

export const ProjectCardSchema = z.object({
  title: z.string().min(1),
  /** Sanity slug object — use `.current` to get the URL-safe string. */
  slug: z.object({ current: z.string().min(1) }),
  category: ProjectCategorySchema,
  heroImage: ProjectImageSchema,
  /**
   * Included in the related-projects projection on the detail page so that
   * RelatedProjects can dim cards that don't share the hovered service.
   * Listing-page cards don't fetch this field (undefined → []).
   * Sanity returns null when the field is unset on a document (null → []).
   */
  servicesInvolved: z.array(z.string()).nullable().optional().transform((v) => v ?? []),
  ecoFriendly: z.boolean().nullable().default(false),
})
