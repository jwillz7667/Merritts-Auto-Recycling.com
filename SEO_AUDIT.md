# SEO and site-quality audit

Updated October 16, 2026. Canonical site: `https://merritts-auto-recycling.com`. Pre-overhaul production baseline: `94010ccf1dd88c5bb8d0b4145a5767fe84f80958`.

This summary replaces the August two-city/19-page recommendation. The detailed historical evidence, all legacy destinations, article comparisons, limitations and current repairs are in [the August migration audit](docs/dev/AUGUST_MIGRATION_AUDIT_2026-10-16.md). Release status must be verified against the exact deployed revision; a source change or old successful test run does not establish publication.

## Current findings and implementation

The owner reports the traffic decline in Google Search Console and explicitly requested a real page for every listed service-area city plus recovery of the historical traffic subjects. The source audit found that the August launch reduced the sitemap from 70 content URLs to 19, removed 51 own-geography destinations, and consolidated substantial articles into much shorter or less relevant replacements. Those are demonstrated migration defects and plausible contributors to the search loss. They do not establish the click contribution of each page without account-side performance data.

The repair preserves the Astro design and provides:

- 88 dedicated community pages: all 66 previously listed metro cities and 22 additional historical communities, including a real St. Paul page.
- Six regional guides with appropriate county/state destinations.
- Thirteen selling guides, including all ten historical article subjects, fuller practical answers and their original publication dates.
- A dedicated `/get-a-quote` request page backed by the existing protected contact API; submission requests a human-reviewed offer and does not dispatch a truck.
- 121 indexable canonical destinations in the complete prepared inventory.
- Direct own-city migration mappings, complete historical article mappings, retained-photo aliases and checks against an independent pre-overhaul fixture.
- One business identity at the real Brooklyn Center address, accurate call/text details and owner-corrected daily 8 AM–8 PM hours.

A service-area page describes a community where an inquiry can be discussed. The exact address, vehicle, access, terms and scheduling remain subject to direct review. The city inventory does not create additional offices or justify fabricated local jobs, testimonials or unconditional pickup promises.

## Historical August assessment and corrections

The original August 25 report treated the smaller crawl surface as a benefit and presented blanket city consolidation as adequate migration. The October audit supersedes that recommendation. Useful city pages and specific article answers should have been retained and improved alongside the visual rebuild.

| Area               | August behavior or rationale                                                                       | October evidence and corrective treatment                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Crawl surface      | Reduced to 19 indexable URLs and two city destinations                                             | The old sitemap contained 70 real content URLs; 76 HTML files included six invalid font artifacts. Restore relevant content destinations instead of treating a smaller index as an SEO success.  |
| City migration     | 51 historical geographic destinations fell back to `/service-areas`                                | A permanent redirect to a directory did not preserve the own-city answer. All 49 historical cities/communities now have corresponding destinations; county/state subjects retain regional pages. |
| Article migration  | Ten articles consolidated into three subject-specific guides, a service page and the guide index   | Restore all ten subjects and concrete answers; preserve existing guide canonical URLs and original article publication metadata.                                                                 |
| Selling intent     | Retired the old quote form and sent its URL to a general service page                              | The old `quote-calculator.html` was already a manual lead form, not an automatic valuation tool. Restore a dedicated human-reviewed quote-request destination.                                   |
| Clean URLs         | Initial blog redirect sources used `.html` despite clean URLs                                      | Sources were corrected on August 25. Keep both legacy request forms covered in live verification.                                                                                                |
| Claims and reviews | Removed or qualified unverified prices, rankings, licenses, timing, testimonials and review markup | Retain the accuracy improvements while recovering useful questions and answers. Do not republish unsupported assertions solely because they appeared before.                                     |
| Business entity    | Consolidated duplicated city-specific business identities                                          | Keep one business identity and describe cities through relevant service pages, without phantom offices.                                                                                          |
| Frontend           | Replaced legacy Bootstrap/jQuery/plugin workflow with static Astro                                 | Preserve the modern rendering and responsive design while restoring migration coverage.                                                                                                          |
| Measurement        | Removed rendered GTM integration                                                                   | This affects site analytics visibility, not Search Console collection. GSC decline requires search-performance investigation independently of GA4.                                               |

