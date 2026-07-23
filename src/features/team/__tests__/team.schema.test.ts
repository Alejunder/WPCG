import { describe, it, expect } from 'vitest'
import {
  TeamImageSchema,
  TeamMemberSchema,
  TeamMembersSchema,
  TeamPageSchema,
} from '../schemas/team.schema'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const validImage = { url: 'https://cdn.sanity.io/images/test.jpg', alt: 'Team member' }

const validMember = {
  _id: 'member-1',
  name: 'Ana García',
  role: 'Principal Architect',
  bio: 'Ana has over 15 years of experience in corporate architecture.',
  image: validImage,
  order: 1,
}

// ---------------------------------------------------------------------------
// TeamImageSchema
// ---------------------------------------------------------------------------

describe('TeamImageSchema', () => {
  it('accepts a valid image with alt text', () => {
    expect(TeamImageSchema.safeParse(validImage).success).toBe(true)
  })

  it('defaults alt to empty string when omitted', () => {
    const result = TeamImageSchema.safeParse({ url: 'https://cdn.sanity.io/images/test.jpg' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.alt).toBe('')
  })

  it('rejects when url is missing', () => {
    expect(TeamImageSchema.safeParse({ alt: 'No URL' }).success).toBe(false)
  })

  it('rejects when url is not a valid URL', () => {
    expect(TeamImageSchema.safeParse({ url: 'not-a-url', alt: 'Alt' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// TeamMemberSchema
// ---------------------------------------------------------------------------

describe('TeamMemberSchema', () => {
  it('accepts a valid full member object', () => {
    const result = TeamMemberSchema.safeParse({
      ...validMember,
      linkedinUrl: 'https://linkedin.com/in/anagarcia',
      featured: true,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Ana García')
      expect(result.data.linkedinUrl).toBe('https://linkedin.com/in/anagarcia')
      expect(result.data.featured).toBe(true)
    }
  })

  it('accepts a member without linkedinUrl', () => {
    expect(TeamMemberSchema.safeParse(validMember).success).toBe(true)
  })

  it('defaults featured to false when omitted', () => {
    const result = TeamMemberSchema.safeParse(validMember)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.featured).toBe(false)
  })

  it('rejects when name is missing', () => {
    const { name: _, ...noName } = validMember
    expect(TeamMemberSchema.safeParse(noName).success).toBe(false)
  })

  it('rejects when role is missing', () => {
    const { role: _, ...noRole } = validMember
    expect(TeamMemberSchema.safeParse(noRole).success).toBe(false)
  })

  it('rejects when bio is missing', () => {
    const { bio: _, ...noBio } = validMember
    expect(TeamMemberSchema.safeParse(noBio).success).toBe(false)
  })

  it('rejects when image is missing', () => {
    const { image: _, ...noImage } = validMember
    expect(TeamMemberSchema.safeParse(noImage).success).toBe(false)
  })

  it('rejects when order is missing', () => {
    const { order: _, ...noOrder } = validMember
    expect(TeamMemberSchema.safeParse(noOrder).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// TeamMembersSchema
// ---------------------------------------------------------------------------

describe('TeamMembersSchema', () => {
  it('accepts an array of valid members', () => {
    expect(TeamMembersSchema.safeParse([validMember]).success).toBe(true)
  })

  it('accepts an empty array', () => {
    expect(TeamMembersSchema.safeParse([]).success).toBe(true)
  })

  it('rejects when any member has an invalid shape', () => {
    expect(TeamMembersSchema.safeParse([{ invalid: true }]).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// TeamPageSchema
// ---------------------------------------------------------------------------

describe('TeamPageSchema', () => {
  it('accepts an empty object — all fields are optional', () => {
    expect(TeamPageSchema.safeParse({}).success).toBe(true)
  })

  it('defaults cultureText to [] when omitted', () => {
    const result = TeamPageSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.cultureText).toEqual([])
  })

  it('accepts a fully populated page object', () => {
    const result = TeamPageSchema.safeParse({
      title: 'Our Team',
      heroImage: validImage,
      cultureText: [{ _key: 'block1', _type: 'block', children: [] }],
      pullQuote: 'Architecture is our craft.',
    })
    expect(result.success).toBe(true)
  })

  it('accepts null for all nullable fields', () => {
    const result = TeamPageSchema.safeParse({
      title: null,
      heroImage: null,
      cultureText: null,
      pullQuote: null,
    })
    expect(result.success).toBe(true)
    // .default([]) only fires for undefined; explicit null is preserved as null
    if (result.success) expect(result.data.cultureText).toBeNull()
  })
})
