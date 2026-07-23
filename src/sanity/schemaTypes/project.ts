import { defineType, defineField, defineArrayMember } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description:
        'Controls the position in the projects grid. Lower numbers come first: 1 appears top-left, then the rest fill left-to-right and wrap to the next row. Projects without a number are shown last (newest first).',
      validation: (r) => r.integer().positive(),
    }),

    defineField({
      name: 'title',
      title: 'Title',
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
      options: { source: 'title.en', maxLength: 96 },
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Office', value: 'office' },
          { title: 'Residential', value: 'residential' },
          { title: 'Retail', value: 'retail' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (r) => r.integer().positive().min(1900).max(2100),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),

    defineField({
      name: 'description',
      title: 'Description',
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
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery',
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

    defineField({
      name: 'surfaceArea',
      title: 'Surface Area (m²)',
      type: 'number',
      validation: (r) => r.positive(),
    }),

    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string' }),
        defineField({ name: 'es', title: 'Spanish', type: 'string' }),
      ],
    }),

    defineField({
      name: 'servicesInvolved',
      title: 'Services Involved',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),

    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      validation: (r) => r.max(3),
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'ecoFriendly',
      title: 'Eco-Friendly',
      type: 'boolean',
      initialValue: false,
      description: 'Mark this project as eco-friendly. An eco-friendly badge will be displayed on the project card and detail page.',
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title.en',
      category: 'category',
      displayOrder: 'displayOrder',
      media: 'heroImage',
    },
    prepare({ title, category, displayOrder, media }) {
      const order = typeof displayOrder === 'number' ? `#${displayOrder} · ` : ''
      return {
        title,
        subtitle: `${order}${category ?? ''}`,
        media,
      }
    },
  },
})
