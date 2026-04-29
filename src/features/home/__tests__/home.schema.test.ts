import { describe, it, expect } from 'vitest'
import { ClientLogoSchema, HomePageSchema } from '../schemas/home.schema'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const validLogo = { url: 'https://cdn.sanity.io/images/logo.png', alt: 'Client logo' }

const validFullPage = {
  heroImages: [
    { url: 'https://cdn.sanity.io/images/hero.jpg', alt: 'Office interior' },
    { url: 'https://cdn.sanity.io/images/hero2.jpg', alt: 'Lobby design' },
  ],
  aboutExcerpt: 'We design spaces that work.',
  featuredProjects: [
    {
      title: 'Tower Office',
      slug: { current: 'tower-office' },
      category: 'office',
      heroImage: { url: 'https://cdn.sanity.io/images/project.jpg', alt: 'Tower' },
    },
  ],
  clients: [validLogo],
}

// ---------------------------------------------------------------------------
// ClientLogoSchema
// ---------------------------------------------------------------------------

describe('ClientLogoSchema', () => {
  it('accepts a valid object with url and alt', () => {
    expect(ClientLogoSchema.safeParse(validLogo).success).toBe(true)
  })

  it('defaults alt to empty string when omitted', () => {
    const result = ClientLogoSchema.safeParse({ url: 'https://cdn.sanity.io/logo.png' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.alt).toBe('')
  })

  it('rejects an object whose url is not a valid URL', () => {
    expect(ClientLogoSchema.safeParse({ url: 'not-a-url', alt: 'Logo' }).success).toBe(false)
  })

  it('rejects an object with no url', () => {
    expect(ClientLogoSchema.safeParse({ alt: 'Logo only' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// HomePageSchema
// ---------------------------------------------------------------------------

describe('HomePageSchema', () => {
  it('accepts a full page object with all optional fields present', () => {
    expect(HomePageSchema.safeParse(validFullPage).success).toBe(true)
  })

  it('accepts an empty object and defaults collections to []', () => {
    const result = HomePageSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.featuredProjects).toEqual([])
      expect(result.data.clients).toEqual([])
    }
  })

  it('accepts heroImages: null and coerces featuredProjects: undefined to []', () => {
    const result = HomePageSchema.safeParse({ heroImages: null })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.heroImages).toBeNull()
      expect(result.data.featuredProjects).toEqual([])
    }
  })

  it('accepts clients: null (nullable — page layer applies ?? [] guard)', () => {
    const result = HomePageSchema.safeParse({ clients: null })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.clients).toBeNull()
  })

  it('rejects a client logo whose url is not valid inside the clients array', () => {
    const result = HomePageSchema.safeParse({
      clients: [{ url: 'bad-url', alt: 'Logo' }],
    })
    expect(result.success).toBe(false)
  })
})
