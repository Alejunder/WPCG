import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// Upstash Redis fixed-window rate limiter (5 requests / IP / hour).
//
// - State is durable across serverless invocations (not in-memory).
// - Lazily instantiated so the module can be imported without Upstash env
//   configured (e.g. local dev, tests) — in that case limiting is disabled.
// - Fails OPEN on Redis errors: a transient limiter outage must not block
//   legitimate contact submissions.
// ---------------------------------------------------------------------------

let ratelimit: Ratelimit | null = null

function getRateLimiter(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.fixedWindow(5, '1 h'),
      analytics: false,
      prefix: 'wpcg:contact',
    })
  }
  return ratelimit
}

/** Returns `true` when the IP has exceeded the allowed request rate. */
export async function isRateLimited(ip: string): Promise<boolean> {
  const limiter = getRateLimiter()
  if (!limiter) return false

  try {
    const { success } = await limiter.limit(ip)
    return !success
  } catch (error) {
    console.error('[contact.rateLimit] limiter unavailable — failing open', error)
    return false
  }
}
