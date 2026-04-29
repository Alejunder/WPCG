import { z } from 'zod'
import { ProjectCardSchema } from '../schemas/project-card.schema'
import { ProjectSchema } from '../schemas/project.schema'
import type { Project, ProjectCard } from '../types'
import {
  getAllProjectsQuery,
  getProjectBySlugQuery,
  getFeaturedProjectsQuery,
  getAllProjectSlugsQuery,
} from './projects.queries'
import { createServiceHelpers } from '@/lib/sanity/service-helpers'

// ---------------------------------------------------------------------------
// Internal types and schemas
// ---------------------------------------------------------------------------

type SlugResult = { slug: { current: string } }

const SlugResultSchema = z.array(
  z.object({ slug: z.object({ current: z.string().min(1) }) }),
)

const { validate, fetchFromSanity } = createServiceHelpers('projects.service')

// ---------------------------------------------------------------------------
// Public service functions
// ---------------------------------------------------------------------------

export async function getAllProjects(locale: string): Promise<ProjectCard[]> {
  const raw = await fetchFromSanity<ProjectCard[]>('getAllProjects', getAllProjectsQuery, { locale })
  return validate(z.array(ProjectCardSchema), raw, 'getAllProjects')
}

export async function getProjectBySlug(locale: string, slug: string): Promise<Project | null> {
  const raw = await fetchFromSanity<Project | null>(
    'getProjectBySlug',
    getProjectBySlugQuery,
    { locale, slug },
  )

  if (raw == null) return null

  return validate(ProjectSchema, raw, `getProjectBySlug("${slug}")`)
}

export async function getFeaturedProjects(locale: string): Promise<ProjectCard[]> {
  const raw = await fetchFromSanity<ProjectCard[]>(
    'getFeaturedProjects',
    getFeaturedProjectsQuery,
    { locale },
  )
  return validate(z.array(ProjectCardSchema), raw, 'getFeaturedProjects')
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const raw = await fetchFromSanity<SlugResult[]>('getAllProjectSlugs', getAllProjectSlugsQuery)
  const validated = validate(SlugResultSchema, raw, 'getAllProjectSlugs')
  return validated.map((item) => item.slug.current)
}
