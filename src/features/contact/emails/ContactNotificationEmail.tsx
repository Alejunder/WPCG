import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components'

// ---------------------------------------------------------------------------
// Internal enquiry notification — delivered to the company inbox.
// Pure presentation: receives already-validated, plain data as props.
// ---------------------------------------------------------------------------

export interface ContactNotificationEmailProps {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  submittedAt: Date
}

const BRAND = {
  page: '#f4f2ee',
  card: '#ffffff',
  ink: '#1d1a15',
  muted: '#6b6b6b',
  accent: '#B4B346',
  border: '#e7e3db',
} as const

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Madrid',
})

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Row style={styles.detailRow}>
      <Column style={styles.labelCol}>
        <Text style={styles.label}>{label}</Text>
      </Column>
      <Column>
        <Text style={styles.value}>{value}</Text>
      </Column>
    </Row>
  )
}

export default function ContactNotificationEmail({
  name,
  email,
  phone,
  company,
  subject,
  message,
  submittedAt,
}: ContactNotificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`New enquiry from ${name} — ${subject}`}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>WPCG</Text>
            <Text style={styles.kicker}>New project enquiry</Text>
          </Section>

          <Section style={styles.card}>
            <Heading as="h1" style={styles.heading}>
              {subject}
            </Heading>

            <DetailRow label="Name" value={name} />
            <DetailRow label="Email" value={email} />
            <DetailRow label="Phone" value={phone || '—'} />
            <DetailRow label="Company" value={company || '—'} />
            <DetailRow label="Received" value={dateFormatter.format(submittedAt)} />

            <Hr style={styles.hr} />

            <Text style={styles.messageLabel}>Message</Text>
            <Text style={styles.message}>{message}</Text>

            <Hr style={styles.hr} />

            <Text style={styles.replyHint}>
              Reply directly to this email to reach{' '}
              <Link href={`mailto:${email}`} style={styles.link}>
                {name}
              </Link>
              .
            </Text>
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
    borderLeft: `3px solid ${BRAND.accent}`,
    borderRadius: '4px',
    padding: '28px 28px 24px',
  },
  heading: { margin: '0 0 20px', fontSize: '20px', fontWeight: 700, color: BRAND.ink },
  detailRow: { marginBottom: '2px' },
  labelCol: { width: '120px', verticalAlign: 'top' as const },
  label: {
    margin: '6px 0',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: BRAND.muted,
  },
  value: { margin: '6px 0', fontSize: '15px', color: BRAND.ink },
  hr: { borderColor: BRAND.border, margin: '20px 0' },
  messageLabel: {
    margin: '0 0 8px',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: BRAND.muted,
  },
  message: {
    margin: 0,
    fontSize: '15px',
    lineHeight: '1.7',
    color: BRAND.ink,
    whiteSpace: 'pre-wrap' as const,
  },
  replyHint: { margin: 0, fontSize: '13px', color: BRAND.muted },
  link: { color: BRAND.accent, fontWeight: 600, textDecoration: 'none' },
  footer: {
    margin: '20px 0 0',
    textAlign: 'center' as const,
    fontSize: '11px',
    color: BRAND.muted,
  },
} as const
