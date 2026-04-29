import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/config/i18n'
import { getAllTeamMembers, getTeamPage } from '@/features/team/services/team.service'
import TeamPageHero from '@/features/team/components/TeamPageHero'
import TeamSection from '@/features/team/components/TeamSection'
import CultureBlock from '@/features/team/components/CultureBlock'
import CtaBanner from '@/features/shared/components/CtaBanner'
import styles from './page.module.css'

export const revalidate = 3600

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: Locale }>
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Our Team | WPCG Architecture & Interior Design',
    description:
      'Meet the multidisciplinary team behind WPCG — architects, designers, and project managers united by a commitment to quality, creativity, and precision.',
  },
  es: {
    title: 'Nuestro Equipo | WPCG Arquitectura y Diseño',
    description:
      'Conoce al equipo multidisciplinar de WPCG — arquitectos, diseñadores y project managers unidos por el compromiso con la calidad, la creatividad y la precisión.',
  },
}

const ROUTES: Record<Locale, string> = {
  en: '/en/team',
  es: '/es/equipo',
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
      canonical: ROUTES[locale],
      languages: {
        en: ROUTES.en,
        es: ROUTES.es,
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TeamPage({ params }: PageProps) {
  const { locale } = await params

  const [members, teamPage, t] = await Promise.all([
    getAllTeamMembers(locale),
    getTeamPage(locale),
    getTranslations({ locale, namespace: 'TeamPage' }),
  ])

  const cultureText = teamPage?.cultureText ?? []

  return (
    <main className={styles.page}>
      <TeamPageHero
        locale={locale}
        title={teamPage?.title}
        sub={teamPage?.pullQuote}
        heroImage={teamPage?.heroImage}
        breadcrumbHomeLabel={t('breadcrumbHome')}
        breadcrumbTeamLabel={t('breadcrumbTeam')}
      />

      <CultureBlock blocks={cultureText} />

      <TeamSection
        members={members}
        locale={locale}
        heading={t('sectionHeading')}
      />

      <CtaBanner
        headline={t('ctaHeadline')}
        sub={t('ctaSub')}
        buttonLabel={t('ctaButton')}
        href={`/${locale}/contact`}
        variant="compact"
      />
    </main>
  )
}
