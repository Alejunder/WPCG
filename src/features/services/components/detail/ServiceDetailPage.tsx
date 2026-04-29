import type { Service } from '@/features/services/types'
import type { BreadcrumbItem } from '@/features/shared/components/Breadcrumb'
import Breadcrumb from '@/features/shared/components/Breadcrumb'
import FadeIn from '@/features/shared/motion/FadeIn'
import ServiceHero from './ServiceHero'
import ServiceContent from './ServiceContent'
import ServiceHighlights from './ServiceHighlights'
import styles from './ServiceDetailPage.module.css'

interface ServiceDetailPageProps {
  service: Service
  breadcrumb: BreadcrumbItem[]
  /** Translation-ready label for the highlights section heading */
  highlightsHeading: string
}

export default function ServiceDetailPage({
  service,
  breadcrumb,
  highlightsHeading,
}: ServiceDetailPageProps) {
  const hasLongDescription =
    Array.isArray(service.longDescription) && service.longDescription.length > 0
  const hasHighlights =
    Array.isArray(service.highlights) && service.highlights.length > 0

  return (
    <article className={styles.article}>
      {/* Hero — 55vh full-bleed with optional parallax image */}
      <ServiceHero
        name={service.name}
        image={service.image ?? null}
        icon={service.icon ?? null}
      />

      {/* Breadcrumb bar */}
      <div className={styles.breadcrumbBar}>
        <Breadcrumb items={breadcrumb} />
      </div>

      {/* Page header: service name + short description */}
      <FadeIn>
        <header className={styles.header}>
          {service.icon && (
            <span className={styles.icon} aria-hidden="true">
              {service.icon}
            </span>
          )}
          <h1 className={styles.name}>{service.name}</h1>
          <p className={styles.shortDescription}>{service.shortDescription}</p>
        </header>
      </FadeIn>

      {/* Body: long description + highlights */}
      {(hasLongDescription || hasHighlights) && (
        <FadeIn delay={0.1}>
          <div className={styles.body}>
            {hasLongDescription && (
              <ServiceContent blocks={service.longDescription!} />
            )}
            {hasHighlights && (
              <ServiceHighlights
                highlights={service.highlights!}
                heading={highlightsHeading}
              />
            )}
          </div>
        </FadeIn>
      )}
    </article>
  )
}
