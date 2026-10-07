# Twin Cities SEO release — October 7, 2026

## Implemented in the repository

- Metro-wide homepage and four revised service pages, retaining the established business identity and contact details.
- A regional service directory with 16 substantive city destinations; coverage is stored centrally in `src/data/metro.ts`.
- One Brooklyn Center business entity; city pages describe pickup areas rather than invented branch offices.
- City-specific legacy redirects for every published city, including the Saint Paul spelling alias.
- Expanded title/document and valuation guides; dedicated weight-comparison and repair/trade-in decision guides.
- Original evergreen guide data retained in `src/data/guide-library.ts`; `src/data/guides.ts` owns the published revisions and additions.
- Accurate article dates and per-content sitemap modification dates rather than a single changing timestamp.
- Customer-facing About and Reviews pages, direct Google review links, and clearer call/text instructions.
- Call/text event context includes page group and CTA placement without customer details or campaign query strings.
- Security scan, lint, unit tests, Astro diagnostics, static build, and output validation are configured as deployment gates in `vercel.json`.

## External work not accomplished by a code push

Google Business Profile categories, service-area settings, directory listing corrections, and any profile website UTM changes must be made through their respective accounts. No profile changes are implied by this release. The existing approved Google profile link is retained.

Google Tag Manager still requires an approved `PUBLIC_GTM_ID` and a published container. Code events do not establish that analytics is receiving data. Verify events in preview/debug tooling and distinguish click proxies from answered calls and completed purchases. Do not put customer identifiers or vehicle documents in analytics.

No customer testimonials, ratings, completed-job stories, or additional photographs were invented. Authentic review excerpts and pickup photos can be added after their source, permission, and privacy review. Request honest feedback consistently without incentives or review gating.

No live search-volume estimate, guaranteed ranking, or measured Core Web Vitals score is asserted. Browser/device checks and field performance should be recorded separately from the code checks.

## Verification and launch checks

1. Run `npm run security:scan`, `npm run lint`, `npm run test`, and `npm run build`. Run `npm run test:e2e` when a browser-equipped environment is available.
2. Verify production homepage, Minneapolis, St. Paul, Woodbury, Eagan, Buffalo, documents guide, and sitemap responses.
3. Verify representative legacy city and blog redirects reach the matching new content without loops.
4. Confirm the existing contact form still delivers a real inquiry before counting it as a verified conversion. Preserve Turnstile and provider idempotency.
5. In Search Console, inspect important new URLs and the sitemap. Compare old and replacement content groups together over matched periods.
6. Monitor qualified inquiries and completed purchases by city, separately from phone-button clicks. Prioritize future local pages using actual demand and service economics.

## References

- Google local results: https://support.google.com/business/answer/7091
- Service-area guidelines: https://support.google.com/business/answer/9157481
- Search spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Site moves: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

Earlier audit documents describe the August two-city release. This document supersedes that geographic scope; it does not override security or factuality safeguards.
