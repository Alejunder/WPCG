import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import TransitionLink from '@/features/shared/motion/TransitionLink'
import FadeIn from '@/features/shared/motion/FadeIn'
import ProjectCard from '@/features/projects/components/ProjectCard'
import type { ProjectCard as ProjectCardType } from '@/features/projects/types'
import type { Locale } from '@/config/i18n'
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
    <section className={styles.section} aria-label="Featured projects">
      <FadeIn enableExit>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow} aria-hidden="true">{t('projectsEyebrow')}</span>
            <div className={styles.headerRow}>
              <h2 className={styles.heading}>{t('projectsHeading')}</h2>
              <TransitionLink href={`/${locale}/projects`} className={styles.viewAll}>
                {t('projectsViewAll')}
                <span aria-hidden="true"> →</span>
              </TransitionLink>
            </div>
          </div>

          {/* Hero-style first featured project */}
          <TransitionLink
            href={`/${locale}/projects/${featured.slug.current}`}
            className={styles.featuredHero}
            aria-label={`${t('projectsViewProject')}: ${featured.title}`}
          >
            <Image
              src={featured.heroImage.url}
              alt={featured.heroImage.alt || featured.title}
              fill
              sizes="100vw"
              className={styles.featuredHeroImage}
              priority
            />
            <div className={styles.featuredHeroOverlay} aria-hidden="true" />
            <div className={styles.featuredHeroContent}>
              <span className={styles.featuredHeroCategory}>
                {categoryLabels[featured.category]}
              </span>
              <p className={styles.featuredHeroTitle}>{featured.title}</p>
              <span className={styles.featuredHeroCta}>
                {t('projectsViewProject')} →
              </span>
            </div>
          </TransitionLink>

          {/* Small grid for remaining projects */}
          {rest.length > 0 && (
            <div className={styles.smallGrid}>
              {rest.map((project) => (
                <ProjectCard key={project.slug.current} project={project} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </section>
  )
}
