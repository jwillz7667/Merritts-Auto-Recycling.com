# Performance report

Measured locally on August 23, 2026 using the production Astro build.

## Build output

| Metric                   |                                        Result |
| ------------------------ | --------------------------------------------: |
| Astro static pages built |                                 21 HTML pages |
| Indexable sitemap URLs   |                                            19 |
| Total built files        |                                            33 |
| Total `dist` size        |                                        1.8 MB |
| Shared CSS               |                              21,824 bytes raw |
| Shared CSS gzip          |                          approximately 5.8 KB |
| External web fonts       |                                             0 |
| Client framework runtime |                                             0 |
| Legacy photo set         | approximately 1.1 MB across five format files |
| Production build time    |     approximately 0.7 seconds after typecheck |

The home hero selects a 205 KB AVIF when supported, with WebP and JPEG fallbacks. Below-the-fold images use native lazy loading. Width and height are set on every photographic image to reserve layout space.

## Implemented performance controls

- static HTML for all marketing routes
- one minified shared stylesheet
- no React/Vue/Svelte client runtime
- no external font stylesheet or font files
- AVIF/WebP/JPEG `<picture>` for the primary hero
- eager/high-priority loading only for the LCP hero
- native lazy loading for other content images
- no autoplay video, carousel, map embed, or chat widget
- immutable one-year caching for brand, image, and Astro assets
- one-hour edge caching for sitemap and robots files
- explicit image dimensions and stable layout containers
- reduced-motion support
- build failure when a CSS asset exceeds 90 KB or JavaScript asset exceeds 60 KB

## Expected Core Web Vitals profile

The architecture is designed for:

- low JavaScript execution cost and good Interaction to Next Paint
- limited render blocking from a single small CSS file
- stable media layout and low Cumulative Layout Shift
- a locally served hero image suitable for a strong Largest Contentful Paint

These are design expectations, not a field-data result. Network, Vercel edge behavior, device class, Turnstile, analytics tags, and the final production environment can change outcomes.

## Remaining measurement

Run Lighthouse and WebPageTest against a Vercel Preview and again after production launch. Test at minimum:

- home on mobile throttling
- `/cash-for-junk-cars`
- `/service-areas/brooklyn-center`
- one guide

Target budgets:

| Check                     |          Target |
| ------------------------- | --------------: |
| Lighthouse Performance    |      90+ mobile |
| Lighthouse Accessibility  |             95+ |
| Lighthouse Best Practices |             95+ |
| Lighthouse SEO            |             95+ |
| LCP                       |  ≤ 2.5 s at p75 |
| INP                       | ≤ 200 ms at p75 |
| CLS                       |    ≤ 0.1 at p75 |

## Regression notes

- Adding GTM/GA4 creates external script and collection requests; measure again after activation.
- Turnstile loads only on form pages and can affect those page scores.
- Do not replace the selected AVIF hero with the original 6.9 MB source file.
- New photos must still come from approved old-site assets unless the owner changes the image-source rule.
- Do not add a carousel or city-page generator to recover the legacy appearance.

## Browser automation environment note

Playwright and axe test files are included. This workspace could not download the Playwright Chromium artifact because the browser CDN returned an empty archive, and the otherwise healthy cloud preview was not reachable from the visual-review browser. Both failures are environmental rather than application test failures. Run `npm run test:e2e` in CI or a developer environment with the Playwright browser installed, then complete visual review before production approval.
