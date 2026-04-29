import type { Metadata } from 'next'
import type { Locale } from '@/config/i18n'
import type { ServiceCard } from '@/features/services/types'
import { getServicesPage, getAllServices } from '@/features/services/services/services.service'
import ServicesHero from '@/features/services/components/ServicesHero'
import ServicesPageContent from '@/features/services/components/ServicesPageContent'
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
    title: 'Our Services | WPCG Architecture & Interior Design',
    description:
      'Interior design, architecture & construction, and project management services delivered by WPCG in Madrid.',
  },
  es: {
    title: 'Nuestros Servicios | WPCG Arquitectura y Diseño',
    description:
      'Servicios de diseño de interiores, arquitectura y construcción, y gestión de proyectos por WPCG en Madrid.',
  },
}

const routes: Record<Locale, string> = {
  en: '/en/services',
  es: '/es/servicios',
}

const CTA_DEFAULTS: Record<Locale, { headline: string; sub: string; buttonLabel: string }> = {
  en: {
    headline: 'Ready to start your project?',
    sub: "Let's design something extraordinary together.",
    buttonLabel: 'Get in touch',
  },
  es: {
    headline: '¿Listo para empezar tu proyecto?',
    sub: 'Diseñemos algo extraordinario juntos.',
    buttonLabel: 'Contáctanos',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
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

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params

  // Fetch the servicesPage singleton (may be null if not yet created in CMS)
  const page = await getServicesPage(locale)

  // Fallback: if the singleton has no services[], fetch all services directly
  const hasPageServices = (page?.services ?? []).length > 0
  const fallbackServices = hasPageServices ? [] : await getAllServices(locale)

  // Normalise fallback into ServiceCard subset for ServicesPageContent
  const fallbackCards: ServiceCard[] = fallbackServices.map((svc) => ({
    name: svc.name,
    slug: svc.slug,
    shortDescription: svc.shortDescription,
    icon: svc.icon,
    image: svc.image,
  }))

  // Resolve CTA content — prefer CMS data, fall back to static defaults
  const cta = CTA_DEFAULTS[locale]
  const ctaHeadline = page?.cta?.headline ?? cta.headline
  const ctaSub = page?.cta?.sub ?? cta.sub
  const ctaButtonLabel = page?.cta?.buttonLabel ?? cta.buttonLabel
  const ctaHref = page?.cta?.href ?? `/${locale}/contact`

  return (
    <main className={styles.page}>
      <ServicesHero
        locale={locale}
        heroImage={page?.heroImage}
        title={page?.title}
        intro={page?.intro}
      />

      <ServicesPageContent
        locale={locale}
        page={page ?? { services: [], processSteps: [] }}
        fallbackServices={fallbackCards}
      />

      <CtaBanner
        headline={ctaHeadline}
        sub={ctaSub}
        buttonLabel={ctaButtonLabel}
        href={ctaHref}
        variant="compact"
      />
    </main>
  )
}
