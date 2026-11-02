# Recovery follow-through — November 1, 2026

## Website changes

Maple Grove, St. Paul, Buffalo and Princeton now show the approved existing truck photo, business identity and one short, attributed Google review excerpt. Its source, publication date and October 16 verification date are preserved. No local job, customer location, new rating, guarantee or testimonial is invented. These four pages have an early direct link to `/get-a-quote`, with instructions for condition, pickup location and documents. Only those four sitemap modification dates advance to November 1 for this visible addition.

`scripts/recovery-report.mjs` compares actual single-period CSV exports, combining historical URLs with replacements and separating query intent. See RECOVERY_MEASUREMENT.md. Test fixtures are synthetic and are not traffic findings.

## Account access and remaining work

GSC Wizard refused this pass's account check with `payment_required` / `subscription_required`; no subscription was purchased. The browser subsequently exposed the signed-in Domain property. Both documented comparison periods were exported and analyzed privately under `.sites-runtime/recovery/`; raw exports and detailed performance metrics are excluded from Git. The high-loss guide and city destinations were inspected. Google accepted indexing requests for the license-plate guide, vehicle-offer guide, Buffalo and the auto-recycling service page. The latter was indexed but still reported an August 25 crawl predating restoration. Princeton was already indexed with a matching canonical and an October 24 crawl. Earlier Maple Grove/St. Paul requests were retained. Each request is a queue submission, not proof of indexing or recovery.

The connected Personal Vercel account exposes the existing `merritts-auto-recycling-com` project. Environment metadata contains no `PUBLIC_GA4_ID` or `PUBLIC_GTM_ID`. The signed-in Analytics account exposes streams for other domains, not this canonical website. A separate property was prepared with the business name, America/Chicago time zone, USD and Autos & Vehicles category. Automatic approval review rejected creating that property because a persistent new Analytics property requires explicit authorization. It was not created and no collection was activated. The consent-aware integration remains ready; see MEASUREMENT_PLAN.md. Do not reuse another domain's measurement ID or reactivate the empty old GTM container.

Account actions and remaining verification:

1. Both initial complete-period comparisons using RECOVERY_MEASUREMENT.md were exported and analyzed. Repeat only when another comparable complete window is available. Keep title rewrites selective: the high-loss guides have very few recent impressions, so their historical traffic loss does not establish a current title problem.
2. Follow the requested city URLs' recrawls and inspect other high-loss destinations. Evaluate content/canonicals for crawled-but-excluded pages before adding copy or requesting crawling again.
3. Submitted Business Profile hours of daily 8 AM–8 PM, canonical website `https://merritts-auto-recycling.com/` and SMS number 763-438-2116. Google displayed these as pending review, not yet approved; its later status message allowed up to seven days for review. The verified name, main phone and address match. Existing categories were reviewed and retained; no new offices or keywords were added to the name.
4. Reviewed services and submitted removal of unsupported emergency, roadside, repair, transport and vague duplicate labels. The three retained services are Cash For Junk Cars, Junk Cars Towing and Junk Car Removal Services. Google displayed the edit as pending review, with up to one day to publish. Existing original truck/vehicle photos were reviewed and retained. The current website logo was added to the empty logo slot; after reloading the owner editor, it showed Change logo. The PNG was re-encoded to meet Google's minimum file size with decoded pixels verified unchanged. Public logo appearance was not independently verified. `/reviews` already requests honest feedback from all prior customers. Keep it unbiased and without incentives. Review replies must concern actual reviews and exclude private customer details.
5. Explicit authorization for new Analytics property creation is still required by automatic approval review. After authorization, create the isolated current-domain stream, review enhanced measurement, activate the confirmed destination, check consent choices and one event per action in the correct account, and verify inquiry collection. Keep qualified inquiries/purchases in a private business log.

## Page Indexing example audit

All 156 excluded examples and 51 indexed examples were read and compared with the current production sitemap. Together they account for all 121 canonical sitemap destinations: 26 appear in the indexed examples, 92 in discovered examples and three in crawled examples. The other examples are historical or host variants. These are report classifications, not a fresh exact count of current indexing. The report still displays an October 22 update date; individual inspections can be newer and take precedence.

