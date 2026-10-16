# Merritt's Auto Recycling

The current Astro visual rebuild is preserved. SEO recovery restores all listed and historical community destinations, direct vehicle inquiries, source-backed guides and complete migration validation. See [the August-to-current audit](docs/dev/AUGUST_MIGRATION_AUDIT_2026-10-16.md) for the evidence and original URL inventory.

## Current content inventory

- 88 dedicated city/community pages: all 66 previously listed metro cities plus all 22 additional historical community destinations. Every directory entry links to its own page.
- Six regional guides and one regional directory. Wider or unconfirmed pickup areas are described as inquiries, not invented offices or blanket service promises.
- 13 selling guides, including restored article answers, a dedicated Minneapolis pickup/cost guide, and the attributed competitor comparison.
- 121 indexable URLs; the sitemap is generated from content and checked against built pages. The thank-you and custom 404 pages remain noindex.
- Explicit mappings for all 53 historical regional URLs and all ten legacy blog topics. Each regional URL has clean and .html aliases; unknown legacy URLs now return a genuine 404 instead of an irrelevant catch-all redirect.

## Business information

Merritt's Auto Recycling; founder Brad Emholtz; established 1988. Business base: 3106 68th Ave N, Brooklyn Center, MN 55429. Call 763-533-2775; text 763-438-2116; email merrittsautorecycling@gmail.com. Open every day, 8:00 AM–8:00 PM. Canonical origin: https://merritts-auto-recycling.com.

Do not invent other locations, customer reviews, payment amounts, timing guarantees, licenses or service outcomes. Pricing, payment method, documents and pickup terms are agreed for each transaction. Source-backed public legal guidance does not replace a vehicle-specific review.

## Development and verification

Node 22.13 or newer and npm are required. Run `npm ci`, then `npm run dev`.

- `npm run security:scan`: scan publishable source for sensitive data. This is not an npm dependency-vulnerability audit.
- `npm run lint`: ESLint.
- `npm run test`: unit and content/migration regression checks.
- `npm run build`: Astro diagnostics, static build and output validation.
- `npm run test:e2e`: browser tests against an already built dist directory. Install Chromium using the same PLAYWRIGHT_BROWSERS_PATH used by the package script.
- `npm run test:all`: source scan, lint, unit tests, build and browser tests.
- `node scripts/dependency-report.mjs`: read-only dependency advisory report, including production-tree classification.

The recovery GitHub Actions workflow builds with public test identifiers and mocks third-party analytics and form delivery. No production credentials are available to the workflow. It verifies routes, metadata, the sitemap, mobile/desktop contrast, keyboard navigation, privacy choices and inquiry response handling. Mocked delivery is not proof of production mailbox receipt.

## Content architecture

`src/data/business-content.ts` holds established business/service data. `site.ts` publishes the complete route inventory. `metro-existing.ts` retains the existing visual-rebuild city content and coverage list; `recovery-areas.ts` adds recovered cities; `metro.ts` exposes the combined catalog. `city-directory.json` is the complete city/link inventory; `directory-*.ts` supplies the remaining metro and historical community pages. `service-regions.ts` defines regional inquiries. `legacy-routes.json` is the regression inventory for historical paths; corresponding Vercel rules are tested against it.

`guide-library.ts`, `guide-base.ts` and `search-guides.ts` retain earlier article versions and revisions. `recovery-guides.ts` supplies recovered topics; `legacy-guide-restoration.ts` restores detailed historical answers and original article dates. `guides.ts` exposes the reviewed publication catalog while preserving established URLs. Page templates use this catalog, not an independent route list.

The homepage's `GoogleReviews.astro` section uses four short, attributed Google review excerpts and an explicitly dated rating snapshot from `src/data/google-reviews.ts`. See [review provenance and refresh instructions](docs/dev/GOOGLE_REVIEWS_PROVENANCE_2026-10-16.md). This is a verified snapshot with original review links, not a live widget; refresh the source evidence and displayed check date together. The corrected Maps CID identifies the actual listing rather than its Business Profile management ID.

The contact form and dedicated `/get-a-quote` vehicle-offer page submit to the existing protected `/api/contact` backend. Old calculator links lead to the manual offer request. Retired quote-calculator and appointment endpoints remain retired. There is no automated price calculator, public document upload or automatic pickup booking.

## Account configuration and honest status

The secured form requires its existing Resend and Turnstile environment settings. Call/text remain available when form verification is not configured. Do not place credentials in Git.

Optional analytics is disabled when no public destination is configured. Set `PUBLIC_GA4_ID` to an owner-controlled GA4 measurement ID or `PUBLIC_GTM_ID` to a reviewed, published container, then verify actual collection. `PUBLIC_ANALYTICS_MODE` supports auto, ga4, gtm, legacy and off. Legacy mode explicitly selects the former public container GTM-WDZ8L9TN; that container was observed with no published tags during recovery and must not be described as active measurement. Setting an ID or passing a browser test does not establish receipt in GA4.

Analytics waits for consent; browser privacy opt-outs are respected. Review third-party tags separately before enabling a container. See MEASUREMENT_PLAN.md and /privacy.

The available Vercel account connection did not authorize this project's scope during recovery, and Search Console access was blocked by the GSC connector subscription. Those account-side limitations are not solved by committing source code. Do not claim indexing, tag publication, production email receipt, or traffic recovery without actual evidence.

## Release discipline

Validate a staging branch, review browser evidence, then merge its pull request with an expected-head check. Confirm the production Vercel result and live URL checks after deployment. Do not use force pushes. Keep the modern styles, contrast fix and approved imagery intact.

SEO_AUDIT.md, SEO_2026_COMPLIANCE.md and CONTENT_VERIFICATION_REQUIRED.md describe prior August decisions and are historical context, not authority to restore the obsolete two-city restriction. Current inventory and migration requirements are defined above and in RECOVERY_RELEASE.md.
