'use client'

import type { ProjectCard } from '../types'
import type { FilterCategory } from '../hooks/useProjectFilter'
import { useProjectFilter } from '../hooks/useProjectFilter'
import ProjectFilterBar from './ProjectFilterBar'
import ProjectGrid from './ProjectGrid'
import ProjectCarousel from './ProjectCarousel'
import LoadMoreButton from './LoadMoreButton'
import styles from './ProjectListing.module.css'

// ---------------------------------------------------------------------------
// Config — labels live here, not in child components
// ---------------------------------------------------------------------------

const categories: FilterCategory[] = ['all', 'office', 'residential', 'retail']

const LABELS: Record<'en' | 'es', Record<FilterCategory, string>> = {
  en: {
    all: 'All',
    office: 'Offices',
    residential: 'Residential',
    retail: 'Retail',
  },
  es: {
    all: 'Todos',
    office: 'Oficinas',
    residential: 'Residencial',
    retail: 'Comercial',
  },
}

const LOAD_MORE: Record<'en' | 'es', { label: string; loadingLabel: string }> = {
  en: { label: 'Load more', loadingLabel: 'Loading…' },
  es: { label: 'Cargar más', loadingLabel: 'Cargando…' },
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProjectListingProps {
  projects: ProjectCard[]
  locale: 'en' | 'es'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProjectListing({ projects, locale }: ProjectListingProps) {
  const { state, data, actions } = useProjectFilter(projects)
  const labels = LABELS[locale]
  const loadMoreLabels = LOAD_MORE[locale]

  return (
    <section className={styles.wrapper} aria-label="Projects listing">
      <ProjectFilterBar
        activeCategory={state.activeCategory}
        categories={categories}
        labels={labels}
        onSelect={actions.setCategory}
      />

      {/* Desktop/tablet: masonry grid — hidden on mobile via CSS */}
      <div className={styles.gridWrapper}>
        <ProjectGrid projects={data.visibleProjects} locale={locale} />
        {state.visibleCount < state.total && (
          <LoadMoreButton
            onClick={actions.loadMore}
            label={loadMoreLabels.label}
            loadingLabel={loadMoreLabels.loadingLabel}
          />
        )}
      </div>

      {/* Mobile: Framer Motion drag carousel — hidden on tablet/desktop via CSS */}
      <div className={styles.carouselWrapper}>
        <ProjectCarousel projects={data.visibleProjects} locale={locale} />
      </div>
    </section>
  )
}
