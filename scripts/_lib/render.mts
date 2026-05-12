import type {
  BlogPost,
  Business,
  City,
  FaqsData,
  ServicesData,
  TestimonialReview,
} from './data.mts';
import { interpolate, stableHashIndex } from './data.mts';

const SITE = 'https://merritts-auto-recycling.com';

export function pickTitle(slug: string, city: City, patterns: string[]): string {
  const idx = stableHashIndex(slug, patterns.length);
  const t = patterns[idx] ?? patterns[0]!;
  return interpolate(t, { city: city.name });
}

export function pickMeta(slug: string, city: City, patterns: string[]): string {
  const idx = stableHashIndex(slug + 'm', patterns.length);
  const t = patterns[idx] ?? patterns[0]!;
  return interpolate(t, {
    city: city.name,
    countyShort: city.countyShort,
    neighborhoods: humanList(city.neighborhoods.slice(0, 2)),
    landmark: city.landmarks[0] ?? city.county,
    driveTime: city.driveTime,
  });
}

export function humanList(items: string[], conjunction = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderHeroH1(
  _slug: string,
  city: City,
  biz: Business,
  depth: 'top' | 'placemark',
): string {
  const phoneHref = biz.phone;
  const phoneDisplay = biz.phoneDisplay;
  const homeHref = depth === 'placemark' ? '../index.html' : './index.html';
  const cityHeading =
    city.type === 'state'
      ? 'Cash for Junk Cars in Minnesota — Same-Day Junk Car Pickup'
      : city.type === 'county'
        ? `Cash for Junk Cars in ${city.name}, MN — Same-Day Junk Car Pickup`
        : `Cash for Junk Cars in ${city.name}, MN — Same-Day Junk Car Pickup`;

  const subheading =
    city.type === 'state'
      ? "Serving the Twin Cities metro and Central Minnesota. We'll tow your junk car away for free, cash on the spot, family-owned since 1988."
      : city.type === 'county'
        ? `Serving every city in ${city.name}, MN. We tow your junk car away free throughout the county, cash paid on the spot.`
        : `Serving ${city.name} and ${city.countyShort} — we'll tow your junk car away for free. Cash paid on the spot — call or text for an instant quote.`;

  return `
<!-- BEGIN auto:hero -->
<section class="local-hero" aria-labelledby="local-hero-title">
  <div class="container">
    <h1 id="local-hero-title">${escapeHtml(cityHeading)}</h1>
    <p class="local-hero-sub">${escapeHtml(subheading)}</p>
    <div class="local-hero-cta">
      <a class="local-hero-call" href="tel:${phoneHref}" aria-label="Call ${phoneDisplay} for an instant quote">
        <i class="icon icon-technology" aria-hidden="true"></i>
        <span class="local-hero-call-label">Call for Instant Quote</span>
        <strong class="local-hero-call-number">${phoneDisplay}</strong>
      </a>
      <a class="local-hero-secondary" href="${homeHref === './index.html' ? '#get-quote-now' : '#get-quote-now'}">Make an Appointment</a>
    </div>
  </div>
</section>
<!-- END auto:hero -->`.trim();
}

export function renderGeoMeta(city: City): string {
  if (city.type === 'state') {
    return `
<!-- BEGIN auto:geo -->
<meta name="geo.region" content="US-MN">
<meta name="geo.placename" content="Minnesota">
<meta name="geo.position" content="${city.lat};${city.lng}">
<meta name="ICBM" content="${city.lat}, ${city.lng}">
<!-- END auto:geo -->`.trim();
  }
  return `
<!-- BEGIN auto:geo -->
<meta name="geo.region" content="US-MN">
<meta name="geo.placename" content="${city.name}">
<meta name="geo.position" content="${city.lat};${city.lng}">
<meta name="ICBM" content="${city.lat}, ${city.lng}">
<!-- END auto:geo -->`.trim();
}

export function renderTwitterCard(title: string, description: string, image: string): string {
  return `
<!-- BEGIN auto:twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="Merritt's Auto Recycling — Cash for Junk Cars in the Twin Cities, MN">
<!-- END auto:twitter -->`.trim();
}

export function renderPwaMeta(themeColor: string): string {
  return `
<!-- BEGIN auto:pwa -->
<meta name="theme-color" content="${themeColor}">
<meta name="msapplication-TileColor" content="${themeColor}">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Merritt's">
<meta name="application-name" content="Merritt's Auto Recycling">
<!-- END auto:pwa -->`.trim();
}

export function renderPreconnect(): string {
  return `
<!-- BEGIN auto:preconnect -->
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
<link rel="dns-prefetch" href="https://www.google-analytics.com">
<link rel="dns-prefetch" href="https://maps.googleapis.com">
<link rel="dns-prefetch" href="https://challenges.cloudflare.com">
<!-- END auto:preconnect -->`.trim();
}

export function renderVerification(biz: Business): string {
  const v = biz.verification ?? {};
  const lines: string[] = [];
  if (v.google && v.google.length > 0) {
    lines.push(`<meta name="google-site-verification" content="${escapeHtml(v.google)}">`);
  }
  if (v.bing && v.bing.length > 0) {
    lines.push(`<meta name="msvalidate.01" content="${escapeHtml(v.bing)}">`);
  }
  if (v.yandex && v.yandex.length > 0) {
    lines.push(`<meta name="yandex-verification" content="${escapeHtml(v.yandex)}">`);
  }
  if (v.pinterest && v.pinterest.length > 0) {
    lines.push(`<meta name="p:domain_verify" content="${escapeHtml(v.pinterest)}">`);
  }
  if (v.norton && v.norton.length > 0) {
    lines.push(`<meta name="norton-safeweb-site-verification" content="${escapeHtml(v.norton)}">`);
  }
  const body =
    lines.length > 0 ? lines.join('\n') : '<!-- no search-engine verification codes configured -->';
  return `<!-- BEGIN auto:verification -->\n${body}\n<!-- END auto:verification -->`;
}

export function renderBusinessJsonLd(biz: Business): string {
  const hasMap =
    biz.hasMap ?? (biz.gbpCid ? `https://www.google.com/maps?cid=${biz.gbpCid}` : undefined);
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['AutomotiveBusiness', 'LocalBusiness'],
    '@id': biz.businessId,
    name: biz.name,
    alternateName: biz.alternateName,
    legalName: biz.legalName,
    description: biz.tagline,
    url: `${biz.siteUrl}/`,
    logo: biz.logo,
    image: biz.ogImage,
    telephone: biz.phone,
    email: biz.email,
    priceRange: biz.priceRange,
    paymentAccepted: biz.paymentAccepted,
    currenciesAccepted: biz.currenciesAccepted,
    address: {
      '@type': 'PostalAddress',
      streetAddress: biz.address.street,
      addressLocality: biz.address.city,
      addressRegion: biz.address.region,
      postalCode: biz.address.postalCode,
      addressCountry: biz.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: biz.geo.latitude,
      longitude: biz.geo.longitude,
    },
    openingHoursSpecification: biz.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: biz.sameAs,
    founder: {
      '@type': 'Person',
      name: biz.founder,
    },
    foundingDate: biz.foundingDate,
    knowsAbout: biz.knowsAbout,
    areaServed: biz.areaServedCounties.map((c) => ({
      '@type': 'AdministrativeArea',
      name: c,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: biz.ratingValue,
      bestRating: '5',
      worstRating: '1',
      reviewCount: biz.reviewCount,
    },
  };
  if (hasMap) data.hasMap = hasMap;
  return jsonLdScript('business', data);
}

export function renderServiceJsonLd(biz: Business, services: ServicesData): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: services.primary.serviceType,
    name: services.primary.name,
    description: services.primary.description,
    provider: { '@id': biz.businessId },
    areaServed: biz.areaServedCounties.map((c) => ({ '@type': 'AdministrativeArea', name: c })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Vehicles We Buy',
      itemListElement: services.vehicleTypes.map((v) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: v },
      })),
    },
  };
  return jsonLdScript('service', data);
}

