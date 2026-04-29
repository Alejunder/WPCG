import { defineType, defineField } from 'sanity'

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'bio',
      title: 'Biography',
      description: 'Full biography — no length restriction. Shown in the member detail modal.',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', validation: (r) => r.required() }),
        defineField({ name: 'es', title: 'Spanish', type: 'text', validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Brief description for screen readers (e.g. "María García, Senior Architect")',
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (r) =>
        r.uri({ scheme: ['https'] }).error('Must be a valid https:// URL'),
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      validation: (r) => r.required().integer().positive(),
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Reserved for future use (e.g. highlighting leadership).',
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  preview: {
    select: { title: 'name', subtitle: 'role.en', media: 'image' },
  },
})
