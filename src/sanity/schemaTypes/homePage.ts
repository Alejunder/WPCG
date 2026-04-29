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
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
