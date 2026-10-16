import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://merritts-auto-recycling.com';
const fail = (message) => { throw new Error(`Build validation failed: ${message}`); };
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
const decode = (text) => text.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, decimal) => String.fromCodePoint(parseInt(hex ?? decimal, hex ? 16 : 10))).replaceAll('&quot;', '"').replaceAll('&apos;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => attrs(match[0]));
const fileFor = (pathname) => pathname === '/' ? join(root, 'index.html') : join(root, extname(pathname) ? pathname.slice(1) : `${pathname.slice(1)}.html`);
const routeOf = (file) => { const name = relative(root, file).replaceAll('\\', '/'); return name === 'index.html' ? '/' : `/${name.replace(/\.html$/, '')}`; };
if (!existsSync(root)) fail('dist directory is missing.');
const files = walk(root);
const pages = files.filter((file) => file.endsWith('.html'));
if (pages.length < 67) fail(`expected at least 67 HTML pages, found ${pages.length}.`);
for (const icon of ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'favicon.ico', 'apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png']) if (!existsSync(join(root, icon))) fail(`missing brand asset: ${icon}.`);
const titles = new Map();
const descriptions = new Map();
const indexable = new Set();
const internalLinks = new Map();
const fragmentTargets = new Map();
const fragmentLinks = [];
const forbidden = ['$1', 'Rated #1', 'top dollar', 'paid cash on the spot', 'Most junk cars in the Twin Cities range', 'aggregateRating', 'FAQPage', '/get-cash-offer'];
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const route = routeOf(file);
  const meta = tags(html, 'meta');
  const links = tags(html, 'link');
  fragmentTargets.set(route, new Set([
    ...tags(html, '[a-z][\\w:-]*').map((item) => item.id),
    ...tags(html, 'a').map((item) => item.name),
  ].filter(Boolean)));
  const title = decode(html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '');
  const description = meta.find((item) => item.name === 'description')?.content ?? '';
  if ((html.match(/<h1(?:\s|>)/gi) ?? []).length !== 1) fail(`${route} must have one H1.`);
  if (title.length < 10 || description.length < 40) fail(`${route} needs useful title and description metadata.`);
  if (links.filter((item) => item.rel === 'canonical').length !== 1 || links.find((item) => item.rel === 'canonical')?.href !== new URL(route, origin).href) fail(`${route} needs a self-referencing canonical.`);
  if (!links.some((item) => item.rel === 'icon' && item.href === '/favicon.svg') || !links.some((item) => item.rel === 'apple-touch-icon' && item.href === '/apple-touch-icon.png')) fail(`${route} needs its brand icons.`);
  if (meta.some((item) => item.name === 'keywords')) fail(`${route} contains obsolete keyword metadata.`);
  const robots = meta.find((item) => item.name === 'robots')?.content ?? '';
  if (!robots.includes('noindex')) {
    indexable.add(route);
    if (!robots.includes('max-image-preview:large')) fail(`${route} blocks large image previews.`);
    if (titles.has(title) || descriptions.has(description)) fail(`${route} duplicates another page’s metadata.`);
    titles.set(title, route); descriptions.set(description, route);
  }
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) if (!meta.some((item) => item.property === property && item.content)) fail(`${route} lacks ${property}.`);
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) if (!meta.some((item) => item.name === name && item.content)) fail(`${route} lacks ${name}.`);
  let graph;
  try { graph = JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)?.[1] ?? '')['@graph']; } catch { fail(`${route} has invalid JSON-LD.`); }
  if (!Array.isArray(graph)) fail(`${route} lacks an entity graph.`);
  const businesses = graph.filter((item) => item['@id'] === `${origin}/#business`);
  if (businesses.length !== 1 || businesses[0].address?.addressLocality !== 'Brooklyn Center') fail(`${route} changes the canonical business identity.`);
  if (!businesses[0].areaServed?.some((item) => item.name === 'Saint Paul, Minnesota')) fail(`${route} omits Saint Paul coverage.`);
  for (const article of graph.filter((item) => item['@type'] === 'Article')) {
    if (!Array.isArray(article.image) || !article.image.length) fail(`${route} lacks article imagery.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(article.datePublished ?? '') || !/^\d{4}-\d{2}-\d{2}$/.test(article.dateModified ?? '') || article.dateModified < article.datePublished) fail(`${route} has invalid article dates.`);
  }
  for (const required of ['763-533-2775', '8:00 AM–8:00 PM']) if (!html.includes(required)) fail(`${route} loses approved business information.`);
  for (const word of forbidden) if (html.includes(word)) fail(`${route} contains forbidden content: ${word}.`);
  for (const image of tags(html, 'img')) {
    if (!image.alt) fail(`${route} has an image without useful alternative text.`);
    if (!image.src?.startsWith('/images/legacy/') && !image.src?.startsWith('/brand/')) fail(`${route} has an unapproved image source.`);
    if (!existsSync(join(root, image.src.slice(1)))) fail(`${route} has a missing image.`);
  }
  const destinations = [];
  for (const link of tags(html, 'a')) {
    const href = link.href ?? '';
    if (!href) continue;
    let destination;
    try { destination = new URL(href, new URL(route, origin)); } catch { fail(`${route} has an invalid link: ${href}.`); }
    if (destination.origin !== origin) continue;
    const pathname = destination.pathname;
    if (!existsSync(fileFor(pathname))) fail(`${route} links to missing destination ${href}.`);
    destinations.push(pathname);
    // A fragment can fail even when the page exists. Resolve these after every
    // page has been read, including absolute links to this site's own origin.
    const fragment = destination.hash.slice(1).split(':~:')[0];
    if (fragment) {
      let target;
      try { target = decodeURIComponent(fragment); } catch { fail(`${route} has an invalid fragment: ${href}.`); }
      fragmentLinks.push({ route, href, pathname, target });
    }
  }
  internalLinks.set(route, destinations);
}
for (const { route, href, pathname, target } of fragmentLinks) {
  if (fragmentTargets.has(pathname) && !fragmentTargets.get(pathname).has(target)) fail(`${route} links to missing fragment ${href}.`);
}
const reachable = new Set(['/']);
const queue = ['/'];
while (queue.length) for (const route of internalLinks.get(queue.shift()) ?? []) if (!reachable.has(route)) { reachable.add(route); queue.push(route); }
for (const route of indexable) if (!reachable.has(route)) fail(`orphaned indexable page: ${route}.`);
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
if (new Set(sitemapUrls).size !== sitemapUrls.length || sitemapUrls.length !== indexable.size) fail('sitemap does not match the unique indexable URLs.');
for (const route of indexable) if (!sitemapUrls.includes(new URL(route, origin).href)) fail(`sitemap omits ${route}.`);
for (const url of sitemapUrls) if (new URL(url).origin !== origin || !indexable.has(new URL(url).pathname)) fail(`invalid sitemap destination: ${url}.`);
// The public city directory is the independent coverage inventory. A city must
// have its own indexable page and a direct directory link; an unlinked label or
// a county-level substitute must never satisfy the city-page release check.
const cityDirectory = JSON.parse(readFileSync(new URL('../src/data/city-directory.json', import.meta.url), 'utf8'));
const directoryLinks = new Set(tags(readFileSync(fileFor('/service-areas'), 'utf8'), 'a')
  .filter((link) => link.href)
  .map((link) => new URL(link.href, origin))
  .filter((url) => url.origin === origin && !url.search && !url.hash)
  .map((url) => url.pathname));
const directorySlugs = new Set();
for (const region of cityDirectory) {
  if (!region.name || !Array.isArray(region.cities) || !region.cities.length) fail('city directory contains an empty or invalid region.');
  for (const city of region.cities) {
    if (!city.city || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(city.slug ?? '')) fail('city directory contains an invalid city name or slug.');
    if (directorySlugs.has(city.slug)) fail(`city directory duplicates ${city.slug}.`);
    directorySlugs.add(city.slug);
    const route = `/service-areas/${city.slug}`;
    if (!existsSync(fileFor(route)) || !indexable.has(route)) fail(`directory city lacks its own indexable page: ${city.city}.`);
    if (!directoryLinks.has(route)) fail(`directory city lacks a direct link to its own page: ${city.city}.`);
    if (!sitemapUrls.includes(new URL(route, origin).href)) fail(`sitemap omits directory city: ${city.city}.`);
  }
}
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const sourceSet = new Set();
for (const rule of config.redirects) {
  if (sourceSet.has(rule.source) || !rule.permanent) fail(`invalid migration rule: ${rule.source}.`);
  sourceSet.add(rule.source);
  if (rule.destination.startsWith('/') && !rule.destination.startsWith('/api/') && !existsSync(fileFor(rule.destination))) fail(`missing redirect destination: ${rule.destination}.`);
  if (rule.source.startsWith('/blog/') && rule.source !== '/blog/index.html' && rule.source.endsWith('.html')) fail(`blog migration must use clean sources: ${rule.source}.`);
}
const manifest = JSON.parse(readFileSync(new URL('../src/data/legacy-routes.json', import.meta.url), 'utf8'));
for (const [key, destination] of Object.entries(manifest.areas)) {
  for (const suffix of ['', '.html']) if (!config.redirects.some((rule) => rule.source === `/placemarks/${key}${suffix}` && rule.destination === destination)) fail(`missing legacy area mapping: ${key}.`);
}
for (const [key, destination] of Object.entries(manifest.blogs)) if (!config.redirects.some((rule) => rule.source === `/blog/${key}` && rule.destination === destination)) fail(`missing legacy blog mapping: ${key}.`);
for (const file of files.filter((entry) => /\.(css|js)$/.test(entry))) if (statSync(file).size > (file.endsWith('.css') ? 90000 : 60000)) fail(`asset exceeds its size budget: ${relative(root, file)}.`);
const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
if (!robots.includes('Allow: /') || robots.includes('Disallow: /thank-you')) fail('robots.txt has incorrect crawl controls.');
console.log(`Validated ${pages.length} HTML pages, ${indexable.size} indexable URLs, ${directorySlugs.size} directly linked city pages, ${Object.keys(manifest.areas).length} historical areas, ${Object.keys(manifest.blogs).length} legacy article topics, metadata, schema, sitemap parity, internal links and fragments, image paths and asset budgets.`);
