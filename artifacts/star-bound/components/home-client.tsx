'use client';

import { getGetSiteContentQueryKey, useGetSiteContent, type SiteContent } from '@workspace/api-client-react';
import { SiteView } from './site-view';

export function HomeClient({ initial }: { initial: SiteContent }) {
  // Server-rendered copy is shown immediately; fresh API content replaces it on mount.
  const { data } = useGetSiteContent({
    query: {
      queryKey: getGetSiteContentQueryKey(),
      initialData: initial,
      initialDataUpdatedAt: 0,
    },
  });
  return <SiteView content={data ?? initial} />;
}
