# August overhaul: migration, content, and inquiry audit

Audit date: October 16, 2026. This is an evidence-based source and migration audit, not a certification of Google rankings or a claim of recovered customers. The owner confirms that the decline appears in Google Search Console. That establishes the reporting context; removing Analytics cannot explain a Search Console clicks or impressions decline.

## Result and strongest evidence

The August launch removed most of the site's indexable destinations and much of its subject-specific information. The sitemap went from **70 content URLs to 19**, a reduction of **51 URLs, or 72.9%**. Of 53 historical geographic destinations, only Brooklyn Center and Minneapolis retained their own destination at launch; the remaining 51 were redirected to a general service-area directory. Ten substantial articles were consolidated into three subject-specific guides, a removal service, and the guide index. Several replacements did not answer the original question in comparable detail.

These are concrete migration failures and strong plausible contributors to the search decline. Source history alone cannot establish which removed city or article produced how many clicks, or assign a percentage of the loss to each change. Those questions require the property's page/query performance and indexing evidence.

The current repair preserves the Astro design while restoring each historical city/community destination, every city listed in the service-area directory, all ten historical article subjects, original article publication metadata, and a dedicated web quote-request destination. Coverage totals and release evidence must match the final tested commit; the prepared catalog is 88 community pages, 13 guides, and 121 indexable URLs including `/get-a-quote`.

## Revisions and inspection method

| Revision                    | Date               | Meaning                                                                                                |
| --------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| `94010cc`                   | August 10, 2026    | Last full-site commit on the production ancestry before maintenance; substantive pre-overhaul baseline |
| `e487a8f`                   | August 10, 2026    | Dependency-only branch based on `94010cc`; not the production baseline                                 |
| `01d382a` through `fda2c15` | August 23, 2026    | Maintenance transition and business-hours correction                                                   |
| `62e9fe4`                   | August 23, 2026    | Production merge of the Astro overhaul; parents `fda2c15` and `08a3f4d`                                |
| `12db32e` / merge `762de7f` | August 25, 2026    | Corrected blog redirect sources for Vercel clean URLs                                                  |
| `0506be7`                   | September 25, 2026 | Alternate metro improvement branch; tracked remotely but not an ancestor of production                 |
| `bbdf329`                   | October 7, 2026    | Successor metro implementation; 16 city pages                                                          |
| `1c13432`, `d3ff393`        | October 7, 2026    | Selling-intent content and image improvements                                                          |
| `6abcf48`, `7c836a0`        | October 16, 2026   | First recovery release and small-phone verification-widget fix                                         |

Inspected all tracked HTML at `94010cc`, not merely the known city slugs. Parsed titles, headings, canonical URLs, Open Graph URLs, visible text, links, structured data, and article dates. Read the ten historical articles substantively, including their price tables, title/plate instructions, vehicle models, pickup instructions, environmental assertions, and comparison advice. Compared configuration, sitemap generation, robots, calls to action, form/API behavior, and business identity with the August merge and October recovery. Inspected local branches, remotes, worktrees, stash, and the initial dirty working tree.

Repeatable source commands include:

```sh
git show 94010cc:sitemap.xml
git ls-tree -r --name-only 94010cc
git show 62e9fe4:src/pages/sitemap.xml.ts
git show 62e9fe4:src/data/site.ts
git show 62e9fe4:src/data/guides.ts
git show 62e9fe4:vercel.json
git show 94010cc:api/quote.ts
git show 62e9fe4:api/quote.ts
git branch -avv
git status --short
git stash list
git worktree list --porcelain
```

The committed fixture `tests/fixtures/pre-overhaul-url-inventory.json` records all 76 historical HTML files and their intended handling. It makes future migration checks independent of a newly edited route manifest.

## Complete historical URL inventory

There were **76 HTML files**. **70 were actual content pages and appeared in the sitemap**; six were invalid font-download artifacts under `css/fonts/`. The content inventory comprises six primary pages, 53 geographic pages, ten articles, and the blog index.

The six primary files were `index.html`, `about-brad.html`, `contact.html`, `faq.html`, `quote-calculator.html`, and `testimonials.html`. The primary canonical URLs `/`, `/contact`, and `/faq` survive. The replacements for the other three are `/about`, `/get-a-quote`, and `/reviews`. The blog hub `/blog/` maps to `/guides`.

The 53 historical `placemarks` destinations were:

