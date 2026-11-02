# Compare migrated Search Console traffic

Run `node scripts/recovery-report.mjs input.json output.json` with private exports from the existing Domain property. The script runs offline. Store exports and reports in the ignored `.sites-runtime/recovery/` directory or outside the repository. Do not commit raw queries, account exports or lead records.

## Inputs

1. Use `sc-domain:merritts-auto-recycling.com`, Web search, and the same country/device/search-appearance filters for both periods.
2. Export each period separately as CSV. Extract `Pages.csv` and `Queries.csv` from each ZIP. Comparison-mode columns and non-English headers are intentionally rejected. Export limits and anonymized queries remain limitations.
3. Use equal whole-week windows of complete data. For the rebuild: July 26–August 22 versus August 23–September 19 (28 days each). For restoration: October 2–15 versus October 16–29 (14 days each). Monitor later periods separately. Account for seasonality and the August 18–21 / September 24–October 8 ranking updates as possible confounders.
4. Optional `propertyTotals` must come from the report header or verified daily Chart.csv totals for the exact same dates and filters, never from summing rows. Omit them when unavailable.
5. Check data completeness before setting `settledThrough`. The tool excludes the latest two calendar days as a minimum safeguard; it cannot independently verify Google's data maturity or the supplied export metadata.

Example manifest for the restoration comparison (configuration, not observed performance data). File paths are relative to the manifest:

```json
{
  "siteUrl": "sc-domain:merritts-auto-recycling.com",
  "searchType": "web",
  "purpose": "restoration",
  "filters": {},
  "settledThrough": "2026-10-29",
  "before": {
    "start": "2026-10-02", "end": "2026-10-15", "complete": true,
    "pagesCsv": "before/Pages.csv", "queriesCsv": "before/Queries.csv"
  },
  "after": {
    "start": "2026-10-16", "end": "2026-10-29", "complete": true,
    "pagesCsv": "after/Pages.csv", "queriesCsv": "after/Queries.csv"
  }
}
```

`purpose` accepts `rebuild`, `restoration` or `monitoring`. Property totals may be supplied inside each window as `propertyTotals` with numeric `clicks`, numeric `impressions` and a `source` describing the capture. Never insert guessed numbers.

## Interpretation

- `pages` combines HTTP/HTTPS, www/non-www, exact historical redirects and their replacements using the repository's migration inventory. It retains `aliasesSeen`, sorts by lost clicks then lost impressions, and leaves unknown URLs visible. Unrelated hosts are rejected.
- `queries` and `queryGroups` compare visible query rows. Groups are heuristic and mutually exclusive: branded first, informational, city/service, then other. Review ambiguous terms manually.
- `coverage` keeps property header totals separate and reports clicks absent from exported query rows when header totals are available. The gap can reflect hidden queries and export limits.
- Page aggregation can differ from property aggregation. Do not label summed page impressions as property impressions. Exported-row average positions are impression-weighted; query mix can change the average.
- Review CTR against query mix, position and actual search results before editing titles. Record the exact title, evidence, reason and change date. Preserve stable destination URLs.

## Follow-through

For each high-loss destination, record indexed status, last crawl, fetch outcome, crawl/indexing permission, declared canonical, selected canonical, historical source and action. Use URL Inspection's indexed result and keep live tests separate. Inspect old sources alongside replacements; redirect exclusions are expected for correctly migrated sources.

Maple Grove and St. Paul were requested for indexing during the November 1 investigation. Repeated requests for unchanged pages do not accelerate crawling. After this release's material evidence/offer-link additions, check current status before deciding whether another request is warranted. Repository code does not submit requests.

Track complete-period priority indexing, nonbranded impressions/clicks and city/service query gains alongside separately verified inquiries. A call/text click is not an answered conversation, and a form success is not a completed purchase.

References:

- https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://support.google.com/webmasters/answer/9012289
- https://developers.google.com/search/docs/appearance/title-link
