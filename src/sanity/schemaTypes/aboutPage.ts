import { defineType, defineField, defineArrayMember } from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
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

    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() }),
      ],
    }),

    defineField({
      name: 'intro',
      title: 'Intro Text',
      description: 'Short sub-headline displayed below the hero title.',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
        defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 3 }),
      ],
    }),

    defineField({
      name: 'content',
      title: 'Story / Body Content',
      description: 'Main editorial content — rich text with optional images.',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'array',
          of: [defineArrayMember({ type: 'block' })],
        }),
        defineField({
          name: 'es',
          title: 'Spanish',
          type: 'array',
          of: [defineArrayMember({ type: 'block' })],
        }),
      ],
    }),

    defineField({
      name: 'values',
      title: 'Values',
      description: 'Three value pillars (e.g. Sustainability, Bespoke, Precision).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Value Title',
              type: 'object',
              fields: [
                defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() }),
              ],
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'object',
              fields: [
                defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
                defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 3 }),
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'cta',
      title: 'CTA Banner',
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'string' }),
            defineField({ name: 'es', title: 'Spanish', type: 'string' }),
          ],
        }),
        defineField({
          name: 'sub',
          title: 'Sub-headline',
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'string' }),
            defineField({ name: 'es', title: 'Spanish', type: 'string' }),
          ],
        }),
        defineField({
          name: 'buttonLabel',
          title: 'Button Label',
          type: 'object',
          fields: [
            defineField({ name: 'en', title: 'English', type: 'string' }),
            defineField({ name: 'es', title: 'Spanish', type: 'string' }),
          ],
        }),
        defineField({
          name: 'href',
          title: 'Button URL',
          type: 'string',
        }),
      ],
    }),
  ],
})
