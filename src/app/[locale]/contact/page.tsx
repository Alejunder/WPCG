import type { Metadata } from 'next'
import type { Locale } from '@/config/i18n'
import { getContactInfo } from '@/features/contact/services/contact.service'
import ContactHero from '@/features/contact/components/ContactHero'
import ContactForm from '@/features/contact/components/ContactForm'
import ContactInfo from '@/features/contact/components/ContactInfo'
import styles from './page.module.css'

export const revalidate = 3600

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: Locale }>
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: 'Contact | WPCG Architecture & Interior Design',
    description:
      'Get in touch with WPCG. Tell us about your project and our team will respond within 24 hours.',
  },
  es: {
    title: 'Contacto | WPCG Arquitectura y Diseño',
    description:
      'Contacta con WPCG. Cuéntanos tu proyecto y nuestro equipo te responderá en menos de 24 horas.',
  },
}

const routes: Record<Locale, string> = {
  en: '/en/contact',
  es: '/es/contacto',
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
      canonical: routes[locale],
      languages: {
        en: routes.en,
        es: routes.es,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params

  // Info panel data — fail gracefully if CMS data is absent
  const info = await getContactInfo(locale).catch(() => null)

  return (
    <main className={styles.page}>
      <ContactHero locale={locale} />

      <section className={styles.split}>
        <div className={styles.formColumn}>
          <ContactForm />
        </div>
        <div className={styles.infoColumn}>
          <ContactInfo info={info} />
        </div>
      </section>
    </main>
  )
}
