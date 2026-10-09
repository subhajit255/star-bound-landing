# Star Bound website (Next.js, App Router, SSR)

Investor landing page (`/`) and website content admin (`/admin`). The admin edits website copy and images only.


## Standard pages and enquiries
- `/features`, `/about`, `/pricing`, `/faq`, `/contact`, `/privacy`, `/terms` are server-rendered
  from `/api/website-pages`. The admin's **Additional pages** editor publishes headings,
  descriptions, SEO titles/descriptions, uploaded images and ordered text sections for all seven pages.
- Pricing defaults to written quotations in GBP (£). No rates or commercial terms are invented.
- The contact form sends validated enquiries to `/api/enquiries`; receipt is confirmed only after
  database storage. The admin's **Enquiries** inbox provides refresh, email reply links and confirmed deletion.
  It uses the same approved-email gate as the existing editor. No outbound email service is configured.
- Before collecting live enquiries, review the Privacy and Terms copy in the CMS and confirm
  operator identity/contact, lawful basis, retention, hosting/transfers and final legal terms.
  The default text explicitly marks these unconfirmed details instead of fabricating them.
- Enquiries and website pages require the new Drizzle tables. Apply `pnpm --filter @workspace/db run push`
  to development; follow the existing database migration process before publishing.
- Regression check: `pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/tests/website.test.ts`.
  This uses the development database, removes its synthetic enquiries and republishes unchanged page content.

## How it works
- `/` is server-rendered on every request (`force-dynamic`). `lib/server-content.ts` fetches
  `http://127.0.0.1:8080/api/site-content` (override with `SITE_API_ORIGIN`). This server-only request goes
  directly to the API process because the preview's port-80 proxy is not available inside production.
  If unreachable it fails explicitly
  rather than serving stale fallback copy. HTML and metadata use current saved content.
- The client hydrates with the server copy and refetches fresh content on mount (`components/home-client.tsx`).
- `/admin` is client-rendered, `noindex`. Flow: log in (`useAuth`) -> `useGetAdminAccess` -> editor using
  `useGetSiteContent`, `useUpdateSiteContent`, `useRequestUploadUrl`. Images upload by PUT to the signed URL; the
  `objectPath` is saved and displayed at `/api/storage<objectPath>`. Saving invalidates the public content query.
- Default product previews live in `public/previews/` and are used when no image is uploaded.

## Scripts
- `pnpm --filter @workspace/star-bound dev` - binds `0.0.0.0` and `$PORT`
- `pnpm --filter @workspace/star-bound build` - `next build` (output `.next`)
- `pnpm --filter @workspace/star-bound start` - production server on `0.0.0.0:$PORT`
- `pnpm --filter @workspace/star-bound typecheck`

## Environment
- `SITE_URL` - verified canonical public origin for sitemap and absolute Open Graph URLs. Configure after publishing.
- `STARBOUND_ADMIN_EMAILS` - approved administrator emails, comma-separated (API server).
- `SITE_API_ORIGIN` - server-side API origin (default `http://127.0.0.1:8080`, matching the API artifact's port).
  Browser requests continue using relative `/api` URLs through the public router.

## Structure
`app/` routes, metadata, robots, sitemap - `components/site-view.tsx` shared public view (also powers the admin
preview) - `components/admin-editor.tsx`, `image-field.tsx` - `lib/` content loading and media helpers.
