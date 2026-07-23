import { z } from 'zod'

export const SketchSchema = z.object({
  id: z.string().min(1),
  image: z.object({
    url: z.string().url(),
    alt: z.string().default(''),
  }),
  /** Projected locale-specific string from the CMS title object. */
  title: z.string().nullish(),
  /** Slug of the linked project, if any. */
  projectSlug: z.string().nullish(),
  showOnHomepage: z.boolean().nullable().default(false),
})

export type Sketch = z.infer<typeof SketchSchema>
