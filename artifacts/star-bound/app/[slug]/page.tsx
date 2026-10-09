import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isPageSlug, loadSiteContent, loadWebsitePages, siteUrl } from '../../lib/server-content';
import { PageView } from '../../components/page-view';
import { storageUrl } from '../../lib/media';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isPageSlug(slug)) return { title: 'Page not found' };
  const [pages, c] = await Promise.all([loadWebsitePages(), loadSiteContent()]);
  const page = pages.pages.find((p) => p.slug === slug);
  if (!page) return { title: 'Page not found' };
  const origin = siteUrl();
  const img = storageUrl(page.imagePath) ?? '/previews/dashboard.png';
  const url = origin ? `${origin}/${slug}` : undefined;
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: 'website',
      siteName: c.brandName,
      title: page.seoTitle,
      description: page.seoDescription,
      ...(url ? { url, images: [{ url: `${origin}${img}` }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seoTitle,
      description: page.seoDescription,
      ...(origin ? { images: [`${origin}${img}`] } : {}),
    },
  };
}

export default async function InfoPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!isPageSlug(slug)) notFound();
  const sp = await searchParams;
  const [pages, c] = await Promise.all([loadWebsitePages(), loadSiteContent()]);
  const page = pages.pages.find((p) => p.slug === slug);
  if (!page) notFound();
  const raw = Array.isArray(sp.interest) ? sp.interest[0] : sp.interest;
  const interest = raw === 'demo' || raw === 'pricing' || raw === 'general' ? raw : undefined;
  return <PageView page={page} brand={c.brandName} updatedAt={pages.updatedAt} interest={interest} />;
}
