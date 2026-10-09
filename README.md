# Star Bound website

Investor-facing Next.js website and a protected website content editor.
This is the marketing website and CMS, not the complete AI product application.

## Stack

- Next.js App Router, React, TypeScript and server-rendered public content
- Express API, PostgreSQL and Drizzle
- Replit Auth for administrator sign-in
- Replit App Storage for persistent uploaded images
- pnpm workspace and generated OpenAPI clients

## Run on Replit

1. Install dependencies: `pnpm install`.
2. Push the development database schema: `pnpm --filter @workspace/db run push`.
3. Set `STARBOUND_ADMIN_EMAILS` to the approved administrator email(s), comma-separated.
4. Start the managed API Server and Star Bound web workflows.
5. Open `/` for the public site and `/admin` for the website editor.

The database and object-storage environment are provisioned by Replit.
Never add credentials to source files. Auth uses the Replit OIDC provider.
Only an authenticated account whose email matches `STARBOUND_ADMIN_EMAILS`
may save content or request image upload URLs. If it is unset, editing is locked.

After publishing, set `SITE_URL` to the verified public website origin,
for example the actual HTTPS custom domain. This enables canonical URLs,
absolute social preview URLs and the sitemap. Do not use a temporary preview URL.
`SITE_API_ORIGIN` defaults to `http://127.0.0.1:8080`, the API process's local
port. Server-rendered requests must not use the workspace's port-80 preview
proxy inside a published container. Browser requests use relative `/api` URLs.

## Content editing

The admin can change all hero copy, overview copy, metrics, feature titles and
descriptions, workflow steps, and the closing call to action. Metrics, features,
and steps support add, remove and reordering. Image uploads support PNG, JPEG,
WebP and AVIF up to 10 MB. Changes become public after **Save and publish**.

Content is persisted in PostgreSQL. Image bytes are in App Storage.
The supplied screenshots are product-demo previews, not live app data or
verified customer traction.

Additional pages (`/features`, `/about`, `/pricing`, `/faq`, `/contact`, `/privacy`,
`/terms`) are edited through **Additional pages**, including SEO copy, uploaded
images and ordered sections. They render current saved content on every request.
Pricing is quote-based in GBP (£).

The contact form stores validated enquiries in PostgreSQL. **Enquiries** in the
protected admin area lets approved administrators review them, reply by email
using their mail app and confirm deletion. It does not send automated emails.
Before collecting live enquiries, the operator must review the legal-page copy
and supply its legal identity, privacy contact, lawful basis, retention and hosting
details. The defaults do not invent these facts.

## Development

- `pnpm run typecheck` — checks all source packages.
- `pnpm --filter @workspace/star-bound run build` — Next.js production build.
- `pnpm --filter @workspace/api-server run build` — API production build.
- `pnpm --filter @workspace/api-spec run codegen` — regenerates clients after API changes.
- `pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/tests/website.test.ts`
  — checks page publishing, enquiry persistence/validation and admin protection in development.
- `python scripts/export-source.py` — creates the complete website source ZIP in
  `artifacts/star-bound/public/downloads/star-bound-source.zip`.

The export includes source, preview images, generated API clients, dependency
lockfile and configuration. It excludes credentials, administrator email
settings, dependencies, caches, build outputs and database/file-storage data.
Replit-specific configuration is included with user environment settings removed.

## Landing-page animation

The hero has staggered text entrances, a screenshot entrance, a slowly moving
glow, stars and subtle button highlights. Sections reveal once as they enter the
viewport. Content stays visible without JavaScript; reduced-motion preferences
disable animation. These effects do not change content or CMS behaviour.

## Source layout

- `artifacts/star-bound/` — Next.js site, admin UI and preview images.
- `artifacts/api-server/` — auth, content and image APIs.
- `lib/db/` — database models.
- `lib/api-spec/` — API contract.
- `lib/api-client-react/`, `lib/api-zod/` — generated typed clients and validation.
- `lib/replit-auth-web/` — browser sign-in hook.

## Hosting outside Replit

The full source is included, but Replit Auth and App Storage use Replit-managed
infrastructure. Another host needs equivalent OIDC and file-storage adapters
plus PostgreSQL. These integrations are not portable just by copying secrets.