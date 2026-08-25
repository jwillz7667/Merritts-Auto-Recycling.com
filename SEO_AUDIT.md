# SEO and site-quality audit

Audit date: August 25, 2026  
Canonical site: `https://merritts-auto-recycling.com`  
Legacy baseline commit: `94010ccf1dd88c5bb8d0b4145a5767fe84f80958`

## Executive summary

The legacy site had useful entity information and a working static deployment model, but its acquisition strategy depended on duplicated location pages, repeated high-risk claims, and a brittle generated-HTML workflow. The rebuild moves to a typed Astro content system, keeps one canonical local entity, reduces the service-area footprint to pages supported by current facts, and places direct call and text actions at the center of the cash-for-cars journey.

The rebuilt site is live on the production domain. Post-launch validation confirms the canonical host, sitemap, robots controls, indexability, metadata, and structured-data syntax across all public routes. The remaining work is account-side monitoring and ownership configuration in Google Search Console, Google Business Profile, analytics, and Bing Webmaster Tools.

## Legacy baseline

| Area              | Legacy finding                                                                                                                                                                      | Impact                                                | Rebuild response                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| Rendering         | Hand-authored and script-mutated static HTML using Bootstrap 3, jQuery, Slick, and regex transforms                                                                                 | High maintenance risk; content and metadata can drift | Astro components and typed source data                                          |
| Crawl surface     | More than 70 HTML pages, including 53 city/county placemark pages                                                                                                                   | Thin/duplicated content and doorway-page risk         | 19 indexable routes; only two detailed service-area pages                       |
| Home page         | Literal `$1` artifact visible above the main interface                                                                                                                              | Severe trust and quality defect                       | Eliminated; build test forbids `$1`                                             |
| Heading structure | No clear visible H1 on the audited home page                                                                                                                                        | Weak primary topic and accessibility signal           | Exactly one H1 required on every HTML page                                      |
| Primary intent    | Cash-for-cars intent competed with towing/repair-like language and large keyword blocks                                                                                             | Ambiguous conversion path                             | Cash-for-cars, direct contact, and acquisition-related removal are explicit     |
| Claims            | “Top dollar,” fixed price ranges, same-day pickup, free towing, no-title acceptance, licensing, insurance, recycling percentages, and “Rated #1” appeared without supplied evidence | Legal, trust, and spam risk                           | Claims removed or qualified pending owner evidence                              |
| Reviews           | Eight testimonials and aggregate rating markup were stored in repository data without supplied source records                                                                       | Review-policy and structured-data risk                | Links to live Google profile; no quotes or aggregateRating                      |
| Local entity      | Correct NAP existed, but broad areaServed and location pages extended well beyond verified proof                                                                                    | Entity dilution and local doorway risk                | One canonical business at the real Brooklyn Center address                      |
| Hours             | Legacy source said 9 AM–6 PM daily                                                                                                                                                  | Incorrect business information                        | Owner-corrected 8 AM–8 PM daily across UI and schema                            |
| Content           | Multiple posts used volatile price figures, broad legal statements, and dated year keywords                                                                                         | Staleness and accuracy risk                           | Five evergreen guides with conservative wording and agency links                |
| Forms             | Multiple acquisition and appointment forms complicated the conversion path                                                                                                          | Duplicate-lead risk and confusing user experience     | Offer and appointment forms retired; one protected general-inquiry form remains |
| Performance       | Large legacy framework/plugin CSS and JS; externally hosted fonts                                                                                                                   | Additional request and execution cost                 | One 19.2 KB CSS asset, no external fonts, no framework runtime                  |
| Redirects         | Only a small group of extension redirects existed                                                                                                                                   | Migration risk                                        | Complete primary/blog/form mapping and placemark fallback                       |

## New crawl and index model

- 19 indexable canonical URLs in `sitemap.xml`
- one noindex `/thank-you` route
- one noindex custom 404 page
- one canonical origin with a permanent `www` redirect
- clean URLs and no trailing slash
- permanent mappings for primary legacy pages, blog posts, forms, and placemarks
- extensionless migration mappings for legacy blog routes, matching Vercel's required `cleanUrls` behavior and preventing normalized paths from producing 404s
- `robots.txt` permits crawling; `/thank-you` and 404 use page-level `noindex`

