import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjectSlugs } from '@/features/projects/services/projects.service'
import { locales } from '@/config/i18n'
import FadeIn from '@/features/shared/motion/FadeIn'
import ProjectHero from '@/features/projects/components/detail/ProjectHero'
import ProjectHeader from '@/features/projects/components/detail/ProjectHeader'
import ProjectDescription from '@/features/projects/components/detail/ProjectDescription'
import ProjectGallery from '@/features/projects/components/detail/ProjectGallery'
import ProjectFacts from '@/features/projects/components/detail/ProjectFacts'
import RelatedProjects from '@/features/projects/components/detail/RelatedProjects'
import { ServiceHoverProvider } from '@/features/projects/components/detail/ServiceHoverContext'
import CtaBanner from '@/features/shared/components/CtaBanner'
import ProjectBreadcrumb from '@/features/projects/components/detail/ProjectBreadcrumb'
import styles from './page.module.css'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()

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
  const project = await getProjectBySlug(locale, slug)

  if (!project) return {}

  const title = project.title
  const description = `${title} — WPCG`

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        es: `/es/projects/${slug}`,
        'x-default': `/en/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      siteName: 'WPCG',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      images: [
        {
          url: project.heroImage.url,
          width: 1200,
          height: 630,
          alt: project.heroImage.alt ?? title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.heroImage.url],
    },
  }
}

// Category → CSS token map for injecting --category-color at the layout level
// so the factsCol border inherits the same colour as the interior elements.
const CATEGORY_COLOR: Record<string, string> = {
  office: 'var(--color-category-office)',
  residential: 'var(--color-category-residential)',
  retail: 'var(--color-category-retail)',
}

// TODO: Move CTA content to CMS (Sanity) and fetch via service layer
const CTA_CONTENT: Record<'en' | 'es', { headline: string; sub: string; button: string }> = {
  en: {
    headline: 'Like what you see?',
    sub: "Let's build something remarkable together.",
    button: 'Get in touch',
  },
  es: {
    headline: '¿Te gusta lo que ves?',
    sub: 'Construyamos algo extraordinario juntos.',
    button: 'Contáctanos',
  },
}

const BREADCRUMB: Record<'en' | 'es', { home: string; projects: string }> = {
  en: { home: 'Home', projects: 'Projects' },
  es: { home: 'Inicio', projects: 'Proyectos' },
}

interface PageProps {
  params: Promise<{
    locale: 'en' | 'es'
    slug: string
  }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const cta = CTA_CONTENT[locale]
  const project = await getProjectBySlug(locale, slug)

  if (!project) {
    notFound()
  }

  const gallery = (project.gallery ?? []).map((img) => ({
    url: img.url,
    alt: img.alt || project.title,
  }))

  const bc = BREADCRUMB[locale]

  return (
    <main className={styles.page}>
      {/* Full-bleed hero — no max-width constraint */}
      <ProjectHero
        heroImage={{ url: project.heroImage.url, alt: project.heroImage.alt ?? project.title }}
        slug={slug}
      />

      {/* Breadcrumb below hero */}
      <div className={styles.breadcrumbBar}>
        <ProjectBreadcrumb
          locale={locale}
          homeLabel={bc.home}
          projectsLabel={bc.projects}
          projectTitle={project.title}
        />
      </div>

      {/* Constrained content */}
      <ServiceHoverProvider>
      <div className={styles.content}>
        <ProjectHeader
          title={project.title}
          slug={slug}
          category={project.category}
          year={project.year}
          location={project.location}
          locale={locale}
        />

        {/* Two-column zone: description + facts sidebar */}
        <div className={styles.bodyZone}>
          <div className={styles.descriptionCol}>
            <FadeIn delay={0.1}>
              <ProjectDescription blocks={project.description ?? []} />
            </FadeIn>
          </div>
          <aside
            className={styles.factsCol}
            style={{ '--category-color': CATEGORY_COLOR[project.category] ?? 'var(--color-secondary)' } as React.CSSProperties}
          >
            <ProjectFacts
              surfaceArea={project.surfaceArea}
              duration={project.duration}
              services={project.servicesInvolved ?? []}
              locale={locale}
              category={project.category}
              ecoFriendly={project.ecoFriendly}
            />
          </aside>
        </div>

        {/* Full-width gallery */}
        <ProjectGallery images={gallery} category={project.category} />

        {/* Related projects */}
        <RelatedProjects projects={project.relatedProjects ?? []} locale={locale} />
      </div>
      </ServiceHoverProvider>

      {/* Full-bleed CTA banner */}
      <CtaBanner
        headline={cta.headline}
        sub={cta.sub}
        buttonLabel={cta.button}
        href={`/${locale}/contact`}
        variant="compact"
      />
    </main>
  )
}
