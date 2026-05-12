# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing site for Merritt's Auto Recycling (Brooklyn Center, MN — phone 763-533-2775). The HTML/CSS/JS at the repo root is the deployed site. There is a small Node 20 / TypeScript tooling layer under `scripts/`, `api/`, and `data/` that generates per-page content, optimizes images, runs Lighthouse, and powers the contact / quote / appointment forms via Vercel serverless functions.

Hosted on **Vercel** (apex `merritts-auto-recycling.com`); DNS at **name.com**. Canonical URL is `https://merritts-auto-recycling.com` (no `www`, no trailing slash, no `.html`).

## Commands

```
npm run dev               # vercel dev (local with serverless functions)
npm run preview           # vercel (preview deploy)
npm run deploy            # vercel --prod

npm run build             # images + placemarks + sitemap + llms (all)
npm run build:images      # Sharp pipeline → WebP/AVIF/optimized originals
npm run build:placemarks  # Inject city-specific content + JSON-LD into 53 placemarks
npm run build:sitemap     # Regenerate sitemap.xml from disk + git lastmod
npm run build:llms        # Regenerate llms.txt + llms-full.txt

npm run validate          # JSON-LD schema validation across every page
npm run lighthouse        # Lighthouse CI gate (mobile + desktop)
npm run typecheck         # tsc --noEmit
npm run lint              # eslint
npm run format            # prettier --write
```

For quick static preview without serverless functions: `python3 -m http.server 8000` (forms will not submit; everything else works).

## Page topology — 57 hand-maintained HTML files

- **4 top-level pages:** `index.html`, `contact.html`, `faq.html`, `testimonials.html` (asset paths `css/...`, `js/...`).
- **53 location pages** under `placemarks/<city>-mn.html` (asset paths `../css/...`, `../js/...`).
- New pages added over the SEO overhaul: `about-brad.html`, `blog/index.html`, `blog/<slug>.html`.

There is no template engine. Shared regions (header, nav, footer, GTM, script tags, structured-data blocks) are **kept in sync via `scripts/apply-shared-blocks.mts`**. The script reads canonical block templates from `data/blocks/*.html` and replaces the content between `<!-- BEGIN auto:<name> -->` and `<!-- END auto:<name> -->` markers in every page. **Never hand-edit content inside `auto:*` markers** — rerun the script.

### Per-placemark content pipeline

`scripts/build-placemarks.mts` reads `data/cities.json` and injects:

- A city-specific `<h1>` + intro hero strip (Phase 2).
- A `local-content` block with neighborhoods, landmarks, drive time, county (Phase 6).
- A `nearby-cities` internal-link block (Phase 6).
- City-scoped `FAQPage` + `BreadcrumbList` + `LocalBusiness` JSON-LD (Phase 4).

Title and meta description follow a deterministic 4-pattern rotation keyed off the city slug — see `scripts/build-placemarks.mts` for the patterns.

### Adding a new service-area city

