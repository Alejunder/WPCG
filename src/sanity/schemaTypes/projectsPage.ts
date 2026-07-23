import { defineType, defineField } from 'sanity'

export const projectsPageType = defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Hero Title',
      type: 'object',
      description: 'Main H1 displayed in the hero section.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() }),
      ],
    }),

    defineField({
      name: 'subtitle',
      title: 'Hero Subtitle',
      type: 'object',
      description: 'Optional short text shown below the hero title.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 2 }),
        defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 2 }),
      ],
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'object',
      description: 'Browser tab / Open Graph title. Falls back to the hero title when blank.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string' }),
        defineField({ name: 'es', title: 'Spanish', type: 'string' }),
      ],
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'object',
      description: 'Meta description for search engines and social sharing.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 2 }),
        defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 2 }),
      ],
    }),
  ],
})
