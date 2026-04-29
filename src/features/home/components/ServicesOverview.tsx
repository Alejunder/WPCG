import TransitionLink from '@/features/shared/motion/TransitionLink'
import FadeIn from '@/features/shared/motion/FadeIn'
import type { Locale } from '@/config/i18n'
import type { ServiceCard } from '@/features/services/types'
import styles from './ServicesOverview.module.css'

interface ServicesOverviewProps {
  locale: Locale
  services: ServiceCard[]
  heading: string
  exploreLabel: string
}

export default function ServicesOverview({ locale, services, heading, exploreLabel }: ServicesOverviewProps) {
  return (
    <section className={styles.section} aria-label="Services overview">
      <FadeIn enableExit>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow} aria-hidden="true">02</span>
            <h2 className={styles.heading}>{heading}</h2>
          </div>

          <div className={styles.grid} role="list">
            {services.map((service, i) => (
              <FadeIn key={service.slug.current} delay={i * 0.12}>
                <article role="listitem" className={styles.card}>
                  <span className={styles.cardNumber} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={styles.cardTitle}>{service.name}</h3>
                  <p className={styles.cardDesc}>{service.shortDescription}</p>
                  <TransitionLink
                    href={`/${locale}/services/${service.slug.current}`}
                    className={styles.cardLink}
                    aria-label={`${exploreLabel} ${service.name}`}
                  >
                    {exploreLabel}
                    <span className={styles.cardArrow} aria-hidden="true">→</span>
                  </TransitionLink>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
