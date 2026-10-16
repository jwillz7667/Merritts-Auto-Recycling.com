# October 16 recovery review

## Scope and evidence

Reviewed the August Astro migration (`62e9fe4` and its ancestry), August canonical/redirect hardening (`762de7f`), October metro expansion (`bbdf329`), city contrast (`e8993c9`), selling-intent/comparison content (`1c13432`), article imagery (`d3ff393`), and all recovery/dependency preparation commits through `6e9817c` against production `d3ff39392159749fb7700553f2d4ab46f41e96ad`.

The current design, real business address, phones, hours, approved photography, original guide URLs and publication dates are preserved. No ranking, traffic or revenue guarantee follows from these checks.

## Confirmed findings

| Finding | Evidence and treatment |
| --- | --- |
| Lost relevance for old local URLs | Public production checks on October 16 returned `/placemarks/ramsey-mn` and `/placemarks/sherburne-county-mn` as 308 redirects to `/service-areas`; `/service-areas/ramsey` returned 404. The recovery provides a Ramsey page and a Sherburne County guide with explicit relevant redirects. |
| Smaller published inventory | The fetched production sitemap contained 36 URLs. A fixed fixture retains these destinations so future changes cannot silently remove them. The recovery build has 65 indexable URLs and 67 HTML pages. |
| Historical migration coverage | Compared the actual pre-rebuild tree at `e487a8f` with `src/data/legacy-routes.json`: all 53 old area pages and ten blog topics are accounted for. Extended territories use qualified regional inquiry guidance rather than fabricated branches or service guarantees. |
| Unfinished dependency candidate | The preparation workflow wrote imports of a nonexistent `node-http.ts`. Added the minimal Node HTTP types, removed the unused Vercel builder dependency and updated Astro to 7.4.0 with a matching lock. Updated affected compatible transitive packages. The full and production dependency audits now report zero advisories. The lock update retains more existing versions than the broadly regenerated candidate. |
| Repeat-run validation failure | ESLint scanned downloaded Chromium JavaScript after browser installation. Excluded `.sites-runtime` generated artifacts. |
| Missing branch validation | Added the dependency-review branch to recovery CI triggers and made all dependency advisories fail CI. Removed the completed, write-enabled one-off candidate preparation workflow. |
| Lead-delivery deadline | Turnstile can take seven seconds and email submission another eight. The old ten-second function limit could terminate delivery; increased it to 30 seconds. Added API tests for validation, origins, abuse limits, security-check failure, provider failure, retries and concurrent duplicate delivery using mocked providers. |
| Conversion regression in the candidate | Restored the directory hero call/text buttons and local ItemList schema removed during recovery, added hero actions to the regional directory, and corrected hero-click analytics placement before generic header detection. Browser coverage protects these contact paths. |
| Oversized mobile hero download | Added full-frame responsive encodings from the existing approved photograph, with provenance hashes. The 640px AVIF is 41,195 bytes versus the original 205,485 bytes; desktop/social originals remain. |
| Incomplete live smoke gate | Replaced a minimum sitemap count with exact preserved/recovered route membership. Added live checks for H1/metadata, X-Robots-Tag, business identity/schema, call/text links, enabled inquiry form, security headers, robots, noindex thank-you, and GET-only API method guard. These checks never send email. |

## Technical SEO and conversion review

Build validation checks unique titles/descriptions, self canonicals, one H1, crawlable internal links and reachability, sitemap parity, Article images/dates, business identity, approved assets, noindex utility pages, and permanent explicit legacy mappings. Existing title/plate guidance retains official Minnesota sources. The comparison remains attributed and does not invent independent endorsements or reviews.

Browser checks cover all published routes, every city page's process-caption contrast at mobile and desktop widths, representative full-page accessibility, overflow, mobile menu, fixed call/text actions, inquiry errors/retries/success and consent behavior. Provider and analytics requests in these tests are intercepted; those results do not establish live email delivery or GA4 ingestion.

Final local validation passed the sensitive-data scan, lint, 44 unit tests, Astro diagnostics, the 67-HTML-page build (65 sitemap URLs), 84 browser tests and the zero-advisory full/production dependency audit. Browser coverage checks 320px phones, 768px tablets, keyboard form validation, prominent landing-page call/text actions, hero event placement and responsive photo loading. See the final exact commit's Recovery validation workflow for release evidence; do not substitute a previous branch's successful run for the release commit.

## Release and measurement limitations

Production at the time of this review is still the 36-URL baseline. A successful preview build is necessary before promotion; verify the released revision using `EXPECTED_REVISION=<full-sha> node scripts/verify-production.mjs`. Check the workflow and public build-info endpoint before describing this release as live.

The Vercel connector returned 403 for `js-projects-995e4cf4`; the CLI has no saved credentials. Preview URLs require Vercel SSO. GitHub commit/deployment statuses remain available for remote-build evidence. No protection settings were disabled.

GSC Wizard's `list_sites` returned `payment_required`. No current Search Console data or live Analytics property can be inspected through that connection. The previously cited traffic windows overlap the rebuild and cannot prove causation. Restore access to the business-controlled Search Console and Analytics accounts before attributing traffic changes, checking Google-selected canonicals, submitting the sitemap or claiming collection.

After release, compare 28-day windows of query/page clicks, impressions, CTR and position, separated by device and branded/nonbranded queries. Review legacy page destinations and excluded/indexed pages. Record qualified conversations and completed purchases privately; a call-link click is not an answered call. Verify the published owner-controlled GA4/GTM destination and real contact delivery with explicit authorization and provider/mailbox evidence. Keep Google Business Profile URL, phone, address and hours aligned with the website. Search engines may take time to recrawl redirects and updated content.

## Mobile Lighthouse laboratory checks

Lighthouse 13.3.0, Chromium, default simulated mobile throttling, local static production output, October 16. Consent was not granted. Contact uses the public Cloudflare testing key; provider delivery was not exercised. These results exclude production network/CDN behavior and do not replace real-user Core Web Vitals or Google rankings.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home after responsive photo | 99 | 100 | 100 | 100 | 2.0 s | 0 |
| Cash for junk cars | 100 | 100 | 100 | 100 | 1.5 s | 0 |
| Contact | 100 | 100 | 100 | 100 | 1.6 s | 0 |
| Ramsey | 100 | 100 | 100 | 100 | 1.5 s | 0 |
| Minnesota plates guide | 100 | 100 | 100 | 100 | 1.5 s | 0 |

The first home run scored 90 with LCP 2.6 seconds; its image-delivery finding prompted the responsive asset change. Raw machine-specific reports remain in the ignored `.sites-runtime/lighthouse` directory. Later edits to hero event placement and directory actions do not change these five pages' visual layout.
