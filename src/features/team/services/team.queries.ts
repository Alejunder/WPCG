// ---------------------------------------------------------------------------
// GROQ queries for the team feature
//
// $locale — GROQ parameter, never interpolated from user input.
// Localized fields (role, bio) are stored as objects: { en: T, es: T }.
// coalesce() falls back to .en when the requested locale is missing.
// name is a plain string (person names do not require translation).
// ---------------------------------------------------------------------------

export const getAllTeamMembersQuery = /* groq */ `
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    "role": coalesce(role[$locale], role.en),
    "bio": coalesce(bio[$locale], bio.en),
    "image": image {
      "url": asset->url,
      alt
    },
    linkedinUrl,
    order,
    "featured": coalesce(featured, false)
  }
`

export const getTeamPageQuery = /* groq */ `
  *[_type == "teamPage"][0] {
    "title": coalesce(title[$locale], title.en),
    "heroImage": heroImage { "url": asset->url, alt },
    "cultureText": coalesce(cultureText[$locale], cultureText.en),
    "pullQuote": coalesce(pullQuote[$locale], pullQuote.en)
  }
`
