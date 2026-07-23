import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { locales, type Locale } from '@/config/i18n'
import { getHomePage } from '@/features/home/services/home.service'
import { getFeaturedServices } from '@/features/services/services/services.service'
import { getHomepageSketches } from '@/features/sketches/services/sketches.service'
import HeroSection from '@/features/home/components/HeroSection'
import AboutExcerpt from '@/features/home/components/AboutExcerpt'
import ServicesOverview from '@/features/home/components/ServicesOverview'
import FeaturedProjectsGrid from '@/features/home/components/FeaturedProjectsGrid'
import HomepageSketchesSection from '@/features/home/components/HomepageSketchesSection'
import ClientsSatisfaction from '@/features/home/components/ClientsSatisfaction'
import ClientsBar from '@/features/home/components/ClientsBar'
import CtaBanner from '@/features/shared/components/CtaBanner'

export const revalidate = 3600

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
      languages: { en: '/en', es: '/es', 'x-default': '/en' },
    },
    openGraph: {
      title,
      description,
      locale: typedLocale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'WPCG — Architecture & Interior Design, Madrid' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'WPCG — Architecture & Interior Design, Madrid' }],
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  if (!hasLocale(locales, locale)) {
    notFound()
  }

  const typedLocale: Locale = locale
  const [home, services, sketches, t] = await Promise.all([
    getHomePage(typedLocale),
    getFeaturedServices(typedLocale),
    getHomepageSketches(typedLocale),
    getTranslations({ locale: typedLocale, namespace: 'HomePage' }),
  ])

  if (!home) notFound()

  return (
    <main>
      <HeroSection
        heroImages={home.heroImages}
        locale={typedLocale}
        heroServiceLinks={home.heroServiceLinks}
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

      <HomepageSketchesSection sketches={sketches} locale={typedLocale} />

      <ClientsBar clients={home.clients ?? []} />

      <ClientsSatisfaction data={home.clientSatisfaction} />

      <CtaBanner
        headline={t('ctaHeadline')}
        sub={t('ctaSub')}
        buttonLabel={t('ctaButton')}
        href={`/${typedLocale}/contact`}
      />
    </main>
  )
}