export function renderLocalBusinessRef(biz: Business, city: City, slug: string): string {
  if (city.isYardCity) {
    return renderBusinessJsonLd(biz);
  }
  const hasMap =
    biz.hasMap ?? (biz.gbpCid ? `https://www.google.com/maps?cid=${biz.gbpCid}` : undefined);
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${biz.siteUrl}/placemarks/${slug}#business`,
    name: `${biz.name} — ${city.type === 'state' ? 'Minnesota' : city.name + ', MN'}`,
    description: `${biz.name} buys junk cars throughout ${city.name}, ${city.countyShort} — we tow your junk car away free, same-day cash, family-owned since ${biz.foundingDate}.`,
    url: `${biz.siteUrl}/placemarks/${slug}`,
    image: biz.ogImage,
    logo: biz.logo,
    telephone: biz.phone,
    email: biz.email,
    priceRange: biz.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: biz.address.street,
      addressLocality: biz.address.city,
      addressRegion: biz.address.region,
      postalCode: biz.address.postalCode,
      addressCountry: biz.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: biz.geo.latitude,
      longitude: biz.geo.longitude,
    },
    openingHoursSpecification: biz.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed:
      city.type === 'state'
        ? { '@type': 'State', name: 'Minnesota' }
        : city.type === 'county'
          ? { '@type': 'AdministrativeArea', name: `${city.name}, MN` }
          : [
              { '@type': 'City', name: `${city.name}, MN` },
              { '@type': 'AdministrativeArea', name: city.county },
            ],
    parentOrganization: { '@id': biz.businessId },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: biz.ratingValue,
      bestRating: '5',
      worstRating: '1',
      reviewCount: biz.reviewCount,
    },
  };
  if (hasMap) data.hasMap = hasMap;
  return jsonLdScript('business', data);
}

