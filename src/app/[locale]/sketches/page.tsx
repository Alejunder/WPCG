import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/config/i18n'
import { getAllSketches } from '@/features/sketches/services/sketches.service'
import FadeIn from '@/features/shared/motion/FadeIn'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import SectionWrapper from '@/features/shared/components/SectionWrapper'
import LayoutContainer from '@/features/shared/components/LayoutContainer'
import CtaBanner from '@/features/shared/components/CtaBanner'
import SketchCarousel from '@/features/sketches/components/SketchCarousel'
import styles from './page.module.css'

// ---------------------------------------------------------------------------
// ISR — revalidate every hour like other content pages
// ---------------------------------------------------------------------------
export const revalidate = 3600

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: Locale }>
}


const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Sketches | WPCG Architecture & Interior Design',
    description:
      'A look inside the WPCG studio — hand-drawn sketches that capture the first moment of every project, before the lines go digital.',
  },
  es: {
    title: 'Bocetos | WPCG Arquitectura y Diseño',
    description:
      'Una mirada al interior del estudio WPCG — bocetos a mano que capturan el primer momento de cada proyecto, antes de que las líneas se vuelvan digitales.',
  },
}

const ROUTES: Record<Locale, string> = {
  en: '/en/sketches',
  es: '/es/sketches',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = META[locale]
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: ROUTES[locale],
      languages: {
        en: ROUTES.en,
        es: ROUTES.es,
        'x-default': ROUTES.en,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'WPCG — Architecture & Interior Design, Madrid' }],
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function SketchesPage({ params }: PageProps) {
  const { locale } = await params
  const [sketches, t] = await Promise.all([
    getAllSketches(locale),
    getTranslations({ locale, namespace: 'SketchesPage' }),
  ])

  const ctaDefaults = {
    en: {
      headline: 'Ready to go from sketch to reality?',
      sub: "Let\u2019s talk about your project.",
      buttonLabel: 'Get in touch',
    },
    es: {
      headline: '¿Listo para pasar del boceto a la realidad?',
      sub: 'Hablemos de tu proyecto.',
      buttonLabel: 'Contáctanos',
    },
  }[locale]

  return (
    <main className={styles.page}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <SectionWrapper spacing="sm" className={styles.hero}>
        <LayoutContainer>
          <FadeIn>
            <span className={styles.eyebrow} aria-hidden="true">
              {t('eyebrow')}
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className={styles.heading}>{t('heading')}</h1>
          </FadeIn>
          <AnimatedDivider className={styles.divider} delay={0.2} />
          <FadeIn delay={0.3}>
            <p className={styles.intro}>{t('intro')}</p>
          </FadeIn>
        </LayoutContainer>
      </SectionWrapper>

      {/* ── Moodboard grid ───────────────────────────────── */}
      {sketches.length > 0 && (
        <>
          <AnimatedDivider className={styles.boardDivider} delay={0.1} />
          <SectionWrapper spacing="default" className={styles.boardSection}>
            <LayoutContainer>
                <SketchCarousel sketches={sketches} locale={locale} />
              </LayoutContainer>
          </SectionWrapper>
        </>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <CtaBanner
        variant="compact"
        headline={ctaDefaults.headline}
        sub={ctaDefaults.sub}
        buttonLabel={ctaDefaults.buttonLabel}
        href={`/${locale}/contact`}
      />
    </main>
  )
}
