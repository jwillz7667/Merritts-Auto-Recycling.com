# Merritt's Auto Recycling website

Production-grade, static-first rebuild of [merritts-auto-recycling.com](https://merritts-auto-recycling.com) for Vercel.

The production domain currently remains on a dedicated maintenance page. This refactor must be reviewed and explicitly approved before it replaces that page.

## What is included

- Astro 7 static site with 20 indexable routes, plus noindex thank-you and 404 pages
- conversion-led cash-offer flow with prominent call and text actions
- Zod-validated Vercel functions for quote and contact submissions
- Cloudflare Turnstile, honeypot, origin checks, body limits, warm-instance rate limiting, and Resend idempotency keys
- internal lead delivery before a best-effort quote confirmation to the customer
- one canonical LocalBusiness entity using the real Brooklyn Center address
- focused service-area pages for Brooklyn Center and Minneapolis only
- five evergreen guides with Minnesota agency sources where legal or environmental facts are discussed
- XML sitemap, robots controls, canonical metadata, Open Graph metadata, security headers, and permanent legacy redirects
- Vitest, build validation, Playwright, and axe accessibility checks
- a full audit, keyword map, redirect map, verification queue, measurement plan, local SEO launch checklist, and performance report

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

| Variable               |    Required | Purpose                                             |
| ---------------------- | ----------: | --------------------------------------------------- |
| `RESEND_API_KEY`       |         Yes | Sends internal lead and customer-confirmation email |
| `RESEND_FROM_EMAIL`    |         Yes | Verified sender address                             |
| `RECIPIENT_EMAIL`      |         Yes | Internal lead destination                           |
| `TURNSTILE_SECRET_KEY` |         Yes | Server-side Turnstile verification                  |
| `TURNSTILE_SITE_KEY`   |         Yes | Public widget key rendered at build time            |
| `ALLOWED_ORIGIN`       | Recommended | Canonical production origin                         |
| `PUBLIC_GTM_ID`        |          No | Reserved for an owner-approved analytics container  |

Forms are deliberately disabled in previews where the public Turnstile site key is absent. The call action remains available.

## Commands

```bash
npm run check          # Astro and TypeScript diagnostics
npm run lint           # ESLint
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
- CSS and JavaScript file budgets

## Architecture

```text
src/
  components/          shared UI, forms, navigation, structured content
  data/                typed business, service, area, FAQ, and guide content
  layouts/             canonical metadata and entity graph
  pages/               static Astro routes and sitemap endpoint
  scripts/             browser-side form and analytics events
api/
  _lib/                validation, abuse prevention, email, and handler pipeline
  contact.ts           general inquiry function
  quote.ts             vehicle offer-request function
public/
  brand/               new SVG logo system
  images/legacy/       selected images copied from the old site only
tests/                 unit, redirect, browser, responsive, and accessibility checks
```

All marketing pages are prerendered. The only runtime code is under `/api`.

## Form reliability model

1. Browser performs native constraint validation.
2. Server enforces request method, size, origin, rate limit, honeypot, Zod schema, and Turnstile.
3. The internal lead email is sent with a 24-hour Resend idempotency key.
4. Only after internal delivery succeeds does the quote function attempt a customer confirmation.
5. Customer confirmation failure is logged but does not discard or falsely report failure for an already-delivered lead.

Warm-instance rate limiting is defense in depth; Turnstile and provider idempotency remain effective across function instances. If abuse volume warrants durable distributed rate limiting, add a managed store after owner approval.

## Image policy

The only photographic content comes from the previous Merritt's site:

- `merritts-tow-truck.*`
- `junk-car-removal.jpg`
- `auto-recycling-yard.jpg`

No generated imagery or third-party stock was added. The SVG logo and icons are interface/brand assets, not photographic content. See `IMAGE_ASSET_PROVENANCE.md`.

## Deployment safety

Do not merge this rebuild into the production branch or remove the maintenance page until all of the following are true:

1. `CONTENT_VERIFICATION_REQUIRED.md` is reviewed by the owner.
2. Resend and Turnstile variables are verified in a Vercel Preview deployment.
3. Form submissions reach the intended inbox and customer confirmation behaves as documented.
4. Analytics and consent decisions are approved.
5. Redirects are sampled in Preview.
6. The owner explicitly approves production launch.

See `LAUNCH_HANDOFF.md` for the complete sequence.
