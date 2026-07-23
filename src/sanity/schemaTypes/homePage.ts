import { defineType, defineField, defineArrayMember } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // ----------------------------------------------------------------
    // Hero
    // ----------------------------------------------------------------
    defineField({
      name: 'heroImages',
      title: 'Hero Images',
      description: 'One or more images for the homepage carousel. First image appears on load.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
      validation: (r) => r.min(1),
    }),

    // ----------------------------------------------------------------
    // Hero — Service Links Row
    // ----------------------------------------------------------------
    defineField({
      name: 'heroServiceLinks',
      title: 'Hero — Service Links',
      type: 'array',
      description:
        'Large links shown below the hero logo (e.g. Architecture | Interior Design | Construction). Each item links to a service page.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceLink',
          fields: [
            defineField({ name: 'en', title: 'Label (English)', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'es', title: 'Label (Spanish)', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'href',
              title: 'URL path (without locale prefix)',
              description: 'e.g. /services/architecture — the locale prefix is added automatically.',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: 'en', subtitle: 'href' } },
        }),
      ],
    }),

    // ----------------------------------------------------------------
    // About Excerpt
    // ----------------------------------------------------------------
    defineField({
      name: 'aboutExcerpt',
      title: 'About Excerpt',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 4, validation: (r) => r.required() }),
        defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 4, validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),

    // ----------------------------------------------------------------
    // Featured Projects
    // ----------------------------------------------------------------
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
          options: { disableNew: true },
        }),
      ],
      validation: (r) => r.max(3),
    }),

    // ----------------------------------------------------------------
    // Clients
    // ----------------------------------------------------------------
    defineField({
      name: 'clients',
      title: 'Client Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: false },
          fields: [
            defineField({
              name: 'alt',
              title: 'Client name (alt text)',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
    }),

    // ----------------------------------------------------------------
    // Client Satisfaction Stats
    // ----------------------------------------------------------------
    defineField({
      name: 'clientSatisfaction',
      title: 'Client Satisfaction — Stats Block',
      type: 'object',
      description: 'Statistics block displayed above the client logos carousel.',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() }),
          ],
        }),
        defineField({
          name: 'tagline',
          title: 'Tagline',
          description: 'Short supporting line shown below the stats (e.g. "Over 6 years exceeding expectations").',
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'string' }),
            defineField({ name: 'es', title: 'Spanish', type: 'string' }),
          ],
        }),
        defineField({
          name: 'stats',
          title: 'Statistics',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'stat',
              fields: [
                defineField({
                  name: 'value',
                  title: 'Value (e.g. 91%)',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'object',
                  fields: [
                    defineField({ name: 'en', title: 'English', type: 'text', rows: 2, validation: (r) => r.required() }),
                    defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 2, validation: (r) => r.required() }),
                  ],
                }),
              ],
              preview: { select: { title: 'value', subtitle: 'label.en' } },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
