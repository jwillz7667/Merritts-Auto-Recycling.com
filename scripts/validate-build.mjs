import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const rootPath = root.pathname;

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function fail(message) {
  throw new Error(`Build validation failed: ${message}`);
}

function count(haystack, pattern) {
  return [...haystack.matchAll(pattern)].length;
}

function routeFile(pathname) {
  if (pathname === '/') return join(rootPath, 'index.html');
  if (extname(pathname)) return join(rootPath, pathname.slice(1));
  return join(rootPath, `${pathname.slice(1)}.html`);
}

if (!existsSync(rootPath)) fail('dist directory is missing.');
const files = walk(rootPath);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
if (htmlFiles.length < 20) fail(`expected at least 20 HTML pages, found ${htmlFiles.length}.`);

const requiredBrandIcons = [
  'favicon.svg',
  'favicon-32x32.png',
  'favicon-16x16.png',
  'favicon.ico',
  'apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
];
for (const icon of requiredBrandIcons) {
  if (!existsSync(join(rootPath, icon))) fail(`brand icon is missing: ${icon}.`);
}

const requiredText = ['763-533-2775', '8:00 AM–8:00 PM'];
const forbiddenText = [
  '$1',
  'Rated #1',
  'top dollar',
  'paid cash on the spot',
  'Most junk cars in the Twin Cities range',
  'aggregateRating',
  'FAQPage',
  '/get-cash-offer',
];
const titles = new Map();
const descriptions = new Map();

const primaryPageSignals = [
  {
    path: '/',
    title: "Cash for Junk Cars in Minneapolis | Merritt's Auto Recycling",
    h1: 'Cash for junk cars in Minneapolis and Brooklyn Center',
  },
  {
    path: '/cash-for-junk-cars',
    title: "Cash for Junk Cars in Brooklyn Center | Merritt's",
    h1: 'Cash for junk cars in Brooklyn Center and Minneapolis',
  },
  {
    path: '/junk-car-removal',
    title: "Junk Car Removal in Minneapolis | Merritt's",
    h1: 'Junk car removal in Brooklyn Center and Minneapolis',
  },
  {
    path: '/auto-recycling',
    title: "Auto Recycling in Brooklyn Center, MN | Merritt's",
    h1: 'Auto recycling in Brooklyn Center, Minnesota',
  },
  {
    path: '/junk-car-towing',
    title: "Junk Car Towing in Minneapolis | Merritt's",
    h1: 'Junk car towing for vehicles Merritt’s agrees to acquire',
  },
];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const label = relative(rootPath, file);
  if (count(html, /<h1(?:\s|>)/gi) !== 1) fail(`${label} must contain exactly one H1.`);
  const title = html.match(/<title>([^<]{10,})<\/title>/i)?.[1];
  if (!title) fail(`${label} is missing a useful title.`);
  const description = html.match(/<meta name="description" content="([^"]{40,})"/i)?.[1];
  if (!description) fail(`${label} is missing a useful description.`);
  if (!/<link rel="canonical" href="https:\/\/merritts-auto-recycling\.com\//i.test(html)) {
    fail(`${label} is missing a canonical URL.`);
  }
  if (!html.includes('rel="icon" href="/favicon.svg"')) {
    fail(`${label} is missing the branded SVG favicon.`);
  }
  if (!html.includes('rel="apple-touch-icon" href="/apple-touch-icon.png"')) {
    fail(`${label} is missing the branded Apple touch icon.`);
  }
  if (/<meta name="keywords"/i.test(html)) fail(`${label} contains an obsolete keywords tag.`);

  const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? '';
  const noindex = robots.includes('noindex');
  if (!noindex && !robots.includes('max-image-preview:large')) {
    fail(`${label} does not allow large search image previews.`);
  }
  if (!noindex) {
    const priorTitle = titles.get(title);
    if (priorTitle) fail(`${label} duplicates the title used by ${priorTitle}.`);
    titles.set(title, label);
    const priorDescription = descriptions.get(description);
    if (priorDescription) fail(`${label} duplicates the description used by ${priorDescription}.`);
    descriptions.set(description, label);
  }

  for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) {
    if (!html.includes(`property="${property}"`)) fail(`${label} is missing ${property}.`);
  }
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!html.includes(`name="${name}"`)) fail(`${label} is missing ${name}.`);
  }

  const jsonLd = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/i)?.[1];
  if (!jsonLd) fail(`${label} is missing JSON-LD.`);
  try {
    JSON.parse(jsonLd);
  } catch {
    fail(`${label} contains invalid JSON-LD.`);
  }
  for (const value of requiredText) {
    if (!html.includes(value)) fail(`${label} is missing required business text: ${value}`);
  }
  for (const value of forbiddenText) {
    if (html.includes(value)) fail(`${label} contains forbidden text: ${value}`);
  }

  const imageRefs = [...html.matchAll(/<(?:img|source)\b[^>]*(?:src|srcset)="([^"]+)"/gi)].map(
    (match) => match[1],
  );
  for (const imageRef of imageRefs) {
    if (imageRef.startsWith('data:')) continue;
    if (!imageRef.startsWith('/images/legacy/') && !imageRef.startsWith('/brand/')) {
      fail(`${label} uses an image outside the approved legacy/brand paths: ${imageRef}`);
    }
    if (!existsSync(join(rootPath, imageRef.slice(1))))
      fail(`${label} references missing image ${imageRef}.`);
  }

  const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (
      href.startsWith('#') ||
      href.startsWith('tel:') ||
      href.startsWith('sms:') ||
      href.startsWith('mailto:') ||
      href.startsWith('https://')
    ) {
      continue;
    }
    const pathname = new URL(href, 'https://merritts-auto-recycling.com').pathname;
    if (!existsSync(routeFile(pathname))) fail(`${label} has a broken internal link to ${href}.`);
  }
}

