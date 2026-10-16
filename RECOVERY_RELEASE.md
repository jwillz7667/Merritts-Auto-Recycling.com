# SEO recovery in the current visual rebuild

Release prepared October 16, 2026. Baseline production commit: d3ff39392159749fb7700553f2d4ab46f41e96ad.

## Implemented scope

Preserve the modern Astro theme, brand assets, business details, existing 16 city destinations, comparison disclosures, contact backend and city-page contrast correction. Add 18 substantial city pages within the previously published coverage list, six regional inquiry guides and a regional directory. Account for all 53 historical regional URLs with relevant explicit destinations rather than a generic two-city hub.

Recover four separate article subjects, expand the existing Minnesota document guide using official DVS and statute sources, and map all ten old blog subjects to relevant final content. Preserve established guide URLs and publication dates; modification dates reflect the new content. The resulting catalog has 34 city pages, six regional guides, 12 selling guides and 65 indexable URLs.

Make the existing protected contact form usable for vehicle-sale inquiries without reintroducing a price calculator, file uploads, false pickup bookings or retired appointment APIs. Retain validation, consent, Turnstile and existing provider delivery. Improve retries, duplicate-submit protection and explicit success-response checking.

Add consent-aware configurable analytics with a fixed event allowlist. An empty historical GTM container is not treated as active collection. No GA4 measurement ID or live account configuration is invented. Production collection remains a separate account-side verification requirement.

Restore production and browser validation through a pinned, read-only GitHub Actions workflow. Validate all rendered URLs, canonical metadata, unique descriptions/titles, article schema, sitemap parity, internal reachability, historical mapping coverage, working contact controls, malformed API responses, retries, analytics choices and mobile/desktop contrast.

## Validation evidence and limits

The initial recovery validation passed source-sensitive-data scanning, lint, 27 unit tests and a 67-HTML-page build. Browser tests identified existing pale service-card numbers, layout overflow and a stale test locator for the navigation button's changing accessible name. Those findings prompted repairs, not a claim that the first browser run passed.

Use the final commit's Actions result for actual browser pass counts. Browser form responses are intercepted, not sent to the business. Analytics requests use a public synthetic test ID and are intercepted; no real visits or leads are injected into Analytics. Production is not considered updated until the master ref and Vercel status have been verified.

Dependency advisories are reported separately from the sensitive-data scan. Do not describe a source-secret scan as proof of dependency safety. Any remaining advisory or account-side blocker must be reported accurately.

## Outstanding external verification

The available Vercel connection returned forbidden for the existing project scope. Search Console access was blocked by the separate connector's subscription, and the alternative browser had no saved Google sign-in. This release cannot itself fix account authorization, publish GTM tags, verify live mailbox receipt, force Google indexing, or guarantee traffic recovery.

Do not restore unverified customer testimonials, fixed offers, free-pickup guarantees, same-day promises, false business locations, or old legal claims just because they appeared on the prior website. Verify real operational terms with the business and publish accurate details when established.
