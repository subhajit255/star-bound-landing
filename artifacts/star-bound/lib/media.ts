const FALLBACKS = [
  '/previews/constellations.png',
  '/previews/dashboard.png',
  '/previews/reports.png',
  '/previews/content.png',
];

export function storageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `/api/storage${path}`;
}

export function featureImage(path: string | null | undefined, index: number): string {
  return storageUrl(path) ?? FALLBACKS[index % FALLBACKS.length];
}

export function heroImage(path: string | null | undefined): string {
  return storageUrl(path) ?? '/previews/dashboard.png';
}