1. Add an entry to `data/cities.json` with name, slug, county, lat/lng, neighborhoods, landmarks, drive time, nearby slugs.
2. Copy any placemark to `placemarks/<new-city>-mn.html` (template structure only — content is injected by the build script).
3. Run `npm run build:placemarks && npm run build:sitemap`.
4. Add an `<li>` to the service-area list in `index.html` (the build script doesn't currently touch the index).

## Hosting + DNS — Vercel + name.com

- `vercel.json` is the single source of truth for redirects, headers, caching, and function config.
- DNS at name.com:
  - apex `@` → A `76.76.21.21` (Vercel)
  - `www` → CNAME `cname.vercel-dns.com`
- `vercel.json` issues a 301 from `www.merritts-auto-recycling.com/*` → apex.
- HSTS is `max-age=63072000; includeSubDomains; preload`; submission at hstspreload.org is a one-time manual step.
- `cleanUrls: true` — links and canonicals everywhere use the extension-less form (`/contact`, `/placemarks/blaine-mn`).

### Caching policy (set in `vercel.json`)

- `*.html` → `public, max-age=0, must-revalidate` (always revalidate)
- `images/**`, `css/**`, `js/**`, `iconfont/**` → `public, max-age=31536000, immutable` (1 year, never bust without filename change)
- `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` → 1-hour cache

### Why redirects don't break static files

Previously on Netlify, `force=true` on the www→apex redirect was found to intercept requests for `/sitemap.xml` and reroute them through the redirect chain. The Vercel redirects do **not** use a force flag, and the `has: [{ type: "host", … }]` predicate scopes them to the www host. Don't add a catch-all that would shadow asset routes.

## Forms — Vercel serverless functions

Forms post to `/api/contact`, `/api/quote`, `/api/appointment` (TypeScript handlers under `api/`):

- Input validation via Zod (`api/_lib/validate.ts`).
- Cloudflare Turnstile token verified server-side (`api/_lib/turnstile.ts`).
- Email sent via Resend (`api/_lib/email.ts`).
- Env vars are parsed and validated at boot in `api/_lib/env.ts` — missing var = fail fast.

Legacy `form/process-*.php` URLs are 301-redirected to the new `/api/*` endpoints in `vercel.json` (defense against cached external links).

`js/forms.js` uses native `fetch` (not the old jQuery Form Plugin AJAX). On submit:

1. jQuery Validate runs client-side rules.
2. Turnstile token + honeypot are appended to the payload.
3. `fetch(action, { method: 'POST', body: FormData })`.
4. Response handled inline (success message or error UI).

## Frontend stack

jQuery + Bootstrap 3 + plugins (slick, validate, form, waypoints, countTo, magnific-popup, datetimepicker, moment). No bundler — every plugin is a separate `<script>` tag in fixed order, repeated on every page. Custom code:

- `js/custom.js` — sliders, sticky header, scroll triggers, mobile nav, all UI behavior. Loaded with `defer`.
- `js/forms.js` — Zod-aligned form submission to `/api/*`. Loaded with `defer`.
- `css/custom.css` — main stylesheet (~6.2k lines).
- `css/critical/*.css` — per-page-type critical CSS (homepage, contact, faq, testimonials, placemark) inlined in `<head>` for LCP.
- Muli is self-hosted at `css/fonts/` and loaded via `@font-face` with `font-display: swap`. The Google Fonts `<link>` has been removed.

## Image pipeline

`scripts/optimize-images.mts` (Sharp):

- For every JPG/PNG in `images/**`, generates `*.webp` (q=80) + `*.avif` (q=60) siblings under `images/optimized/`.
- Re-encodes JPG/PNG via `mozjpeg` settings.
- Resizes oversized originals (e.g. `footer-tow-truck.jpg` to max-width 1600px).
- Emits `images/optimized/manifest.json` with width/height/byte size of every variant.

Every `<img>` in HTML uses a `<picture>` element with AVIF → WebP → JPEG fallback, explicit `width`/`height`, `loading="lazy"` (below fold), `decoding="async"`. The LCP image gets `fetchpriority="high"` and a matching `<link rel="preload" as="image">` in `<head>`.

## Structured data

JSON-LD blocks are emitted by `scripts/build-placemarks.mts` (per-city) and `scripts/apply-shared-blocks.mts` (global). Sources of truth:

- `data/business.json` — single LocalBusiness entity (name, address, hours, phone, sameAs URLs, founder, geo).
- `data/services.json` — Service / OfferCatalog data.
- `data/faqs.json` — global + per-city FAQ templates.
- `data/cities.json` — per-city facts feeding LocalBusiness `areaServed` + city FAQs + BreadcrumbList.

Every page has, at minimum: a LocalBusiness block (or `@id` reference to the homepage entity), a BreadcrumbList, and a WebPage wrapper. The homepage owns the canonical LocalBusiness `@id = https://merritts-auto-recycling.com/#business`; all other pages reference it rather than redefining the entity.

`npm run validate` parses every `<script type="application/ld+json">` block and validates against schema.org's official context. CI gates on it.

## SEO surface

- Per-page canonical URLs use the extension-less form (`https://merritts-auto-recycling.com/placemarks/blaine-mn`).
- Sitemap is auto-generated from disk + `data/cities.json` + `git log` lastmod.
- `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot (this is a local-services site that benefits from AI Overview citation).
- `llms.txt` (index) + `llms-full.txt` (full content dump) live at the site root.
- IndexNow ping on deploy (`api/indexnow-ping.ts`) — Bing/Yandex pick up changes within minutes.

## Conventions when editing

- **Replicate cross-file edits via the build scripts** — do not hand-edit shared regions across 57 files. Update the template/data, rerun the script.
- **Asset paths differ by depth:** top-level uses `css/…`, placemarks use `../css/…`. The build scripts handle this; if hand-editing, mind the prefix.
- **Phone `763-533-2775` and address `3106 68th Ave N, Brooklyn Center, MN 55429`** are canonical — change in `data/business.json`, then rerun `scripts/apply-shared-blocks.mts`.
- **No emojis in source files.**
- **Strict TypeScript only** in `api/` and `scripts/` — no `any`, no `as` casts unless unavoidable, all external input validated by Zod.
- **Conventional Commits** — `feat(seo): ...`, `perf(images): ...`, `fix(forms): ...`.

## Environment variables

See `.env.example`. Required at runtime: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RECIPIENT_EMAIL`, `TURNSTILE_SECRET_KEY`. Optional: `TURNSTILE_SITE_KEY` (also injected into HTML at build), `GOOGLE_MAPS_API_KEY` (build-time only), `INDEXNOW_KEY`, `SLACK_WEBHOOK_URL`.

Set in Vercel dashboard under Project → Settings → Environment Variables. Local development uses `.env.local` (gitignored).
