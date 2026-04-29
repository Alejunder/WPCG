import { defineType, defineField, defineArrayMember } from 'sanity'

export const teamPageType = defineType({
  name: 'teamPage',
  title: 'Team Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() }),
      ],
    }),

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
      name: 'cultureText',
      title: 'Culture Text',
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
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string' }),
        defineField({ name: 'es', title: 'Spanish', type: 'string' }),
      ],
    }),
  ],
})
