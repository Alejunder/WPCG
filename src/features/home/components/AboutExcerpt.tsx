import { getTranslations } from 'next-intl/server'
import TransitionLink from '@/features/shared/motion/TransitionLink'
import FadeIn from '@/features/shared/motion/FadeIn'
import type { Locale } from '@/config/i18n'
import styles from './AboutExcerpt.module.css'

interface AboutExcerptProps {
  text: string
  locale: Locale
}

export default async function AboutExcerpt({ text, locale }: AboutExcerptProps) {
  const t = await getTranslations('HomePage')

  return (
    <section className={styles.section} aria-label="About excerpt">
      <FadeIn enableExit>
        <div className={styles.inner}>
          <div className={styles.decorCol} aria-hidden="true" />

          <div className={styles.textCol}>
            <span className={styles.label}>{t('aboutLabel')}</span>

            <h2 className={styles.heading}>
              {t.rich('aboutHeading', {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </h2>

            <p className={styles.body}>{text}</p>

            <TransitionLink href={`/${locale}/about`} className={styles.cta}>
              {t('aboutCta')}
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </TransitionLink>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
