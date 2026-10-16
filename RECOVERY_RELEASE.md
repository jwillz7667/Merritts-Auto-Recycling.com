# SEO recovery in the current visual rebuild

Release prepared October 16, 2026. Current follow-through baseline: 7c836a0a55eef0f468352f7cd91e092572e35de6. The earlier first recovery began at d3ff39392159749fb7700553f2d4ab46f41e96ad.

## Implemented scope

Preserve the modern Astro theme, brand assets, business details, comparison disclosures, contact backend and city-page contrast correction. Publish 88 dedicated community pages: every one of the 66 listed metro cities plus 22 additional historical communities. Strengthen the earlier 34 pages with distinct descriptions, two substantive sections and two local FAQs. All 49 historical city URLs map to their own city; the four historical county/state URLs use relevant regional guides. Every directory entry is a direct link to its real page.

Restore detailed answers for all ten historical article subjects, retain the current DVS/statute-based document and plate guidance, and restore original article publication dates from the pre-overhaul source. Keep established guide URLs and add a dedicated Minneapolis removal/cost guide. Modification dates reflect the revised content. The catalog has 88 community pages, six regional guides, 13 selling guides and 121 indexable URLs.

Restore the dedicated manual offer-request destination at `/get-a-quote`, with homepage/shared inquiry links and historical calculator redirects. Reuse the existing protected contact form and provider delivery, including validation, consent, Turnstile, retries, duplicate-submit protection and explicit success-response checking. The retired quote/appointment APIs remain retired; no automatic valuation or pickup booking is asserted.

Add consent-aware configurable analytics with a fixed event allowlist. An empty historical GTM container is not treated as active collection. No GA4 measurement ID or live account configuration is invented. Production collection remains a separate account-side verification requirement.

Validate all rendered URLs, canonical metadata, unique descriptions/titles, article schema, sitemap parity, internal reachability, all 88 directory city links, contact controls, malformed API responses, retries, analytics choices and mobile/desktop contrast through the pinned GitHub Actions workflow. Verify the expected live SHA, all 121 destinations, 211 content aliases and 12 retained-photo aliases. Repair the analytics path expression that caused exponential backtracking on long rejected `.html` paths, and check actual browser completion of that case.

## Validation evidence and limits

The initial recovery validation passed source-sensitive-data scanning, lint, 27 unit tests and a 67-HTML-page build. Browser tests identified existing pale service-card numbers, layout overflow and a stale test locator for the navigation button's changing accessible name. Those findings prompted repairs, not a claim that the first browser run passed.

Use the final commit's Actions result for actual browser pass counts. Browser form responses are intercepted, not sent to the business. Analytics requests use a public synthetic test ID and are intercepted; no real visits or leads are injected into Analytics. Production is not considered updated until the master ref and Vercel status have been verified.

Dependency advisories are reported separately from the sensitive-data scan. Do not describe a source-secret scan as proof of dependency safety. Any remaining advisory or account-side blocker must be reported accurately.

## Outstanding external verification

The available Vercel connection returned forbidden for the existing project scope. Search Console access was blocked by the separate connector's subscription, and the alternative browser had no saved Google sign-in. This release cannot itself fix account authorization, publish GTM tags, verify live mailbox receipt, force Google indexing, or guarantee traffic recovery.

Do not restore unverified customer testimonials, fixed offers, free-pickup guarantees, same-day promises, false business locations, or old legal claims just because they appeared on the prior website. Verify real operational terms with the business and publish accurate details when established.

## Complete August migration restoration

The follow-through expands coverage to 88 dedicated community pages (all 66 previously listed metro cities plus 22 additional historical communities), with direct links and own-city historical redirects. The ten historical article subjects regain detailed answers and original publication dates, including a dedicated Minneapolis removal/cost guide. The catalog now has 13 guides and 121 indexable destinations. `tests/fixtures/pre-overhaul-url-inventory.json` accounts for all 76 old HTML files: 70 real content URLs and six invalid font artifacts that remain noindex 404s. The exhaustive audit is `docs/dev/AUGUST_MIGRATION_AUDIT_2026-10-16.md`.

The completed local gate passed sensitive-data scanning, ESLint, all 59 unit tests, Astro diagnostics with zero errors/warnings/hints, the 123-HTML-page build, and all 195 browser checks without retries. The build independently validates 121 indexable destinations and all 88 directly linked city pages. Both complete and production dependency audits reported zero advisories. Production results must still be read from the final master deployment's Actions evidence rather than inferred from this local result.
