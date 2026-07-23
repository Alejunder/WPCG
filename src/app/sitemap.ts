import type { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/features/projects/services/projects.service'
import { getAllServiceSlugs } from '@/features/services/services/services.service'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wpcg.es'
const LOCALES = ['en', 'es'] as const

const STATIC_ROUTES = [
  '',          // home
  '/about',
  '/services',
  '/projects',
  '/team',
  '/contact',
  '/privacy-policy',
  '/quality-policy',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, serviceSlugs] = await Promise.all([
    getAllProjectSlugs(),
    getAllServiceSlugs(),
  ])

  const staticEntries = STATIC_ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  )

  const projectEntries = projectSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const serviceEntries = serviceSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticEntries, ...projectEntries, ...serviceEntries]
}
