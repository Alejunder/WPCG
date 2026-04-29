import { AboutPageSchema } from '../schemas/about.schema'
import type { AboutPageData } from '../types'
import { getAboutPageQuery } from './about.queries'
import type { Locale } from '@/config/i18n'
import { createServiceHelpers } from '@/lib/sanity/service-helpers'
import { ServiceError } from '@/lib/errors/service-error'

const { validate, fetchFromSanity } = createServiceHelpers('about.service')

// ---------------------------------------------------------------------------
// Public service functions
// ---------------------------------------------------------------------------

/**
 * Fetches the `aboutPage` singleton from Sanity.
 *
 * Throws `ServiceError` with code `NOT_FOUND` when no singleton document
 * has been created in the CMS yet.
 * Throws `ServiceError` on fetch failure or validation error.
 */
export async function getAboutPage(locale: Locale): Promise<AboutPageData> {
  const raw = await fetchFromSanity<unknown>('getAboutPage', getAboutPageQuery, { locale })

  if (raw == null) {
    throw new ServiceError('About page not configured in CMS', 'NOT_FOUND')
  }

  return validate(AboutPageSchema, raw, 'getAboutPage')
}

export { ServiceError }
