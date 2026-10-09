import type { Metadata } from 'next';
import InfoPage, { generateMetadata as pageMetadata } from '../[slug]/page';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ params: Promise.resolve({ slug: 'privacy' }), searchParams: Promise.resolve({}) });
}

export default function PrivacyPage() {
  return InfoPage({ params: Promise.resolve({ slug: 'privacy' }), searchParams: Promise.resolve({}) });
}