export function renderBreadcrumbJsonLd(items: { name: string; url: string }[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return jsonLdScript('breadcrumb', data);
}

export function renderFaqJsonLd(faqs: { question: string; answer: string }[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
  return jsonLdScript('faq', data);
}

export function renderWebPageJsonLd(args: {
  url: string;
  name: string;
  description: string;
  inLanguage?: string;
  about?: string;
  isPartOf?: string;
}): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${args.url}#webpage`,
    url: args.url,
    name: args.name,
    description: args.description,
    inLanguage: args.inLanguage ?? 'en-US',
  };
  if (args.about) data.about = { '@id': args.about };
  if (args.isPartOf) data.isPartOf = { '@id': args.isPartOf };
  return jsonLdScript('webpage', data);
}

export function renderPersonJsonLd(biz: Business): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE}/about-brad#brad`,
    name: 'Brad Emholtz',
    jobTitle: 'Owner',
    description:
      'Owner of Merritt’s Auto Recycling — buying and recycling junk cars across the Twin Cities since 1988.',
    image: `${SITE}/images/optimized/slider/slide2.jpg`,
    url: `${SITE}/about-brad`,
    worksFor: { '@id': biz.businessId },
    knowsAbout: [
      'Auto recycling',
      'Junk car buying',
      'Salvage vehicle removal',
      'Catalytic converter recycling',
      'Free junk car pickup in Minnesota',
    ],
  };
  return jsonLdScript('person', data);
}

export function renderReviewsJsonLd(biz: Business, reviews: TestimonialReview[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE}/testimonials#reviews`,
    name: `Reviews of ${biz.name}`,
    itemListElement: reviews.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: r.body,
        itemReviewed: { '@id': biz.businessId },
      },
    })),
  };
  return jsonLdScript('reviews', data);
}

export function renderCityFaqs(city: City, faqs: FaqsData): { question: string; answer: string }[] {
  const templates = city.type === 'county' ? faqs.perCounty : faqs.perCity;
  const countyName = city.type === 'county' ? city.name : city.county;
  return templates.map((t) => ({
    question: interpolate(t.question, {
      city: city.name,
      county: countyName,
      countyShort: city.countyShort,
    }),
    answer: interpolate(t.answer, {
      city: city.name,
      county: countyName,
      countyShort: city.countyShort,
      miles: city.milesFromYard,
      driveTime: city.driveTime,
    }),
  }));
}

