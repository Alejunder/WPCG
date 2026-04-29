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
import { getAboutPage } from '../services/about.service'

// ---------------------------------------------------------------------------
// Typed mock handle
// ---------------------------------------------------------------------------

const fetchMock = vi.mocked(sanityClient.fetch)

// ---------------------------------------------------------------------------
// Fixtures — minimal shapes that satisfy AboutPageSchema
// ---------------------------------------------------------------------------

const minimalAboutPage = {}

const fullAboutPage = {
  heroImage: { url: 'https://cdn.sanity.io/images/test.jpg', alt: 'Studio' },
  title: 'About Us',
  intro: 'Specialists in corporate spaces.',
  content: [{ _key: 'b1', _type: 'block', children: [] }],
  values: [{ title: 'Sustainability', description: 'Committed to reuse.' }],
  cta: { headline: 'Start your project', sub: "Let's talk.", buttonLabel: 'Contact', href: '/en/contact' },
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
// getAboutPage
// ---------------------------------------------------------------------------

describe('getAboutPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns parsed AboutPageData on a minimal valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce(minimalAboutPage)

    const result = await getAboutPage('en')

    expect(result.content).toEqual([])
    expect(result.values).toEqual([])
  })

  it('returns parsed AboutPageData on a fully populated Sanity response', async () => {
    fetchMock.mockResolvedValueOnce(fullAboutPage)

    const result = await getAboutPage('en')

    expect(result.title).toBe('About Us')
    expect(result.values).toHaveLength(1)
    expect(result.cta?.href).toBe('/en/contact')
  })

  it('passes the locale parameter to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce(minimalAboutPage)

    await getAboutPage('es')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'es' }),
    )
  })

  it('throws ServiceError with NOT_FOUND when Sanity returns null (singleton not configured)', async () => {
    fetchMock.mockResolvedValueOnce(null)

    await expect(getAboutPage('en')).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'))

    await expect(getAboutPage('en')).rejects.toMatchObject({ code: 'FETCH_ERROR' })
  })

  it('throws ServiceError with VALIDATION_ERROR when Sanity returns invalid data', async () => {
    // values array with an empty title — fails AboutValueSchema
    fetchMock.mockResolvedValueOnce({ values: [{ title: '' }] })

    await expect(getAboutPage('en')).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
  })
})
