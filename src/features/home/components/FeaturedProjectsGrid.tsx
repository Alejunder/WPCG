import { type CSSProperties } from 'react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import FadeIn from '@/features/shared/motion/FadeIn'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import ProjectCard from '@/features/projects/components/ProjectCard'
import type { ProjectCard as ProjectCardType } from '@/features/projects/types'
import type { Locale } from '@/config/i18n'
import SectionWrapper from '@/features/shared/components/SectionWrapper'
import LayoutContainer from '@/features/shared/components/LayoutContainer'
import styles from './FeaturedProjectsGrid.module.css'

interface FeaturedProjectsGridProps {
  projects: ProjectCardType[]
  locale: Locale
}

export default async function FeaturedProjectsGrid({ projects, locale }: FeaturedProjectsGridProps) {
  if (projects.length === 0) return null

  const t = await getTranslations('HomePage')
  const tCard = await getTranslations('ProjectCard')

  const categoryLabels: Record<'office' | 'residential' | 'retail', string> = {
    office: tCard('categories.office'),
    residential: tCard('categories.residential'),
    retail: tCard('categories.retail'),
  }

  const [featured, ...rest] = projects

  return (
    <SectionWrapper className={styles.section} aria-label="Featured projects">
      <AnimatedDivider className={styles.topDivider} />
      <FadeIn enableExit>
        <LayoutContainer className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow} aria-hidden="true">03</span>
            <div className={styles.headerRow}>
              <h2 className={styles.heading}>{t('projectsHeading')}</h2>
              <Link href={`/${locale}/projects`} className={styles.viewAll} transitionTypes={['nav-forward']}>
                {t('projectsViewAll')}
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </div>

          {/* Hero-style first featured project — morphs to ProjectHero on navigation */}
          <Link
            href={`/${locale}/projects/${featured.slug.current}`}
            className={styles.featuredHero}
            aria-label={`${t('projectsViewProject')}: ${featured.title}`}
          >
            {/*
             * Isolated image wrapper carries the view-transition-name so the VT
             * snapshot is just the image (no overlay text), matching the
             * ProjectHero.imageWrapper element on the detail page.
             * contain:paint clips the <Image fill> to this box and isolates
             * the snapshot — the same approach used in ProjectCard.
             */}
            <div
              className={styles.featuredHeroImageWrapper}
              style={{
                viewTransitionName: `project-hero-${featured.slug.current}`,
              } as CSSProperties}
            >
              <Image
                src={featured.heroImage.url}
                alt={featured.heroImage.alt || featured.title}
                fill
                sizes="100vw"
                className={styles.featuredHeroImage}
                priority
              />
            </div>
            <div className={styles.featuredHeroOverlay} aria-hidden="true" />
            <div className={styles.featuredHeroContent}>
              <span className={styles.featuredHeroCategory}>
                {categoryLabels[featured.category]}
              </span>
              {/*
               * Title carries a matching view-transition-name so it morphs
               * to the ProjectHeader <h1> (which uses <ViewTransition> with
               * the same name on the detail page).
               */}
              <p
                className={styles.featuredHeroTitle}
                style={{
                  viewTransitionName: `project-title-${featured.slug.current}`,
                } as CSSProperties}
              >
                {featured.title}
              </p>
              <span className={styles.featuredHeroCta}>
                {t('projectsViewProject')} →
              </span>
            </div>
          </Link>

          {/* Small grid for remaining projects */}
          {rest.length > 0 && (
            <div className={styles.smallGrid}>
              {rest.map((project) => (
                <ProjectCard key={project.slug.current} project={project} locale={locale} />
              ))}
            </div>
          )}
        </LayoutContainer>
      </FadeIn>
    </SectionWrapper>
  )
}
