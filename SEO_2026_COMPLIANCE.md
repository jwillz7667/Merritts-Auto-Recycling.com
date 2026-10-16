# 2026 SEO implementation and verification record

Updated October 16, 2026. Canonical origin: `https://merritts-auto-recycling.com`.

This record maps current source controls to official search guidance. It documents implementation requirements and verification limits, not a Google certification or a promise of rankings, rich results, calls or revenue. The final deployed revision and its validation evidence determine release status.

## Current authority and historical policy

The owner explicitly authorized complete listed-city pages and recovery of the historical destinations on October 16. The current implementation has 88 dedicated community pages, six regional guides, 13 selling guides and 121 indexable destinations including `/get-a-quote`. St. Paul has a dedicated page. Exact-address availability, loading access, terms and pickup timing are confirmed directly; the pages do not establish additional business locations.

The August recommendation to consolidate other cities into a two-city directory model is superseded. It removed relevant own-city destinations and article answers. Historical findings and the exact 70-to-19 sitemap reduction are recorded in [the migration audit](docs/dev/AUGUST_MIGRATION_AUDIT_2026-10-16.md). Current source inventories are `src/data/city-directory.json`, `src/data/legacy-routes.json` and the guide library. The independent historical fixture protects against omissions introduced by changing those inventories together.

## Crawl and migration controls

- Public marketing pages are emitted as complete static HTML.
- Navigation and contextual links use crawlable anchors; every listed city links to its own actual page.
- The sitemap contains the complete canonical indexable inventory, with modification dates tied to content changes.
- Robots allows crawling and references the canonical sitemap.
- `/thank-you` and the custom 404 remain crawlable with page-level noindex; unknown URLs return HTTP 404.
- HTTPS non-www remains the canonical origin used before the overhaul; the alternate host preserves the requested path when redirecting.
- Historical cities map to their corresponding community pages, and historical articles map to pages that answer their subjects. Counties/state map to relevant regional destinations.
- Legacy `.html` and extensionless forms are verified against real final destinations; Vercel clean-URL normalization is included in testing.
- Retained historical photos receive exact equivalent asset aliases where available; arbitrary missing assets do not redirect to service pages.
- Invalid historical font-download HTML artifacts remain noindex 404s.

A successful permanent response is insufficient when the destination loses the original subject. Broad city-to-directory fallbacks and article-to-index redirects are not the current preservation strategy.

Official basis: [Google developer SEO guidance](https://developers.google.com/search/docs/fundamentals/get-started-developers), [URL migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [robots meta specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), and [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

## Titles, snippets and page structure

- Each indexable page has a descriptive visible H1, unique title and meta description, and absolute canonical URL.
- Metadata and headings describe the rendered subject instead of introducing unsupported prices or guarantees.
- Main content is visible in HTML and does not require JavaScript interaction.
- Community pages use shared layout components with individual geographic and practical pickup context.
- No hidden keyword block or fabricated local proof is introduced.
- Indexable pages permit eligible snippets and large image previews; Google decides the actual presentation.

Official basis: [title links](https://developers.google.com/search/docs/appearance/title-link) and [snippets](https://developers.google.com/search/docs/appearance/snippet).

## Business identity and structured data

- One canonical LocalBusiness/AutomotiveBusiness identity uses the actual business name, address, phone, email, founder, founding year, map/profile links and daily 8 AM–8 PM hours.
- WebSite and page-specific service, contact, about, collection, article and breadcrumb data reference the same business identity where appropriate.
- Brooklyn Center is the real business location. Other communities, including Minneapolis and St. Paul, are service inquiry areas.
- Schema describes visible content without adding a fabricated office, review, aggregate rating, fixed price or unsupported operational promise.
- Article subjects retain established guide URLs and the corresponding legacy publication dates. Modification metadata reflects the revised content.
- Customer-facing FAQ answers remain visible; FAQPage rich-result markup is not emitted.

Official basis: [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business), [business details](https://developers.google.com/search/docs/appearance/establish-business-details), and [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## Local and helpful-content controls

Business name, address, contact details, hours and canonical origin remain consistent across templates. Direct Google Business Profile and Maps links identify the real entity. A city page cannot create physical proximity; its purpose is to answer the local vehicle-sale and pickup questions accurately.

All ten historical article subjects have useful destinations. The restored material includes condition and completeness, running versus non-running cases, curb weight and weight units, model-specific inquiry details, repair/private-sale/trade comparisons, Minneapolis access and removal costs, ownership documents, plate handling and environmental/process questions. Unsupported legacy rankings, volatile price charts, blanket legal instructions, fixed pickup promises and invented business procedures are not republished as facts.

Operational claims remain qualified where they depend on the vehicle, exact location, schedule or current policy. Minnesota DVS, statutes and MPCA resources support the legal and environmental explanations. Review quotations require actual source evidence. [The content verification register](CONTENT_VERIFICATION_REQUIRED.md) records those distinctions without reviving the superseded two-city restriction.

No AI-only file or schema layer guarantees Google AI visibility. Crawlability, snippet eligibility, internal links, page experience, useful text/images and accurate structured data remain the applicable foundation.

Official basis: [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [local ranking](https://support.google.com/business/answer/7091), and [AI features](https://developers.google.com/search/docs/appearance/ai-features).

## Inquiry and page experience

The dedicated quote page requests a human-reviewed offer through the protected contact form and `/api/contact`. It preserves phone/text alternatives and does not advertise automatic pricing or dispatch. Deprecated quote/appointment APIs remain retired. Validation, Turnstile, consent, duplicate-submit handling, retry behavior and response checks need exact-revision tests; provider acceptance and delivered email are separate evidence.

Static rendering and limited client code reduce execution work. Responsive local image variants, dimensions reserved for images, eager/high-priority hero loading, lazy loading below the fold, local fonts and reduced-motion support help page experience. Build budgets remain technical gates; scores and screenshots do not prove customer outcomes.

Field targets at the 75th percentile:

| Metric                    |           Good threshold |
| ------------------------- | -----------------------: |
| Largest Contentful Paint  |      2.5 seconds or less |
| Interaction to Next Paint | 200 milliseconds or less |
| Cumulative Layout Shift   |              0.1 or less |

Official basis: [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals).

## Verification evidence and account follow-through

Required code checks cover historical URL preservation, directory/page/sitemap parity, unique metadata, canonical and schema consistency, internal reachability, proper error responses, mobile accessibility and protected inquiry behavior. Production checks must identify the final deployed SHA and inspect actual redirects, assets, crawl files and representative rendered templates. Mocked browser form or analytics requests are not live delivery or collection evidence.

The owner confirms the loss in Search Console. Removing GTM/GA4 cannot explain a GSC clicks/impressions decline because Search Console collection is independent of those scripts. Fresh page/query/indexing exports remain unavailable through the blocked connector; do not claim that their detailed performance was verified.

With account access, compare old and new URL groups under consistent property/search/device/country/date filters; inspect indexing, soft-404 status, selected canonicals, last crawl and lost queries; submit the sitemap and inspect representative restored pages. Confirm profile details, real inquiry delivery and any owner-approved Analytics ingestion. Monitor actual qualified calls and purchases separately from call-link clicks and form acceptance. Google recrawling and ranking recovery are measured outcomes, not facts established by this record.
