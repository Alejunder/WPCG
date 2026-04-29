import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getServiceBySlug, getAllServiceSlugs } from '@/features/services/services/services.service'
import { locales } from '@/config/i18n'
import CtaBanner from '@/features/shared/components/CtaBanner'
import ServiceDetailPage from '@/features/services/components/detail/ServiceDetailPage'
import type { BreadcrumbItem } from '@/features/shared/components/Breadcrumb'
import styles from './page.module.css'

export const revalidate = 3600
export const dynamicParams = true

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wpcg.com'

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es'; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params

  let service: Awaited<ReturnType<typeof getServiceBySlug>> | null = null
  try {
    service = await getServiceBySlug(locale, slug)
  } catch {
    return {}
  }

  const routes: Record<'en' | 'es', string> = {
    en: `/en/services/${slug}`,
    es: `/es/servicios/${slug}`,
  }

  const canonical = `${BASE_URL}${routes[locale]}`
  const title = `${service.name} — WPCG`
  const description = service.shortDescription

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}${routes.en}`,
        es: `${BASE_URL}${routes.es}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'WPCG',
      ...(service.image?.url && {
        images: [
          {
            url: service.image.url,
            width: 1200,
            height: 630,
            alt: service.image.alt || service.name,
          },
        ],
      }),
      type: 'article',
    },
  }
}

interface PageProps {
  params: Promise<{ locale: 'en' | 'es'; slug: string }>
}

export default async function ServiceDetailRoute({ params }: PageProps) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'ServiceDetailPage' })

  let service: Awaited<ReturnType<typeof getServiceBySlug>> | null = null
  try {
    service = await getServiceBySlug(locale, slug)
  } catch {
    notFound()
  }

  if (!service) notFound()

  const breadcrumb: BreadcrumbItem[] = [
    { label: t('breadcrumbHome'), href: `/${locale}` },
    { label: t('breadcrumbServices'), href: `/${locale}/services` },
    { label: service.name },
  ]

  return (
    <main className={styles.page}>
      <ServiceDetailPage
        service={service}
        breadcrumb={breadcrumb}
        highlightsHeading={t('highlightsHeading')}
      />

      <CtaBanner
        headline={t('ctaHeadline')}
        sub={t('ctaSub')}
        buttonLabel={t('ctaButton')}
        href={`/${locale}/contact`}
      />
    </main>
  )
}
