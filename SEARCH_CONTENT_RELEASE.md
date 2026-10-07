# Search-intent content and buyer comparison

Release date: October 7, 2026.

## Scope

- Retain all existing city pages, service titles, guide URLs, redirects, and the city-page contrast fix.
- Improve the existing non-running-car guide with direct answers about a blown engine, bad transmission, value, pickup, and whether to repair first. Do not create multiple pages for the same intent.
- Improve the repair/sale decision title and description while preserving its URL and content.
- Publish one comparison at `/guides/cash-for-junkers-mn-vs-merritts` with publisher disclosure, equal treatment of both businesses, linked sources for each row, and a source-check date.
- Use descriptive contextual links from relevant service pages, the guide directory, and existing decision guides.
- The existing sitemap and Article metadata are data-driven; the new guide joins the sitemap without manual URL duplication.

## Sources and claim boundaries

Competitor sources checked October 7, 2026:

- https://www.cashforjunkersmn.com/ — published contact options, phone estimate followed by inspection, advertised pickup charges, payment statement, and scheduling statement.
- https://www.cashforjunkersmn.com/areas/ — published Twin Cities/suburban territory and nine listed counties.

Merritt's source of truth: existing business and service data in `src/data/site.ts`, with public links to `/cash-for-junk-cars`, `/junk-car-removal`, and `/service-areas` in each corresponding comparison row.

The comparison reports published policies, not tested service performance. It credits the competitor's advertised free towing and cash-at-collection terms. It does not claim Merritt's pays more, is faster, has better reviews, or is affiliated with the competitor. No competitor logo, customer review, rating markup, or invented testimonial is used. There is no guarantee of ranking for a competitor's brand.

Implementation references:

- https://developers.google.com/search/docs/appearance/title-link — descriptive, concise titles without keyword stuffing.
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable — descriptive internal link text.
- https://www.ftc.gov/legal-library/browse/statement-policy-regarding-comparative-advertising — clear, supported comparisons; this is a publishing reference, not a legal opinion about a particular trademark use.

## Maintenance

Recheck the competitor's linked pages before changing the comparison, when a changed policy is reported, and during periodic content reviews. Preserve its original source-check date until the information is actually rechecked. Label unavailable facts rather than treating absence as a disadvantage. Do not turn either business's advertised terms into an unconditional promise for an individual vehicle.

## Validation

Run the configured production gate: `npm run security:scan && npm run lint && npm run test && npm run build`.

The new unit tests preserve established URLs and dates, verify direct answers, check unique metadata and comparator disclosures, require source links, and guard against invented ratings or branding. The existing build validation checks canonical tags, sitemap coverage, unique metadata, working internal links, structured data, asset budgets, and business details. Browser checks should include the comparison at narrow mobile and desktop widths, including text contrast and all source links.

Google Business Profile settings, paid ads, keyword bidding, and analytics accounts are not changed by this release.