## On-page system

Every indexable page includes:

- unique title and meta description
- absolute canonical URL
- one visible H1
- descriptive section headings
- prominent call and text actions
- consistent NAP and corrected hours in the footer
- Open Graph and Twitter card fields
- one shared LocalBusiness/WebSite graph plus page-specific schema where appropriate

Page-specific structured data is limited to content visible on the page:

- `Service` for core service and area pages
- `CollectionPage` for the visible FAQ collection; no retired `FAQPage` rich-result markup
- `Article` for guides
- `BreadcrumbList` for nested routes
- no `aggregateRating`, fabricated review, or hidden city entities

## Local SEO assessment

Google describes local ranking in terms of relevance, distance, and prominence. A larger collection of city-name pages does not create physical proximity. The new model prioritizes entity consistency and useful pages instead of pretending to operate a location in every target city.

Primary local proof:

- real business name: Merritt's Auto Recycling
- real address: 3106 68th Ave N, Brooklyn Center, MN 55429
- canonical call number: 763-533-2775
- corrected daily hours: 8:00 AM–8:00 PM
- direct Google Business Profile and Maps links
- Brooklyn Center home-location page
- Minneapolis page that explicitly requires address-level confirmation

Relevant official references:

- [Google Business Profile local ranking guidance](https://support.google.com/business/answer/7091)
- [Google LocalBusiness structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google review snippet policy](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)

## Content quality and trust

The rebuild uses a claim-evidence rule:

1. Immutable supplied facts may be published.
2. Operational claims must be owner-confirmed before becoming unconditional.
3. State-law and environmental content links to the relevant Minnesota authority.
4. Volatile prices and timing estimates are not published as universal facts.
5. Review quotes stay off-site until their source and permission are documented.

This approach is reflected in `CONTENT_VERIFICATION_REQUIRED.md`.

## Technical SEO and security

Implemented:

- static-first Astro 7 output
- no client framework runtime
- CSP, HSTS, nosniff, frame denial, referrer policy, and permissions policy
- immutable cache headers for fingerprinted/static assets
- noindex conversion and error routes
- internal-link and metadata build validation
- XML sitemap generated from the typed route set
- preserved 308 redirects for legacy value transfer
- normalized clean-URL redirect checks for every migrated legacy blog article
- one canonical local entity and consistent IDs
- explicit indexable-page robots controls with large image previews and unrestricted eligible snippets
- automatic breadcrumb structured data for interior pages that do not already define it
- no AI-only markup or `llms.txt`; current Google guidance requires the same crawl, snippet, content, and page-experience fundamentals used for standard Search

The implementation-to-guidance mapping is maintained in `SEO_2026_COMPLIANCE.md`.

## Remaining account-side actions

| Priority | Action                                                        | Owner or account administrator step                                        |
| -------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| P0       | Confirm Google Search Console ownership                       | Verify the domain property and submit the production sitemap               |
| P0       | Confirm Google Business Profile details                       | Match phone, website, address, category, and 8 AM–8 PM daily hours         |
| P1       | Confirm production contact-form delivery                      | Send a safe test inquiry and confirm internal delivery                     |
| P1       | Decide on analytics                                           | Supply an approved GTM container ID or intentionally remain analytics-free |
| P1       | Confirm Bing Webmaster Tools ownership                        | Verify the domain and submit the same production sitemap                   |
| P2       | Monitor field performance after enough traffic exists         | Review Page Indexing and Core Web Vitals; field data cannot be prebuilt    |
| P2       | Add service areas only when operations and unique facts exist | Require owner confirmation and genuinely useful local content              |

## Expected outcome

The rebuild materially improves crawl clarity, local entity consistency, conversion focus, accessibility, maintainability, and claim accuracy. It does not guarantee rankings, leads, or Google Business Profile visibility. Those outcomes depend on relevance, real-world proximity, prominence, competition, reviews, citations, and ongoing operations beyond the codebase.
