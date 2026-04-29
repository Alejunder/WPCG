import type { Locale } from '@/config/i18n'
import type { ServicesPageData, ServiceCard } from '@/features/services/types'
import ServicesGrid from './ServicesGrid'
import ProcessSection from './ProcessSection'
import styles from './ServicesPageContent.module.css'

interface ServicesPageContentProps {
  locale: Locale
  page: ServicesPageData
  /** Fallback flat service list when the page singleton has no services[] configured. */
  fallbackServices?: ServiceCard[]
}

const PROCESS_HEADING: Record<Locale, string> = {
  en: 'Our Process',
  es: 'Nuestro Proceso',
}

const SECTION_HEADING: Record<Locale, string> = {
  en: 'Our Services',
  es: 'Nuestros Servicios',
}

/**
 * Server component — composes all content sections for the Services page.
 * Receives fully validated data from the page; performs no data fetching.
 */
export default function ServicesPageContent({
  locale,
  page,
  fallbackServices = [],
}: ServicesPageContentProps) {
  // Resolve service cards from the page singleton or the fallback list
  const services: ServiceCard[] = (page.services ?? []).length > 0
    ? (page.services ?? []).map((svc) => ({
        name: svc.name,
        slug: svc.slug,
        shortDescription: svc.shortDescription,
        icon: svc.icon,
        image: svc.image,
      }))
    : fallbackServices

  const processSteps = page.processSteps ?? []

  return (
    <>
      {/* Services grid section */}
      <section className={styles.gridSection} aria-labelledby="services-grid-heading">
        <div className={styles.inner}>
          <h2 id="services-grid-heading" className={styles.sectionHeading}>
            {SECTION_HEADING[locale]}
          </h2>
          <ServicesGrid services={services} locale={locale} />
        </div>
      </section>

      {/* Process steps section (only rendered when steps exist) */}
      {processSteps.length > 0 && (
        <ProcessSection steps={processSteps} heading={PROCESS_HEADING[locale]} />
      )}
    </>
  )
}
