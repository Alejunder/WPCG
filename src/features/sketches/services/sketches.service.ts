import { z } from 'zod'
import { SketchSchema } from '../schemas/sketch.schema'
import type { Sketch } from '../types'
import { getAllSketchesQuery, getHomepageSketchesQuery } from './sketches.queries'
import { createServiceHelpers } from '@/lib/sanity/service-helpers'

const { validate, fetchFromSanity } = createServiceHelpers('sketches.service')

/**
 * Returns all sketch documents ordered by `order asc`, then `_createdAt desc`.
 * Returns an empty array when no sketches are published yet.
 */
export async function getAllSketches(locale: string): Promise<Sketch[]> {
  const raw = await fetchFromSanity<unknown>(
    'getAllSketches',
    getAllSketchesQuery,
    { locale },
  )
  return validate(z.array(SketchSchema), raw, 'getAllSketches')
}

/**
 * Returns only sketches flagged with `showOnHomepage == true`.
 * Returns an empty array when none are selected, so the homepage section
 * can conditionally render without throwing.
 */
export async function getHomepageSketches(locale: string): Promise<Sketch[]> {
  const raw = await fetchFromSanity<unknown>(
    'getHomepageSketches',
    getHomepageSketchesQuery,
    { locale },
  )
  return validate(z.array(SketchSchema), raw, 'getHomepageSketches')
}
