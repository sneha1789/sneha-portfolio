import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'sneha-portfolio-cms',
  projectId: 'cSchpdfm',
  dataset: 'production',
  
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },

  // ADD THIS - PERMANENT FIX
  server: {
    port: 3333
  }
})