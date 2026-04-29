import type { z } from 'zod'
import type { AboutPageSchema, AboutValueSchema, AboutImageSchema } from '../schemas/about.schema'

/** Full about page singleton data. Derived from AboutPageSchema — single source of truth. */
export type AboutPageData = z.infer<typeof AboutPageSchema>

/** Single value pillar. Derived from AboutValueSchema. */
export type AboutValue = z.infer<typeof AboutValueSchema>

/** Image shape. Derived from AboutImageSchema. */
export type AboutImage = z.infer<typeof AboutImageSchema>

/** Single PortableText block — extracted from AboutPageData for convenience. */
export type AboutPortableTextBlock = NonNullable<AboutPageData['content']>[number]
