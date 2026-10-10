import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers';
import { siteUrl } from '../lib/server-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: siteUrl() ? new URL(siteUrl()!) : undefined,
  title: 'Star Bound',
  description: 'Star Bound brings model teams, quality scans, and team visibility into one understandable workspace.',
  icons: {
    icon: '/logo.jpeg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
