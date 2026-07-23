import type { Metadata } from 'next'
import { getAllProjects, getProjectsPage } from '@/features/projects/services/projects.service'
import ProjectListing from '@/features/projects/components/ProjectListing'
import ProjectsPageHero from '@/features/projects/components/ProjectsPageHero'
import styles from './page.module.css'

export const revalidate = 3600

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: 'en' | 'es' }>
}

// ---------------------------------------------------------------------------
// Fallback metadata (used when Sanity document has not been created yet)
// ---------------------------------------------------------------------------

const META_FALLBACK: Record<'en' | 'es', { title: string; description: string }> = {
  en: {
    title: 'Architecture Projects | WPCG',
    description: 'Explore architecture, interior design, and construction projects by WPCG.',
  },
  es: {
    title: 'Proyectos de Arquitectura | WPCG',
    description:
      'Descubre los proyectos de arquitectura, interiorismo y construcción realizados por WPCG.',
  },
}

const routes = {
  en: '/en/projects',
  es: '/es/projects',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' }>
}): Promise<Metadata> {
  const { locale } = await params
  const page = await getProjectsPage(locale)
  const fallback = META_FALLBACK[locale]

  const title = page?.seoTitle ?? page?.title ?? fallback.title
  const description = page?.seoDescription ?? fallback.description

  return {
    title,
    description,
    alternates: {
      canonical: routes[locale],
      languages: {
        en: routes.en,
        es: routes.es,
        'x-default': routes.en,
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === 'en' ? 'en_US' : 'es_ES',
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

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params
  const [projects, page] = await Promise.all([
    getAllProjects(locale),
    getProjectsPage(locale),
  ])

  return (
    <main className={styles.page}>
      <ProjectsPageHero
        locale={locale}
        title={page?.title ?? null}
        subtitle={page?.subtitle ?? null}
      />
      <div className={styles.listingContainer}>
        <ProjectListing projects={projects} locale={locale} />
      </div>
    </main>
  )
}
