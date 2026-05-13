#!/usr/bin/env tsx
/**
 * Apply shared head / meta / structured-data updates to the 4 top-level pages:
 *  - index.html
 *  - contact.html
 *  - faq.html
 *  - testimonials.html
 *
 * Also handles cross-page sweeps applicable to every page (placemarks + top-level):
 *  - Normalize internal links to extension-less form (cleanUrls)
 *  - Refresh the service-area listing on index.html
 *  - Add skip link + sticky-call button
 *  - Fix orphan placemark linkage
 *
 * Idempotent.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  loadBlogPosts,
  loadBusiness,
  loadCities,
  loadFaqs,
  loadServices,
  loadTestimonials,
  repoRoot,
} from './_lib/data.mts';
import type { Business } from './_lib/data.mts';
import {
  renderArticleJsonLd,
  renderBlogIndexJsonLd,
  renderBreadcrumbJsonLd,
  renderBusinessJsonLd,
  renderFaqJsonLd,
  renderGeoMeta,
  renderHeroH1,
  renderPersonJsonLd,
  renderPreconnect,
  renderPwaMeta,
  renderVerification,
  renderReviewsJsonLd,
  renderServiceJsonLd,
  renderTwitterCard,
  renderWebPageJsonLd,
  siteUrl,
} from './_lib/render.mts';
import {
  activateSmsLinks,
  addAriaCurrentToNav,
  addNavAriaLabel,
  dedupeAboutBradNavLinks,
  dedupeBlogNavLinks,
  addRoleMainToPageContent,
  addSkipLink,
  addStickyMobileCall,
  applyMarkerBlock,
  deferLocalScripts,
  demoteLegacyH1s,
  injectFontStylesheet,
  injectIntoHead,
  injectBeforeMainContent,
  insertAboutBradNavLink,
  insertBlogNavLink,
  insertQuoteCalculatorNavLink,
  dedupeQuoteCalculatorNavLinks,
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

type PageSpec = {
  file: string;
  slug: string;
  title: string;
  description: string;
  url: string;
  ogTitle?: string;
  ogImage?: string;
  ogImageAlt?: string;
  breadcrumbs: { name: string; url: string }[];
  hero?: { heading: string; subheading: string };
  extraJsonLd?: (biz: Business) => string[];
  skipHero?: boolean;
};

async function main(): Promise<void> {
  const [cities, business, faqs, services, testimonials, blog] = await Promise.all([
    loadCities(),
    loadBusiness(),
    loadFaqs(),
    loadServices(),
    loadTestimonials(),
    loadBlogPosts(),
  ]);
  void cities;

  const SITE = siteUrl();
  const blogPostsBySlug = Object.fromEntries(blog.posts.map((p) => [p.slug, p]));
  void blogPostsBySlug;

  const blogPages: PageSpec[] = [
    {
      file: 'blog/index.html',
      slug: 'blog',
      title: `Blog — Cash for Junk Cars Guides for Minnesota Sellers | ${business.name}`,
      description:
        'Practical, no-fluff guides on selling junk cars in Minnesota — pricing, titles, scrap value, the auto-recycling process, and how to get the most cash for your old vehicle.',
      url: `${SITE}/blog/`,
      ogImage: `${SITE}/images/optimized/slider/slide1.jpg`,
      ogImageAlt: `${business.name} — Cash for Junk Cars Blog`,
      breadcrumbs: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'Blog', url: `${SITE}/blog/` },
      ],
      skipHero: true,
      extraJsonLd: (biz) => [
        renderBlogIndexJsonLd({ blogUrl: `${SITE}/blog/`, posts: blog.posts, biz }),
      ],
    },
    ...blog.posts.map<PageSpec>((post) => ({
      file: `blog/${post.slug}.html`,
      slug: `blog-${post.slug}`,
      title: `${post.title} | ${business.name}`,
      description: post.description,
      url: `${SITE}/blog/${post.slug}`,
      ogImage: `${SITE}/images/optimized/slider/${post.image}`,
      ogImageAlt: post.imageAlt,
      breadcrumbs: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'Blog', url: `${SITE}/blog/` },
        { name: post.category, url: `${SITE}/blog/` },
        { name: post.title, url: `${SITE}/blog/${post.slug}` },
      ],
      skipHero: true,
      extraJsonLd: (biz) => [
        renderArticleJsonLd({
          post,
          biz,
          imageUrl: `${SITE}/images/optimized/slider/${post.image}`,
        }),
      ],
    })),
  ];

  const pages: PageSpec[] = [
    {
      file: 'index.html',
      slug: 'home',
      title:
        'Cash for Junk Cars in the Twin Cities, MN — Same-Day Junk Car Pickup | Merritt’s Auto Recycling',
      description:
        'Top-dollar cash for junk cars, trucks, vans, and SUVs across the Twin Cities metro. We tow your junk car away for free, paid in cash on the spot. Family-owned since 1988. Instant quote: 763-533-2775.',
      url: `${SITE}/`,
      breadcrumbs: [{ name: 'Home', url: `${SITE}/` }],
      hero: {
        heading: 'Cash for Junk Cars in the Twin Cities, MN',
        subheading:
          "Same-day junk car pickup across the metro and outer suburbs — we'll tow your junk car away for free. Paid in cash on the spot — call or text for an instant quote.",
      },
      extraJsonLd: (biz) => [renderServiceJsonLd(biz, services)],
    },
    {
      file: 'contact.html',
      slug: 'contact',
      title: 'Contact Merritt’s Auto Recycling — 763-533-2775 | Cash for Junk Cars MN',
      description:
        'Contact Merritt’s Auto Recycling for an instant cash quote on your junk car. Call or text 763-533-2775, or message us via the form. Serving the Twin Cities and Central MN.',
      url: `${SITE}/contact`,
      breadcrumbs: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'Contact', url: `${SITE}/contact` },
      ],
      hero: {
        heading: 'Contact Merritt’s Auto Recycling',
        subheading:
          'Call or text 763-533-2775 for an instant cash quote, or use the form for an appointment. We serve the entire Twin Cities metro.',
      },
    },
    {
      file: 'faq.html',
      slug: 'faq',
      title: 'FAQ — Cash for Junk Cars in Minnesota | Merritt’s Auto Recycling',
      description:
        'Answers to the most common questions about selling your junk car in Minnesota: how much you get, whether you need a title, how fast pickup happens, and more. Call 763-533-2775.',
      url: `${SITE}/faq`,
      breadcrumbs: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'FAQ', url: `${SITE}/faq` },
      ],
      hero: {
        heading: 'Frequently Asked Questions',
        subheading:
          'Everything you need to know about selling your junk car in Minnesota — title rules, pickup timing, payment, and what we buy.',
      },
    },
    {
      file: 'testimonials.html',
      slug: 'testimonials',
      title: 'Testimonials — 5-Star Reviews of Merritt’s Auto Recycling, Twin Cities MN',
      description:
        'See what Twin Cities customers say about Merritt’s Auto Recycling. Real 5-star reviews from junk car sellers across Brooklyn Park, Maple Grove, Blaine, Coon Rapids, and more.',
      url: `${SITE}/testimonials`,
      breadcrumbs: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'Testimonials', url: `${SITE}/testimonials` },
      ],
      hero: {
        heading: '5-Star Reviews from Twin Cities Customers',
        subheading:
          'Real reviews from people across the Twin Cities metro who sold their junk cars to Merritt’s Auto Recycling.',
      },
      extraJsonLd: (biz) => [renderReviewsJsonLd(biz, testimonials.reviews)],
    },
    {
      file: 'about-brad.html',
      slug: 'about-brad',
      title: 'About Brad Emholtz — Owner, Merritt’s Auto Recycling | Twin Cities Junk Car Buyer',
      description:
        'Meet Brad Emholtz, owner of Merritt’s Auto Recycling — buying junk cars across the Twin Cities since 1988. Family-owned, fully licensed, cash on the spot.',
      url: `${SITE}/about-brad`,
      breadcrumbs: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'About Brad', url: `${SITE}/about-brad` },
      ],
      extraJsonLd: (biz) => [renderPersonJsonLd(biz)],
    },
    {
      file: 'quote-calculator.html',
      slug: 'quote-calculator',
      title:
        'Junk Car Cash Calculator — Instant Estimate for Your Vehicle | Merritt’s Auto Recycling',
      description:
        'Get a no-obligation cash estimate for your junk car in 30 seconds. Pick your vehicle, year, and condition — we’ll show your preliminary range based on real Minnesota scrap pricing. Request a callback for your final on-the-spot offer.',
      url: `${SITE}/quote-calculator`,
      breadcrumbs: [
        { name: 'Home', url: `${SITE}/` },
        { name: 'Cash Calculator', url: `${SITE}/quote-calculator` },
      ],
      hero: {
        heading: 'How much is my junk car worth?',
        subheading:
          'Get an instant preliminary cash estimate based on your vehicle’s scrap weight, year, and condition — then request a callback for your final on-the-spot offer.',
      },
    },
    ...blogPages,
  ];

  for (const page of pages) {
    const filePath = resolve(repoRoot, page.file);
    const original = await readFile(filePath, 'utf8');
    let html = original;

    html = setLangAttribute(html, 'en-US');
    html = setBodyClass(html, 'page-toplevel');
    html = removeDeadMapsScript(html);
    html = removeGoogleFontsLink(html);
    html = injectFontStylesheet(html);
    html = removeLoaderSplash(html);
    html = deferLocalScripts(html);
    html = removeLegacyJsonLd(html);
    html = updateYearsInBusiness(html, business.yearsInBusiness);

    html = addSkipLink(html);
    html = addRoleMainToPageContent(html);
    html = addNavAriaLabel(html);
    html = dedupeAboutBradNavLinks(html);
    html = insertAboutBradNavLink(html, 'absolute');
    html = dedupeBlogNavLinks(html);
    html = insertBlogNavLink(html, 'absolute');
    html = dedupeQuoteCalculatorNavLinks(html);
    html = insertQuoteCalculatorNavLink(html, 'absolute');
    html = replaceAppointmentButtonWithQuoteCta(html, 'absolute');
    html = addAriaCurrentToNav(
      html,
      page.slug === 'home'
        ? '/'
        : page.slug === 'blog'
          ? '/blog/'
          : page.slug === 'quote-calculator'
            ? '/quote-calculator'
            : `/${page.slug}`,
    );
    html = activateSmsLinks(html);
    html = addStickyMobileCall(html, business.phoneDisplay, business.smsPhoneDisplay);

    html = replaceTitle(html, page.title);
    html = replaceMetaDescription(html, page.description);
    html = replaceCanonical(html, page.url);

    const ogImage = page.ogImage ?? business.ogImage;
    const ogImageAlt =
      page.ogImageAlt ?? `${business.name} — Cash for Junk Cars in the Twin Cities, MN`;

    html = replaceOgTags(html, {
      title: page.ogTitle ?? page.title,
      description: page.description,
      url: page.url,
      image: ogImage,
      siteName: business.name,
      imageWidth: 1200,
      imageHeight: 630,
      imageType: 'image/jpeg',
      imageAlt: ogImageAlt,
    });

    html = injectIntoHead(
      html,
      'twitter',
      renderTwitterCard(page.title, page.description, ogImage),
    );
    html = injectIntoHead(
      html,
      'geo',
      renderGeoMeta({
        name: 'Minnesota',
        type: 'state',
        county: 'Minnesota',
        countyShort: 'Minnesota',
        lat: business.geo.latitude,
        lng: business.geo.longitude,
        population: 0,
        milesFromYard: 0,
        driveTime: 'varies',
        neighborhoods: [],
        landmarks: [],
        nearby: [],
      }),
    );
    html = injectIntoHead(html, 'pwa', renderPwaMeta(business.themeColor));
    html = injectIntoHead(html, 'preconnect', renderPreconnect());
    html = injectIntoHead(html, 'verification', renderVerification(business));

    html = injectIntoHead(html, 'jsonld-business', renderBusinessJsonLd(business));
    html = injectIntoHead(html, 'jsonld-breadcrumb', renderBreadcrumbJsonLd(page.breadcrumbs));
    html = injectIntoHead(
      html,
      'jsonld-webpage',
      renderWebPageJsonLd({
        url: page.url,
        name: page.title,
        description: page.description,
        about: business.businessId,
        isPartOf: business.websiteId,
      }),
    );

    if (page.file === 'faq.html') {
      html = injectIntoHead(html, 'jsonld-faq', renderFaqJsonLd(faqs.global));
    }

    if (page.extraJsonLd) {
      for (const block of page.extraJsonLd(business)) {
        const matchName = /<!-- BEGIN auto:(jsonld-[a-z-]+) -->/.exec(block);
        if (matchName?.[1]) {
          html = injectIntoHead(html, matchName[1], block);
        }
      }
    }

    if (page.hero) {
      const heroCity = {
        name: page.hero.heading,
        type: 'city' as const,
        county: '',
        countyShort: '',
        lat: business.geo.latitude,
        lng: business.geo.longitude,
        population: 0,
        milesFromYard: 0,
        driveTime: '',
        neighborhoods: [],
        landmarks: [],
        nearby: [],
      };
      const customHero = renderTopLevelHero(page.hero.heading, page.hero.subheading, business);
      if (html.includes('<!-- BEGIN auto:hero -->')) {
        html = applyMarkerBlock(html, 'hero', customHero);
      } else {
        html = injectBeforeMainContent(html, 'hero', customHero);
      }
      void heroCity;
      void renderHeroH1;
    }

    html = stripDuplicateMetaAndOpeningTags(html);
    html = demoteLegacyH1s(html);

    if (html !== original) {
      await writeFile(filePath, html, 'utf8');
      console.info(`  ✓ ${page.file}`);
    } else {
      console.info(`  · ${page.file} (no change)`);
    }
  }

  await updateServiceAreaList(cities);
  await ensureNowthenLinked();
}

function renderTopLevelHero(heading: string, subheading: string, biz: Business): string {
  const escape = (s: string): string =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return `
<!-- BEGIN auto:hero -->
<section class="local-hero" aria-labelledby="local-hero-title">
  <div class="container">
    <h1 id="local-hero-title">${escape(heading)}</h1>
    <p class="local-hero-sub">${escape(subheading)}</p>
    <div class="local-hero-cta">
      <a class="local-hero-call" href="tel:${biz.phone}" aria-label="Call ${biz.phoneDisplay} for an instant quote">
        <i class="icon icon-technology" aria-hidden="true"></i>
        <span class="local-hero-call-label">Call for Instant Quote</span>
        <strong class="local-hero-call-number">${biz.phoneDisplay}</strong>
      </a>
      <a class="local-hero-secondary" href="#get-quote-now">Make an Appointment</a>
    </div>
  </div>
</section>
<!-- END auto:hero -->`.trim();
}

function stripDuplicateMetaAndOpeningTags(html: string): string {
  // Remove duplicate apple-mobile-web-app-title meta tags outside auto:pwa marker
  let out = html;
  const lines = out.split('\n');
  let seenAppleTitle = false;
  const filtered = lines.filter((line) => {
    if (line.includes('<!-- BEGIN auto:pwa -->')) {
      seenAppleTitle = false;
      return true;
    }
    if (/<meta\s+name=["']apple-mobile-web-app-title["']/i.test(line)) {
      if (seenAppleTitle) return false;
      seenAppleTitle = true;
      return true;
    }
    return true;
  });
  out = filtered.join('\n');
  return out;
}

async function updateServiceAreaList(
  cities: Awaited<ReturnType<typeof loadCities>>,
): Promise<void> {
  const filePath = resolve(repoRoot, 'index.html');
  const html = await readFile(filePath, 'utf8');

  const slugs = Object.keys(cities.cities).sort((a, b) => {
    const an = cities.cities[a]!.name.toLowerCase();
    const bn = cities.cities[b]!.name.toLowerCase();
    if (an < bn) return -1;
    if (an > bn) return 1;
    return 0;
  });

  const total = slugs.length;
  const perCol = Math.ceil(total / 3);
  const cols: string[][] = [
    slugs.slice(0, perCol),
    slugs.slice(perCol, perCol * 2),
    slugs.slice(perCol * 2),
  ];

  const colHtml = cols
    .map((col) => {
      const items = col
        .map((slug) => {
          const c = cities.cities[slug]!;
          const label = c.type === 'state' ? c.name : `${c.name}, MN`;
          return `\t\t\t\t\t\t\t\t<li><a href="/placemarks/${slug}">${label}</a></li>`;
        })
        .join('\n');
      return `\t\t\t\t\t\t<div class="col-sm-4 col-md-4">\n\t\t\t\t\t\t\t<ul class="marker-list">\n${items}\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</div>`;
    })
    .join('\n');

  const block = `<!-- BEGIN auto:service-area -->
\t\t<div id="service-area" class="block bg-1">
\t\t\t<div class="container">
\t\t\t\t<h2 class="h-lg text-center">Our <span class="color">Service Area</span></h2>
\t\t\t\t<p class="info text-center">Cash for Junk Cars — Same-Day Pickup — We'll Tow Your Junk Car Away Free</p>
\t\t\t\t<p class="info text-center">We serve every city below in the Twin Cities metro and Central Minnesota:</p>
\t\t\t\t<div class="row" id="slideMobile" style="margin-left:10px;">
\t\t\t\t\t<div style="width:65%;margin: 0 auto;">
${colHtml}
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="map-section" aria-label="Service area map">
\t\t\t\t\t<iframe class="map-frame" title="Merritt's Auto Recycling service area — Twin Cities, MN" src="https://www.google.com/maps?q=Merritt%27s+Auto+Recycling+3106+68th+Ave+N+Brooklyn+Center+MN+55429&z=9&output=embed" width="100%" height="380" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
<!-- END auto:service-area -->`;

  let next = html;
  if (next.includes('<!-- BEGIN auto:service-area -->')) {
    next = applyMarkerBlock(next, 'service-area', block);
  } else {
    next = next.replace(
      /<div id="service-area"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
      block,
    );
  }
  // Also nuke the leftover commented duplicate listing if present
  next = next.replace(/<!--\s*\n?\s*<div id="service-area"[\s\S]*?-->\s*\n?/g, '');

  if (next !== html) {
    await writeFile(filePath, next, 'utf8');
    console.info('  ✓ index.html service-area refreshed');
  }
}

async function ensureNowthenLinked(): Promise<void> {
  const filePath = resolve(repoRoot, 'index.html');
  const html = await readFile(filePath, 'utf8');
  if (!html.includes('placemarks/nowthen-mn')) {
    console.warn('  ! index.html missing nowthen-mn link — service-area block should include it');
  } else {
    console.info('  ✓ nowthen-mn linked from index.html');
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
