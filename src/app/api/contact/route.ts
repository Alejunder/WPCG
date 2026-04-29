import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { ContactFormSchema } from '@/features/contact/schemas/contact.schema'
import { sendContactEmail } from '@/lib/email/sendContactEmail'

// ---------------------------------------------------------------------------
// Upstash Redis rate limiter — persists across serverless invocations.
// Limits to 5 requests per IP per hour using a fixed window algorithm.
//
// Required environment variables (server-only — never NEXT_PUBLIC_*):
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// ---------------------------------------------------------------------------

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, '1 h'),
  analytics: false,
  prefix: 'wpcg:contact',
})

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

function validateInput(body: unknown) {
  const result = ContactFormSchema.safeParse(body)
  if (!result.success) {
    return { ok: false as const, errors: result.error.flatten().fieldErrors }
  }
  return { ok: true as const, data: result.data }
}

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limit
  const ip = getClientIp(request)
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  // 2. Parse + validate input
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 },
    )
  }

  const validation = validateInput(body)
  if (!validation.ok) {
    return NextResponse.json(
      { success: false, error: 'Validation failed.', errors: validation.errors },
      { status: 422 },
    )
  }

  // 3. Send email
  try {
    await sendContactEmail(validation.data)
  } catch (err) {
    console.error('[contact/route] sendEmail failed', err)
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 },
    )
  }

  // 4. (Future) Save to database / CRM
  // await saveToDatabase(validation.data)

  return NextResponse.json({ success: true }, { status: 200 })
}
