// ---------------------------------------------------------------------------
// GROQ queries for the home page singleton
//
// $locale — GROQ parameter, never interpolated from user input.
// Localized fields use coalesce() to fall back to English when the requested
// locale value is absent in the CMS.
// ---------------------------------------------------------------------------

import { PROJECT_CARD_PROJECTION } from '@/features/projects/services/projects.queries'

export const getHomePageQuery = /* groq */ `
  *[_type == "homePage"][0] {
    "heroImages": heroImages[] {
      "url": asset->url,
      alt
    },
    "heroServiceLinks": heroServiceLinks[] {
      "label": select($locale == "es" => es, en),
      "href": href
    },
    "aboutExcerpt": coalesce(aboutExcerpt[$locale], aboutExcerpt.en),
    "featuredProjects": featuredProjects[]->${PROJECT_CARD_PROJECTION},
    "clients": clients[] {
      "url": asset->url,
      alt
    },
    "clientSatisfaction": clientSatisfaction {
      "heading": coalesce(heading[$locale], heading.en),
      "tagline": coalesce(tagline[$locale], tagline.en),
      "stats": stats[] {
        value,
        "label": coalesce(label[$locale], label.en)
      }
    }
  }
`
