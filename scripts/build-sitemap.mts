#!/usr/bin/env tsx
/**
 * Regenerate `sitemap.xml` from the source of truth (data/cities.json + the top-level pages).
 *
 *  - URLs are in the canonical extension-less form to match `cleanUrls: true` in vercel.json.
 *  - `<lastmod>` for each entry is the last git-modified date of the file, fallback to today.
 *  - `<image:image>` entries are emitted with the per-page OG image so Google Image search picks
 *    up the local-business OG composition for every placemark.
 *  - Output is sorted: homepage → top-level pages → placemarks (alphabetical).
 */

import { execFile as execFileCb } from 'node:child_process';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

import { loadBlogPosts, loadBusiness, loadCities, repoRoot } from './_lib/data.mts';

const execFile = promisify(execFileCb);

type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: 'weekly' | 'monthly' | 'yearly';
  priority: string;
  image?: { url: string; caption: string };
};

async function lastModifiedISO(file: string): Promise<string> {
  let gitDate: string | null = null;
  try {
    const { stdout } = await execFile('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: repoRoot,
    });
    const out = stdout.trim();
    if (out) gitDate = out.slice(0, 10);
  } catch {
    // ignore
  }

  let mtimeDate: string | null = null;
  try {
    const s = await stat(resolve(repoRoot, file));
    mtimeDate = s.mtime.toISOString().slice(0, 10);
  } catch {
    // ignore
  }

  // Prefer the more recent of the two — captures uncommitted edits but never regresses past
  // the last commit date when files haven't been touched in the working tree.
  if (gitDate && mtimeDate) return gitDate > mtimeDate ? gitDate : mtimeDate;
  return gitDate ?? mtimeDate ?? new Date().toISOString().slice(0, 10);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function entryXml(e: SitemapEntry): string {
  const image = e.image
    ? `\n    <image:image>\n      <image:loc>${escapeXml(e.image.url)}</image:loc>\n      <image:caption>${escapeXml(e.image.caption)}</image:caption>\n    </image:image>`
    : '';
  return `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${image}
  </url>`;
}

async function main(): Promise<void> {
  const [cities, business, blog] = await Promise.all([
    loadCities(),
    loadBusiness(),
    loadBlogPosts(),
  ]);
  const SITE = business.siteUrl.replace(/\/$/, '');

  const entries: SitemapEntry[] = [];

  entries.push({
    loc: `${SITE}/`,
    lastmod: await lastModifiedISO('index.html'),
    changefreq: 'weekly',
    priority: '1.00',
    image: {
      url: business.ogImage,
      caption: `${business.name} — Cash for Junk Cars in the Twin Cities, MN`,
    },
  });

  const topLevel: { file: string; slug: string; priority: string }[] = [
    { file: 'contact.html', slug: 'contact', priority: '0.90' },
    { file: 'quote-calculator.html', slug: 'quote-calculator', priority: '0.90' },
    { file: 'about-brad.html', slug: 'about-brad', priority: '0.85' },
    { file: 'faq.html', slug: 'faq', priority: '0.80' },
    { file: 'testimonials.html', slug: 'testimonials', priority: '0.80' },
  ];

  for (const p of topLevel) {
    entries.push({
      loc: `${SITE}/${p.slug}`,
      lastmod: await lastModifiedISO(p.file),
      changefreq: 'monthly',
      priority: p.priority,
    });
  }

  const slugs = Object.keys(cities.cities).sort();
  for (const slug of slugs) {
    const city = cities.cities[slug]!;
    const filename = slug === 'minnesota' ? 'minnesota.html' : `${slug}.html`;
    entries.push({
      loc: `${SITE}/placemarks/${slug}`,
      lastmod: await lastModifiedISO(`placemarks/${filename}`),
      changefreq: city.type === 'state' ? 'monthly' : 'monthly',
      priority: city.type === 'county' ? '0.75' : city.type === 'state' ? '0.85' : '0.70',
      image: {
        url: business.ogImage,
        caption: `${business.name} — Cash for Junk Cars in ${city.name}${city.type === 'state' ? '' : ', MN'}`,
      },
    });
  }

  entries.push({
    loc: `${SITE}/blog/`,
    lastmod: await lastModifiedISO('blog/index.html'),
    changefreq: 'weekly',
    priority: '0.80',
    image: {
      url: business.ogImage,
      caption: `${business.name} — Cash for Junk Cars Blog`,
    },
  });

  for (const post of blog.posts) {
    const imageUrl = `${SITE}/images/optimized/slider/${post.image}`;
    entries.push({
      loc: `${SITE}/blog/${post.slug}`,
      lastmod: post.dateModified,
      changefreq: 'monthly',
      priority: '0.70',
      image: {
        url: imageUrl,
        caption: post.imageAlt,
      },
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(entryXml).join('\n')}
</urlset>
`;

  const outPath = resolve(repoRoot, 'sitemap.xml');
  const previous = await readFile(outPath, 'utf8').catch(() => '');
  if (previous !== xml) {
    await writeFile(outPath, xml, 'utf8');
    console.info(`Wrote ${entries.length} URLs → sitemap.xml`);
  } else {
    console.info('sitemap.xml unchanged');
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
