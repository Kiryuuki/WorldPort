# Directus CMS Schema Reference
> Instance: https://direk.kiryuuki.space  
> Use this file to understand available collections and fields before creating or updating items.

---

## Collections Overview

| Collection | Purpose | Has Status |
|---|---|---|
| `about` | Personal bio, philosophy, current focus | ✓ (default: published) |
| `blog_posts` | Blog articles | ✓ (default: **draft**) |
| `case_studies` | Portfolio project case studies | ✓ (default: published) |
| `content_ideas` | Content pipeline ideas | ✓ |
| `social_posts` | Multi-platform social content | ✓ |
| `ai_prompts` | Reusable MCP prompt templates | ✓ |
| `github` | GitHub items | ✓ |

---

## `about`
Singleton-style. One active entry (id: 1).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer | auto | PK |
| `status` | string | — | published / draft / archived. Default: `published` |
| `bio` | text (markdown) | — | Full bio paragraph |
| `philosophy` | text (markdown) | — | Work philosophy statement |
| `current_focus` | text (markdown) | — | What you're working on now |
| `whoiam_section` | text (markdown) | — | Short "who I am" blurb |
| `date_created` | timestamp | auto | |

**Example create:**
```json
{
  "status": "published",
  "bio": "...",
  "philosophy": "...",
  "current_focus": "...",
  "whoiam_section": "..."
}
```

---

## `case_studies`
Portfolio project entries. Currently has 4 items (ids 1–4).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer | auto | PK |
| `status` | string | — | published / draft / archived. Default: `published` |
| `title` | string | ✓ | Project name |
| `slug` | string | — | URL-safe identifier e.g. `ai-lead-qualification-funnel` |
| `hook` | text | — | One-liner summary shown in cards |
| `body` | text (markdown) | — | Full case study: Problem / Solution / Architecture |
| `outcome` | text (markdown) | — | Results and impact |
| `stack` | text | — | Comma-separated tech stack |
| `date_created` | timestamp | auto | |
| `date_updated` | timestamp | auto | |

**Example create:**
```json
{
  "status": "published",
  "title": "Project Name",
  "slug": "project-name",
  "hook": "One sentence describing what was built and why it matters.",
  "body": "## Problem\n...\n\n## Solution\n...\n\n## Architecture\n- **Trigger**: ...\n- **Process**: ...\n- **Output**: ...",
  "outcome": "Quantified result. X hours saved, Y% improvement.",
  "stack": "n8n, Claude API, Python, PostgreSQL"
}
```

**Existing entries:**
| id | title |
|---|---|
| 1 | AI Lead Qualification Funnel |
| 2 | YouTube-to-Knowledge-Base Ingestion Pipeline |
| 3 | Self-Hosted RAG Research Assistant |
| 4 | Enterprise Portfolio Platform |

---

## `blog_posts`
Blog articles. Status defaults to **draft** — must explicitly set `published`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer | auto | PK |
| `status` | string | — | published / draft / archived. Default: **`draft`** |
| `title` | string | ✓ | Article title |
| `slug` | string | — | URL slug |
| `excerpt` | text | — | Short preview shown in listings |
| `content` | text (markdown) | — | Full article body |
| `read_time` | string | — | e.g. `"5 min read"` |
| `date_created` | timestamp | auto | |
| `date_updated` | timestamp | auto | |

**Example create:**
```json
{
  "status": "published",
  "title": "How I Built X",
  "slug": "how-i-built-x",
  "excerpt": "Short preview of the article.",
  "content": "## Introduction\n...",
  "read_time": "6 min read"
}
```

---

## `content_ideas`

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `status` | string | published / draft / archived |
| `Title` | string | Idea title |
| `Summary` | text | Brief description |
| `content_angle` | text | Unique angle or hook |
| `source` | string | `Github` or `Reddit` |
| `source_url` | string | Link to source |
| `relevance_score` | string | e.g. `"8/10"` |
| `topics` | json (tags) | Array of topic strings |
| `content_type` | string | `Blog`, `Short`, or `Socials` |
| `hype_level` | string | `exploding`, `massive`, `established`, `rising`, `low` |
| `Facebook` | string | Platform-specific copy |
| `Instagram` | string | |
| `Threads` | string | |
| `Bluesky` | string | |
| `image` | uuid | File reference |

---

## `social_posts`

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `status` | string | published / draft / archived |
| `Title` | string | Post title |
| `content` | text | Generic content |
| `twitter_content` | text | Twitter/X specific copy |
| `linkedin_content` | text | LinkedIn specific copy |
| `blog_content_md` | text (markdown) | Blog version |
| `blog_content_html` | text (html) | HTML version |
| `hashtags` | json (tags) | Array of hashtags |
| `platforms` | json | Array: `facebook`, `twitter`, `LinkedIn`, `threads`, `instagram` |
| `Image` | uuid | File reference |

---

## Notes for Agent

- **All markdown fields** accept standard markdown. Use `\n\n` for paragraph breaks.
- **status field** controls visibility on frontend. Always set explicitly.
- **blog_posts default is draft** — easy to forget. Always pass `"status": "published"` if meant to be live.
- **Slugs** should be lowercase, hyphenated, no special chars.
- **stack field** in case_studies is plain text — comma-separated, not JSON.
- To update an existing item, use `update-item` with the item `id`.
- Instance URL for direct admin links: `https://direk.kiryuuki.space/admin/content/{collection}/{id}`