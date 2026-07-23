import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/sanity-studio/', '/api/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wpcg.es'}/sitemap.xml`,
  }
}