/**
 * Unique, city-specific local-content block. Drops the doorway-page risk by ensuring every
 * placemark has genuine local signal (neighborhoods, landmarks, drive time) above any
 * boilerplate. Wrapped in marker comments so the script owns the content end-to-end.
 */
export function renderLocalContent(city: City, biz: Business): string {
  const hoods = city.neighborhoods.slice(0, 3);
  const landmarks = city.landmarks.slice(0, 3);
  const hoodList = humanList(hoods);
  const headingCity = city.type === 'state' ? 'Minnesota' : `${city.name}, MN`;

  const paragraphs: string[] = [];

  if (city.type === 'state') {
    paragraphs.push(
      `Merritt's Auto Recycling buys junk cars throughout Minnesota — from the Twin Cities metro to ${city.countyShort} and out into Central Minnesota. We tow free, pay cash on the spot, and have been doing it the same way since ${biz.foundingDate}.`,
    );
    paragraphs.push(
      `Whether your car is in a driveway, an alley, a parking lot, or stuck behind a snowbank, our flatbed driver will get it. Most pickups happen within 24 hours of your call.`,
    );
  } else if (city.type === 'county') {
    paragraphs.push(
      `Merritt's Auto Recycling buys junk vehicles in every city across ${city.name}. We're based in ${biz.address.city}, roughly ${city.driveTime} from most of ${city.name}, and our flatbed driver covers the whole county daily.`,
    );
    if (landmarks.length > 0) {
      paragraphs.push(
        `Common pickup spots include the areas around ${humanList(landmarks)} — and any residential street or business lot in between. Running or not, with or without a title, our offer is no-obligation and the tow is free.`,
      );
    }
  } else {
    const distLine = `Our ${biz.address.city}, MN yard is ${city.milesFromYard} miles from ${city.name} — typical pickup time is ${city.driveTime} from the moment we confirm the appointment.`;
    paragraphs.push(
      `Merritt's Auto Recycling serves every part of ${city.name}${hoodList ? `, from ${hoodList}` : ''}, plus the surrounding stretch of ${city.countyShort}. ${distLine}`,
    );
    if (landmarks.length > 0) {
      paragraphs.push(
        `We pick up regularly near ${humanList(landmarks)} and on the residential and commercial streets in between. Running or not, with or without keys, we will quote it and tow it for free.`,
      );
    }
    paragraphs.push(
      `Family-owned since ${biz.foundingDate}, we pay top-dollar cash on the spot — no waiting for a check, no hidden fees, no high-pressure pitch. Call ${biz.phoneDisplay} for an instant quote, or use the form below.`,
    );
  }

  const html = paragraphs.map((p) => `  <p>${escapeHtml(p)}</p>`).join('\n');

  return `
<!-- BEGIN auto:local-content -->
<section class="local-content" aria-labelledby="local-content-title">
  <h2 id="local-content-title">Cash for Junk Cars Throughout ${escapeHtml(headingCity)}</h2>
${html}
</section>
<!-- END auto:local-content -->`.trim();
}

/**
 * Internal-link block to the city's nearest peers. Closes the geographic graph for Google
 * (and AI crawlers) — when one placemark gets a hit, link equity flows to its neighbors.
 */
export function renderNearbyCities(city: City, allCities: Record<string, City>): string {
  const nearby = (city.nearby ?? [])
    .map((slug) => ({ slug, city: allCities[slug] }))
    .filter((p): p is { slug: string; city: City } => p.city !== undefined);

  if (nearby.length === 0) {
    return `<!-- BEGIN auto:nearby-cities -->\n<!-- END auto:nearby-cities -->`;
  }

  const items = nearby
    .map((p) => {
      const label =
        p.city.type === 'county'
          ? `${p.city.name}, MN`
          : p.city.type === 'state'
            ? 'Minnesota'
            : `${p.city.name}, MN`;
      return `    <li><a href="/placemarks/${p.slug}">${escapeHtml(label)}</a></li>`;
    })
    .join('\n');

  return `
<!-- BEGIN auto:nearby-cities -->
<aside class="nearby-cities" aria-labelledby="nearby-cities-title">
  <h3 id="nearby-cities-title">We also buy junk cars in nearby areas:</h3>
  <ul>
${items}
  </ul>
</aside>
<!-- END auto:nearby-cities -->`.trim();
}