```text
albertville-mn, andover-mn, anoka-mn, becker-mn, big-lake-mn,
blaine-mn, brooklyn-center-mn, brooklyn-park-mn, buffalo-mn,
champlin-mn, clear-lake-mn, clearwater-mn, columbia-heights-mn,
coon-rapids-mn, corcoran-mn, crystal-mn, dayton-mn, elk-river-mn,
foley-mn, foreston-mn, fridley-mn, ham-lake-mn, hanover-mn,
hennepin-county-mn, maple-grove-mn, maple-lake-mn, milaca-mn,
minneapolis-mn, minnesota, monticello-mn, new-brighton-mn,
new-hope-mn, nowthen-mn, oak-grove-mn, orrock-mn, osseo-mn,
otsego-mn, plymouth-mn, princeton-mn, ramsey-mn, robbinsdale-mn,
rockford-mn, rogers-mn, sartell-mn, sauk-rapids-mn,
sherburne-county-mn, spring-lake-park-mn, st-cloud-mn,
st-francis-mn, st-michael-mn, waite-park-mn, wright-county-mn,
zimmerman-mn
```

These are 49 city/community pages plus three counties and a statewide page. At `7c836a0`, 27 had their own city destination and 26 mapped to a regional guide. Of those 26, 22 were cities/communities that still lacked their own destination and four were the county/state subjects. The new repair gives the 22 communities their own pages; county and state subjects retain appropriate regional destinations. The service-area list's other cities also receive real, directly linked pages. No page should imply a second office or assert a pickup term the business has not confirmed.

All ten historical articles are listed in the table below. The six font artifacts were `glyphicons-halflings-regular.html`, variants `-2.html` through `-5.html`, and `glyphicons-halflings-regulard41d.html`. They are not local service content and must remain proper noindex 404s rather than redirecting to a service page.

**67 of the 70 legacy content canonical paths changed** during the overhaul. That includes all geographic paths, all article paths, the blog hub, and the three renamed primary pages. This was a large URL migration even though the domain and design identity looked continuous.

## Geographic coverage and redirect findings

At the August launch, `62e9fe4:vercel.json` contained only two explicit own-city mappings and these fallbacks:

```json
{"source":"/placemarks/:slug.html","destination":"/service-areas","permanent":true}
{"source":"/placemarks/:slug","destination":"/service-areas","permanent":true}
```

A permanent response did not preserve the city answer: a search for a particular community reached a general directory that had no corresponding local landing page. A broad destination can be less relevant to the original query and can be treated as a soft 404. The source demonstrates the relevance loss; a historical Google soft-404 classification requires Search Console evidence.

The October 16 first recovery was materially better, but it still used regional guides for 22 historical city/community subjects. That did not fulfill the request for a page for every listed city. The follow-through uses `src/data/city-directory.json`, the city data/rendering pipeline, explicit `src/data/legacy-routes.json` mappings, and `vercel.json` rules to preserve the city itself. All historical `.html` and extensionless forms must land on the final corresponding destination with no directory catch-all or redirect chain. Unknown slugs remain 404s.

The city directory, homepage, footer, regional pages, sitemap, canonical URLs, and structured data need to agree with the same route inventory. A page merely existing in a build is insufficient if its directory entry is plain text or points to a missing slug.

## Article loss and recovered answers

At launch the five new guide bodies contained only **184–230 words each** when counting the title, summary, section headings, paragraphs, and list items. The ten original article elements contained approximately **1,098–1,372 visible words each**, including their in-article related links. These are different but explicitly stated extraction boundaries; they demonstrate the scale of reduction, not a target word count or a ranking formula. The old JSON-LD `wordCount` fields were not used because they did not reliably match visible content.

