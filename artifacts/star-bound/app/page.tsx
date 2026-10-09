import type { Metadata } from 'next';
import { loadSiteContent, siteUrl } from '../lib/server-content';
import { HomeClient } from '../components/home-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const c = await loadSiteContent();
  const title = `${c.brandName}: ${c.heroTitle}`.slice(0, 120);
  const description = c.heroDescription.slice(0, 160);
  const image = c.heroImagePath ? `/api/storage${c.heroImagePath}` : '/previews/dashboard.png';
  const origin = siteUrl();
  return {
    title,
    description,
    ...(origin ? { alternates: { canonical: `${origin}/` } } : {}),
    openGraph: {
      type: 'website',
      siteName: c.brandName,
      title,
      description,
      ...(origin ? { url: `${origin}/`, images: [{ url: `${origin}${image}` }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, ...(origin ? { images: [`${origin}${image}`] } : {}) },
  };
}

export default async function HomePage() {
  const content = await loadSiteContent();
  return <HomeClient initial={content} />;
}
