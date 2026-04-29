import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/config/i18n'
import { getHomePage } from '@/features/home/services/home.service'
import { getFeaturedServices } from '@/features/services/services/services.service'
import HeroSection from '@/features/home/components/HeroSection'
import AboutExcerpt from '@/features/home/components/AboutExcerpt'
import ServicesOverview from '@/features/home/components/ServicesOverview'
import FeaturedProjectsGrid from '@/features/home/components/FeaturedProjectsGrid'
import ClientsBar from '@/features/home/components/ClientsBar'
import CtaBanner from '@/features/shared/components/CtaBanner'

export const revalidate = 3600

const LOCALES = ['en', 'es'] as const

interface Props {
  params: Promise<{ locale: string }>
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const typedLocale = locale as Locale

  const title =
    typedLocale === 'en'
      ? 'WPCG — Architecture & Interior Design · Madrid'
      : 'WPCG — Arquitectura y Diseño de Interiores · Madrid'

  const description =
    typedLocale === 'en'
      ? 'Work Place Consulting Group — premium corporate architecture and interior design firm based in Madrid.'
      : 'Work Place Consulting Group — firma premium de arquitectura corporativa y diseño de interiores en Madrid.'

  return {
    title,
    description,
    alternates: {
      canonical: `/${typedLocale}`,
      languages: { en: '/en', es: '/es' },
    },
    openGraph: {
      title,
      description,
      locale: typedLocale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound()
  }

  const typedLocale = locale as Locale
  const [home, services, t] = await Promise.all([
    getHomePage(typedLocale),
    getFeaturedServices(typedLocale),
    getTranslations({ locale: typedLocale, namespace: 'HomePage' }),
  ])

  if (!home) notFound()

  return (
    <main>
      <HeroSection
        heroImages={home.heroImages}
        locale={typedLocale}
      />

      {home.aboutExcerpt && (
        <AboutExcerpt text={home.aboutExcerpt} locale={typedLocale} />
      )}

      <ServicesOverview
        locale={typedLocale}
        services={services}
        heading={t('servicesHeading')}
        exploreLabel={t('servicesExplore')}
      />

      <FeaturedProjectsGrid
        projects={home.featuredProjects ?? []}
        locale={typedLocale}
      />

      <ClientsBar clients={home.clients ?? []} />

      <CtaBanner
        headline={t('ctaHeadline')}
        sub={t('ctaSub')}
        buttonLabel={t('ctaButton')}
        href={`/${typedLocale}/contact`}
      />
    </main>
  )
}

