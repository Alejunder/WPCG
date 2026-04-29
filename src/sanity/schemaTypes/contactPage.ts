import { defineType, defineField, defineArrayMember } from 'sanity'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Used only in Sanity Studio for identification.',
      initialValue: 'Contact Page',
    }),

    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string' }),
        defineField({ name: 'es', title: 'Spanish', type: 'string' }),
      ],
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (r) => r.email(),
    }),

    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),

    defineField({
      name: 'workingHours',
      title: 'Working Hours',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string' }),
        defineField({ name: 'es', title: 'Spanish', type: 'string' }),
      ],
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Instagram', value: 'instagram' },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact Page' }),
  },
})
