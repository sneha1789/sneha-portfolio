// src/sanity/config.js
import { createClient } from '@sanity/client';

const projectId = 'c5chpdfm';
const token = 'skwx8l7OIhGkLuixJ4luT5cGvA1qnkOwkFANAmvj4vVnqHOCTKDdhUBgeOq3wax26GWBENCsBgPYwFmk2vD4Ujco7GGbPMPrRrLZIUBPI9RUOtUClqMqH6RqPKmI89UGDSF2zEBDMMuzILTdQp8T5TmQfNzXqYHOj8T1SoIVCAtOgTqYLSW4';

export const client = createClient({
  projectId: projectId,
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
  token: token
});