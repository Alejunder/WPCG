// ---------------------------------------------------------------------------
// GROQ projections
//
// $locale — GROQ parameter, never interpolated from user input.
// Localized fields (title, description, duration) are stored as objects:
// { en: string, es: string }.
// coalesce() falls back to .en when the requested locale is missing.
//
// PROJECT_CARD_PROJECTION is reused inside PROJECT_PROJECTION for related
// projects to avoid duplication. It is exported so that other features
// (e.g. home) can import it directly instead of duplicating the shape.
// ---------------------------------------------------------------------------

export const PROJECT_CARD_PROJECTION = /* groq */ `{
  "title": coalesce(title[$locale], title.en),
  slug { current },
  category,
  servicesInvolved,
  ecoFriendly,
  "heroImage": heroImage {
    "url": asset->url,
    alt
  }
}`

/**
 * Extended card projection used for related projects on the detail page.
 * Includes servicesInvolved so RelatedProjects can dim cards by hovered service.
 * NOT exported — only consumed by PROJECT_PROJECTION below.
 */
const PROJECT_PROJECTION = /* groq */ `{
  "title": coalesce(title[$locale], title.en),
  slug { current },
  category,
  year,
  location,
  "description": coalesce(description[$locale], description.en),
  "heroImage": heroImage {
    "url": asset->url,
    alt
  },
  "gallery": gallery[] {
    "url": asset->url,
    alt
  },
  surfaceArea,
  "duration": coalesce(duration[$locale], duration.en),
  servicesInvolved,
  "relatedProjects": relatedProjects[0..2]->${PROJECT_CARD_PROJECTION},
  featured,
  ecoFriendly
}`

// Manual ordering: `displayOrder` (1 = first) drives the grid position
// (top-left, then left-to-right, wrapping to the next row). Projects without a
// displayOrder are pushed to the end via coalesce and fall back to newest-first.
export const getAllProjectsQuery = /* groq */ `
  *[_type == "project"] | order(coalesce(displayOrder, 999999) asc, _createdAt desc) ${PROJECT_CARD_PROJECTION}
`

export const getFeaturedProjectsQuery = /* groq */ `
  *[_type == "project" && featured == true] | order(coalesce(displayOrder, 999999) asc, _createdAt desc) ${PROJECT_CARD_PROJECTION}
`

export const getProjectBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0] ${PROJECT_PROJECTION}
`

// Locale-agnostic — slugs are shared across locales.
export const getAllProjectSlugsQuery = /* groq */ `
  *[_type == "project"]{ slug { current } }
`

export const getProjectsPageQuery = /* groq */ `
  *[_type == "projectsPage"][0] {
    "title": coalesce(title[$locale], title.en),
    "subtitle": coalesce(subtitle[$locale], subtitle.en),
    "seoTitle": coalesce(seoTitle[$locale], seoTitle.en),
    "seoDescription": coalesce(seoDescription[$locale], seoDescription.en),
  }
`
