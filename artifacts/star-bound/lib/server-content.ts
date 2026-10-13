import type { SiteContent, WebsitePage, WebsitePages } from '@workspace/api-client-react';
import { cache } from 'react';

/** Server-only access to the API process; the preview's port-80 proxy is not available inside production. */
const API_ORIGIN = (process.env.SITE_API_ORIGIN || 'http://127.0.0.1:8080').replace(/\/$/, '');

const FALLBACK_SITE_CONTENT: SiteContent = {
  brandName: 'Star Bound',
  heroEyebrow: 'AI operations workspace',
  heroTitle: 'Run your AI teams from one clear view.',
  heroDescription:
    'Star Bound brings model teams, quality scans, and team visibility into one understandable workspace, so operators always know what is running and what needs attention.',
  primaryCta: 'Explore the product',
  secondaryCta: 'See the workflow',
  heroImagePath: null,
  proofHeadline: 'Built for the people who keep AI work on track.',
  proofDescription:
    'One place to compose model teams, check their quality, and share a plain-language read on the whole operation.',
  metrics: [],
  features: [
    { title: 'Constellations', description: 'Compose focused model teams and keep their quality visible at a glance.', imagePath: null },
    { title: 'Workspace overview', description: 'A clear read on AI operations, usage, and team activity.', imagePath: null },
    { title: 'Reports and analytics', description: 'Turn product activity into a sharper view of what is changing.', imagePath: null },
    { title: 'Content library', description: 'Keep guidance, templates, and release notes useful and current.', imagePath: null },
  ],
  workflowTitle: 'From first model to shared confidence.',
  steps: [
    { title: 'Compose', description: 'Group models into a constellation built for one job.' },
    { title: 'Scan', description: 'Run quality scans and surface findings early.' },
    { title: 'Review', description: 'See health, usage, and risk in one place.' },
    { title: 'Share', description: 'Give the whole team the same clear picture.' },
  ],
  closingTitle: 'See Star Bound in motion.',
  closingDescription: 'Take the product tour and see how the workspace fits together.',
  closingCta: 'Back to the top',
  updatedAt: new Date().toISOString(),
};

export const loadSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const res = await fetch(`${API_ORIGIN}/api/site-content`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    return (await res.json()) as SiteContent;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      return FALLBACK_SITE_CONTENT;
    }
    throw err;
  }
});

export function siteUrl(): string | undefined {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  return undefined;
}

export const loadWebsitePages = cache(async (): Promise<WebsitePages> => {
  const res = await fetch(`${API_ORIGIN}/api/website-pages`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`Website pages request failed with status ${res.status}`);
  return (await res.json()) as WebsitePages;
});

export const PAGE_SLUGS = ['features', 'about', 'pricing', 'faq', 'contact', 'privacy', 'terms'] as const;

export function isPageSlug(s: string): s is WebsitePage['slug'] {
  return (PAGE_SLUGS as readonly string[]).includes(s);
}
