// ---------------------------------------------------------------------------
// GROQ projections
//
// $locale — GROQ parameter injected at query time, never string-interpolated.
// Sanity stores localized fields as { en, es } objects; coalesce() falls
// back to .en when the requested locale value is missing.
// ---------------------------------------------------------------------------

/**
 * Full projection for a single sketch document.
 *
 * `title` is resolved to the locale-specific string (or null when unset).
 * `projectSlug` follows the project reference and returns the slug string
 * (or null when no project is linked).
 */
export const getAllSketchesQuery = /* groq */ `
  *[_type == "sketch"] | order(order asc, _createdAt desc) {
    "id": _id,
    "image": image {
      "url": asset->url,
      alt
    },
    "title": coalesce(title[$locale], title.en),
    "projectSlug": project->slug.current,
    showOnHomepage
  }
`

/**
 * Fetches only sketches flagged with `showOnHomepage == true`, ordered by
 * `order asc` then newest-first. Used by the homepage Sketches section.
 */
export const getHomepageSketchesQuery = /* groq */ `
  *[_type == "sketch" && showOnHomepage == true] | order(order asc, _createdAt desc) {
    "id": _id,
    "image": image {
      "url": asset->url,
      alt
    },
    "title": coalesce(title[$locale], title.en),
    "projectSlug": project->slug.current,
    showOnHomepage
  }
`
