import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootPath = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://merritts-auto-recycling.com';
const fail = (message) => { throw new Error(`Build validation failed: ${message}`); };
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});
const count = (text, pattern) => [...text.matchAll(pattern)].length;
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const routeFile = (pathname) => pathname === '/' ? join(rootPath, 'index.html') : extname(pathname) ? join(rootPath, pathname.slice(1)) : join(rootPath, `${pathname.slice(1)}.html`);
const routeOf = (file) => { const name = relative(rootPath, file).replaceAll('\\', '/'); return name === 'index.html' ? '/' : `/${name.replace(/\.html$/, '')}`; };
if (!existsSync(rootPath)) fail('dist directory is missing.');
const files = walk(rootPath);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
if (htmlFiles.length < 37) fail(`expected at least 37 HTML pages, found ${htmlFiles.length}.`);
for (const icon of ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'favicon.ico', 'apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png']) {
  if (!existsSync(join(rootPath, icon))) fail(`brand icon is missing: ${icon}.`);
}
const requiredText = ['763-533-2775', '8:00 AM–8:00 PM'];
const forbiddenText = ['$1', 'Rated #1', 'top dollar', 'paid cash on the spot', 'Most junk cars in the Twin Cities range', 'aggregateRating', 'FAQPage', '/get-cash-offer'];
const titles = new Map();
const descriptions = new Map();
const indexableRoutes = new Set();
const signals = [
  ['/', "Cash for Junk Cars in the Twin Cities | Merritt's", 'Cash for junk cars across the Twin Cities'],
  ['/cash-for-junk-cars', "Sell Your Junk Car in the Twin Cities | Merritt's", 'Sell your junk car in Minneapolis, St. Paul and the suburbs'],
  ['/junk-car-removal', "Junk Car Removal Across the Twin Cities | Merritt's", 'Junk car removal across the Twin Cities metro'],
  ['/auto-recycling', "Auto Recycling in the Twin Cities Metro | Merritt's", 'Auto recycling for Twin Cities vehicle owners'],
  ['/junk-car-towing', "Junk Car Towing and Pickup | Twin Cities | Merritt's", 'Junk car towing for vehicles we agree to buy'],
];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const label = relative(rootPath, file);
  const route = routeOf(file);
  if (count(html, /<h1(?:\s|>)/gi) !== 1) fail(`${label} must contain exactly one H1.`);
  const title = html.match(/<title>([^<]{10,})<\/title>/i)?.[1];
  const description = html.match(/<meta name="description" content="([^"]{40,})"/i)?.[1];
  if (!title || !description) fail(`${label} is missing useful metadata.`);
  const canonical = decode(html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? '');
  if (canonical !== new URL(route, origin).toString()) fail(`${label} is missing its self-referencing canonical.`);
  for (const required of ['rel="icon" href="/favicon.svg"', 'rel="apple-touch-icon" href="/apple-touch-icon.png"']) if (!html.includes(required)) fail(`${label} is missing a branded icon.`);
  if (/<meta name="keywords"/i.test(html)) fail(`${label} contains an obsolete keywords tag.`);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? '';
  const noindex = robots.includes('noindex');
  if (!noindex) {
    indexableRoutes.add(route);
    if (!robots.includes('max-image-preview:large')) fail(`${label} does not allow large search image previews.`);
    if (titles.has(title)) fail(`${label} duplicates the title on ${titles.get(title)}.`);
    if (descriptions.has(description)) fail(`${label} duplicates the description on ${descriptions.get(description)}.`);
    titles.set(title, label); descriptions.set(description, label);
  }
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) if (!html.includes(`property="${property}"`)) fail(`${label} is missing ${property}.`);
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) if (!html.includes(`name="${name}"`)) fail(`${label} is missing ${name}.`);
  const jsonLd = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/i)?.[1];
  if (!jsonLd) fail(`${label} is missing JSON-LD.`);
  let graph;
  try { graph = JSON.parse(jsonLd)['@graph']; } catch { fail(`${label} contains invalid JSON-LD.`); }
  if (!Array.isArray(graph)) fail(`${label} has no structured entity graph.`);
  const businesses = graph.filter((item) => item['@id'] === `${origin}/#business`);
  if (businesses.length !== 1) fail(`${label} must have one canonical business entity.`);
  const entity = businesses[0];
  if (entity.address?.addressLocality !== 'Brooklyn Center') fail(`${label} changes the business base.`);
  if (!entity.areaServed?.some((item) => item.name === 'Saint Paul, Minnesota')) fail(`${label} omits Saint Paul coverage.`);
  for (const value of requiredText) if (!html.includes(value)) fail(`${label} is missing ${value}.`);
  for (const value of forbiddenText) if (html.includes(value)) fail(`${label} contains forbidden text: ${value}.`);
  const images = [...html.matchAll(/<(?:img|source)\b[^>]*(?:src|srcset)="([^"]+)"/gi)].map((match) => match[1]);
  for (const image of images) {
    if (image.startsWith('data:')) continue;
    if (!image.startsWith('/images/legacy/') && !image.startsWith('/brand/')) fail(`${label} uses an unapproved image: ${image}.`);
    if (!existsSync(join(rootPath, image.slice(1)))) fail(`${label} references missing image ${image}.`);
  }
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const href = decode(match[1]);
    if (/^(?:#|tel:|sms:|mailto:|https:\/\/)/.test(href)) continue;
    if (!existsSync(routeFile(new URL(href, origin).pathname))) fail(`${label} has a broken internal link to ${href}.`);
  }
}
for (const [path, title, heading] of signals) {
  const html = readFileSync(routeFile(path), 'utf8');
  if (decode(html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '') !== title) fail(`${path} has the wrong search title.`);
  const h1 = decode(html.match(/<h1(?:\s[^>]*)?>([^<]+)<\/h1>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();
  if (h1 !== heading) fail(`${path} has the wrong H1.`);
}
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const sources = new Set();
for (const redirect of config.redirects) {
  if (sources.has(redirect.source)) fail(`duplicate redirect: ${redirect.source}.`);
  sources.add(redirect.source);
  if (!redirect.permanent) fail(`temporary migration redirect: ${redirect.source}.`);
  if (redirect.destination.startsWith('/') && !redirect.destination.startsWith('/api/') && !existsSync(routeFile(redirect.destination))) fail(`missing redirect destination: ${redirect.destination}.`);
  if (redirect.source.startsWith('/blog/') && redirect.source !== '/blog/index.html' && redirect.source.endsWith('.html')) fail(`blog redirect must use a clean URL: ${redirect.source}.`);
}
for (const asset of files.filter((file) => /\.(css|js)$/.test(file))) {
  const limit = asset.endsWith('.css') ? 90000 : 60000;
  if (statSync(asset).size > limit) fail(`${relative(rootPath, asset)} exceeds the ${limit}-byte budget.`);
}
const sitemap = readFileSync(join(rootPath, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail('sitemap has duplicate URLs.');
if (sitemapUrls.length !== indexableRoutes.size) fail('sitemap does not match the indexable page count.');
for (const route of indexableRoutes) if (!sitemapUrls.includes(new URL(route, origin).toString())) fail(`sitemap omits ${route}.`);
for (const url of sitemapUrls) if (!indexableRoutes.has(new URL(url).pathname)) fail(`sitemap contains a non-indexable URL: ${url}.`);
if (!existsSync(join(rootPath, 'robots.txt'))) fail('robots.txt is missing.');
const robots = readFileSync(join(rootPath, 'robots.txt'), 'utf8');
if (!robots.includes('Allow: /')) fail('robots.txt does not allow public crawling.');
if (robots.includes('Disallow: /thank-you')) fail('robots.txt prevents discovery of the thank-you noindex.');
console.log(`Validated ${htmlFiles.length} HTML pages, ${indexableRoutes.size} indexable URLs, metadata, schema, redirects, links, approved images, crawl controls, and asset budgets.`);
