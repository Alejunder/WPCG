import { Resend } from 'resend'
import type { ContactFormData } from '@/features/contact/schemas/contact.schema'

const PROJECT_TYPE_LABELS: Record<ContactFormData['projectType'], string> = {
  office: 'Office',
  residential: 'Residential',
  retail: 'Retail',
  other: 'Other',
}

function sanitize(value: string): string {
  return value.replace(/[<>]/g, '')
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL_TO
  const from = process.env.CONTACT_EMAIL_FROM

  if (!apiKey) throw new Error('[sendContactEmail] Missing required env var: RESEND_API_KEY')
  if (!to) throw new Error('[sendContactEmail] Missing required env var: CONTACT_EMAIL_TO')
  if (!from) throw new Error('[sendContactEmail] Missing required env var: CONTACT_EMAIL_FROM')

  const resend = new Resend(apiKey)

  const name = sanitize(data.name)
  const email = sanitize(data.email)
  const company = data.company ? sanitize(data.company) : '—'
  const phone = data.phone ? sanitize(data.phone) : '—'
  const projectType = PROJECT_TYPE_LABELS[data.projectType]
  const message = sanitize(data.message)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1D1A15;">
      <div style="background: #1D1A15; padding: 24px 32px; margin-bottom: 0;">
        <h1 style="color: #C3A466; margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">
          New Project Enquiry
        </h1>
      </div>
      <div style="background: #23221F; padding: 32px; border-left: 3px solid #C3A466;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; width: 140px; vertical-align: top;">Name</td>
            <td style="padding: 10px 0; color: #BABDBE; font-size: 15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Email</td>
            <td style="padding: 10px 0; color: #BABDBE; font-size: 15px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Phone</td>
            <td style="padding: 10px 0; color: #BABDBE; font-size: 15px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Company</td>
            <td style="padding: 10px 0; color: #BABDBE; font-size: 15px;">${company}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Project Type</td>
            <td style="padding: 10px 0; color: #C3A466; font-size: 15px; font-weight: bold;">${projectType}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #4C3E24;">
          <p style="color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Message</p>
          <p style="color: #BABDBE; font-size: 15px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
      </div>
      <div style="background: #1D1A15; padding: 16px 32px; text-align: center;">
        <p style="color: #4C3E24; font-size: 11px; margin: 0;">WPCG — Work Place Consulting Group</p>
      </div>
    </div>
  `

  const text = [
    'NEW PROJECT ENQUIRY — WPCG',
    '----------------------------',
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Phone:        ${phone}`,
    `Company:      ${company}`,
    `Project Type: ${projectType}`,
    '',
    'Message:',
    message,
  ].join('\n')

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: 'New contact — WPCG',
    html,
    text,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
