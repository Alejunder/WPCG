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
import { getAllTeamMembers, getTeamPage } from '../services/team.service'

// ---------------------------------------------------------------------------
// Typed mock handle
// ---------------------------------------------------------------------------

const fetchMock = vi.mocked(sanityClient.fetch)

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const validMember = {
  _id: 'member-1',
  name: 'Ana García',
  role: 'Principal Architect',
  bio: 'Ana has over 15 years of experience in corporate architecture.',
  image: { url: 'https://cdn.sanity.io/images/test.jpg', alt: 'Ana García' },
  order: 1,
  featured: false,
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
// getAllTeamMembers
// ---------------------------------------------------------------------------

describe('getAllTeamMembers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns a parsed array on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce([validMember])

    const result = await getAllTeamMembers('en')

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Ana García')
    expect(result[0].featured).toBe(false)
  })

  it('returns [] when Sanity returns null', async () => {
    fetchMock.mockResolvedValueOnce(null)

    const result = await getAllTeamMembers('en')

    expect(result).toEqual([])
  })

  it('passes the locale parameter to sanityClient.fetch', async () => {
    fetchMock.mockResolvedValueOnce([validMember])

    await getAllTeamMembers('es')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'es' }),
    )
  })

  it('throws ServiceError with VALIDATION_ERROR on an invalid shape', async () => {
    fetchMock.mockResolvedValueOnce([{ invalid: true }])

    await expect(getAllTeamMembers('en')).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'))

    await expect(getAllTeamMembers('en')).rejects.toMatchObject({ code: 'FETCH_ERROR' })
  })
})

// ---------------------------------------------------------------------------
// getTeamPage
// ---------------------------------------------------------------------------

describe('getTeamPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns a parsed singleton on a valid Sanity response', async () => {
    fetchMock.mockResolvedValueOnce({})

    const result = await getTeamPage('en')

    expect(result).not.toBeNull()
    expect(result?.cultureText).toEqual([])
  })

  it('returns null when Sanity returns null', async () => {
    fetchMock.mockResolvedValueOnce(null)

    const result = await getTeamPage('en')

    expect(result).toBeNull()
  })

  it('returns a fully populated page object', async () => {
    fetchMock.mockResolvedValueOnce({
      title: 'Our Team',
      heroImage: { url: 'https://cdn.sanity.io/images/hero.jpg', alt: 'Office' },
      cultureText: [{ _key: 'b1', _type: 'block', children: [] }],
      pullQuote: 'Architecture is our craft.',
    })

    const result = await getTeamPage('en')

    expect(result?.title).toBe('Our Team')
    expect(result?.pullQuote).toBe('Architecture is our craft.')
  })

  it('throws ServiceError with VALIDATION_ERROR on an invalid shape', async () => {
    fetchMock.mockResolvedValueOnce({ title: 123 })

    await expect(getTeamPage('en')).rejects.toMatchObject({ code: 'VALIDATION_ERROR' })
  })

  it('throws ServiceError with FETCH_ERROR when sanityClient.fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'))

    await expect(getTeamPage('en')).rejects.toMatchObject({ code: 'FETCH_ERROR' })
  })
})
