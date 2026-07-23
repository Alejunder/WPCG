import type { Locale } from '@/config/i18n'
import type { LegalDocument } from '../types'
import { privacyPolicyEn } from './privacy.en'
import { privacyPolicyEs } from './privacy.es'
import { qualityPolicyEn } from './quality.en'
import { qualityPolicyEs } from './quality.es'

export function getPrivacyPolicy(locale: Locale): LegalDocument {
  return locale === 'es' ? privacyPolicyEs : privacyPolicyEn
}

export function getQualityPolicy(locale: Locale): LegalDocument {
  return locale === 'es' ? qualityPolicyEs : qualityPolicyEn
}
