import { ContactInfoSchema } from '../schemas/contact.schema'
import type { ContactInfoData } from '../types'
import { getContactPageQuery } from './contact.queries'
import { createServiceHelpers } from '@/lib/sanity/service-helpers'

const { validate, fetchFromSanity } = createServiceHelpers('contact.service')

export async function getContactInfo(locale: string): Promise<ContactInfoData | null> {
  const raw = await fetchFromSanity<ContactInfoData | null>(
    'getContactInfo',
    getContactPageQuery,
    { locale },
  )

  if (raw == null) return null

  return validate(ContactInfoSchema, raw, 'getContactInfo')
}
