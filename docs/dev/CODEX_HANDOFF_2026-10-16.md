# Codex handoff — Merritt's Auto Recycling SEO recovery
**Prepared:** 2026-10-16
**Repo:** https://github.com/jwillz7667/Merritts-Auto-Recycling.com
**Work branch:** `fix/dependency-patch-review-2026-10-16`
**Base production branch:** `master`
**Production baseline before recovery:** `d3ff39392159749fb7700553f2d4ab46f41e96ad`

## User directive
Preserve the modern Astro visual rebuild. Repair search-traffic regression without rolling back the design. User specifically requested a Codex handoff and a commit of completed work. **Do not broaden scope or start new refactors before validating the work already committed.** Do not assert the changes are live unless `master` and deployment are verified.

## State at handoff
- The recovery changes are committed on `fix/seo-recovery-2026-10-16`; `fix/dependency-patch-review-2026-10-16` is a descendant containing the recovery plus an isolated dependency-patch *preparation workflow*. At the time of this handoff, `master` was still at `d3ff393`.
- Recovery diff from `master`: 18 additional local city landing pages alongside the existing 16 (34 total), six regional guides and regional index, restored selling guides (12 total), a 65-URL indexable sitemap inventory, plus explicit redirect coverage for all 53 former regional URLs and 10 historical blog topics. Unknown legacy destinations should return proper 404 rather than blanket redirects to the service-area hub. See `README.md`, `RECOVERY_RELEASE.md`, `REDIRECT_MAP.md`, and `src/data/legacy-routes.json` for implementation.
- Current visual rebuild and existing business identity/contact numbers are preserved. Inquiry form remains backed by `/api/contact` with input validation, Turnstile and Resend, and improved duplicate-submit/retry/success handling; no automatic pricing or booking was introduced.
- Added consent-aware analytics component and event allowlist. Optional tag only loads if configured; former `GTM-WDZ8L9TN` container was reportedly empty at the time of inspection. Consent-aware code is not proof of live GA4 collection. See `MEASUREMENT_PLAN.md`.
- Added a pinned recovery CI workflow, browser tests, production verification script, and build/content/migration checks. See `.github/workflows/recovery-validation.yml`, `scripts/verify-production.mjs`, and `tests/`.
- Dependency-patch workflow at `.github/workflows/prepare-dependency-patch.yml` prepares a proposed Astro/runtime dependency update and saves its candidate blobs; **the candidate has not been applied to package.json/package-lock.json in this branch**. Do not present the dependency advisory as fixed. Inspect its artifact and audit before any dependency merge.

## Verification already reported; recheck latest branch head
Prior recovery run passed sensitive-data scan, lint, 27 unit tests, and a 67-HTML-file build. An *initial* browser run identified pale service-card numbering, horizontal overflow, and a stale navigation test locator; follow-up commits addressed those. Do **not** claim all browser tests or production smoke tests pass merely from this note. Read the latest GitHub Actions statuses and artifacts for this exact branch head.

### First commands for Codex
```bash
git fetch origin
git checkout fix/dependency-patch-review-2026-10-16
git pull --ff-only
node --version  # Node >= 22.13
npm ci
npm run security:scan
npm run lint
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
node scripts/dependency-report.mjs
git status --short
```
Install Playwright browsers with `PLAYWRIGHT_BROWSERS_PATH=.sites-runtime/playwright` consistent with the package script. Capture failures and fix only reproducible problems; do not rewrite unrelated pages.

## Remaining work — in priority order
1. **Confirm branch content and tests:** inspect full diff `master...fix/dependency-patch-review-2026-10-16` and CI results; reproduce/fix any failing browser, responsive overflow, contrast, keyboard, sitemap, legacy-redirect, contact, or build validations. Verify clean working tree and actual dependency audit output.
2. **Dependency update:** treat prepared dependency patch as *unreviewed candidate*, not a completed fix. If compatible and audit-clean, apply a narrowly scoped patch with matching lockfile and tests. Otherwise preserve the existing dependency state and document the residual advisory.
3. **Release to production only after checks:** use a normal reviewed PR or a confirmed fast-forward promotion from the correct branch; do not force-push or roll back the Astro redesign. Check that the deployment actually builds from the promoted commit.
4. **Verify live site:** run `node scripts/verify-production.mjs` as documented and inspect representative local and regional routes, old redirects, sitemap, canonical/meta/robots, mobile menu/cards, lead form and noindex 404 behavior. Account for real-world service-territory details; do not promise unsupported pickup terms.
5. **Account-dependent setup:** confirm owner-controlled GA4 ID or published GTM tags and validate consent-safe GA4 Realtime/DebugView events; verify production Resend/Turnstile and real delivery *with permission*. Search Console property/session or GSC Wizard subscription is needed for direct indexing/traffic comparisons; lack of access should not block code repairs.
6. **Monitor actual SEO recovery:** compare pre/post rebuild queries, impressions, clicks and URLs in Search Console over appropriate windows. Historical figures cited in investigation: Aug 10–Sep 6 clicks 125 / impressions 9,040 versus Sep 7–Oct 4 clicks 46 / impressions 4,897, but the first period straddles the rebuild and is not clean causal proof. Record the actual post-release metrics rather than promise rankings.

## Guardrails and important caveats
- Do not restore the old design, invent reviews/testimonials or business locations, guarantee same-day pickup/free towing/payment amounts, or copy outdated legal language. Follow the existing public official sources for Minnesota title/plate guidance.
- Do not classify source secret scans as dependency security audits. Do not treat mocked form/analytics browser tests as successful production delivery or tag ingestion.
- Production deployment and Google indexing were **not** verified from the recovery branch at handoff. Earlier available Vercel integration did not authorize this project's scope; GSC Wizard was subscription-blocked and separate browser profile had no saved sign-in.
- Prefer linking to actual workflows, PRs, commits, and explicit test logs in final status. Keep `master` intact until validated.

## Expected completion report
State precise branch/commit SHA, CI and local checks passed/failed, whether merged/deployed, live URLs checked, remaining external account prerequisites, and any unresolved risks. Do not call the task complete without evidence.
