import type { Metadata } from 'next'
import type { Locale } from '@/config/i18n'
import { getTranslations } from 'next-intl/server'
import LegalHero from '@/features/legal/components/LegalHero'
import LegalDocumentView from '@/features/legal/components/LegalDocumentView'
import { getQualityPolicy } from '@/features/legal/content'
import styles from '../legal.module.css'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ locale: Locale }>
}

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Quality Policy | WPCG',
    description:
      'Quality policy of Work Place Consulting Group — ISO 9001:2015 management system for architecture, interior design and construction.',
  },
  es: {
    title: 'Política de Calidad | WPCG',
    description:
      'Política de calidad de Work Place Consulting Group — sistema de gestión ISO 9001:2015 para arquitectura, interiorismo y construcción.',
  },
}

const routes: Record<Locale, string> = {
  en: '/en/quality-policy',
  es: '/es/quality-policy',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = META[locale]

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: routes[locale],
      languages: {
        en: routes.en,
        es: routes.es,
        'x-default': routes.en,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
    },
  }
}

export default async function QualityPolicyPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'LegalPage' })
  const document = getQualityPolicy(locale)

  return (
    <main className={styles.page}>
      <LegalHero
        locale={locale}
        title={document.title}
        homeLabel={t('breadcrumbHome')}
        currentLabel={t('qualityBreadcrumb')}
      />
      <div className={styles.content}>
        <LegalDocumentView document={document} />
      </div>
    </main>
  )
}
