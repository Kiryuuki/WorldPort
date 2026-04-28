import { directus } from './directus';
import { readItems } from '@directus/sdk';

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  hook: string;
  stack: string; // Plain text per directus.md
  body: string;
  outcome: string;
  date_created: string;
};

export type About = {
  id: string;
  date_created: string;
  bio: string;
  philosophy: string;
  current_focus: string;
  whoiam_section: string;
  stack?: string;
};

export async function getCaseStudies() {
  if (typeof window !== 'undefined') return [];
  if (!directus.url || directus.url.toString().includes('fallback.invalid')) return [];
  try {
    return await directus.request(
      readItems('case_studies', {
        filter: { status: { _eq: 'published' } },
        sort: ['-date_created'],
      })
    );
  } catch (e) {
    console.error("Directus CaseStudies Error:", e);
    return [];
  }
}

export async function getCaseStudy(slug: string) {
  if (typeof window !== 'undefined') return undefined;
  if (!directus.url || directus.url.toString().includes('fallback.invalid')) return undefined;
  try {
    const items = await directus.request(
      readItems('case_studies', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        limit: 1,
      })
    );
    return items[0] as unknown as CaseStudy | undefined;
  } catch (e) {
    console.error("Directus CaseStudy Error:", e);
    return undefined;
  }
}

export async function getAbout() {
  if (typeof window !== 'undefined') return null;
  if (!directus.url || directus.url.toString().includes('fallback.invalid')) return null;
  try {
    const items = await directus.request(
      readItems('about')
    );
    return (items?.[0] || items || null) as unknown as About;
  } catch (e) {
    console.error("Directus About Error:", e);
    return null;
  }
}
