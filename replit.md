# Star Bound

Investor-facing website explaining Star Bound's product features and usability, with client-managed website content and images.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- The client wants the website before the full product app, to demonstrate features and usability to investors. Do not expand this CMS into the AI product backend.
- Next.js server rendering is required so website content and metadata are visible to search engines immediately after CMS changes.
- The public site does not claim customer traction. Supplied product screenshots contain example dashboard numbers.
- Editing requires an authenticated email in `STARBOUND_ADMIN_EMAILS`; no first-user auto-admin or public editing.

## Product

The website includes Features, About, Pricing, FAQ, Contact, Privacy and Terms alongside
the homepage. Website pages and SEO copy are managed in the existing admin CMS.
Contact enquiries are stored in the protected admin inbox; email reply links do not
imply an automated email service.

Keep UK positioning and GBP (£). Use quote-based pricing until real prices are supplied.
Do not invent company identity, registration, addresses, tax treatment, service promises
or legal arrangements. Legal-page defaults require operator review before live collection.

## User preferences

The user explicitly requires Next.js, SEO support, editable website copy/images, and complete source-code handoff. See README.md for setup.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
