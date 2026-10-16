# Current legacy migration map

Updated October 16, 2026. This replaces the August two-city catch-all plan.

The complete machine-readable inventory is `src/data/legacy-routes.json`; the deployed rules are in `vercel.json`. Tests require agreement between them, permanent redirects, unique sources, real final destinations and no chains. The static output validator verifies every destination.

## Historical regional URLs

All 53 former city, county and statewide URLs are explicitly mapped in both their extensionless and .html forms. All 49 historical city URLs redirect to dedicated pages for the same city. The four county or statewide URLs redirect to the corresponding regional guides. Every one of the 88 communities in the current service-area directory has its own substantive page; the directory does not substitute regional links for a listed city's page.

Examples:

- /placemarks/ramsey-mn -> /service-areas/ramsey
- /placemarks/rogers-mn -> /service-areas/rogers
- /placemarks/ham-lake-mn -> /service-areas/ham-lake
- /placemarks/becker-mn -> /service-areas/becker
- /placemarks/rockford-mn -> /service-areas/rockford
- /placemarks/sherburne-county-mn -> /service-regions/sherburne-county
- /placemarks/minnesota -> /service-regions/minnesota

Local and regional pages describe pickup inquiries, not new business offices or unconditional service promises. Exact-address availability, vehicle acceptance, pickup costs and scheduling are confirmed directly. Unknown legacy slugs have no catch-all and return the custom 404 with HTTP 404 and noindex. Do not create redirects for imaginary paths merely to hide errors.

## Historical blog URLs

All ten historical articles have explicit destinations within the current collection of 13 detailed guides. Recovered coverage includes plate handling, ownership documents, running versus non-running value, weight and condition, environmental considerations, what happens after pickup, vehicle types and alternatives to recycling. The old unsupported most-junked-model ranking is replaced by useful vehicle-type guidance rather than invented statistics.

The historical Minneapolis free-removal article redirects to `/guides/minneapolis-junk-car-removal-costs-and-pickup`. That dedicated guide retains the Minneapolis removal subject while explaining quote-specific costs, access and pickup arrangements without claiming every removal is free or immediately available. Other historical article destinations retain their corresponding subject rather than being collapsed into a generic landing page.

Vercel cleanUrls remains enabled. Blog migration rules use normalized extensionless sources; preserve the existing /blog/index.html hub rule. Test live normalization after deployment as well as the static destination mapping.

## Preserved routes

Current guide and city URLs retain their canonical addresses. www still redirects to the corresponding non-www path. Primary about and reviews aliases retain their valid replacements. Historical quote-calculator aliases redirect to `/get-a-quote`, where a manual vehicle inquiry submits to the protected `/api/contact` endpoint. It requests a vehicle-specific review and does not publish an automatic valuation or guarantee an offer or pickup.

The retired `/api/quote` endpoint returns HTTP 410. The retired appointment API remains unavailable; a form or appointment inquiry does not establish a booked pickup. Historical form-processor paths and their endpoint responses must be checked alongside the page redirects so no retired calculator or API is mistaken for a working quote flow.

No blanket maintenance redirect or noindex was introduced. A successful redirect alone is not proof of retained Google rankings: inspect the combined old/new content groups after Google recrawls.
