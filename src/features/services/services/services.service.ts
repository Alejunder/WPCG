import { z } from 'zod'
import { ServiceSchema, ServiceCardSchema, ServicesPageSchema } from '../schemas/service.schema'
import type { Service, ServiceCard, ServicesPageData } from '../types'
import {
  getServicesPageQuery,
  getAllServicesQuery,
  getFeaturedServicesQuery,
  getServiceBySlugQuery,
  getAllServiceSlugsQuery,
} from './services.queries'
import type { Locale } from '@/config/i18n'
import { createServiceHelpers } from '@/lib/sanity/service-helpers'
import { ServiceError } from '@/lib/errors/service-error'

const { validate, fetchFromSanity } = createServiceHelpers('services.service')

// ---------------------------------------------------------------------------
// Public service functions
// ---------------------------------------------------------------------------

/**
 * Fetches the `servicesPage` singleton from Sanity, including all referenced
 * service documents resolved and ordered by `order` field.
 *
 * Returns `null` when no singleton document has been created in the CMS yet.
 * Throws `ServiceError` on fetch failure or validation error.
 */
export async function getServicesPage(locale: Locale): Promise<ServicesPageData | null> {
  const raw = await fetchFromSanity<unknown>('getServicesPage', getServicesPageQuery, { locale })

  if (raw == null) return null

  return validate(ServicesPageSchema, raw, 'getServicesPage')
}

/**
 * Fetches all `service` documents ordered by the `order` field.
 * Use as a fallback when the `servicesPage` singleton hasn't been configured.
 *
 * Throws `ServiceError` on fetch failure or validation error.
 */
export async function getAllServices(locale: Locale): Promise<Service[]> {
  const raw = await fetchFromSanity<unknown[]>('getAllServices', getAllServicesQuery, { locale })

  return validate(z.array(ServiceSchema), raw, 'getAllServices')
}

/**
 * Fetches only services marked as `featured == true`, returning the card subset.
 * Used by the home page services overview.
 *
 * Throws `ServiceError` on fetch failure or validation error.
 */
export async function getFeaturedServices(locale: Locale): Promise<ServiceCard[]> {
  const raw = await fetchFromSanity<unknown[]>(
    'getFeaturedServices',
    getFeaturedServicesQuery,
    { locale },
  )

  return validate(z.array(ServiceCardSchema), raw, 'getFeaturedServices')
}

/**
 * Fetches a single `service` document by slug.
 * Returns the full service shape (name, longDescription, highlights, image, icon, …).
 *
 * Throws `ServiceError` with code `'NOT_FOUND'` when the slug doesn't match any document.
 * Throws `ServiceError` on fetch failure or validation error.
 */
export async function getServiceBySlug(locale: Locale, slug: string): Promise<Service> {
  const raw = await fetchFromSanity<unknown>('getServiceBySlug', getServiceBySlugQuery, { locale, slug })

  if (raw == null) {
    throw new ServiceError(`Service not found: "${slug}"`, 'NOT_FOUND', { slug })
  }

  return validate(ServiceSchema, raw, `getServiceBySlug("${slug}")`)
}

/**
 * Returns all service slugs (locale-agnostic) for `generateStaticParams`.
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  const SlugResultSchema = z.array(z.object({ slug: z.object({ current: z.string().min(1) }) }))
  const raw = await fetchFromSanity<unknown[]>('getAllServiceSlugs', getAllServiceSlugsQuery)
  const validated = validate(SlugResultSchema, raw, 'getAllServiceSlugs')
  return validated.map((item) => item.slug.current)
}
