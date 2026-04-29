import { describe, it, expect } from 'vitest'
import {
  ServiceImageSchema,
  ServiceSchema,
  ServiceCardSchema,
  ProcessStepSchema,
  ServicesPageSchema,
} from '../schemas/service.schema'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const validImage = { url: 'https://cdn.sanity.io/images/test.jpg', alt: 'Office interior' }

const validService = {
  name: 'Office Design',
  slug: { current: 'office-design' },
  shortDescription: 'We design premium office spaces.',
}

const validServiceFull = {
  ...validService,
  longDescription: [{ _key: 'block1', _type: 'block', children: [] }],
  highlights: ['Fast delivery', 'Premium quality'],
  icon: 'office-icon',
  image: validImage,
  order: 1,
  featured: true,
}

const validProcessStep = { step: 1, title: 'Initial Consultation' }

// ---------------------------------------------------------------------------
// ServiceImageSchema
// ---------------------------------------------------------------------------

describe('ServiceImageSchema', () => {
  it('accepts a valid image and defaults alt to empty string when omitted', () => {
    expect(ServiceImageSchema.safeParse(validImage).success).toBe(true)

    const withoutAlt = ServiceImageSchema.safeParse({ url: 'https://cdn.sanity.io/img.jpg' })
    expect(withoutAlt.success).toBe(true)
    if (withoutAlt.success) expect(withoutAlt.data.alt).toBe('')
  })

  it('fails when url is missing or not a valid URL', () => {
    expect(ServiceImageSchema.safeParse({ alt: 'No URL' }).success).toBe(false)
    expect(ServiceImageSchema.safeParse({ url: 'not-a-url', alt: 'Alt' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// ServiceSchema
// ---------------------------------------------------------------------------

describe('ServiceSchema', () => {
  it('accepts minimal input and applies correct defaults', () => {
    const result = ServiceSchema.safeParse(validService)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.longDescription).toEqual([])
      expect(result.data.highlights).toEqual([])
      expect(result.data.featured).toBe(false)
    }
  })

  it('accepts a fully populated valid service', () => {
    expect(ServiceSchema.safeParse(validServiceFull).success).toBe(true)
  })

  it('accepts null for nullable optional fields', () => {
    const result = ServiceSchema.safeParse({
      ...validService,
      icon: null,
      image: null,
      order: null,
      featured: null,
    })
    expect(result.success).toBe(true)
  })

  it('fails when required string fields are missing or empty', () => {
    const { name: _n, ...withoutName } = validService
    const { shortDescription: _s, ...withoutDesc } = validService

    expect(ServiceSchema.safeParse(withoutName).success).toBe(false)
    expect(ServiceSchema.safeParse({ ...validService, name: '' }).success).toBe(false)
    expect(ServiceSchema.safeParse(withoutDesc).success).toBe(false)
  })

  it('fails when slug.current is missing', () => {
    expect(ServiceSchema.safeParse({ ...validService, slug: {} }).success).toBe(false)
  })

  it('fails when optional typed fields receive the wrong type', () => {
    expect(ServiceSchema.safeParse({ ...validService, featured: 'yes' }).success).toBe(false)
    expect(ServiceSchema.safeParse({ ...validService, order: 'first' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// ServiceCardSchema
// ---------------------------------------------------------------------------

describe('ServiceCardSchema', () => {
  it('accepts required fields only, and with optional image and icon', () => {
    expect(ServiceCardSchema.safeParse(validService).success).toBe(true)
    expect(ServiceCardSchema.safeParse({ ...validService, icon: 'office', image: validImage }).success).toBe(true)
  })

  it('fails when name is missing or shortDescription is empty', () => {
    const { name: _n, ...withoutName } = validService

    expect(ServiceCardSchema.safeParse(withoutName).success).toBe(false)
    expect(ServiceCardSchema.safeParse({ ...validService, shortDescription: '' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// ProcessStepSchema
// ---------------------------------------------------------------------------

describe('ProcessStepSchema', () => {
  it('accepts a valid step with and without optional description', () => {
    expect(ProcessStepSchema.safeParse(validProcessStep).success).toBe(true)
    expect(ProcessStepSchema.safeParse({ ...validProcessStep, description: 'Details.' }).success).toBe(true)
  })

  it('fails when step is missing or title is missing', () => {
    expect(ProcessStepSchema.safeParse({ title: 'Consultation' }).success).toBe(false)
    expect(ProcessStepSchema.safeParse({ step: 1 }).success).toBe(false)
  })

  it('fails when step violates positive integer constraint', () => {
    expect(ProcessStepSchema.safeParse({ step: 0, title: 'Consultation' }).success).toBe(false)
    expect(ProcessStepSchema.safeParse({ step: -1, title: 'Consultation' }).success).toBe(false)
    expect(ProcessStepSchema.safeParse({ step: 1.5, title: 'Consultation' }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// ServicesPageSchema
// ---------------------------------------------------------------------------

describe('ServicesPageSchema', () => {
  it('accepts an empty object and defaults services and processSteps to []', () => {
    const result = ServicesPageSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.services).toEqual([])
      expect(result.data.processSteps).toEqual([])
    }
  })

  it('accepts a fully populated services page', () => {
    const result = ServicesPageSchema.safeParse({
      heroImage: validImage,
      title: 'Our Services',
      intro: 'We offer premium workspace solutions.',
      services: [validServiceFull],
      processSteps: [validProcessStep],
      cta: {
        headline: 'Ready to start?',
        sub: 'Contact our team today.',
        buttonLabel: 'Get in touch',
        href: '/contact',
      },
    })
    expect(result.success).toBe(true)
  })

  it('fails when nested arrays contain invalid entries', () => {
    expect(ServicesPageSchema.safeParse({
      services: [{ name: '', slug: { current: 'slug' }, shortDescription: 'Short' }],
    }).success).toBe(false)

    expect(ServicesPageSchema.safeParse({
      processSteps: [{ step: 0, title: 'Bad step' }],
    }).success).toBe(false)
  })
})
