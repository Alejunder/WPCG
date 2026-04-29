import { describe, it, expect } from 'vitest'
import { ProjectCategorySchema, ProjectImageSchema, ProjectCardSchema } from '../schemas/project-card.schema'
import { ProjectSchema } from '../schemas/project.schema'

// ---------------------------------------------------------------------------
// Shared fixtures
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

const validProjectFull = {
  ...validProject,
  year: 2024,
  location: 'Madrid',
  description: [{ _key: 'b1', _type: 'block', children: [] }],
  gallery: [validImage],
  surfaceArea: 1200,
  duration: '6 months',
  servicesInvolved: ['Interior Design'],
  relatedProjects: [],
  featured: true,
}

// ---------------------------------------------------------------------------
// ProjectCategorySchema
// ---------------------------------------------------------------------------

describe('ProjectCategorySchema', () => {
  it('accepts valid categories (case-insensitive)', () => {
    expect(ProjectCategorySchema.safeParse('office').success).toBe(true)
    expect(ProjectCategorySchema.safeParse('residential').success).toBe(true)
    expect(ProjectCategorySchema.safeParse('retail').success).toBe(true)
    expect(ProjectCategorySchema.safeParse('Office').success).toBe(true)
  })

  it('normalises input to lowercase', () => {
    const result = ProjectCategorySchema.safeParse('OFFICE')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toBe('office')
  })

  it('rejects unknown category values', () => {
    expect(ProjectCategorySchema.safeParse('').success).toBe(false)
    expect(ProjectCategorySchema.safeParse('hotel').success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// ProjectImageSchema
// ---------------------------------------------------------------------------

describe('ProjectImageSchema', () => {
  it('accepts a valid image and defaults alt to empty string when omitted', () => {
    expect(ProjectImageSchema.safeParse(validImage).success).toBe(true)

    const withoutAlt = ProjectImageSchema.safeParse({ url: 'https://cdn.sanity.io/img.jpg' })
    expect(withoutAlt.success).toBe(true)
    if (withoutAlt.success) expect(withoutAlt.data.alt).toBe('')
  })

  it('fails when url is missing or not a valid URL', () => {
    expect(ProjectImageSchema.safeParse({ alt: 'No URL' }).success).toBe(false)
    expect(ProjectImageSchema.safeParse({ url: 'not-a-url' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// ProjectCardSchema
// ---------------------------------------------------------------------------

describe('ProjectCardSchema', () => {
  it('accepts a valid project card', () => {
    expect(ProjectCardSchema.safeParse(validCard).success).toBe(true)
  })

  it('fails when required fields are missing', () => {
    const { title: _t, ...withoutTitle } = validCard
    const { slug: _s, ...withoutSlug } = validCard
    const { heroImage: _i, ...withoutImage } = validCard

    expect(ProjectCardSchema.safeParse(withoutTitle).success).toBe(false)
    expect(ProjectCardSchema.safeParse(withoutSlug).success).toBe(false)
    expect(ProjectCardSchema.safeParse(withoutImage).success).toBe(false)
    expect(ProjectCardSchema.safeParse({ ...validCard, title: '' }).success).toBe(false)
    expect(ProjectCardSchema.safeParse({ ...validCard, slug: {} }).success).toBe(false)
  })

  it('fails when category is invalid', () => {
    expect(ProjectCardSchema.safeParse({ ...validCard, category: 'hotel' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// ProjectSchema
// ---------------------------------------------------------------------------

describe('ProjectSchema', () => {
  it('accepts minimal input and applies correct defaults', () => {
    const result = ProjectSchema.safeParse(validProject)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.description).toEqual([])
      expect(result.data.gallery).toEqual([])
      expect(result.data.servicesInvolved).toEqual([])
      expect(result.data.relatedProjects).toEqual([])
      expect(result.data.featured).toBe(false)
    }
  })

  it('accepts a fully populated project', () => {
    expect(ProjectSchema.safeParse(validProjectFull).success).toBe(true)
  })

  it('accepts null for nullable optional fields', () => {
    const result = ProjectSchema.safeParse({
      ...validProject,
      year: null,
      location: null,
      surfaceArea: null,
      duration: null,
      featured: null,
    })
    expect(result.success).toBe(true)
  })

  it('fails when required fields are missing or empty', () => {
    const { title: _t, ...withoutTitle } = validProject
    const { slug: _s, ...withoutSlug } = validProject
    const { heroImage: _i, ...withoutHeroImage } = validProject

    expect(ProjectSchema.safeParse(withoutTitle).success).toBe(false)
    expect(ProjectSchema.safeParse({ ...validProject, title: '' }).success).toBe(false)
    expect(ProjectSchema.safeParse(withoutSlug).success).toBe(false)
    expect(ProjectSchema.safeParse({ ...validProject, slug: {} }).success).toBe(false)
    expect(ProjectSchema.safeParse(withoutHeroImage).success).toBe(false)
  })

  it('fails on type mismatches for constrained optional fields', () => {
    expect(ProjectSchema.safeParse({ ...validProject, year: 'twenty-twenty' }).success).toBe(false)
    expect(ProjectSchema.safeParse({ ...validProject, year: 0 }).success).toBe(false)
    expect(ProjectSchema.safeParse({ ...validProject, year: -1 }).success).toBe(false)
    expect(ProjectSchema.safeParse({ ...validProject, surfaceArea: -10 }).success).toBe(false)
    expect(ProjectSchema.safeParse({ ...validProject, featured: 'yes' }).success).toBe(false)
  })

  it('fails when relatedProjects exceeds the maximum of 3', () => {
    const result = ProjectSchema.safeParse({
      ...validProject,
      relatedProjects: [validCard, validCard, validCard, validCard],
    })
    expect(result.success).toBe(false)
  })
})
