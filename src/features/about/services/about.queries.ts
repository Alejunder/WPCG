// ---------------------------------------------------------------------------
// GROQ queries for the about feature
//
// $locale — GROQ parameter, never interpolated from user input.
// Localized fields are stored as objects: { en: T, es: T }.
// coalesce() falls back to .en when the requested locale is missing.
// ---------------------------------------------------------------------------

export const getAboutPageQuery = /* groq */ `
  *[_type == "aboutPage"][0] {
    "heroImage": heroImage {
      "url": asset->url,
      alt
    },
    "title": coalesce(title[$locale], title.en),
    "intro": coalesce(intro[$locale], intro.en),
    "content": coalesce(content[$locale], content.en),
    "values": values[] {
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
