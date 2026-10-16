# Current legacy migration map

Updated October 16, 2026. This replaces the August two-city catch-all plan.

The complete machine-readable inventory is `src/data/legacy-routes.json`; the deployed rules are in `vercel.json`. Tests require agreement between them, permanent redirects, unique sources, real final destinations and no chains. The static output validator verifies every destination.

## Historical regional URLs

All 53 former city, county and statewide URLs are explicitly mapped in both their extensionless and .html forms. Of those, 27 have a dedicated same-city destination. The other 26 map to six relevant regional guides that identify the geography and explain inquiry/availability limits. The original 16 modern city pages are preserved, including seven markets not in the older 53-page inventory; 18 restored city pages bring the current city total to 34.

Examples:

- /placemarks/ramsey-mn -> /service-areas/ramsey
- /placemarks/rogers-mn -> /service-areas/rogers
- /placemarks/ham-lake-mn -> /service-areas/ham-lake
- /placemarks/becker-mn -> /service-regions/sherburne-county
- /placemarks/rockford-mn -> /service-regions/wright-county
- /placemarks/minnesota -> /service-regions/minnesota

A regional destination is not represented as a new office or an unconditional service promise. Unknown legacy slugs have no catch-all and return the custom 404 with HTTP 404 and noindex. Do not create redirects for imaginary paths merely to hide errors.

## Historical blog URLs

All ten original subjects have explicit content destinations. Plate handling, running/non-running value, environmental considerations and vehicle-type information have separate recovered guides. The old unsupported most-junked-model ranking is replaced by useful vehicle-type guidance rather than invented statistics. Free-removal intent goes to the removal page, which explains actual quote-specific terms without inventing a guarantee.

Vercel cleanUrls remains enabled. Blog migration rules use normalized extensionless sources; preserve the existing /blog/index.html hub rule. Test live normalization after deployment as well as the static destination mapping.

## Preserved routes

Current guide and city URLs retain their canonical addresses. www still redirects to the corresponding non-www path. Primary about, reviews and retired calculator aliases retain their valid replacements. The historical form processor paths retain their endpoint mappings, and the quote and appointment APIs remain retired.

No blanket maintenance redirect or noindex was introduced. A successful redirect alone is not proof of retained Google rankings: inspect the combined old/new content groups after Google recrawls.
