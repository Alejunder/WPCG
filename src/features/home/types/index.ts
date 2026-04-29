import type { HomePageData, ClientLogo } from '../schemas/home.schema'
import type { ProjectCard } from '@/features/projects/types'

export type { HomePageData, ClientLogo }

/**
 * Convenience alias for a featured project on the home page.
 * Same shape as ProjectCard — reuses the validated projects type.
 */
export type FeaturedProject = ProjectCard
