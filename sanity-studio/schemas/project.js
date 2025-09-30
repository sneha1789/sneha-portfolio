// sanity-studio/schemas/project.js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Web Development', value: 'web' },
          { title: 'App Development', value: 'app' },
          { title: 'AI/ML Projects', value: 'ai' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'tech',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'images',
      title: 'Project Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    },
    {
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'date',
      title: 'Completion Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'github',
      title: 'GitHub URL',
      type: 'url'
    }
  ],
  orderings: [
    {
      title: 'Date, New',
      name: 'dateDesc',
      by: [
        { field: 'date', direction: 'desc' }
      ]
    }
  ]
}