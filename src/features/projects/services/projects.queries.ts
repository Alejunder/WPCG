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
  "heroImage": heroImage {
    "url": asset->url,
    alt
  }
}`

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
  featured
}`

export const getAllProjectsQuery = /* groq */ `
  *[_type == "project"] | order(_createdAt desc) ${PROJECT_CARD_PROJECTION}
`

export const getFeaturedProjectsQuery = /* groq */ `
  *[_type == "project" && featured == true] | order(_createdAt desc) ${PROJECT_CARD_PROJECTION}
`

export const getProjectBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0] ${PROJECT_PROJECTION}
`

// Locale-agnostic — slugs are shared across locales.
export const getAllProjectSlugsQuery = /* groq */ `
  *[_type == "project"]{ slug { current } }
`
