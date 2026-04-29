import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ServiceError } from '@/lib/errors/service-error'

// ---------------------------------------------------------------------------
// Mock sanityClient before any module that depends on it is loaded.
// ---------------------------------------------------------------------------

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from '@/lib/sanity/client'
import { getHomePage } from '../services/home.service'

const fetchMock = vi.mocked(sanityClient.fetch)

// ---------------------------------------------------------------------------
// Silence console.error output (service-helpers logs on validation errors)
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Shared fixtures — minimal shape that satisfies HomePageSchema
// ---------------------------------------------------------------------------

const validHomePage = {
  heroImages: [{ url: 'https://cdn.sanity.io/images/hero.jpg', alt: '' }],
  aboutExcerpt: 'We design remarkable spaces.',
  featuredProjects: [],
  clients: [],
}

// ---------------------------------------------------------------------------
// getHomePage
// ---------------------------------------------------------------------------

describe('getHomePage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns an object that satisfies HomePageSchema on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce(validHomePage)

    const result = await getHomePage('en')

    expect(result).not.toBeNull()
    expect(Array.isArray(result?.heroImages)).toBe(true)
    expect(Array.isArray(result?.featuredProjects)).toBe(true)
    expect(Array.isArray(result?.clients)).toBe(true)
  })

  it('returns null when Sanity returns null (homePage document not published)', async () => {
    fetchMock.mockResolvedValueOnce(null)

    const result = await getHomePage('en')

    expect(result).toBeNull()
  })

  it('forwards the locale parameter to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce(validHomePage)

    await getHomePage('es')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'es' }),
    )
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'))

    const err = await getHomePage('en').catch((e: unknown) => e)
    expect(err).toBeInstanceOf(ServiceError)
    expect((err as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('throws ServiceError with VALIDATION_ERROR when the response does not match the schema', async () => {
    fetchMock.mockResolvedValueOnce({ clients: [{ url: 'not-a-url' }] })

    await expect(getHomePage('en')).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
    })
  })
})