| Historical blog slug                              | Legacy publication date | Old article words | August replacement and missing answer                                                                                     | Repair                                                                                                                               |
| ------------------------------------------------- | ----------------------- | ----------------: | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `how-much-is-my-junk-car-worth-minnesota-2026`    | 2026-02-04              |             1,196 | `/guides/what-affects-a-junk-car-offer`, 184 words; lost component/completeness examples and offer-comparison detail      | Preserve canonical guide; recover component, condition, access, inspection and net-offer answers                                     |
| `minnesota-junk-car-title-requirements`           | 2026-02-11              |             1,218 | `/guides/minnesota-junk-car-documents`, 230 words; lost replacement-title, lien, estate and alternative-process questions | Current DVS/statute-based title guide with concrete steps and limitations                                                            |
| `scrap-value-by-weight-minnesota-guide`           | 2026-02-18              |             1,098 | Redirected into general offer guide; independent weight/unit answer disappeared                                           | Dedicated existing weight guide gains curb weight/GVWR, short/gross/metric ton and material-rate distinctions                        |
| `mn-license-plates-before-junking`                | 2026-02-25              |             1,110 | Redirected into document checklist; distinct plate question disappeared                                                   | Separate plate guide, current statute and official resources, no blanket removal rule                                                |
| `auto-recycling-environmental-impact-twin-cities` | 2026-03-04              |             1,211 | Consolidated into after-pickup guide, 196 words; lost fluids, stormwater, batteries, refrigerants and material recovery   | Separate environment guide regains those practical explanations with MPCA/EPA sources                                                |
| `running-vs-non-running-junk-car-prices`          | 2026-03-11              |             1,168 | Redirected into general offer guide; no direct running-condition comparison                                               | Separate existing value guide gains starts-but-will-not-move, dead battery, long-parked and warning-light cases                      |
| `junk-vs-tradein-vs-private-sale`                 | 2026-03-18              |             1,137 | Sent to `/guides`; comparison answer absent                                                                               | Existing comparison guide gains net-proceeds method, complete dealer transaction, time/deadline and fake-check guidance              |
| `what-happens-to-car-after-pickup`                | 2026-03-25              |             1,372 | `/guides/what-happens-after-junk-car-pickup`, 196 words; multi-stage explanation reduced to short generalities            | Preserve guide URL; add evaluation, reuse, depollution, material separation and seller-record explanations                           |
| `top-10-most-junked-cars-minnesota`               | 2026-04-01              |             1,156 | Sent to `/guides`; model names and vehicle-specific questions disappeared                                                 | Existing vehicle guide regains all ten model groups as examples with useful condition/access questions, without a fabricated ranking |
| `free-junk-car-removal-minneapolis-mn`            | 2026-04-08              |             1,123 | Sent to metro-wide `/junk-car-removal`; lost Minneapolis alley/ramp/shop access and cost questions                        | Dedicated `/guides/minneapolis-junk-car-removal-costs-and-pickup`; historical URL maps directly to it                                |

The new `src/data/legacy-guide-restoration.ts` composes seven substantive guide updates with the existing material and adds the Minneapolis article. `src/data/guides.ts` applies them while keeping established guide canonical URLs. It also restores all ten legacy publication dates from the actual `Article.datePublished` values in `94010cc`, with October 16 modification dates for revised material. The metadata documents continuity; it is not proof of a Google recrawl or independently verified first publication before the repository history.

All ten historical model groups are retained as ordinary examples: Ford F-150; Chevrolet Silverado/GMC Sierra; Honda Civic; Toyota Camry; Dodge/Ram 1500; Ford Taurus/Mercury Sable; Chevrolet Impala; Jeep Grand Cherokee; Subaru Outback/Forester/Legacy; and Chrysler Town & Country/Dodge Caravan. Their presence does not assert a statewide popularity ranking, a recurring defect, acceptance of every vehicle, or a fixed offer.

### Legacy assertions intentionally corrected

The old articles contained price charts, unsupported model rankings, fixed metal/converter rates, a 30-day firm-quote promise, rigid pickup windows, all-cash handoff claims, neighborhood timing promises, universal plate-removal instructions, specific fees/processing times, and purported business operating procedures. Some described the business's equipment, downstream facilities, staff, testing, environmental participation, and processing percentages without a supporting record.

Restoring those assertions verbatim would introduce accuracy and trust problems. The repair restores the questions and useful explanations with appropriate sources and actual vehicle-specific review. The title and plate guides retain the current Minnesota statute/DVS treatment. No unsupported legal form numbers, fee schedules, payment promises, recycler licenses, testimonials, or environmental statistics are republished as facts.

## Calls, web quote requests, and backend continuity

The old `quote-calculator.html` name is misleading: before the overhaul, commit `1211f08` had replaced the automatic calculator with an actual **manual vehicle lead form**. At `94010cc` its visible form posted to `/api/quote`, required name, phone, email, city, year, make and model, and accepted optional condition notes. The button said “Get My Cash Quote.” `api/quote.ts` sent the business lead email and then a customer acknowledgement.

The August rebuild sent the old quote URL to the general cash-for-cars service page and retired `/api/quote` with HTTP 410. A general contact form survived at `/contact`, but the dedicated quote-request destination and its clearer vehicle-sale intent disappeared. This is a plausible lead-conversion regression separately from Google's search traffic. A phone/SMS link existing somewhere on the page is not evidence that every interested customer can find and complete the preferred action.

