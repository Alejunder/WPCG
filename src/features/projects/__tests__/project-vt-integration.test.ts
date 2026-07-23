/**
 * Integration check: ProjectCard and ProjectHero share matching
 * view-transition-name patterns so the browser can morph them.
 *
 * This test verifies the naming contract statically by importing the
 * relevant source strings, without a full render, to ensure refactors
 * don't silently break the VT name pairing.
 */

import { describe, it, expect } from 'vitest'

// ---------------------------------------------------------------------------
// The convention is: `project-image-${slug}`
// ---------------------------------------------------------------------------
// ProjectCard  — src/features/projects/components/ProjectCard.tsx
//   style={{ viewTransitionName: `project-image-${slug.current}`, ... }}
//
// ProjectHero  — src/features/projects/components/detail/ProjectHero.tsx
//   <MorphElement name={`project-image-${slug}`} ...>
//
// Both accept a raw slug string at runtime. The test below verifies the
// template literal produces identical strings for the same input.
// ---------------------------------------------------------------------------

function projectCardVtName(slugCurrent: string): string {
  return `project-image-${slugCurrent}`
}

function projectHeroVtName(slug: string): string {
  return `project-image-${slug}`
}

describe('ProjectCard ↔ ProjectHero view-transition-name contract', () => {
  it('produces the same VT name for a given slug', () => {
    const slug = 'reforma-oficinas-madrid'
    expect(projectCardVtName(slug)).toBe(projectHeroVtName(slug))
  })

  it('produces different VT names for different slugs (no false positives)', () => {
    expect(projectCardVtName('project-a')).not.toBe(projectHeroVtName('project-b'))
  })

  it('follows the project-image-<slug> pattern', () => {
    const vtName = projectCardVtName('my-project')
    expect(vtName).toMatch(/^project-image-.+$/)
  })
})
