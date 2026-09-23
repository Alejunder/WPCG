import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import FadeIn from '@/features/shared/motion/FadeIn'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import type { Locale } from '@/config/i18n'
import type { AboutExcerptContent } from '@/features/home/types'
import SectionWrapper from '@/features/shared/components/SectionWrapper'
import styles from './AboutExcerpt.module.css'

interface AboutExcerptProps {
  text: AboutExcerptContent
  locale: Locale
}

const aboutPortableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={styles.body}>{children}</p>,
  },
  marks: {
    highlight: ({ children }) => <span className={styles.highlight}>{children}</span>,
  },
}

export default async function AboutExcerpt({ text, locale }: AboutExcerptProps) {
  const t = await getTranslations('HomePage')
  const isPortableText = Array.isArray(text)

  return (
    <SectionWrapper className={styles.section} aria-label="About excerpt">
      <AnimatedDivider className={styles.topDivider} />
      <FadeIn enableExit>
        <div className={styles.inner}>
          <AnimatedDivider orientation="vertical" className={styles.decorCol} delay={0.3} />
          <div className={styles.textCol}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.eyebrow} aria-hidden="true">01</h1>
              <span className={styles.label}>{t('aboutLabel')}</span>
            </div>
            <h2 className={styles.heading}>
              {t.rich('aboutHeading', {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </h2>
            {isPortableText ? (
              <PortableText value={text} components={aboutPortableComponents} />
            ) : (
              <p className={styles.body}>{text}</p>
            )}

            <Link href={`/${locale}/about`} className={styles.cta} transitionTypes={['nav-forward']}>
              {t('aboutCta')}
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  )
}
