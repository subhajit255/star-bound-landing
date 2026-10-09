import type { Metadata } from 'next';
import InfoPage, { generateMetadata as pageMetadata } from '../[slug]/page';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ params: Promise.resolve({ slug: 'terms' }), searchParams: Promise.resolve({}) });
}

export default function TermsPage() {
  return InfoPage({ params: Promise.resolve({ slug: 'terms' }), searchParams: Promise.resolve({}) });
}