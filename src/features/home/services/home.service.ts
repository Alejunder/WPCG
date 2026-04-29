import { HomePageSchema } from '../schemas/home.schema'
import type { HomePageData } from '../types'
import { getHomePageQuery } from './home.queries'
import type { Locale } from '@/config/i18n'
import { createServiceHelpers } from '@/lib/sanity/service-helpers'

const { validate, fetchFromSanity } = createServiceHelpers('home.service')

// ---------------------------------------------------------------------------
// Public service functions
// ---------------------------------------------------------------------------

export async function getHomePage(locale: Locale): Promise<HomePageData | null> {
  const raw = await fetchFromSanity<unknown>('getHomePage', getHomePageQuery, { locale })

  if (raw == null) return null

  return validate(HomePageSchema, raw, 'getHomePage')
}
