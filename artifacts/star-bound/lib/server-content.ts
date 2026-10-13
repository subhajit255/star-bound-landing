import type { SiteContent, WebsitePage, WebsitePages } from '@workspace/api-client-react';
import { cache } from 'react';

/** Server-only access to the API process; the preview's port-80 proxy is not available inside production. */
const API_ORIGIN = (process.env.SITE_API_ORIGIN || 'http://127.0.0.1:8080').replace(/\/$/, '');

const FALLBACK_SITE_CONTENT: SiteContent = {
  brandName: 'Star Bound',
  heroEyebrow: '✦ Body-Constellation Vision AI',
  heroTitle: 'Your skin tells a cosmic story. Turn every freckle into a constellation.',
  heroDescription:
    'Star Bound uses proprietary on-device computer vision to turn natural freckles, beauty marks, and skin patterns into personal astronomical star maps. A viral consumer experience bridging personal identity with the stars.',
  primaryCta: 'Explore Investor Deck',
  secondaryCta: 'View Traction & Growth',
  heroImagePath: null,
  proofHeadline: 'Where human biology meets celestial discovery.',
  proofDescription:
    'An emotionally captivating consumer AI product with viral TikTok organic momentum, zero-privacy-leakage on-device scanning, and high-retention personal star lore.',
  metrics: [],
  features: [
    { title: 'Real-Time Skin Scanning', description: 'On-device neural vision instantly isolates freckle coordinates and skin patterns with zero server latency.', imagePath: null },
    { title: 'Astronomical Star Matching', description: 'Maps coordinates against IAU celestial charts or generates one-of-a-kind personal star systems.', imagePath: null },
    { title: 'The Constellation Vault', description: 'Track skin star maps over seasons, trace pattern evolutions, and unlock personal mythological lore.', imagePath: null },
    { title: 'Physical Celestial Goods', description: 'Turn digital skin constellations into laser-etched sterling silver pendants and fine-art prints.', imagePath: null },
  ],
  workflowTitle: 'From first model to shared confidence.',
  steps: [],
  closingTitle: 'Back the future of personal astronomy.',
  closingDescription: 'Star Bound is raising our Seed Round to scale on-device vision models, expand viral creator marketing, and launch custom celestial merchandise.',
  closingCta: 'Request Pitch Deck & Data',
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
