# Launch handoff

## Current production state

The live domain is intentionally serving a site-maintenance page with:

- “This website is down for maintenance.”
- call number 763-533-2775
- daily hours 8:00 AM–8:00 PM

Do not replace it automatically. The full rebuild requires explicit owner approval after the gates below.

## Release gates

### 1. Content and operations

- [ ] Owner reviews `CONTENT_VERIFICATION_REQUIRED.md`.
- [ ] Owner approves all selected legacy images and the new logo.
- [ ] Owner confirms whether any omitted claim should be restored with evidence.
- [ ] Owner confirms Brooklyn Center and Minneapolis service wording.
- [ ] Owner confirms the privacy and contact-consent language.

### 2. Preview environment

- [ ] Create a Vercel Preview from the refactor branch.
- [ ] Configure Preview `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RECIPIENT_EMAIL`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY`, and `ALLOWED_ORIGIN`.
- [ ] Add the preview hostname to Turnstile or use Cloudflare’s documented test keys only for non-production testing.
- [ ] Do not point the production domain or production branch at the refactor yet.

### 3. Functional validation

- [ ] Submit the general contact form with safe test data.
- [ ] Confirm exactly one internal lead email arrives.
- [ ] Confirm customer acknowledgement arrives or logs a best-effort failure without losing the lead.
- [ ] Retry the same request/idempotency key and confirm no duplicate email.
- [ ] Submit a general contact inquiry.
- [ ] Confirm validation, honeypot, expired Turnstile, rate-limit, and provider-failure states.
- [ ] Confirm phone, text, email, Maps, Google profile, and Facebook links.

### 4. Automated and visual QA

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run test:e2e` in an environment with Chromium installed
- [ ] Review desktop at 1440 × 900.
- [ ] Review tablet at 768 × 1024.
- [ ] Review mobile at 390 × 844 and 320 × 720.
- [ ] Confirm no horizontal overflow, clipped navigation, or sticky-CTA overlap.
- [ ] Run Lighthouse on home, cash-for-cars, contact, one area page, and one guide.

### 5. SEO migration

- [ ] Compare `vercel.json` to `REDIRECT_MAP.md`.
- [ ] Sample primary, blog, city, county, form, and `www` redirects.
- [ ] Validate sitemap and robots on Preview.
- [ ] Validate one LocalBusiness entity and absence of aggregateRating.
- [ ] Confirm Search Console and Bing access.
- [ ] Update Google Business Profile hours and website URL if needed.

### 6. Production approval and release

- [ ] Obtain explicit owner approval to launch.
- [ ] Confirm the exact branch Vercel production tracks.
- [ ] Merge/push the approved refactor to that branch.
- [ ] Watch the Vercel deployment to completion.
- [ ] Verify the production home, call/text actions, contact form, headers, schema, sitemap, robots, and redirect samples.
- [ ] Keep the final maintenance commit available for immediate rollback.

## Rollback

If production forms, routing, rendering, or canonical behavior fail:

1. restore the known-good maintenance commit to the production branch
2. confirm the maintenance page returns HTTP 200 and shows the call number/hours
3. preserve the failed deployment logs and request IDs
4. fix in a preview branch
5. repeat the release gates before another launch

## First-week monitoring

- Day 0: form delivery, Vercel logs, response headers, redirects, schema, and crawl files
- Day 1–3: inbox delivery, spam rate, provider errors, Search Console inspection, GBP link
- Day 7: crawl errors, legacy redirect traffic, lead quality, mobile performance
- Day 14–28: qualified calls/forms versus baseline, index coverage, local profile actions

Rankings and lead volume are monitored outcomes, not launch acceptance guarantees.
