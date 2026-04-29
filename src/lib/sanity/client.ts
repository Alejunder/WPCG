import { createClient, type SanityClient } from '@sanity/client'

export const sanityClient: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-01-01',
  useCdn: true,
  perspective: 'published',
})
