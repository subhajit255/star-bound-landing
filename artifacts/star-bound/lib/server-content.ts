import type { SiteContent, WebsitePage, WebsitePages } from '@workspace/api-client-react';
import { cache } from 'react';

/** Server-only access to the API process; the preview's port-80 proxy is not available inside production. */
const API_ORIGIN = (process.env.SITE_API_ORIGIN || 'http://127.0.0.1:8080').replace(/\/$/, '');

export const loadSiteContent = cache(async (): Promise<SiteContent> => {
    const res = await fetch(`${API_ORIGIN}/api/site-content`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    return (await res.json()) as SiteContent;
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
