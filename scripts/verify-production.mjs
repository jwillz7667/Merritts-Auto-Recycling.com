// Read-only verification of the canonical production deployment. This never
// submits a form, requests indexing, or sends an analytics event.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const origin = 'https://merritts-auto-recycling.com';
const expected = process.env.EXPECTED_REVISION;
if (!expected || !/^[a-f0-9]{40}$/.test(expected)) throw new Error('EXPECTED_REVISION must be the reviewed commit.');
const manifest = JSON.parse(readFileSync('src/data/legacy-routes.json', 'utf8'));
const baselineRoutes = JSON.parse(readFileSync('tests/fixtures/production-routes-before-recovery.json', 'utf8'));
const expectedUrls = new Set([...baselineRoutes, ...Object.values(manifest.areas), ...Object.values(manifest.blogs), '/service-regions'].map((path) => new URL(path, origin).href));
const result = { expectedRevision: expected, observedRevision: null, checkedAt: new Date().toISOString(), pages: [], redirects: [], controls: [], errors: [] };
const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Merritts-Release-Verification/1.0', ...options.headers } });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function run() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await request(`${origin}/build-info.json?revision=${expected}`);
      if (response.ok) {
        const build = await response.json();
        result.observedRevision = build.sourceRevision;
        if (build.sourceRevision === expected) break;
      }
    } catch { /* Deployment may still be warming. Retry only this read. */ }
    await delay(6000);
  }
  if (result.observedRevision !== expected) throw new Error('Production has not exposed the expected deployment revision; no success is inferred from an older build.');
  const response = await request(`${origin}/sitemap.xml?revision=${expected}`);
  if (!response.ok) throw new Error(`Sitemap returned ${response.status}.`);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll('&amp;', '&'));
  if (urls.length !== expectedUrls.size || urls.length !== new Set(urls).size || urls.some((url) => !expectedUrls.has(url))) throw new Error('Sitemap differs from the preserved production routes and reviewed recovery destinations.');
  for (const url of urls) if (new URL(url).origin !== origin) throw new Error('Sitemap contains an unexpected origin.');
  const checks = urls.map((url) => async () => {
    const page = await request(url, { redirect: 'manual' });
    const html = await page.text();
    const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
    const noindex = /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html) || /noindex|none/i.test(page.headers.get('x-robots-tag') ?? '');
    if (page.status !== 200 || canonical !== url || noindex) throw new Error(`Page check failed: ${url} (${page.status}, canonical=${canonical}, noindex=${noindex}).`);
    if ((html.match(/<h1(?:\s|>)/gi) ?? []).length !== 1 || !/<title>[^<]{10,}<\/title>/i.test(html) || !/<meta\b[^>]*name="description"[^>]*content="[^"]{40,}"/i.test(html)) throw new Error(`Missing search metadata or unique H1: ${url}.`);
    for (const link of ['tel:+1-763-533-2775', 'sms:+1-763-438-2116']) if (!html.includes(`href="${link}"`)) throw new Error(`Missing working contact link on ${url}.`);
    const graph = JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)?.[1] ?? '{}')['@graph'];
    const businesses = graph?.filter((entity) => entity['@id'] === `${origin}/#business`) ?? [];
    if (businesses.length !== 1 || businesses[0].address?.addressLocality !== 'Brooklyn Center' || businesses[0].telephone !== '+1-763-533-2775' || html.includes('aggregateRating')) throw new Error(`Business identity/schema regression: ${url}.`);
    if (url === `${origin}/contact` && (!/<form\b[^>]*action="\/api\/contact"/.test(html) || !html.includes('data-sitekey=') || /<button\b[^>]*type="submit"[^>]*\bdisabled(?:[\s=>])/.test(html))) throw new Error('Production inquiry form is disabled or misconfigured.');
    for (const header of ['strict-transport-security', 'content-security-policy', 'x-content-type-options']) if (!page.headers.has(header)) throw new Error(`Missing ${header} on ${url}.`);
    result.pages.push({ url, status: page.status, canonical });
  });
  const migrations = [
    ...Object.entries(manifest.areas).flatMap(([slug, destination]) => ['', '.html'].map((suffix) => [`/placemarks/${slug}${suffix}`, destination])),
    ...Object.entries(manifest.blogs).flatMap(([slug, destination]) => ['', '.html'].map((suffix) => [`/blog/${slug}${suffix}`, destination])),
  ];
  for (const [source, destination] of migrations) checks.push(async () => {
    let current = new URL(source, origin).href;
    const chain = [];
    for (let hops = 0; hops < 5; hops++) {
      const page = await request(current, { redirect: 'manual' });
      if (page.status >= 300 && page.status < 400) {
        const location = page.headers.get('location');
        if (![301, 308].includes(page.status) || !location) throw new Error(`Invalid migration response: ${current} (${page.status}).`);
        const next = new URL(location, current);
        if (next.origin !== origin) throw new Error(`Migration leaves the canonical origin: ${current}.`);
        chain.push({ url: current, status: page.status, destination: next.href });
        await page.body?.cancel();
        current = next.href;
      } else {
        await page.body?.cancel();
        if (page.status !== 200 || current !== new URL(destination, origin).href || !chain.length) throw new Error(`Wrong migration destination: ${source} -> ${current} (${page.status}).`);
        result.redirects.push({ source, destination, chain });
        return;
      }
    }
    throw new Error(`Too many redirect hops: ${source}.`);
  });
  checks.push(async () => {
    const response = await request('https://www.merritts-auto-recycling.com/service-areas/ramsey', { redirect: 'manual' });
    if (![301, 308].includes(response.status) || new URL(response.headers.get('location') ?? '', 'https://www.merritts-auto-recycling.com').href !== `${origin}/service-areas/ramsey`) throw new Error('WWW canonical redirect failed.');
    await response.body?.cancel();
  });
  for (const path of ['/recovery-unknown-page', '/placemarks/recovery-unknown-mn']) checks.push(async () => {
    const response = await request(origin + path, { redirect: 'manual' });
    const html = await response.text();
    if (response.status !== 404 || !html.includes('noindex')) throw new Error(`Unknown route is not a real noindex 404: ${path}.`);
  });
  checks.push(async () => {
    const response = await request(`${origin}/robots.txt`);
    const text = await response.text();
    if (response.status !== 200 || !/^Allow: \/\s*$/m.test(text) || /^Disallow: \/\s*$/m.test(text) || !text.includes(`Sitemap: ${origin}/sitemap.xml`)) throw new Error('Production robots controls block crawling or omit the sitemap.');
    result.controls.push('robots');
  });
  checks.push(async () => {
    const response = await request(`${origin}/thank-you`, { redirect: 'manual' });
    const html = await response.text();
    if (response.status !== 200 || !/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) throw new Error('Thank-you page is not noindex.');
    result.controls.push('thank-you');
  });
  checks.push(async () => {
    const response = await request(`${origin}/api/contact`, { redirect: 'manual' });
    const body = await response.json();
    if (response.status !== 405 || body.error !== 'method_not_allowed' || body.ok !== false) throw new Error('Contact API is not responding with the expected method guard.');
    result.controls.push('contact-api-get-only');
  });
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < checks.length) {
      const check = checks[next++];
      try { await check(); } catch (error) { result.errors.push(error instanceof Error ? error.message : String(error)); }
      await delay(75);
    }
  }));
}
try { await run(); } catch (error) { result.errors.push(error instanceof Error ? error.message : String(error)); }
mkdirSync('.sites-runtime', { recursive: true });
writeFileSync('.sites-runtime/production-verification.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ expectedRevision: expected, observedRevision: result.observedRevision, pagesChecked: result.pages.length, migrationsChecked: result.redirects.length, controls: result.controls, errors: result.errors }, null, 2));
if (result.errors.length) process.exitCode = 1;
