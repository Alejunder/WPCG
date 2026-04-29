import Image from 'next/image'
import Breadcrumb from '@/features/shared/components/Breadcrumb'
import FadeIn from '@/features/shared/motion/FadeIn'
import type { Locale } from '@/config/i18n'
import type { AboutImage } from '@/features/about/types'
import styles from './AboutHero.module.css'

interface AboutHeroProps {
  locale: Locale
  heroImage?: AboutImage | null
  title?: string | null
  intro?: string | null
}

const CONTENT: Record<Locale, { defaultTitle: string; home: string; about: string }> = {
  en: { defaultTitle: 'About Us', home: 'Home', about: 'About' },
  es: { defaultTitle: 'Sobre Nosotros', home: 'Inicio', about: 'Nosotros' },
}

const HREF: Record<Locale, string> = {
  en: '/en',
  es: '/es',
}

export default function AboutHero({ locale, heroImage, title, intro }: AboutHeroProps) {
  const c = CONTENT[locale]
  const displayTitle = title ?? c.defaultTitle

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
                { label: c.home, href: HREF[locale] },
                { label: c.about },
              ]}
            />
          </FadeIn>

          <FadeIn delay={0.12}>
            <h1 className={styles.title}>{displayTitle}</h1>
          </FadeIn>

          {intro && (
            <FadeIn delay={0.24}>
              <p className={styles.intro}>{intro}</p>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