The repair provides `/get-a-quote` using the existing protected contact form and `/api/contact`. Its copy requests a human-reviewed offer, preserves call/text alternatives, explains that submission does not confirm pickup, and avoids an invented instant valuation or online booking. The old calculator aliases now point to the specific quote-request page. Homepage and shared inquiry actions lead to that flow. `/api/quote` and `/api/appointment` remain intentionally retired; they are not represented as working dispatch APIs.

The previous form also had failure ambiguity: its comment described returning an error if the customer acknowledgement failed after the internal lead had already been sent. Retrying could therefore concern an already submitted lead. Current provider handling, retries, idempotency, explicit response-success checks, and mobile Turnstile layout must be verified at the final revision. Intercepted browser tests cannot prove an actual inbox received an email. This audit sent no emails or analytics events.

The old phone number `763-533-2775`, text number `763-438-2116`, address, founder and founding year remain. The old site's hours were internally inconsistent, including daily 9–6 displays and some Sunday-closed blog footers. The owner-corrected current daily 8–8 hours should be kept consistent across content/schema and the owner-controlled business profile.

## Domain, canonical, robots, schema, and assets

**No canonical-origin change was found.** All 70 original content pages used `https://merritts-auto-recycling.com` in their canonical and Open Graph URL fields. None used HTTP, `www`, or `.html` as its canonical identity. The old blog hub alone used the `/blog/` trailing slash. The non-www HTTPS origin remains in `astro.config.mjs`, the current business configuration, canonical generation, sitemap and structured data.

The `www` host permanent redirect preserves the corresponding path and was present before and after the overhaul. Therefore source evidence does not support a new origin split as the primary explanation of the GSC decline. Account-side verification should still use the correct property and include old and new URL groups; an old-path-only filter will naturally lose clicks after a path migration.

The August source used `.html` blog redirect sources despite `cleanUrls: true`. Commit `12db32e` changed those sources to normalized extensionless paths on August 25. This was a concrete configuration defect and a plausible early migration interruption. Historical deployment responses are not available here, so this audit does not assert that every request failed during that interval. Final production checks must cover both URL forms.

The old and new `robots.txt` allow crawling and reference the same canonical sitemap. Removing redundant explicitly allowed crawler blocks did not block those crawlers, because `User-agent: *` still allows `/`. No source-wide noindex or persistent maintenance rule was found in the August merge or `7c836a0`. The brief August 23 maintenance commits replaced the root and temporarily redirected content routes; their exact crawl exposure cannot be reconstructed from commit timestamps alone. They do not explain months of missing subject destinations.

The current layout emits one central business identity, page/service/article schema and breadcrumbs. Old city pages emitted separate LocalBusiness identities named for each city at the same Brooklyn Center address, and legacy pages included an unverified 5.0/8 aggregate rating. Do not recreate phantom locations or unverified review markup. The business address, contact details, official profile links and useful service-area references provide valid continuity without those claims.

Selected legacy photos remain under new filenames, with provenance in `IMAGE_ASSET_PROVENANCE.md`. Old links to the retained images should be permanently redirected to their exact retained equivalents, including the footer tow-truck and slide 2/3 images and appropriate existing optimized equivalents. Other missing decorative assets are not new city pages and should not receive blanket service-page redirects. The widely referenced old `/images/fb-merritts-auto-recycling-v2.jpg` was already absent from the `94010cc` tree; it is an old inconsistency, not evidence of a newly deleted photo. Whether image-search clicks were affected requires the GSC image search report.

Removing `llms.txt` and `llms-full.txt` is observable in the overhaul. Neither file establishes Google indexing or local rankings, and their absence is not a demonstrated cause of the GSC decline. Restoring accurate versions may support consumers that use them, but it cannot substitute for HTML answers, relevant redirects, crawlability, and measurement.

## Uncommitted and unpushed work

At the start of this audit, HEAD and `master` were `7c836a0`, equal to `origin/master`. Existing local dependency-review and mobile-fix branches matched their corresponding remote branches. The stash was empty, and there was one working tree. The only initial untracked item was `src/data/city-directory.json`, created for the requested complete city expansion. It had not been published. The new source changes in the current work must be committed, pushed, and deployed before they can affect the live site.

Remote `origin/codex/seo-audit-metro-coverage` at `0506be7` is not an ancestor of `master`, so it is stranded in the narrow ancestry sense. Its files were compared with the later `bbdf329` implementation. The later commit uses a broader dedicated-city content structure and reproduces the central metro improvements; the unmerged branch is not evidence that deploying its old tree would recover the lost historical markets. Dependency bot branches are update proposals, not unpublished SEO recovery content. Do not merge them indiscriminately.

