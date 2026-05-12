#!/usr/bin/env tsx
/**
 * Apply Phase 2 + Phase 4 (head meta + JSON-LD + visible H1) transforms to every placemark page.
 *
 * Reads:  data/cities.json, data/business.json, data/faqs.json, data/services.json
 * Writes: placemarks/*.html
 *
 * Idempotent — re-run safely. Every injected block is wrapped in auto:NAME markers.
 */

import { readFile, writeFile } from 'node:fs/promises';

import {
  canonicalUrlFor,
  loadBusiness,
  loadCities,
  loadFaqs,
  loadServices,
  placemarkFilePath,
} from './_lib/data.mts';
import {
  pickMeta,
  pickTitle,
  renderBreadcrumbJsonLd,
  renderCityFaqs,
  renderFaqJsonLd,
  renderFaqVisible,
  renderGeoMeta,
  renderHeroH1,
  renderLocalBusinessRef,
  renderLocalContent,
  renderNearbyCities,
  renderPreconnect,
  renderPwaMeta,
  renderVerification,
  renderTwitterCard,
  renderWebPageJsonLd,
  siteUrl,
} from './_lib/render.mts';
import {
  activateSmsLinks,
  addNavAriaLabel,
  addRoleMainToPageContent,
  addSkipLink,
  addStickyMobileCall,
  applyMarkerBlock,
  deferLocalScripts,
  demoteLegacyH1s,
  injectAfterMarker,
  injectBeforeMarker,
  injectFontStylesheet,
  injectIntoHead,
  injectBeforeMainContent,
  dedupeAboutBradNavLinks,
  dedupeBlogNavLinks,
  dedupeQuoteCalculatorNavLinks,
  insertAboutBradNavLink,
  insertBlogNavLink,
  insertQuoteCalculatorNavLink,
  replaceAppointmentButtonWithQuoteCta,
  removeDeadMapsScript,
  removeGoogleFontsLink,
  removeLegacyJsonLd,
  removeLoaderSplash,
  replaceCanonical,
  replaceMetaDescription,
  replaceOgTags,
  replaceTitle,
  setBodyClass,
  setLangAttribute,
  updateYearsInBusiness,
} from './_lib/transform.mts';

async function main(): Promise<void> {
  const [cities, business, faqs, services] = await Promise.all([
    loadCities(),
    loadBusiness(),
    loadFaqs(),
    loadServices(),
  ]);

  void services; // reserved for future cross-page service blocks

  const SITE = siteUrl();
  const slugs = Object.keys(cities.cities);
  console.info(`Building ${slugs.length} placemarks…`);

  let touched = 0;
  for (const slug of slugs) {
    const city = cities.cities[slug]!;
    const filePath = placemarkFilePath(slug);
    let html: string;
    try {
      html = await readFile(filePath, 'utf8');
    } catch (err) {
      console.warn(`  skip ${slug}: ${(err as Error).message}`);
      continue;
    }

    const canonical = canonicalUrlFor(city, slug);
    const title = pickTitle(slug, city, cities._meta.titlePatterns);
    const meta = pickMeta(slug, city, cities._meta.metaPatterns);

    let next = html;

    next = setLangAttribute(next, 'en-US');
    next = setBodyClass(next, 'page-placemark');
    next = removeDeadMapsScript(next);
    next = removeGoogleFontsLink(next);
    next = injectFontStylesheet(next);
    next = removeLoaderSplash(next);
    next = deferLocalScripts(next);
    next = removeLegacyJsonLd(next);
    next = updateYearsInBusiness(next, business.yearsInBusiness);

    next = addSkipLink(next);
    next = addRoleMainToPageContent(next);
    next = addNavAriaLabel(next);
    next = dedupeAboutBradNavLinks(next);
    next = insertAboutBradNavLink(next, 'relative');
    next = dedupeBlogNavLinks(next);
    next = insertBlogNavLink(next, 'relative');
    next = dedupeQuoteCalculatorNavLinks(next);
    next = insertQuoteCalculatorNavLink(next, 'relative');
    next = replaceAppointmentButtonWithQuoteCta(next, 'relative');
    next = activateSmsLinks(next);
    next = addStickyMobileCall(next, business.phoneDisplay, business.phoneDisplay);

    next = replaceTitle(next, title);
    next = replaceMetaDescription(next, meta);
    next = replaceCanonical(next, canonical);

    next = replaceOgTags(next, {
      title,
      description: meta,
      url: canonical,
      image: business.ogImage,
      siteName: business.name,
      imageWidth: 1200,
      imageHeight: 630,
      imageType: 'image/jpeg',
      imageAlt: `${business.name} — Cash for Junk Cars in ${city.name}, MN`,
    });

    next = injectIntoHead(next, 'twitter', renderTwitterCard(title, meta, business.ogImage));
    next = injectIntoHead(next, 'geo', renderGeoMeta(city));
    next = injectIntoHead(next, 'pwa', renderPwaMeta(business.themeColor));
    next = injectIntoHead(next, 'preconnect', renderPreconnect());
    next = injectIntoHead(next, 'verification', renderVerification(business));

    const breadcrumbBase = [
      { name: 'Home', url: `${SITE}/` },
      { name: 'Service Areas', url: `${SITE}/#service-area` },
      {
        name: city.type === 'state' ? 'Minnesota' : `${city.name}, MN`,
        url: canonical,
      },
    ];

    next = injectIntoHead(next, 'jsonld-business', renderLocalBusinessRef(business, city, slug));
    next = injectIntoHead(next, 'jsonld-breadcrumb', renderBreadcrumbJsonLd(breadcrumbBase));
    next = injectIntoHead(next, 'jsonld-faq', renderFaqJsonLd(renderCityFaqs(city, faqs)));
    next = injectIntoHead(
      next,
      'jsonld-webpage',
      renderWebPageJsonLd({
        url: canonical,
        name: title,
        description: meta,
        about: business.businessId,
        isPartOf: business.websiteId,
      }),
    );

    const heroBlock = renderHeroH1(slug, city, business, 'placemark');
    if (next.includes('<!-- BEGIN auto:hero -->')) {
      next = applyMarkerBlock(next, 'hero', heroBlock);
    } else {
      next = injectBeforeMainContent(next, 'hero', heroBlock);
    }

    next = injectAfterMarker(
      next,
      '<!-- END auto:hero -->',
      'local-content',
      renderLocalContent(city, business),
    );

    next = injectBeforeMarker(
      next,
      '<!-- // Content  -->',
      'nearby-cities',
      renderNearbyCities(city, cities.cities),
    );

    next = injectBeforeMarker(
      next,
      '<!-- BEGIN auto:nearby-cities -->',
      'faq-visible',
      renderFaqVisible(renderCityFaqs(city, faqs)),
    );

    next = demoteLegacyH1s(next);

    if (next !== html) {
      await writeFile(filePath, next, 'utf8');
      touched += 1;
      console.info(`  ✓ ${slug}`);
    } else {
      console.info(`  · ${slug} (no change)`);
    }
  }

  console.info(`Done. ${touched}/${slugs.length} placemark files updated.`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
