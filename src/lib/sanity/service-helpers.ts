import { z } from 'zod'
import { sanityClient } from './client'
import { ServiceError } from '@/lib/errors/service-error'
import type { ErrorCode } from '@/lib/errors/service-error'

/**
 * Creates a pair of private helpers (`validate` and `fetchFromSanity`) scoped
 * to a feature tag so log output is easy to trace (e.g. `[projects.service]`).
 *
 * Usage in each service file:
 *   const { validate, fetchFromSanity } = createServiceHelpers('projects.service')
 */
export function createServiceHelpers(tag: string) {
  function validate<T>(schema: z.ZodType<T>, raw: unknown, operation: string): T {
    const result = schema.safeParse(raw)
    if (!result.success) {
      const error = new ServiceError(
        `Validation failed in ${operation}`,
        'VALIDATION_ERROR',
        { errors: result.error.flatten() },
      )
      console.error(`[${tag}] ${operation}`, { code: error.code, context: error.context })
      throw error
    }
    return result.data
  }

  async function fetchFromSanity<T>(
    fn: string,
    query: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    try {
      return await sanityClient.fetch<T>(query, params ?? {})
    } catch (originalError) {
      const error = new ServiceError(
        'Failed to fetch data from Sanity',
        'FETCH_ERROR' satisfies ErrorCode,
        { originalError },
      )
      console.error(`[${tag}] ${fn}`, { code: error.code, context: error.context })
      throw error
    }
  }

  return { validate, fetchFromSanity }
}
