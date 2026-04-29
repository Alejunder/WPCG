import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'
import { ServiceError } from '@/lib/errors/service-error'

// ---------------------------------------------------------------------------
// Mock sanityClient before loading the module under test.
// ---------------------------------------------------------------------------

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from '@/lib/sanity/client'
import { createServiceHelpers } from '../service-helpers'

const fetchMock = vi.mocked(sanityClient.fetch)

// ---------------------------------------------------------------------------
// Silence console.error output (service-helpers logs on errors)
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const SimpleSchema = z.object({
  id: z.number().int().positive(),
  label: z.string().min(1),
})

const validData = { id: 1, label: 'Test label' }
const invalidData = { id: -1, label: '' }     // violates both constraints
const wrongTypeData = { id: 'not-a-number' }  // type mismatch

// ---------------------------------------------------------------------------
// validate()
// ---------------------------------------------------------------------------

describe('createServiceHelpers › validate', () => {
  const { validate } = createServiceHelpers('test.service')

  it('returns the parsed result when data is valid', () => {
    const result = validate(SimpleSchema, validData, 'testOperation')

    expect(result).toEqual(validData)
  })

  it('throws ServiceError with VALIDATION_ERROR for invalid, null, mistyped, or missing input', () => {
    const cases = [invalidData, wrongTypeData, null, undefined] as const
    for (const input of cases) {
      let caught: unknown
      try { validate(SimpleSchema, input, 'testOperation') } catch (err) { caught = err }
      expect(caught).toBeInstanceOf(ServiceError)
      expect((caught as ServiceError).code).toBe('VALIDATION_ERROR')
    }
  })

  it('includes a context object on the thrown ServiceError', () => {
    let caught: unknown
    try {
      validate(SimpleSchema, invalidData, 'testOperation')
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).context).toBeDefined()
  })

  it('works independently for each createServiceHelpers call (scoped tag)', () => {
    const { validate: validateA } = createServiceHelpers('feature.a')
    const { validate: validateB } = createServiceHelpers('feature.b')

    // Both should parse correctly — tags are just labels, logic is identical
    expect(validateA(SimpleSchema, validData, 'op')).toEqual(validData)
    expect(validateB(SimpleSchema, validData, 'op')).toEqual(validData)
  })
})

// ---------------------------------------------------------------------------
// fetchFromSanity()
// ---------------------------------------------------------------------------

describe('createServiceHelpers › fetchFromSanity', () => {
  const { fetchFromSanity } = createServiceHelpers('test.service')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the data resolved by sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce({ id: 42 })

    const result = await fetchFromSanity<{ id: number }>('op', '*[_type == "test"]')

    expect(result).toEqual({ id: 42 })
  })

  it('forwards the query string to sanityClient.fetch', async () => {
    const query = '*[_type == "service"]'
    fetchMock.mockResolvedValueOnce([])

    await fetchFromSanity<unknown[]>('op', query)

    expect(fetchMock).toHaveBeenCalledWith(query, expect.anything())
  })

  it('forwards params to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce(null)

    await fetchFromSanity<null>('op', '*[_type == "test"]', { locale: 'es' })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'es' }),
    )
  })

  it('passes an empty params object when params is omitted', async () => {
    fetchMock.mockResolvedValueOnce(null)

    await fetchFromSanity<null>('op', '*[_type == "test"]')

    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {})
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'))

    const caught = await fetchFromSanity('op', '*[_type == "test"]').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('wraps the original error in the ServiceError context', async () => {
    const originalError = new Error('Original network error')
    fetchMock.mockRejectedValueOnce(originalError)

    let caught: unknown
    try {
      await fetchFromSanity('op', '*[_type == "test"]')
    } catch (err) {
      caught = err
    }

    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).context).toMatchObject({ originalError })
  })
})
