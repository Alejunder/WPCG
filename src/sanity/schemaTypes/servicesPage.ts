import { defineType, defineField, defineArrayMember } from 'sanity'

export const servicesPageType = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  // Only one document of this type should exist (singleton)
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
      type: 'object',
      description: 'Short intro paragraph shown below the hero title.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
        defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 3 }),
      ],
    }),

    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      description: 'Ordered references to service documents.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'service' }],
        }),
      ],
    }),

    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      description: 'The WPCG methodology steps (e.g. Brief → Concept → Design → Execution → Handover).',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'step',
              title: 'Step Number',
              type: 'number',
              validation: (r) => r.required().integer().positive(),
            }),
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'object',
              fields: [
                defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() }),
              ],
            }),
            defineField({
              name: 'description',
              title: 'Step Description',
              type: 'object',
              fields: [
                defineField({ name: 'en', title: 'English', type: 'text', rows: 2 }),
                defineField({ name: 'es', title: 'Spanish', type: 'text', rows: 2 }),
              ],
            }),
          ],
          preview: {
            select: { step: 'step', titleEn: 'title.en' },
            prepare({ step, titleEn }) {
              return { title: `${step ?? '?'}. ${titleEn ?? ''}` }
            },
          },
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
          title: 'Button href',
          type: 'string',
          description: 'Locale-agnostic path (e.g. /contact). The locale prefix is added at render time.',
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Services Page' }
    },
  },
})
