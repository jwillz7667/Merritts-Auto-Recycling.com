# Google Search Console handoff

Updated: August 25, 2026  
Canonical site: `https://merritts-auto-recycling.com`

This handoff separates completed website work from steps that require access to the business's Google account or DNS provider. Search visibility and rankings cannot be guaranteed.

## Implemented on the website

- `https://merritts-auto-recycling.com/sitemap.xml` returns the canonical indexable URL set with accurate `lastmod` values.
- `https://merritts-auto-recycling.com/robots.txt` permits crawling and declares the sitemap.
- Every public route has a unique title, meta description, canonical, one H1, crawlable internal links, social metadata, and valid JSON-LD.
- `/thank-you` and the custom 404 use `noindex` and are excluded from the sitemap.
- HTTPS and non-`www` are canonical; legacy URLs permanently redirect to their closest replacements.
- Legacy blog redirects cover both `.html` and extensionless forms to work with Vercel clean URLs.
- Structured data uses verified business details only. Visible FAQs remain on the site without Google's retired `FAQPage` rich-result markup.
- The favicon, touch icon, web app icons, and social preview image use the current brand assets.

## Account-side setup

1. Sign in with a business-controlled Google account and add a **Domain property** for `merritts-auto-recycling.com` in Google Search Console.
2. Add the supplied DNS TXT record at the domain's DNS provider, wait for propagation, and complete verification. Keep the DNS record in place.
3. In **Settings → Users and permissions**, grant access to named users instead of sharing the account password.
4. In **Sitemaps**, submit `sitemap.xml` and confirm Google reports a successful fetch.
5. Use **URL Inspection** on the home page, each core service page, both service-area pages, and one guide. Confirm the Google-selected canonical matches the declared canonical.
6. Request indexing for the home page and materially changed priority pages after this release. Repeated requests for unchanged URLs do not accelerate routine crawling.
7. Inspect representative legacy blog and placemark URLs. Google should observe a permanent redirect and eventually consolidate signals into the destination URL.

## Ongoing monitoring

- Review Page Indexing, Sitemaps, Core Web Vitals, HTTPS, Security Issues, and Manual Actions monthly and after major releases.
- Investigate groups of excluded URLs before isolated URLs; duplicates and redirected legacy URLs are expected when their canonical destination is indexed.
- Use Search performance to compare qualified organic calls, texts, and inquiries by page and query. Avoid optimizing only for impressions.
- Check field Core Web Vitals after sufficient traffic exists. Laboratory tests are diagnostic and cannot replace Search Console field data.
- Keep the Google Business Profile website, phone, address, category, and daily 8:00 AM–8:00 PM hours aligned with the site.

## Analytics status

The site supports an owner-approved Google Tag Manager container through `PUBLIC_GTM_ID`, but no container ID should be invented or committed. Configure the real value in Vercel only after the business approves the analytics and consent setup.

## 2026 guidance note

Google does not require AI-specific schema or an `llms.txt` file for Search AI features. The applicable controls remain crawlability, indexability, visible people-first content, accurate structured data, internal links, useful images, and page experience.

Official references:

- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Ask Google to recrawl URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Search Console ownership verification](https://support.google.com/webmasters/answer/9008080)
- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
