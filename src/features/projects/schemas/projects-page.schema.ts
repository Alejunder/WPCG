import { z } from 'zod'

export const ProjectsPageSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
})

export type ProjectsPage = z.infer<typeof ProjectsPageSchema>
