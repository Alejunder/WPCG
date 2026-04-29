import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ServiceError } from '@/lib/errors/service-error'

// ---------------------------------------------------------------------------
// Mock sanityClient before any module that depends on it is loaded.
// vi.mock is hoisted by Vitest, so this runs before imports below.
// ---------------------------------------------------------------------------

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from '@/lib/sanity/client'
import {
  getServicesPage,
  getAllServices,
  getFeaturedServices,
} from '../services/services.service'

// ---------------------------------------------------------------------------
// Typed mock handle
// ---------------------------------------------------------------------------

const fetchMock = vi.mocked(sanityClient.fetch)

// ---------------------------------------------------------------------------
// Fixtures — minimal shapes that satisfy the Zod schemas
// ---------------------------------------------------------------------------

const minimalService = {
  name: 'Office Design',
  slug: { current: 'office-design' },
  shortDescription: 'We design premium office spaces.',
}

const minimalServiceCard = {
  name: 'Office Design',
  slug: { current: 'office-design' },
  shortDescription: 'We design premium office spaces.',
}

const minimalServicesPage = {
  title: 'Our Services',
  intro: 'Premium workspace solutions.',
  services: [],
  processSteps: [],
}

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
// getServicesPage
// ---------------------------------------------------------------------------

describe('getServicesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when Sanity returns null (singleton not yet created)', async () => {
    fetchMock.mockResolvedValueOnce(null)

    const result = await getServicesPage('en')

    expect(result).toBeNull()
  })

  it('returns parsed ServicesPageData on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce(minimalServicesPage)

    const result = await getServicesPage('en')

    expect(result).not.toBeNull()
    expect(result?.title).toBe('Our Services')
    expect(result?.services).toEqual([])
    expect(result?.processSteps).toEqual([])
  })

  it('passes the locale parameter to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce(minimalServicesPage)

    await getServicesPage('es')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'es' }),
    )
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'))

    const caught = await getServicesPage('en').catch((e: unknown) => e)

    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('throws ServiceError with VALIDATION_ERROR when Sanity returns invalid data', async () => {
    // services array contains an entry with an empty name — fails ServiceSchema
    fetchMock.mockResolvedValueOnce({
      services: [{ name: '', slug: { current: 'slug' }, shortDescription: 'Short' }],
    })

    const caught = await getServicesPage('en').catch((e: unknown) => e)

    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('VALIDATION_ERROR')
  })
})

// ---------------------------------------------------------------------------
// getAllServices
// ---------------------------------------------------------------------------

describe('getAllServices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an array of services on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce([minimalService])

    const result = await getAllServices('en')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Office Design')
  })

  it('returns an empty array when Sanity returns an empty array', async () => {
    fetchMock.mockResolvedValueOnce([])

    const result = await getAllServices('en')

    expect(result).toEqual([])
  })

  it('passes the locale parameter to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce([])

    await getAllServices('es')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'es' }),
    )
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Timeout'))

    const caught = await getAllServices('en').catch((e: unknown) => e)

    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('throws ServiceError with VALIDATION_ERROR when data fails schema validation', async () => {
    // Missing required shortDescription field
    fetchMock.mockResolvedValueOnce([{ name: 'Office Design', slug: { current: 'slug' } }])

    const caught = await getAllServices('en').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('VALIDATION_ERROR')
  })
})

// ---------------------------------------------------------------------------
// getFeaturedServices
// ---------------------------------------------------------------------------

describe('getFeaturedServices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an array of service cards on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce([minimalServiceCard])

    const result = await getFeaturedServices('en')

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Office Design')
  })

  it('returns an empty array when Sanity returns an empty array', async () => {
    fetchMock.mockResolvedValueOnce([])

    const result = await getFeaturedServices('en')

    expect(result).toEqual([])
  })

  it('passes the locale parameter to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce([])

    await getFeaturedServices('es')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'es' }),
    )
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Connection refused'))

    const caught = await getFeaturedServices('en').catch((e: unknown) => e)

    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('FETCH_ERROR')
  })

  it('throws ServiceError with VALIDATION_ERROR when a card fails schema validation', async () => {
    // shortDescription is empty — fails ServiceCardSchema (min(1))
    fetchMock.mockResolvedValueOnce([
      { name: 'Office Design', slug: { current: 'slug' }, shortDescription: '' },
    ])

    const caught = await getFeaturedServices('en').catch((e: unknown) => e)
    expect(caught).toBeInstanceOf(ServiceError)
    expect((caught as ServiceError).code).toBe('VALIDATION_ERROR')
  })
})
