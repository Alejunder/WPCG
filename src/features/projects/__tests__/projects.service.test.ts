import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ServiceError } from '@/lib/errors/service-error'

// ---------------------------------------------------------------------------
// Mock sanityClient before any module that depends on it is loaded.
// ---------------------------------------------------------------------------

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from '@/lib/sanity/client'
import {
  getAllProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getAllProjectSlugs,
} from '../services/projects.service'

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
// Shared fixtures — minimal shapes that satisfy the Zod schemas
// ---------------------------------------------------------------------------

const validImage = { url: 'https://cdn.sanity.io/images/test.jpg', alt: 'Office space' }

const validCard = {
  title: 'Tower Office',
  slug: { current: 'tower-office' },
  category: 'office',
  heroImage: validImage,
}

const validProject = {
  ...validCard,
  heroImage: validImage,
}

// ---------------------------------------------------------------------------
// getAllProjects
// ---------------------------------------------------------------------------

describe('getAllProjects', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns an array of project cards on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce([validCard])

    const result = await getAllProjects('en')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Tower Office')
  })

  it('returns an empty array when Sanity returns an empty array', async () => {
    fetchMock.mockResolvedValueOnce([])
    expect(await getAllProjects('en')).toEqual([])
  })

  it('forwards the locale parameter to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce([])
    await getAllProjects('es')
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ locale: 'es' }))
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'))
    const caught = await getAllProjects('en').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('throws ServiceError with VALIDATION_ERROR when data fails schema validation', async () => {
    // Missing required heroImage
    fetchMock.mockResolvedValueOnce([{ title: 'Bad', slug: { current: 'bad' }, category: 'office' }])
    const caught = await getAllProjects('en').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('VALIDATION_ERROR')
  })
})

// ---------------------------------------------------------------------------
// getProjectBySlug
// ---------------------------------------------------------------------------

describe('getProjectBySlug', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns parsed Project when Sanity returns a matching document', async () => {
    fetchMock.mockResolvedValueOnce(validProject)

    const result = await getProjectBySlug('en', 'tower-office')

    expect(result).not.toBeNull()
    expect(result?.title).toBe('Tower Office')
    expect(result?.slug.current).toBe('tower-office')
  })

  it('returns null when Sanity returns null (document not found)', async () => {
    fetchMock.mockResolvedValueOnce(null)
    expect(await getProjectBySlug('en', 'unknown-slug')).toBeNull()
  })

  it('forwards both locale and slug parameters to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce(validProject)
    await getProjectBySlug('es', 'tower-office')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'es', slug: 'tower-office' }),
    )
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Timeout'))
    const caught = await getProjectBySlug('en', 'tower-office').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('throws ServiceError with VALIDATION_ERROR when the returned document is invalid', async () => {
    // Missing required heroImage and category
    fetchMock.mockResolvedValueOnce({ title: 'Bad', slug: { current: 'bad' } })
    const caught = await getProjectBySlug('en', 'bad').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('VALIDATION_ERROR')
  })
})

// ---------------------------------------------------------------------------
// getFeaturedProjects
// ---------------------------------------------------------------------------

describe('getFeaturedProjects', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns an array of project cards on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce([validCard])
    const result = await getFeaturedProjects('en')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Tower Office')
  })

  it('returns an empty array when Sanity returns an empty array', async () => {
    fetchMock.mockResolvedValueOnce([])
    expect(await getFeaturedProjects('en')).toEqual([])
  })

  it('forwards the locale parameter to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce([])
    await getFeaturedProjects('es')
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ locale: 'es' }))
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Connection refused'))
    const caught = await getFeaturedProjects('en').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('throws ServiceError with VALIDATION_ERROR when a card fails schema validation', async () => {
    // Invalid category value
    fetchMock.mockResolvedValueOnce([{ ...validCard, category: 'hotel' }])
    const caught = await getFeaturedProjects('en').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('VALIDATION_ERROR')
  })
})

// ---------------------------------------------------------------------------
// getAllProjectSlugs
// ---------------------------------------------------------------------------

describe('getAllProjectSlugs', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns an array of slug strings on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce([
      { slug: { current: 'tower-office' } },
      { slug: { current: 'river-loft' } },
    ])

    const result = await getAllProjectSlugs()

    expect(result).toEqual(['tower-office', 'river-loft'])
  })

  it('returns an empty array when Sanity returns no slugs', async () => {
    fetchMock.mockResolvedValueOnce([])
    expect(await getAllProjectSlugs()).toEqual([])
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'))
    const caught = await getAllProjectSlugs().catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('throws ServiceError with VALIDATION_ERROR when a slug entry is malformed', async () => {
    // slug.current must be a non-empty string
    fetchMock.mockResolvedValueOnce([{ slug: { current: '' } }])
    const caught = await getAllProjectSlugs().catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('VALIDATION_ERROR')
  })
})