| Report reason | Examples read | Current sitemap destinations | Historical or host variants |
| --- | ---: | ---: | ---: |
| Discovered — currently not indexed | 92 | 92 | 0 |
| Crawled — currently not indexed | 8 | 3 | 5 |
| Page with redirect | 50 | 0 | 50 |
| Alternate page with proper canonical | 6 | 0 | 6 |

The three current crawled examples are Princeton, Waconia and the repair/trade-in/sale guide. Newer individual inspections confirm all three are already indexed with matching canonicals; do not treat the lagging group as their current status. No current crawled-but-excluded destination was confirmed among those examples, and no unnecessary rewrite was made to chase that stale label. The five other crawled examples are about-Brad and old city paths. All six alternate-canonical examples are old www placemark URLs. Keep their relevant permanent replacements. The 92 discovered examples are genuine current destinations requiring measured follow-through, not 92 broken pages. Do not subtract any HTTPS count from sitemap inventory to infer an indexing total.

## Public listing and link audit

The following listings were checked November 1. Search Console's Links report showed 18 external links, all attributed to the canonical homepage, and 448 internal links. Its JunkyardAtlas drilldown showed five referring URLs pointing to the working www homepage. This reported set is not a comprehensive backlink inventory. No observed link in it targeted a missing historical deep URL; retain the working permanent host redirect. No external directory correction/outreach submission is claimed.

| Listing | Finding | Prepared correction |
| --- | --- | --- |
| https://junkyardatlas.com/minnesota/brooklyn-center/ | Phone, address and daily 8 AM–8 PM match; working www root link; five linking pages reported in GSC | No urgent correction; preserve host redirect |
| https://bestaround.com/listing/latjms3rew/merrittaposs-auto-recycling-brooklyn-center-mn | Daily 9 AM–8 PM; www link; unverified blanket free/same-day claims | Daily 8 AM–8 PM; canonical root link; vehicle-specific pickup terms |
| https://junkurcar.com/directory/junk-car-buyers/minnesota/saint-paul | www link; Brooklyn Center address and phone match | Canonical root link; retain correct identity |
| https://junkurcar.com/sell-junk-car/plymouth/mn | Public search rendering labels Merritt's Brooklyn Park alongside its Brooklyn Center address | Brooklyn Center, MN; recheck live record before submission |

BestAround exposes a claim-listing flow rather than an authenticated editor. JunkUrCar is independently operated. Edits require access/operator cooperation. Do not buy a listing, claim a directory grade as an endorsement, or imply a prepared request has been accepted.

Prepared correction text for a verified operator channel when outreach is authorized:

> Please correct Merritt's Auto Recycling's listing to: 3106 68th Ave N, Brooklyn Center, MN 55429; phone 763-533-2775; text 763-438-2116; daily hours 8 AM–8 PM; website https://merritts-auto-recycling.com/. Please describe timing and any pickup charges as agreed for the specific vehicle rather than guaranteed free or same-day service. The official site publishes these details. Thank you.

For incoming links from Search Console, prioritize relevant sources that referred visitors to old destinations. Preserve correct permanent redirects and seek a direct current URL when the operator can update it. A working www root link has lower priority than a broken deep link. No paid-link campaign is proposed.

## Firsthand evidence

New city-specific case studies require genuine job records: city, customer-approved photo, actual vehicle/access issue and accurate outcome. Confirm permission and exclude plates, VINs, home addresses and private communications. The existing truck photo and attributed review establish business context but do not establish a job in either city.

Sources: listing URLs above, README.md business details, IMAGE_ASSET_PROVENANCE.md, docs/dev/GOOGLE_REVIEWS_PROVENANCE_2026-10-16.md, https://support.google.com/business/answer/7091, https://support.google.com/contributionpolicy/answer/7400114 and https://developers.google.com/search/docs/fundamentals/creating-helpful-content.

Google performance exports were obtained through the signed-in browser and analyzed privately. Record each separate inspection, indexing request, profile save and analytics activation only after its visible confirmation. No source-code test establishes indexing or traffic recovery.
