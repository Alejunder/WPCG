import { defineType, defineField, defineArrayMember } from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.en', maxLength: 96 },
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'object',
      description: 'Used in card previews and overview grids.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3, validation: (r) => r.required() }),
        defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 3, validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'object',
      description: 'Full rich-text description for the service detail section.',
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
      name: 'highlights',
      title: 'Highlights',
      type: 'object',
      description: 'Bullet-point highlights shown in alternating service blocks.',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
        }),
        defineField({
          name: 'es',
          title: 'Spanish',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
        }),
      ],
    }),

    defineField({
      name: 'icon',
      title: 'Icon / Accent Identifier',
      type: 'string',
      description: 'Accent number or icon identifier (e.g. "01", "02"). Used as a decorative accent.',
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description:
        'Used on service cards and the detail page hero. One image covers both — no separate hero upload needed.',
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
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the display order. Lower numbers appear first.',
      validation: (r) => r.integer().positive().min(1),
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on the home page services overview.',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      titleEn: 'name.en',
      titleEs: 'name.es',
      icon: 'icon',
      media: 'heroImage',
    },
    prepare({ titleEn, titleEs, icon }) {
      return {
        title: titleEn ?? titleEs ?? 'Untitled service',
        subtitle: icon ? `Accent: ${icon}` : undefined,
      }
    },
  },
})