The brief August maintenance transition and the two-day clean-URL configuration defect are recorded in the full audit. Source timestamps do not reconstruct every historical production response or Google crawl.

## Crawl, routing and content controls

Every indexable page should be complete static HTML, reachable through crawlable internal links, and present once in the canonical sitemap. Directory entries, generated pages, regional references, titles, canonical URLs, business service areas and redirect manifests must agree with the complete inventory. Every historical content URL is accounted for in `tests/fixtures/pre-overhaul-url-inventory.json`.

Historical city requests must reach their own community destinations. Historical article requests must reach pages answering the corresponding subject. Unknown slugs and the six invalid legacy font artifacts retain proper HTTP 404 and noindex behavior. Permanent redirects must reach valid final destinations without avoidable chains. These controls preserve relevance; they do not guarantee a Google indexing decision.

All 70 pre-overhaul content pages used HTTPS non-www canonical and Open Graph URLs. The canonical origin remains unchanged. The source therefore does not demonstrate an origin/property split as the explanation of the decline. Path changes were extensive: 67 of the 70 old content canonical paths migrated. GSC comparisons must group each old URL with its replacement and use consistent property and report filters.

`robots.txt` allows crawling and references the canonical sitemap. Removing redundant explicit crawler-allow blocks did not block crawlers covered by `User-agent: *`. Conversion/error pages carry noindex. Neither `llms.txt` nor AI-specific markup substitutes for crawlable useful HTML and accurate migration.

## On-page and entity controls

The layout provides unique title/description metadata, absolute canonical URLs, a visible H1, Open Graph/Twitter fields, consistent business contact details and page-specific structured data. One shared LocalBusiness/AutomotiveBusiness and WebSite identity anchors service, article, collection and breadcrumb information. Visible FAQs remain useful without promising a search rich result.

The real business remains Merritt's Auto Recycling at 3106 68th Ave N, Brooklyn Center, MN 55429. Calls use 763-533-2775; texts use 763-438-2116. Community pages, including Minneapolis and St. Paul, describe service inquiry areas and do not claim additional storefronts. No unverified aggregate rating, customer quote, business license, fixed offer or hidden location should be introduced in schema.

Content restores practical condition, completeness, weight, document, payment, access and comparison questions. Minnesota DVS, statute and MPCA sources support legal/environmental guidance. Old fixed prices, model rankings, blanket plate-removal instructions, invented processing timelines and unsupported business operating procedures are corrected. See [the current verification register](CONTENT_VERIFICATION_REQUIRED.md).

## Inquiry, performance and validation

The web quote request uses `/api/contact` with validation, consent, Turnstile and provider handling. Phone and text remain direct alternatives. The retired `/api/quote` and `/api/appointment` endpoints are not presented as booking systems. Clear retry and success behavior, idempotency, mobile verification controls and accessible error states require current tests. Browser interception can validate interface behavior without proving actual mailbox receipt.

Static rendering, responsive local images, reserved dimensions, limited JavaScript, no external font requests and responsive navigation support page experience. Laboratory results measure a tested revision and scenario; they do not establish field Core Web Vitals or recovered leads. Final build, lint, unit/browser tests, dependency checks, production route/asset/API checks and the deployed SHA belong in the release evidence.

## Account evidence and remaining measurement

The GSC connector was subscription-blocked and a usable signed-in browser was unavailable during the historical source audit, so no fresh page/query/indexing export was obtained. The owner's GSC report is taken seriously; missing account access does not invalidate demonstrated migration defects or justify delaying their repair.

Account follow-through should:

1. Use the correct property, consistent search type/device/country filters and comparable periods around the August 23 launch.
2. Compare old/new URL groups, lost queries, indexed/soft-404 status, Google-selected canonical and last crawl.
3. Separate brand, local/service, article and image search effects.
4. Confirm Google Business Profile and Bing details and submit the canonical sitemap where authorized.
5. Activate an owner-controlled measurement tag and validate consent-safe account ingestion if Analytics is desired.
6. Confirm actual inquiry delivery and track qualified calls, completed conversations and purchases separately from clicks.
7. Monitor recrawling and sustained performance after release; do not represent a passing Lighthouse score as traffic recovery.

Relevant guidance: [Google local ranking](https://support.google.com/business/answer/7091), [site moves and redirects](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business), and [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