for (const signal of primaryPageSignals) {
  const html = readFileSync(routeFile(signal.path), 'utf8');
  if (!html.includes(`<title>${signal.title}</title>`)) {
    fail(`${signal.path} does not use the approved search title.`);
  }
  if (!html.includes(`>${signal.h1}</h1>`)) {
    fail(`${signal.path} does not use the approved visible H1.`);
  }
}

const vercelConfig = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const redirects = new Map(
  vercelConfig.redirects.map((redirect) => [redirect.source, redirect.destination]),
);
for (const redirect of vercelConfig.redirects.filter(
  (item) =>
    item.source.startsWith('/blog/') &&
    item.source.endsWith('.html') &&
    item.source !== '/blog/index.html',
)) {
  const cleanSource = redirect.source.slice(0, -'.html'.length);
  if (redirects.get(cleanSource) !== redirect.destination) {
    fail(`${redirect.source} is missing its clean-URL redirect equivalent.`);
  }
}

for (const asset of files.filter((file) => /\.(css|js)$/.test(file))) {
  const bytes = statSync(asset).size;
  const limit = asset.endsWith('.css') ? 90_000 : 60_000;
  if (bytes > limit) fail(`${relative(rootPath, asset)} exceeds the ${limit}-byte asset budget.`);
}

const sitemap = readFileSync(join(rootPath, 'sitemap.xml'), 'utf8');
if (sitemap.includes('/thank-you') || sitemap.includes('/404'))
  fail('sitemap includes a noindex route.');
if (sitemap.includes('/get-cash-offer')) fail('sitemap includes the retired cash-offer form.');
if (
  !sitemap.includes('/service-areas/brooklyn-center') ||
  !sitemap.includes('/service-areas/minneapolis')
) {
  fail('sitemap is missing a published service area.');
}
if (!existsSync(join(rootPath, 'robots.txt'))) fail('robots.txt is missing.');
const robotsText = readFileSync(join(rootPath, 'robots.txt'), 'utf8');
if (!robotsText.includes('Allow: /')) fail('robots.txt does not allow public crawling.');
if (robotsText.includes('Disallow: /thank-you')) {
  fail('robots.txt blocks crawlers from seeing the thank-you page noindex directive.');
}

console.log(
  `Validated ${htmlFiles.length} HTML pages, ${files.length} built files, internal links, approved image paths, metadata, crawl controls, and asset budgets.`,
);
