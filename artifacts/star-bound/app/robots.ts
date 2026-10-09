import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/server-content';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    ...(siteUrl() ? { sitemap: `${siteUrl()}/sitemap.xml` } : {}),
  };
}
