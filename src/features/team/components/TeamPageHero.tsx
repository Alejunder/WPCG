import Image from 'next/image'
import Breadcrumb from '@/features/shared/components/Breadcrumb'
import FadeIn from '@/features/shared/motion/FadeIn'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import type { Locale } from '@/config/i18n'
import type { TeamPageImage } from '@/features/team/types'
import styles from './TeamPageHero.module.css'

interface TeamPageHeroProps {
  locale: Locale
  title?: string | null
  sub?: string | null
  heroImage?: TeamPageImage | null
  breadcrumbHomeLabel: string
  breadcrumbTeamLabel: string
}

const HOME_HREF: Record<Locale, string> = {
  en: '/en',
  es: '/es',
}

export default function TeamPageHero({
  locale,
  title,
  sub,
  heroImage,
  breadcrumbHomeLabel,
  breadcrumbTeamLabel,
}: TeamPageHeroProps) {
  const displayTitle = title ?? breadcrumbTeamLabel

  return (
    <section className={styles.hero} aria-label={displayTitle}>
      {heroImage?.url && (
        <div className={styles.imageWrapper} aria-hidden="true">
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
          <div className={styles.overlay} />
        </div>
      )}

      <div className={styles.inner}>
        <div className={styles.content}>
          <FadeIn delay={0} className={styles.breadcrumb}>
            <Breadcrumb
              items={[
                { label: breadcrumbHomeLabel, href: HOME_HREF[locale] },
                { label: breadcrumbTeamLabel },
              ]}
            />
          </FadeIn>

          <FadeIn delay={0.12}>
            <h1 className={styles.title}>{displayTitle}</h1>
          </FadeIn>

          {sub && (
            <FadeIn delay={0.24}>
              <p className={styles.sub}>{sub}</p>
            </FadeIn>
          )}
        </div>
      </div>
      <AnimatedDivider className={styles.bottomDivider} delay={0.3} />
    </section>
  )
}
