import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from '@/config/i18n'
import { getAboutPage, ServiceError } from '@/features/about/services/about.service'
import AboutHero from '@/features/about/components/AboutHero'
import AboutContent from '@/features/about/components/AboutContent'
import AboutValues from '@/features/about/components/AboutValues'
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
    title: 'About Us | WPCG Architecture & Interior Design',
    description:
      'Learn about WPCG — a corporate architecture and interior design firm based in Madrid, specialising in turnkey workplace transformations.',
  },
  es: {
    title: 'Sobre Nosotros | WPCG Arquitectura y Diseño',
    description:
      'Conoce WPCG — empresa de arquitectura corporativa y diseño de interiores en Madrid, especializada en transformaciones de espacios de trabajo llave en mano.',
  },
}

const routes: Record<Locale, string> = {
  en: '/en/about',
  es: '/es/about',
}

const VALUES_HEADING: Record<Locale, string> = {
  en: 'Our Values',
  es: 'Nuestros Valores',
}

const CTA_DEFAULTS: Record<Locale, { headline: string; sub: string; buttonLabel: string }> = {
  en: {
    headline: 'Ready to transform your workspace?',
    sub: "Let's design something extraordinary together.",
    buttonLabel: 'Get in touch',
  },
  es: {
    headline: '¿Listo para transformar tu espacio?',
    sub: 'Diseñemos algo extraordinario juntos.',
    buttonLabel: 'Contáctanos',
  },
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
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'WPCG — Architecture & Interior Design, Madrid' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'WPCG — Architecture & Interior Design, Madrid' }],
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params

  let page: Awaited<ReturnType<typeof getAboutPage>>
  try {
    page = await getAboutPage(locale)
  } catch (err) {
    if (err instanceof ServiceError && err.code === 'NOT_FOUND') {
      notFound()
    }
    throw err
  }

  const cta = CTA_DEFAULTS[locale]
  const ctaHeadline = page.cta?.headline ?? cta.headline
  const ctaSub = page.cta?.sub ?? cta.sub
  const ctaButtonLabel = page.cta?.buttonLabel ?? cta.buttonLabel
  const ctaHref = page.cta?.href ?? `/${locale}/contact`

  return (
    <main className={styles.page}>
      <AboutHero
        locale={locale}
        heroImage={page.heroImage}
        title={page.title}
        intro={page.intro}
      />

      <AboutContent content={page.content ?? []} />
      <AboutValues values={page.values ?? []} heading={VALUES_HEADING[locale]} />

      <CtaBanner
        headline={ctaHeadline}
        sub={ctaSub ?? undefined}
        buttonLabel={ctaButtonLabel ?? cta.buttonLabel}
        href={ctaHref}
        variant="default"
      />
    </main>
  )
}
