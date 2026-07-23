// ---------------------------------------------------------------------------
// GROQ queries for the services feature
//
// $locale — GROQ parameter, never interpolated from user input.
// Localized fields (name, shortDescription, longDescription, highlights) are
// stored as objects: { en: T, es: T }.
// coalesce() falls back to .en when the requested locale is missing.
// ---------------------------------------------------------------------------

// Single hero image projection — coalesce keeps legacy `image` documents working.
const SERVICE_HERO_IMAGE_PROJECTION = /* groq */ `"heroImage": coalesce(heroImage, image) {
  "url": asset->url,
  alt
}`

const SERVICE_CARD_PROJECTION = /* groq */ `{
  "name": coalesce(name[$locale], name.en),
  slug { current },
  "shortDescription": coalesce(shortDescription[$locale], shortDescription.en),
  icon,
  ${SERVICE_HERO_IMAGE_PROJECTION}
}`

const SERVICE_PROJECTION = /* groq */ `{
  "name": coalesce(name[$locale], name.en),
  slug { current },
  "shortDescription": coalesce(shortDescription[$locale], shortDescription.en),
  "longDescription": coalesce(longDescription[$locale], longDescription.en),
  "highlights": coalesce(highlights[$locale], highlights.en),
  icon,
  ${SERVICE_HERO_IMAGE_PROJECTION},
  order,
  featured
}`

export const getServicesPageQuery = /* groq */ `
  *[_type == "servicesPage"][0] {
    "heroImage": heroImage {
      "url": asset->url,
      alt
    },
    "intro": coalesce(intro[$locale], intro.en),
    "services": services[]-> | order(order asc) ${SERVICE_PROJECTION},
    "processSteps": processSteps[] {
      step,
      "title": coalesce(title[$locale], title.en),
      "description": coalesce(description[$locale], description.en)
    },
    "cta": cta {
      "headline": coalesce(headline[$locale], headline.en),
      "sub": coalesce(sub[$locale], sub.en),
      "buttonLabel": coalesce(buttonLabel[$locale], buttonLabel.en),
      href
    }
  }
`

export const getAllServicesQuery = /* groq */ `
  *[_type == "service"] | order(order asc) ${SERVICE_PROJECTION}
`

export const getFeaturedServicesQuery = /* groq */ `
  *[_type == "service" && featured == true] | order(order asc) ${SERVICE_CARD_PROJECTION}
`

export const getServiceBySlugQuery = /* groq */ `
  *[_type == "service" && slug.current == $slug][0] ${SERVICE_PROJECTION}
`

// Locale-agnostic — slugs are shared across locales.
export const getAllServiceSlugsQuery = /* groq */ `
  *[_type == "service"]{ slug { current } }
`
