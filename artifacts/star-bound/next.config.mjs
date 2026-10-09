/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-rendered (SSR). The public page fetches /api/site-content at request time.
  poweredByHeader: false,
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    ...(process.env.REPLIT_DOMAINS?.split(',') ?? []),
    ...(process.env.REPLIT_DEV_DOMAIN ? [process.env.REPLIT_DEV_DOMAIN] : []),
  ],
  images: { unoptimized: true },
  transpilePackages: ['@workspace/api-client-react', '@workspace/replit-auth-web'],
  reactStrictMode: true,
};

export default nextConfig;
