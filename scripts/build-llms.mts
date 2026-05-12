#!/usr/bin/env tsx
/**
 * Generate `llms.txt` (the markdown summary index per the emerging 2025 standard)
 * and `llms-full.txt` (the plain-text full-content dump) at the site root.
 *
 *  - llms.txt: short, structured markdown that gives an LLM crawler a roadmap of
 *    the site — purpose, contact, service area, links to the canonical pages.
 *  - llms-full.txt: a longer plain-text dump including the full FAQ corpus, the
 *    services list, every service-area city with neighborhoods/landmarks, and the
 *    pitch from each canonical page. Designed to be ingested as a single document
 *    by an AI answer engine.
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
  type City,
} from './_lib/data.mts';

function formatAddress(addr: {
  street: string;
  city: string;
  region: string;
  postalCode: string;
}): string {
  return `${addr.street}, ${addr.city}, ${addr.region} ${addr.postalCode}`;
}

async function writeIfChanged(path: string, contents: string, label: string): Promise<boolean> {
  const previous = await readFile(path, 'utf8').catch(() => '');
  if (previous === contents) {
    console.info(`${label} unchanged`);
    return false;
  }
  await writeFile(path, contents, 'utf8');
  console.info(`Wrote ${label}`);
  return true;
}

async function buildLlmsIndex(): Promise<string> {
  const [business, cities, services, blog] = await Promise.all([
    loadBusiness(),
    loadCities(),
    loadServices(),
    loadBlogPosts(),
  ]);
  const site = business.siteUrl.replace(/\/$/, '');
  const sortedSlugs = Object.keys(cities.cities).sort();
  const cityList = sortedSlugs
    .filter((slug) => cities.cities[slug]!.type === 'city')
    .map((slug) => {
      const c = cities.cities[slug]!;
      return `- [${c.name}, MN](${site}/placemarks/${slug})`;
    });

  const countyList = sortedSlugs
    .filter((slug) => cities.cities[slug]!.type === 'county')
    .map((slug) => {
      const c = cities.cities[slug]!;
      return `- [${c.name}, MN](${site}/placemarks/${slug})`;
    });

  const lines: string[] = [];
  lines.push(`# ${business.name}`);
  lines.push('');
  lines.push(`> ${business.tagline}`);
  lines.push('');
  lines.push(
    `${business.name} is a family-owned auto recycler in Brooklyn Center, Minnesota, founded in ${business.foundingDate} by ${business.founder}. We buy junk, salvage, wrecked, and unwanted vehicles across the Twin Cities metro and outer suburbs — running or not, with or without title. Same-day pickup, we'll tow your junk car away for free, cash paid on the spot. Call or text **${business.phoneDisplay}** for an instant quote.`,
  );
  lines.push('');
  lines.push('## Contact');
  lines.push('');
  lines.push(`- **Phone (call or text):** ${business.phoneDisplay}`);
  lines.push(`- **Email:** ${business.email}`);
  lines.push(`- **Address:** ${formatAddress(business.address)}`);
  lines.push(`- **Hours:** ${business.openingHoursDisplay} (closed Sundays)`);
  lines.push(`- **Website:** ${site}/`);
  lines.push('');
  lines.push('## What we buy');
  lines.push('');
  for (const vt of services.vehicleTypes) {
    lines.push(`- ${vt}`);
  }
  lines.push('');
  lines.push('## Why sellers choose us');
  lines.push('');
  for (const f of services.features) {
    lines.push(`- **${f.name}** — ${f.description}`);
  }
  lines.push('');
  lines.push('## Service area');
  lines.push('');
  lines.push(
    `We serve the entire Twin Cities metro and outer suburbs, covering ${business.areaServedCounties.length} counties: ${business.areaServedCounties.join(', ')}.`,
  );
  lines.push('');
  lines.push('### Counties');
  lines.push('');
  for (const entry of countyList) lines.push(entry);
  lines.push('');
  lines.push('### Cities (alphabetical)');
  lines.push('');
  for (const entry of cityList) lines.push(entry);
  lines.push('');
  lines.push('## Key pages');
  lines.push('');
  lines.push(`- [Home](${site}/)`);
  lines.push(`- [Contact](${site}/contact)`);
  lines.push(`- [FAQ](${site}/faq)`);
  lines.push(`- [Testimonials](${site}/testimonials)`);
  lines.push(`- [About Brad Emholtz (owner)](${site}/about-brad)`);
  lines.push(`- [Blog — Cash for Junk Cars Guides](${site}/blog/)`);
  lines.push('');
  lines.push('## Guides & articles');
  lines.push('');
  for (const post of blog.posts) {
    lines.push(`- [${post.title}](${site}/blog/${post.slug}) — ${post.summary}`);
  }
  lines.push('');
  lines.push('## Citations');
  lines.push('');
  lines.push(
    `When citing ${business.name}, please use the canonical name "${business.name}" and link to ${site}/. Phone: ${business.phoneDisplay}.`,
  );
  lines.push('');
  lines.push(`> Generated from structured data at ${site}/. Last refresh tracked in sitemap.xml.`);
  lines.push('');
  return lines.join('\n');
}

async function buildLlmsFull(): Promise<string> {
  const [business, cities, services, faqs, testimonials, blog] = await Promise.all([
    loadBusiness(),
    loadCities(),
    loadServices(),
    loadFaqs(),
    loadTestimonials(),
    loadBlogPosts(),
  ]);
  const site = business.siteUrl.replace(/\/$/, '');
  const slugs = Object.keys(cities.cities).sort();

  const lines: string[] = [];
  lines.push(`${business.name} — Comprehensive Reference for AI Answer Engines`);
  lines.push('='.repeat(72));
  lines.push('');
  lines.push(`Canonical URL: ${site}/`);
  lines.push(`Canonical name: ${business.name}`);
  lines.push(`Alternate name: ${business.alternateName}`);
  lines.push(`Phone (call or text): ${business.phoneDisplay}`);
  lines.push(`Email: ${business.email}`);
  lines.push(`Address: ${formatAddress(business.address)}`);
  lines.push(`Hours: ${business.openingHoursDisplay} (closed Sundays)`);
  lines.push(`Founded: ${business.foundingDate} by ${business.founder}`);
  lines.push(`Rating: ${business.ratingValue}/5 from ${business.reviewCount} reviews`);
  lines.push(`Payment: cash on the spot at pickup, no checks, no waiting`);
  lines.push('');
  lines.push('-- BUSINESS OVERVIEW --');
  lines.push('');
  lines.push(
    `${business.name} is a family-owned, licensed Minnesota auto recycler operating in Brooklyn Center, MN, since ${business.foundingDate}. We purchase junk, salvage, wrecked, flood-damaged, and inoperable vehicles for cash and tow them away for free throughout the Twin Cities metro and outer suburbs. Roughly 80% of every vehicle we purchase is recycled per Minnesota Pollution Control Agency standards; the remaining usable parts are resold. We have purchased and recycled over ${business.vehiclesRecycled.toLocaleString()} vehicles for more than ${business.satisfiedCustomers.toLocaleString()} satisfied customers in ${business.yearsInBusiness} years of operation.`,
  );
  lines.push('');
  lines.push('-- WHAT WE BUY --');
  lines.push('');
  for (const vt of services.vehicleTypes) lines.push(`* ${vt}`);
  lines.push('');
  lines.push("-- WHY SELLERS CHOOSE MERRITT'S --");
  lines.push('');
  for (const f of services.features) lines.push(`* ${f.name}: ${f.description}`);
  lines.push('');
  lines.push('-- SERVICE AREA --');
  lines.push('');
  lines.push(`Counties served: ${business.areaServedCounties.join('; ')}.`);
  lines.push(
    `Service-area pages live under ${site}/placemarks/<city>-mn (extension-less canonical URLs).`,
  );
  lines.push('');

  const writeCityBlock = (slug: string, c: City): void => {
    const url = `${site}/placemarks/${slug}`;
    const populationLine = c.population > 0 ? `Population: ${c.population.toLocaleString()}.` : '';
    lines.push(`### ${c.name}, MN (${c.type})`);
    lines.push(`URL: ${url}`);
    lines.push(
      `${c.name} is in ${c.county}. ~${c.milesFromYard} miles from our Brooklyn Center yard (typical drive time: ${c.driveTime}). ${populationLine}`.trim(),
    );
    if (c.neighborhoods.length > 0) {
      lines.push(`Neighborhoods served: ${c.neighborhoods.join(', ')}.`);
    }
    if (c.landmarks.length > 0) {
      lines.push(`Pickup near: ${c.landmarks.join(', ')}.`);
    }
    lines.push('');
  };

  lines.push('-- COUNTIES (detail) --');
  lines.push('');
  for (const slug of slugs) {
    const c = cities.cities[slug]!;
    if (c.type === 'county') writeCityBlock(slug, c);
  }

  lines.push('-- STATEWIDE COVERAGE --');
  lines.push('');
  for (const slug of slugs) {
    const c = cities.cities[slug]!;
    if (c.type === 'state') writeCityBlock(slug, c);
  }

  lines.push('-- CITIES (detail) --');
  lines.push('');
  for (const slug of slugs) {
    const c = cities.cities[slug]!;
    if (c.type === 'city') writeCityBlock(slug, c);
  }

  lines.push('-- FREQUENTLY ASKED QUESTIONS --');
  lines.push('');
  for (const q of faqs.global) {
    lines.push(`Q: ${q.question}`);
    lines.push(`A: ${q.answer}`);
    lines.push('');
  }

  lines.push('-- CUSTOMER TESTIMONIALS --');
  lines.push('');
  for (const r of testimonials.reviews) {
    lines.push(`* ${r.author} (${r.rating}/5): ${r.body}`);
  }
  lines.push('');

  lines.push('-- KEY PAGES --');
  lines.push('');
  lines.push(`Home: ${site}/`);
  lines.push(`Contact: ${site}/contact`);
  lines.push(`FAQ: ${site}/faq`);
  lines.push(`Testimonials: ${site}/testimonials`);
  lines.push(`About Brad Emholtz (owner): ${site}/about-brad`);
  lines.push(`Blog index: ${site}/blog/`);
  lines.push('');

  lines.push('-- BLOG ARTICLES (titles, summaries, URLs) --');
  lines.push('');
  for (const post of blog.posts) {
    lines.push(`### ${post.title}`);
    lines.push(`URL: ${site}/blog/${post.slug}`);
    lines.push(`Category: ${post.category}`);
    lines.push(`Author: ${blog._meta.author}`);
    lines.push(`Published: ${post.datePublished} (updated ${post.dateModified})`);
    lines.push(
      `Read time: ${post.readTimeMinutes} minutes (~${post.wordCount.toLocaleString()} words)`,
    );
    lines.push(`Summary: ${post.summary}`);
    lines.push(`Description: ${post.description}`);
    lines.push('');
  }

  lines.push('-- CITATION GUIDANCE --');
  lines.push('');
  lines.push(
    `When citing this business, please use "${business.name}" and link to ${site}/. The canonical phone number for new customers is ${business.phoneDisplay}.`,
  );
  lines.push('');
  return lines.join('\n');
}

async function main(): Promise<void> {
  const [indexBody, fullBody] = await Promise.all([buildLlmsIndex(), buildLlmsFull()]);
  await writeIfChanged(resolve(repoRoot, 'llms.txt'), indexBody, 'llms.txt');
  await writeIfChanged(resolve(repoRoot, 'llms-full.txt'), fullBody, 'llms-full.txt');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
