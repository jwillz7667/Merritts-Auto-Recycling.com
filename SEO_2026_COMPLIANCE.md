# 2026 SEO compliance record

Review date: August 23, 2026  
Canonical origin: `https://merritts-auto-recycling.com`

This record maps the rebuilt site to current official Google Search guidance. It documents technical eligibility and quality controls; it does not promise rankings, rich results, AI citations, calls, or revenue.

## Crawl and index controls

- Every public marketing page is emitted as complete static HTML.
- Navigation and contextual links use crawlable `<a href>` elements.
- Every indexable page is reachable through internal navigation, contextual links, or the footer.
- `sitemap.xml` contains only canonical, indexable routes.
- `robots.txt` allows crawling and points to the sitemap.
- `/thank-you` and the custom 404 remain crawlable but carry page-level `noindex`, allowing crawlers to see the directive.
- The canonical host is HTTPS without `www`; the alternate host permanently redirects in one hop.
- Removed legacy pages permanently redirect to the closest useful replacement instead of a generic home-page redirect.

Official basis: [Google's developer SEO guide](https://developers.google.com/search/docs/fundamentals/get-started-developers) and [robots meta specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

## Titles, snippets, and page structure

- Every route has one descriptive, visible H1.
- Titles and meta descriptions are unique, concise, human-readable, and aligned with the page's visible topic.
- No `meta keywords` tag, keyword block, hidden text, or templated city swapping is used.
- Indexable pages permit large image previews and unrestricted eligible snippets.
- Important content is visible in the HTML and does not require JavaScript interaction.

Official basis: [title-link guidance](https://developers.google.com/search/docs/appearance/title-link) and [snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

## Entity and structured-data controls

- One canonical `LocalBusiness` entity uses the public name, address, phone, email, founder, founding year, map, profiles, and 8:00 AM–8:00 PM daily hours.
- One `WebSite` entity references the same business.
- Page-specific `Service`, `ContactPage`, `AboutPage`, `CollectionPage`, `Article`, `FAQPage`, and `BreadcrumbList` objects describe visible content only.
- Breadcrumb markup is present on nested and top-level interior routes.
- There is no fabricated `aggregateRating`, review markup, price range, geographic office, or unsupported service claim.
- Structured data never introduces facts that are absent from the rendered page.

Official basis: [LocalBusiness structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business) and [business-details guidance](https://developers.google.com/search/docs/appearance/establish-business-details).

## Local SEO controls

- Name, address, phone, hours, and canonical URL are consistent across the site.
- The site links directly to the current Google Business Profile and Google Maps entity.
- Brooklyn Center is presented as the real business location.
- Minneapolis is a service-area page, not a claimed storefront.
- Additional legacy city pages consolidate into the service-area hub to avoid doorway-page and duplicate-content risk.
- Operational claims and any future location expansion require owner evidence before publication.

## Helpful content and AI-search eligibility

- Service pages answer distinct customer questions instead of repeating keyword variants.
- Guides identify practical decision factors and link to Minnesota authorities for legal or environmental topics.
- Content distinguishes verified facts from conditions that must be confirmed by phone.
- The site does not add an `llms.txt` file, AI-specific schema, or other unsupported machine-readable layer.
- Eligibility for Google AI Overviews and AI Mode relies on the same crawlability, snippet eligibility, internal linking, page experience, visible text, useful imagery, and accurate structured data used for standard Search.

Official basis: [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) and [AI features and website guidance](https://developers.google.com/search/docs/appearance/ai-features).

## Page experience and Core Web Vitals

- Static rendering and no client-framework runtime minimize JavaScript execution.
- The LCP hero uses a local AVIF with WebP and JPEG fallbacks, explicit dimensions, eager loading, and high fetch priority.
- Below-the-fold images use native lazy loading with dimensions reserved to prevent layout shift.
- No external fonts, autoplay media, carousel, map embed, or chat widget is loaded.
- Reduced-motion preferences are honored.
- Build budgets fail when CSS exceeds 90 KB or JavaScript exceeds 60 KB.

Field targets at the 75th percentile:

| Metric                    |           Good threshold |
| ------------------------- | -----------------------: |
| Largest Contentful Paint  |      2.5 seconds or less |
| Interaction to Next Paint | 200 milliseconds or less |
| Cumulative Layout Shift   |              0.1 or less |

Official basis: [Google Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals).

## Required post-launch validation

1. Test representative production URLs in Google Rich Results Test and Schema.org Validator.
2. Verify the domain in Google Search Console and Bing Webmaster Tools.
3. Submit the canonical sitemap and inspect the home, core service, service-area, and guide templates.
4. Confirm the Google Business Profile hours, phone, website, category, and address match the site.
5. Monitor Page Indexing, Core Web Vitals, structured-data, manual-action, and security reports.
6. Review Search Console's Search and generative-AI performance reporting when available to the property.
7. Evaluate field Core Web Vitals after enough production traffic exists; laboratory scores are not field data.
8. Add new city pages only when service is confirmed and genuinely unique local information is available.
