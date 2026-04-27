import { createDirectus, rest, staticToken } from '@directus/sdk';

const url = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || '';
const token = process.env.DIRECTUS_TOKEN || '';

if (!url) {
  console.warn("DIRECTUS_URL environment variable is missing. CMS features will be limited.");
}

export const directus = createDirectus(url || 'https://fallback.invalid')
  .with(staticToken(token))
  .with(rest());