/**
 * Visible FAQ block matching the JSON-LD FAQPage. Same Q&A, rendered as a `<details>` list
 * for compact, accessible-by-default disclosure.
 */
export function renderFaqVisible(faqs: { question: string; answer: string }[]): string {
  if (faqs.length === 0) {
    return `<!-- BEGIN auto:faq-visible -->\n<!-- END auto:faq-visible -->`;
  }
  const items = faqs
    .map(
      (f) => `  <details class="local-faq-item">
    <summary>${escapeHtml(f.question)}</summary>
    <div class="local-faq-answer"><p>${escapeHtml(f.answer)}</p></div>
  </details>`,
    )
    .join('\n');

  return `
<!-- BEGIN auto:faq-visible -->
<section class="local-faq" aria-labelledby="local-faq-title">
  <h2 id="local-faq-title">Frequently Asked Questions</h2>
${items}
</section>
<!-- END auto:faq-visible -->`.trim();
}

function jsonLdScript(name: string, data: unknown): string {
  return `
<!-- BEGIN auto:jsonld-${name} -->
<script type="application/ld+json">
${JSON.stringify(data, null, 2)}
</script>
<!-- END auto:jsonld-${name} -->`.trim();
}

export function renderArticleJsonLd(args: {
  post: BlogPost;
  biz: Business;
  imageUrl: string;
}): string {
  const postUrl = `${SITE}/blog/${args.post.slug}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${postUrl}#article`,
    headline: args.post.title,
    description: args.post.description,
    mainEntityOfPage: { '@id': `${postUrl}#webpage` },
    image: args.imageUrl,
    datePublished: args.post.datePublished,
    dateModified: args.post.dateModified,
    author: { '@id': `${SITE}/about-brad#brad` },
    publisher: { '@id': args.biz.organizationId },
    inLanguage: 'en-US',
    wordCount: args.post.wordCount,
    articleSection: args.post.category,
  };
  return jsonLdScript('article', data);
}

export function renderBlogIndexJsonLd(args: {
  blogUrl: string;
  posts: BlogPost[];
  biz: Business;
}): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${args.blogUrl}#blog`,
    url: args.blogUrl,
    name: `${args.biz.name} — Blog`,
    description:
      'Practical, no-fluff guides on selling junk cars in Minnesota — pricing, titles, scrap value, and the auto-recycling process.',
    inLanguage: 'en-US',
    publisher: { '@id': args.biz.organizationId },
    blogPost: args.posts.map((p) => ({
      '@type': 'BlogPosting',
      '@id': `${SITE}/blog/${p.slug}#article`,
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      description: p.description,
      datePublished: p.datePublished,
      dateModified: p.dateModified,
      author: { '@id': `${SITE}/about-brad#brad` },
    })),
  };
  return jsonLdScript('blog', data);
}

export function renderRelatedLinks(args: {
  cities: { slug: string; name: string }[];
  posts: { slug: string; title: string }[];
}): string {
  const cityItems = args.cities
    .map(
      (c) =>
        `\t\t<li><a href="/placemarks/${c.slug}">Cash for junk cars in ${escapeHtml(c.name)}, MN</a></li>`,
    )
    .join('\n');
  const postItems = args.posts
    .map((p) => `\t\t<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></li>`)
    .join('\n');
  return `<!-- BEGIN auto:related -->
<aside class="related-links" aria-labelledby="related-title">
\t<h2 id="related-title">Keep reading</h2>
\t<div class="related-grid">
\t\t<div class="related-col">
\t\t\t<h3>Related cities</h3>
\t\t\t<ul>
${cityItems}
\t\t\t</ul>
\t\t</div>
\t\t<div class="related-col">
\t\t\t<h3>More guides</h3>
\t\t\t<ul>
${postItems}
\t\t\t</ul>
\t\t</div>
\t</div>
</aside>
<!-- END auto:related -->`;
}

export function siteUrl(): string {
  return SITE;
}
