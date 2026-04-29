import { describe, it, expect } from 'vitest'
import {
  AboutImageSchema,
  AboutValueSchema,
  AboutPageSchema,
} from '../schemas/about.schema'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const validImage = { url: 'https://cdn.sanity.io/images/test.jpg', alt: 'Studio interior' }

const validValue = { title: 'Sustainability', description: 'Committed to reuse.' }

const validAboutPage = {}

const validAboutPageFull = {
  heroImage: validImage,
  title: 'About Us',
  intro: 'Specialists in corporate spaces.',
  content: [{ _key: 'block1', _type: 'block', children: [] }],
  values: [validValue, { title: 'Bespoke' }, { title: 'Precision', description: null }],
  cta: {
    headline: 'Start your project',
    sub: "Let's talk.",
    buttonLabel: 'Contact us',
    href: '/en/contact',
  },
}

// ---------------------------------------------------------------------------
// AboutImageSchema
// ---------------------------------------------------------------------------

describe('AboutImageSchema', () => {
  it('accepts a valid image and defaults alt to empty string when omitted', () => {
    expect(AboutImageSchema.safeParse(validImage).success).toBe(true)

    const withoutAlt = AboutImageSchema.safeParse({ url: 'https://cdn.sanity.io/img.jpg' })
    expect(withoutAlt.success).toBe(true)
    if (withoutAlt.success) expect(withoutAlt.data.alt).toBe('')
  })

  it('fails when url is missing or not a valid URL', () => {
    expect(AboutImageSchema.safeParse({ alt: 'No URL' }).success).toBe(false)
    expect(AboutImageSchema.safeParse({ url: 'not-a-url', alt: 'Alt' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// AboutValueSchema
// ---------------------------------------------------------------------------

describe('AboutValueSchema', () => {
  it('accepts a value with title only and with an optional description', () => {
    expect(AboutValueSchema.safeParse({ title: 'Bespoke' }).success).toBe(true)
    expect(AboutValueSchema.safeParse(validValue).success).toBe(true)
    expect(AboutValueSchema.safeParse({ title: 'Precision', description: null }).success).toBe(true)
  })

  it('fails when title is missing or empty', () => {
    expect(AboutValueSchema.safeParse({}).success).toBe(false)
    expect(AboutValueSchema.safeParse({ title: '' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// AboutPageSchema
// ---------------------------------------------------------------------------

describe('AboutPageSchema', () => {
  it('accepts an empty object and applies defaults', () => {
    const result = AboutPageSchema.safeParse(validAboutPage)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.content).toEqual([])
      expect(result.data.values).toEqual([])
    }
  })

  it('accepts a fully populated page object', () => {
    expect(AboutPageSchema.safeParse(validAboutPageFull).success).toBe(true)
  })

  it('defaults content and values to [] when undefined; rejects null', () => {
    const withUndefined = AboutPageSchema.safeParse({})
    expect(withUndefined.success).toBe(true)
    if (withUndefined.success) {
      expect(withUndefined.data.content).toEqual([])
      expect(withUndefined.data.values).toEqual([])
    }

    expect(AboutPageSchema.safeParse({ content: null }).success).toBe(false)
    expect(AboutPageSchema.safeParse({ values: null }).success).toBe(false)
  })

  it('accepts null for all nullable optional top-level fields', () => {
    expect(
      AboutPageSchema.safeParse({ heroImage: null, title: null, intro: null, cta: null }).success,
    ).toBe(true)
  })

  it('fails when a value in the values array has an empty title', () => {
    const result = AboutPageSchema.safeParse({
      values: [{ title: '' }],
    })
    expect(result.success).toBe(false)
  })

  it('fails when a content block is missing _key or _type', () => {
    expect(
      AboutPageSchema.safeParse({ content: [{ _type: 'block' }] }).success,
    ).toBe(false)

    expect(
      AboutPageSchema.safeParse({ content: [{ _key: 'k1' }] }).success,
    ).toBe(false)
  })

  it('accepts a CTA with all optional fields omitted or null', () => {
    expect(AboutPageSchema.safeParse({ cta: {} }).success).toBe(true)
    expect(
      AboutPageSchema.safeParse({
        cta: { headline: null, sub: null, buttonLabel: null, href: null },
      }).success,
    ).toBe(true)
  })
})
