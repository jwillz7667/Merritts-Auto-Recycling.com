# Merritt's Auto Recycling website

Production-grade, static-first rebuild of [merritts-auto-recycling.com](https://merritts-auto-recycling.com) for Vercel. The rebuilt site is live on the canonical production domain.

## What is included

- Astro 7 static site with 19 indexable routes, plus noindex thank-you and 404 pages
- conversion-led cash-for-cars flow centered on prominent call and text actions
- Zod-validated Vercel function for general contact submissions
- Cloudflare Turnstile, honeypot, origin checks, body limits, warm-instance rate limiting, and Resend idempotency keys
- secure internal lead delivery with provider idempotency
- one canonical LocalBusiness entity using the real Brooklyn Center address
- focused service-area pages for Brooklyn Center and Minneapolis only
- five evergreen guides with Minnesota agency sources where legal or environmental facts are discussed
- XML sitemap, robots controls, canonical metadata, Open Graph metadata, security headers, and permanent legacy redirects
- Vitest, build validation, Playwright, and axe accessibility checks
- a full audit, 2026 SEO compliance record, keyword map, redirect map, verification queue, measurement plan, local SEO launch checklist, and performance report

## Immutable business information

| Field            | Value                                      |
| ---------------- | ------------------------------------------ |
| Business         | Merritt's Auto Recycling                   |
| Call             | 763-533-2775                               |
| Text             | 763-438-2116                               |
| Email            | merrittsautorecycling@gmail.com            |
| Address          | 3106 68th Ave N, Brooklyn Center, MN 55429 |
| Hours            | Every day, 8:00 AM–8:00 PM                 |
| Founder          | Brad Emholtz                               |
| Founded          | 1988                                       |
| Canonical origin | https://merritts-auto-recycling.com        |

The 8:00 AM–8:00 PM daily hours supersede the 9:00 AM–6:00 PM value found in the legacy repository.

## Local development

Requirements:

- Node.js 22.13 or newer
- npm

```bash
npm ci
npm run dev
```

Astro serves the local site at `http://localhost:4321` by default.

## Environment variables

Create an untracked `.env.local` for local development using the variable names below. Configure the same values directly in Vercel for Preview and Production; never commit their values.

| Variable               |    Required | Purpose                                            |
| ---------------------- | ----------: | -------------------------------------------------- |
| `RESEND_API_KEY`       |         Yes | Sends the internal contact-inquiry email           |
| `RESEND_FROM_EMAIL`    |         Yes | Verified sender address                            |
| `RECIPIENT_EMAIL`      |         Yes | Internal lead destination                          |
| `TURNSTILE_SECRET_KEY` |         Yes | Server-side Turnstile verification                 |
| `TURNSTILE_SITE_KEY`   |         Yes | Public widget key rendered at build time           |
| `ALLOWED_ORIGIN`       | Recommended | Canonical production origin                        |
| `PUBLIC_GTM_ID`        |          No | Reserved for an owner-approved analytics container |

The general inquiry form is deliberately disabled in previews where the public Turnstile site key is absent. Call and text actions remain available.

## Commands

```bash
npm run check          # Astro and TypeScript diagnostics
npm run lint           # ESLint
npm run security:scan  # prevent credentials and private data from entering the publish set
npm run test           # Vitest unit and policy tests
npm run build          # typecheck, static build, and output validation
npm run test:e2e       # Playwright and axe checks
npm run test:all       # complete automated suite
npm run format:check   # formatting check
```

The build validator checks:

- exactly one H1 on every HTML page
- useful title, description, and canonical metadata
- corrected phone and hours across all pages
- forbidden legacy claims and templating artifacts
- internal link integrity
- content-image provenance paths
- sitemap and robots behavior
- absence of retired FAQ rich-result markup
- clean-URL parity for legacy blog redirects
- CSS and JavaScript file budgets

## Architecture

```text
src/
  components/          shared UI, contact form, navigation, structured content
  data/                typed business, service, area, FAQ, and guide content
  layouts/             canonical metadata and entity graph
  pages/               static Astro routes and sitemap endpoint
  scripts/             browser-side form and analytics events
api/
  _lib/                validation, abuse prevention, email, and handler pipeline
  contact.ts           general inquiry function
  quote.ts             retired legacy endpoint returning HTTP 410
public/
  brand/               new SVG logo system
  images/legacy/       selected images copied from the old site only
tests/                 unit, redirect, browser, responsive, and accessibility checks
```

All marketing pages are prerendered. The only runtime code is under `/api`.

## Contact-form reliability model

1. Browser performs native constraint validation.
2. Server enforces request method, size, origin, rate limit, honeypot, Zod schema, and Turnstile.
3. The internal lead email is sent with a 24-hour Resend idempotency key.
4. A successful browser response is returned only after the internal inquiry is accepted by the email provider.

Warm-instance rate limiting is defense in depth; Turnstile and provider idempotency remain effective across function instances. If abuse volume warrants durable distributed rate limiting, add a managed store after owner approval.

## Image policy

The only photographic content comes from the previous Merritt's site:

- `merritts-tow-truck.*`
- `junk-car-removal.jpg`
- `auto-recycling-yard.jpg`

No generated imagery or third-party stock was added. The SVG logo and icons are interface/brand assets, not photographic content. See `IMAGE_ASSET_PROVENANCE.md`.

## Deployment safety

Production changes move through a review branch and Vercel Preview before merging to the production branch. Each release must pass the credential scan, automated checks, remote build, metadata validation, and representative redirect checks. Keep environment values in Vercel rather than Git, and see `LAUNCH_HANDOFF.md` for release and rollback guidance.

Search Console and analytics configuration are account-side tasks. See `SEARCH_CONSOLE_HANDOFF.md` for the exact post-launch workflow; do not commit Google or Vercel account credentials to this repository.
