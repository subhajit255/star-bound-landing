import type { MetadataRoute } from 'next';
import { loadSiteContent, loadWebsitePages, siteUrl } from '../lib/server-content';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  if (!origin) return [];
  const [c, p] = await Promise.all([loadSiteContent(), loadWebsitePages()]);
  return [
    { url: `${origin}/`, lastModified: new Date(c.updatedAt), changeFrequency: 'weekly', priority: 1 },
    ...p.pages.map((pg) => ({
      url: `${origin}/${pg.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: pg.slug === 'privacy' || pg.slug === 'terms' ? 0.3 : 0.7,
    })),
  ];
}