## Verification and reporting limits

Required source/build checks are: every original content URL accounted for; every original city maps to its own city destination; county/state mappings remain appropriate; every directory city has a real static page; all legacy article subjects have actual answers and correct publication metadata; no duplicate canonical/title/description; one intended business identity; sitemap parity; noindex HTTP 404 for invalid paths; accessible mobile calls and form controls; and valid internal links. The exact final CI/build/browser results and live deployment SHA belong in the release report and must not be inferred from this audit document.

User-confirmed Search Console decline is a real search-performance concern. Search Console collects Google's search data independently of the site's GTM/GA4 JavaScript. The overhaul removed GTM from rendered pages, and the handoff reports the old `GTM-WDZ8L9TN` container was empty when previously inspected. That can affect site analytics visibility or conversion measurement; it does **not** explain fewer GSC impressions/clicks. An owner-controlled measurement ID and actual account-side collection verification remain necessary to measure leads.

The GSC connector was subscription-blocked and a usable signed-in browser was not available for this audit. No fresh page/query/indexing export was obtained. The earlier handoff cites 125 clicks/9,040 impressions for August 10–September 6 and 46 clicks/4,897 impressions for September 7–October 4. Those figures were not re-exported here, and the first window straddles the August 23 rebuild. They must not be presented as a clean before/after causal analysis.

Account follow-through should compare the same property, search type, country/device filters and comparable date windows; group each old URL with its new destination; inspect lost queries and indexed/soft-404 status; inspect Google-selected canonical and last crawl for representative restored pages; separate brand/local/service/article and image-search effects; and compare qualified calls/inquiries after release. External profile accuracy, competition, seasonality and business response practices remain possible contributors and cannot be diagnosed from repository history alone.

The repair removes the demonstrated source-level migration gaps. Actual recovery requires Google to revisit and reassess the destinations, with outcomes measured over time. A perfect Lighthouse SEO score, a successful redirect, or a passing mocked form test cannot certify recovered rankings, answered calls, or delivered mail.

## Independent content and resource review

The final source review checked all 88 community records, not only the newly added pages. The earlier 34 pages were expanded to two distinct sections and two local FAQs, with unique descriptions and 240–280 words of main prose. Main paragraphs remain distinct after replacing city names with a common marker; no duplicate first headings, titles or descriptions remain. This is a content-quality check, not a claim that a particular word count determines ranking.

An independent read of all 88 emitted city pages confirmed the correct city H1, self-canonical, indexability, unique metadata, a city-specific Service entity and one Brooklyn Center business provider. Orrock uses Place rather than asserting it is an incorporated city. The emitted directory has 88 unique direct city links, all represented in the sitemap.

All 15 unique external guide sources were checked. A broken Department of Revenue link was replaced with the official, working Motor Vehicle Sales guide, which covers the trade-in allowance question. DVS, Revisor statutes, FTC, EPA, New Brighton and Minneapolis links returned relevant content; the two attributed competitor references also responded. The two MPCA resources returned security-challenge pages to automation, so their underlying content could not be reverified through this connection. No failed request was silently represented as a successful content review.

The release verifier checks all 121 canonical content destinations, 211 content-alias migrations (including both forms for every published city), 12 retained-photo aliases, directory links, robots, the protected forms' visible configuration, and actual noindex 404 destinations. Vercel's permanent `.html` normalization is permitted for the six invalid font artifacts only when it reaches that exact extensionless 404, never unrelated service content. These checks run against the expected deployment SHA so an older live build cannot satisfy the release gate.

The expanded browser suite also exposed a client-side path-validation defect in `src/scripts/tracking.ts`: nested repetition with an optional slash caused exponential backtracking on a long rejected `.html` path. The Inver Grove Heights page repeatedly stalled despite its HTML and assets returning promptly. A controlled read-only browser comparison kept the HTML and CSS unchanged: the original script timed out after ten seconds; replacing only the expression completed navigation in 213 ms at phone width and 56 ms at desktop width. Requiring the slash inside the repeated group removes that ambiguity while retaining the intended path filtering. Both viewport checks and a long invalid-path 404 regression exercise the repaired behavior. Production normally redirects city `.html` aliases before rendering; this finding is not evidence that canonical city URLs were previously freezing or that this defect caused the August traffic decline.
