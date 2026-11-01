# Google Search Console recovery handoff

Reviewed: November 1, 2026

Canonical site: `https://merritts-auto-recycling.com`

Existing Domain property: `sc-domain:merritts-auto-recycling.com`

The August 23 rebuild reduced the sitemap from 70 content URLs to 19 and changed 67 original canonical paths. The October 16 recovery restored the historical city destinations and article subjects. Preserve those repairs and the established replacement URLs. See [the migration audit](docs/dev/AUGUST_MIGRATION_AUDIT_2026-10-16.md) and [the current migration map](REDIRECT_MAP.md).

Passing website checks establishes crawlability and migration behavior. It does not establish that Google has indexed the replacements or that rankings, visits, or leads have recovered.

## Implemented on the website

- `https://merritts-auto-recycling.com/sitemap.xml` returns the canonical indexable URL set with accurate `lastmod` values.
- `https://merritts-auto-recycling.com/robots.txt` permits crawling and declares the sitemap.
- The sitemap currently contains 121 indexable destinations, including 88 city/community pages, six regional guides, 13 selling guides, and the core pages/directories. Every city directory entry links directly to its own page.
- All 53 historical geographic destinations and ten historical article subjects have corresponding replacements. County/state destinations use relevant regional guides. Detailed article answers and the dedicated `/get-a-quote` manual offer-request flow remain available.
- Build and production verification evaluate Googlebot permission for indexable paths and the canonical sitemap declaration. They reject invalid or future sitemap `lastmod` values. Dates describe substantive content changes, not the date of each build or deployment.
- Every public route has a unique title, meta description, canonical, one H1, crawlable internal links, social metadata, and valid JSON-LD.
- `/thank-you` and the custom 404 use `noindex` and are excluded from the sitemap.
- HTTPS and non-`www` are canonical; legacy URLs permanently redirect to their closest replacements.
- Vercel normalizes incoming legacy `.html` blog URLs to extensionless paths, and those normalized paths have permanent migration redirects.
- Structured data uses verified business details only. Visible FAQs remain on the site without Google's retired `FAQPage` rich-result markup.
- The favicon, touch icon, web app icons, and social preview image use the current brand assets.

## Search Console follow-through

1. Open the existing verified Domain property above with an authorized account. Keep its DNS verification record. Only add or verify a property if the existing account genuinely lacks access; do not create a replacement property to reset reporting. This was a path migration within the same domain and does not need the Change of Address tool.
2. In **Sitemaps**, confirm a successful fetch of the canonical `sitemap.xml` and the expected discovered inventory. Submit it if absent, or resubmit after a failed fetch or substantive sitemap repair. A successful sitemap fetch does not mean every URL is indexed.
3. In **Page indexing**, separate current canonical destinations from old redirects, duplicate variants, thank-you pages, and genuine 404s. Investigate restored destinations excluded as crawled/discovered but not indexed, unexpected soft 404s, robots blocks, server errors, or an unintended canonical.
4. Use **URL Inspection** first on the homepage, core service pages, `/get-a-quote`, and restored destinations that previously received useful clicks or impressions. Include representative cities and guides such as `/service-areas/maple-grove`, `/service-areas/st-paul`, `/guides/minnesota-junk-car-documents`, and `/guides/scrap-car-value-by-weight`.
5. Record indexed status, last crawl, crawl/fetch outcome, indexing permission, declared canonical, and Google-selected canonical for each inspected destination. A successful live test alone does not establish indexing. Request indexing for materially restored priority pages when appropriate; repeated requests for unchanged URLs do not speed routine crawling.
6. Inspect representative old paths to confirm that Google observes their intended permanent redirect. **Page with redirect** on a migrated source is expected when the relevant final destination is indexed. Do not remove correct redirects merely to eliminate that exclusion or its validation notice.
7. Review **Manual actions**, **Security issues**, **Crawl stats**, and Search Console data anomalies before assigning a cause to the traffic loss. Record actual findings; do not infer a penalty from the chart alone.

Keep an evidence table with the final destination, historical source(s), indexed status, last crawl, Google-selected canonical, and finding/action. Leave account results unknown until observed; do not fill them from HTTP tests or repository claims.

## Compare migrated traffic accurately

Search Console's **Performance → Search results** measures clicks, impressions, CTR, and average position. It does not measure completed calls, texts, quote requests, or all website visitors.

- Compare equal-length windows of complete data with the same search type, property, country/device filters, and weekday mix. Keep the pre-rebuild window entirely before August 23. A window straddling the launch is not a clean baseline; use the latest settled dates for the recent window.
- Combine each old canonical URL and its replacement when evaluating traffic. Include `.html`/clean variants if they appear in the export. A fall on an old path alone is expected; check whether the replacement gained its queries. The historical fixture and `src/data/legacy-routes.json` supply the mapping.
- Compare lost queries and page groups separately: branded searches, city/service searches, and informational guides. Separate image search when relevant. Prioritize losses in useful search demand instead of changing every title or URL again.
- Annotate the August 23 rebuild, August 25 redirect repair, October 7 expansion, and October 16 restoration. Google's August 18–21 and September 24–October 8 ranking updates overlap this period; verify dates against the [official dashboard](https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history) when interpreting comparisons.
- Retain the current URLs and accurate content while measuring recrawls and query recovery. There is no guaranteed recovery date or ranking improvement from a successful build.

## Ongoing monitoring

- Review Page Indexing, Sitemaps, Core Web Vitals, HTTPS, Security Issues, and Manual Actions monthly and after major releases.
- Investigate groups of excluded URLs before isolated URLs; duplicates and redirected legacy URLs are expected when their canonical destination is indexed.
- Measure calls, texts, and submitted inquiries separately using business-controlled analytics/call tracking. A phone-link click is not a completed conversation; a mocked form test is not delivered production mail.
- Check field Core Web Vitals after sufficient traffic exists. Laboratory tests are diagnostic and cannot replace Search Console field data.
- Keep the Google Business Profile website, phone, address, category, and daily 8:00 AM–8:00 PM hours aligned with the site.

## Analytics status

Optional analytics supports a reviewed `PUBLIC_GA4_ID` or `PUBLIC_GTM_ID` with consent-aware collection; see [the measurement plan](MEASUREMENT_PLAN.md). Verify real collection in the appropriate account before claiming that tracking works. Never invent an ID or enable an unrelated account's container.

## Verification boundaries

The GSC Wizard connection was subscription-blocked during the investigation. Repository changes cannot repair account access. Use an authorized Search Console session or restore connector access before recording indexing, sitemap-submission, or performance results. Do not report account actions as completed merely because the website is deployable.

The Vercel connection now exposes the existing Merritt's project. For each release, verify the intended project/team, exact source revision, deployment result, and live checks. The October release's success is not evidence for a newer commit.

## 2026 guidance note

Google does not require AI-specific schema or an `llms.txt` file for Search AI features. The applicable controls remain crawlability, indexability, visible people-first content, accurate structured data, internal links, useful images, and page experience.

Official references:

- [Site moves with URL changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Debugging drops in search traffic](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [How Google interprets robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
- [URL Inspection](https://support.google.com/webmasters/answer/9012289)
- [Ask Google to recrawl URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Search Console ownership verification](https://support.google.com/webmasters/answer/9008080)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
