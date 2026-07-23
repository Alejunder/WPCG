import { defineType, defineField } from 'sanity'

export const sketchType = defineType({
  name: 'sketch',
  title: 'Sketch',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Sketch Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Brief description for screen readers (e.g. "Preliminary floor plan — Office A")',
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'title',
      title: 'Caption',
      description:
        'Optional pencil-note label shown below the card in the moodboard. Leave empty for a purely visual card.',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string' }),
        defineField({ name: 'es', title: 'Spanish', type: 'string' }),
      ],
    }),

    defineField({
      name: 'project',
      title: 'Related Project',
      description:
        "When set, the card becomes a link to this project's detail page. Leave empty for a visual-only card.",
      type: 'reference',
      to: [{ type: 'project' }],
    }),

    defineField({
      name: 'showOnHomepage',
      title: 'Show on Homepage',
      description:
        'When enabled, this sketch appears in the Sketches section on the homepage. Select only your strongest sketches.',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first. Controls the scatter arrangement on the page.',
      type: 'number',
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      media: 'image',
      title: 'title.en',
    },
    prepare({ media, title }) {
      return {
        media,
        title: title ?? '(untitled sketch)',
      }
    },
  },
})
