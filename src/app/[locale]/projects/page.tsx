import type { Metadata } from 'next'
import { getAllProjects } from '@/features/projects/services/projects.service'
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
// Metadata
// ---------------------------------------------------------------------------

const META: Record<'en' | 'es', { title: string; description: string }> = {
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
  es: '/es/proyectos',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    ...META[locale],
    alternates: { canonical: routes[locale],
      languages: {
        en: routes.en,
        es: routes.es
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params
  const projects = await getAllProjects(locale)

  return (
    <main className={styles.page}>
      <ProjectsPageHero locale={locale} />
      <div className={styles.listingContainer}>
        <ProjectListing projects={projects} locale={locale} />
      </div>
    </main>
  )
}
