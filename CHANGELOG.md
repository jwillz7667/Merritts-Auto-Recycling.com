# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Dates are ISO 8601 (`YYYY-MM-DD`) and reflect when the change reached
production.

## [Unreleased]

### Added

- Pro-dev-team tooling baseline: husky pre-commit / commit-msg / pre-push
  hooks, `lint-staged`, `commitlint` (Conventional Commits), EditorConfig,
  `.gitattributes`, `.markdownlint.jsonc`, `.npmrc`, pinned Node version
  via `.node-version` + `.nvmrc`.
- VS Code workspace baseline: `settings.json`, `extensions.json`,
  `launch.json`, `tasks.json`.
- GitHub workflows: `.github/workflows/ci.yml` (typecheck, lint, format,
  schema validation, commitlint on PRs) and
  `.github/workflows/lighthouse.yml` (weekly performance gate).
- GitHub issue templates (bug, feature, config), PR template, CODEOWNERS,
  Dependabot config.
- Governance: `LICENSE` (proprietary, assigned to Viral Ventures LLC,
  Maple Grove, MN), `NOTICE` (third-party attribution),
  `SECURITY.md`, `CONTRIBUTING.md`.

## [1.0.0] — 2026-05-12

Initial production release of the Merritt's Auto Recycling site on Vercel
under the proprietary license held by Viral Ventures LLC.

### Added

- 57-page static site: 4 top-level pages (`index`, `contact`, `faq`,
  `testimonials`) plus 53 service-area placemarks.
- New pages: `about-brad.html`, `blog/index.html`, and 10 long-form blog
  posts.
- Vercel hosting baseline: `vercel.json` with 301 redirects (www → apex,
  trailing slash, legacy PHP form URLs), security headers (HSTS, CSP,
  Frame Options, Referrer Policy, Permissions Policy), 1-year immutable
  caching for static assets, and `cleanUrls: true` for extension-less URLs.
- Serverless contact/quote/appointment endpoints under `api/` with Zod
  validation, Cloudflare Turnstile verification, and Resend email
  delivery.
- Per-city content pipeline driven by `data/cities.json` + Node 20 /
  TypeScript build scripts (`scripts/build-placemarks.mts`,
  `scripts/apply-shared-blocks.mts`, `scripts/build-blog.mts`,
  `scripts/build-sitemap.mts`, `scripts/build-llms.mts`).
- WebP/AVIF image pipeline (`scripts/optimize-images.mts`) plus
  `<picture>` markup with intrinsic dimensions and `fetchpriority`
  hints on every page.
- JSON-LD structured data: LocalBusiness + Service + AggregateRating on
  the homepage; per-page BreadcrumbList + FAQPage + city-scoped
  LocalBusiness references on placemarks; Article schema on blog posts.
  Validated by `scripts/validate-schema.mts` (CI-gated).
- AI-search surface: `llms.txt`, `llms-full.txt`, `robots.txt` allow-lists
  for GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
  Applebot-Extended, CCBot. IndexNow deploy hook.
- Self-hosted Muli font via `@font-face` with `font-display: swap`.
- Per-page-type critical CSS inlined in `<head>` for LCP.
- Sticky mobile click-to-call CTA; SMS links re-enabled site-wide.
- Lazy-loaded Google Maps embed on `contact.html` and `index.html`.

### Changed

- Migrated hosting from Netlify to Vercel; DNS held at name.com.
  Canonical URL is `https://merritts-auto-recycling.com` (apex, no
  trailing slash, no `.html`).
- Replaced the jQuery Form Plugin AJAX flow with native `fetch` against
  the new `/api/*` endpoints; preserved client-side jQuery Validate rules.

### Removed

- `netlify.toml` (dead config since the Vercel migration).
- Google Maps placeholder script tag that 404'd on every page.
- Preloader splash + `body.loaded` JS gate.

### Security

- HSTS submitted for browser preload list.
- CSP allow-list for GTM, Maps, and self-hosted fonts; everything else
  blocked.
- Cloudflare Turnstile guards every public form endpoint.
