export const WORKFLOW_META: Record<string, { does: string; solves: string }> = {
  'Error Alert': {
    does: 'Catches any failed workflow and sends an instant Telegram notification with the error details and a direct link to the execution.',
    solves: 'Blind spots — failed automations that silently die with no one noticing until the damage is done.'
  },
  'Upwork Scraper': {
    does: 'Scrapes Upwork job listings matching automation keywords, filters by client spend history, and saves qualified leads to Obsidian.',
    solves: 'Manually refreshing Upwork search pages throughout the day and missing time-sensitive postings.'
  },
  'Book Summary': {
    does: 'Takes a book PDF via Telegram, extracts text, sends it through Claude for a structured summary, and saves the result to Obsidian.',
    solves: 'Hours of reading time for books that only need the key mental models extracted.'
  },
  'Directus to Socials Backup': {
    does: 'Backs up mission critical data from Directus to X and Bluesky.',
    solves: 'Data loss and inconsistency across platforms.'
  },
};
