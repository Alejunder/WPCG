import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { Locale } from '@/config/i18n'

// ---------------------------------------------------------------------------
// Automatic confirmation — delivered to the customer after a valid submission.
// Locale-aware copy lives here (self-contained); presentation only.
// ---------------------------------------------------------------------------

export interface ConfirmationEmailProps {
  name: string
  subject: string
  locale: Locale
}

const BRAND = {
  page: '#f4f2ee',
  card: '#ffffff',
  ink: '#1d1a15',
  muted: '#6b6b6b',
  accent: '#B4B346',
  border: '#e7e3db',
} as const

const COPY: Record<
  Locale,
  {
    preview: string
    greeting: (name: string) => string
    received: string
    subjectLabel: string
    soon: string
    signoff: string
    team: string
  }
> = {
  en: {
    preview: 'Thanks for reaching out — we’ve received your message.',
    greeting: (name) => `Hi ${name},`,
    received:
      'Thank you for contacting WPCG. We’ve received your message and it has reached our team.',
    subjectLabel: 'Your subject',
    soon: 'We typically reply within 24 hours on business days. We’ll be in touch shortly.',
    signoff: 'Warm regards,',
    team: 'The WPCG Team',
  },
  es: {
    preview: 'Gracias por escribirnos — hemos recibido tu mensaje.',
    greeting: (name) => `Hola ${name}:`,
    received:
      'Gracias por contactar con WPCG. Hemos recibido tu mensaje y ya ha llegado a nuestro equipo.',
    subjectLabel: 'Tu asunto',
    soon: 'Normalmente respondemos en menos de 24 horas en días laborables. Nos pondremos en contacto contigo muy pronto.',
    signoff: 'Un cordial saludo,',
    team: 'El equipo de WPCG',
  },
}

export default function ConfirmationEmail({ name, subject, locale }: ConfirmationEmailProps) {
  const copy = COPY[locale] ?? COPY.en

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>WPCG</Text>
            <Text style={styles.kicker}>Architecture &amp; Interior Design · Madrid</Text>
          </Section>

          <Section style={styles.card}>
            <Heading as="h1" style={styles.heading}>
              {copy.greeting(name)}
            </Heading>
            <Text style={styles.paragraph}>{copy.received}</Text>

            <Section style={styles.subjectBox}>
              <Text style={styles.subjectLabel}>{copy.subjectLabel}</Text>
              <Text style={styles.subjectValue}>{subject}</Text>
            </Section>

            <Text style={styles.paragraph}>{copy.soon}</Text>

            <Hr style={styles.hr} />

            <Text style={styles.signoff}>{copy.signoff}</Text>
            <Text style={styles.team}>{copy.team}</Text>
          </Section>

          <Text style={styles.footer}>
            WPCG — Work Place Consulting Group · Madrid
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: BRAND.page,
    margin: 0,
    padding: '32px 0',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: { maxWidth: '600px', margin: '0 auto', padding: '0 16px' },
  header: { padding: '4px 4px 20px' },
  brand: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '4px',
    color: BRAND.ink,
  },
  kicker: {
    margin: '4px 0 0',
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    color: BRAND.accent,
    fontWeight: 700,
  },
  card: {
    backgroundColor: BRAND.card,
    border: `1px solid ${BRAND.border}`,
    borderTop: `3px solid ${BRAND.accent}`,
    borderRadius: '4px',
    padding: '28px',
  },
  heading: { margin: '0 0 14px', fontSize: '20px', fontWeight: 700, color: BRAND.ink },
  paragraph: { margin: '0 0 16px', fontSize: '15px', lineHeight: '1.7', color: BRAND.ink },
  subjectBox: {
    backgroundColor: BRAND.page,
    borderRadius: '4px',
    padding: '14px 16px',
    margin: '0 0 16px',
  },
  subjectLabel: {
    margin: '0 0 4px',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: BRAND.muted,
  },
  subjectValue: { margin: 0, fontSize: '15px', fontWeight: 600, color: BRAND.ink },
  hr: { borderColor: BRAND.border, margin: '20px 0' },
  signoff: { margin: '0 0 2px', fontSize: '15px', color: BRAND.ink },
  team: { margin: 0, fontSize: '15px', fontWeight: 700, color: BRAND.ink },
  footer: {
    margin: '20px 0 0',
    textAlign: 'center' as const,
    fontSize: '11px',
    color: BRAND.muted,
  },
} as const
