import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import FadeIn from '@/features/shared/motion/FadeIn'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import SectionWrapper from '@/features/shared/components/SectionWrapper'
import LayoutContainer from '@/features/shared/components/LayoutContainer'
import SketchCarousel from '@/features/sketches/components/SketchCarousel'
import type { Sketch } from '@/features/sketches/types'
import type { Locale } from '@/config/i18n'
import styles from './HomepageSketchesSection.module.css'

interface HomepageSketchesSectionProps {
  sketches: Sketch[]
  locale: Locale
}

export default async function HomepageSketchesSection({
  sketches,
  locale,
}: HomepageSketchesSectionProps) {
  if (sketches.length === 0) return null

  const t = await getTranslations('HomePage')

  return (
    <SectionWrapper className={styles.section} aria-label={t('sketchesHeading')}>
      <AnimatedDivider className={styles.topDivider} />
      <FadeIn enableExit>
        <LayoutContainer className={styles.inner}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow} aria-hidden="true">04</span>
            <div className={styles.headerRow}>
              <h2 className={styles.heading}>{t('sketchesHeading')}</h2>
              <Link
                href={`/${locale}/sketches`}
                className={styles.viewAll}
                transitionTypes={['nav-forward']}
              >
                {t('sketchesViewAll')}
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </div>

          <SketchCarousel sketches={sketches} locale={locale} />
        </LayoutContainer>
      </FadeIn>
    </SectionWrapper>
  )
}
