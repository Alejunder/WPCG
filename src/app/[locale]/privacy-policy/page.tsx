import type { Metadata } from 'next'
import type { Locale } from '@/config/i18n'
import { getTranslations } from 'next-intl/server'
import LegalHero from '@/features/legal/components/LegalHero'
import LegalDocumentView from '@/features/legal/components/LegalDocumentView'
import { getPrivacyPolicy } from '@/features/legal/content'
import styles from '../legal.module.css'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ locale: Locale }>
}

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Privacy Policy | WPCG',
    description:
      'Privacy policy of Work Place Consulting Group SL. — how we process personal data under applicable data protection law.',
  },
  es: {
    title: 'Política de Privacidad | WPCG',
    description:
      'Política de privacidad de Work Place Consulting Group SL. — cómo tratamos los datos personales conforme a la normativa aplicable.',
  },
}

const routes: Record<Locale, string> = {
  en: '/en/privacy-policy',
  es: '/es/privacy-policy',
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

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'LegalPage' })
  const document = getPrivacyPolicy(locale)

  return (
    <main className={styles.page}>
      <LegalHero
        locale={locale}
        title={document.title}
        homeLabel={t('breadcrumbHome')}
        currentLabel={t('privacyBreadcrumb')}
      />
      <div className={styles.content}>
        <LegalDocumentView document={document} />
      </div>
    </main>
  )
}
