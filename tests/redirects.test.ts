import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Redirect = { source: string; destination: string; permanent: boolean };
type VercelConfig = { cleanUrls: boolean; redirects: Redirect[] };

const config = JSON.parse(
  readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
) as VercelConfig;

describe('legacy redirect map', () => {
  it('maps the primary legacy pages to their closest new equivalents', () => {
    const redirects = new Map(
      config.redirects.map((redirect) => [redirect.source, redirect.destination]),
    );
    expect(redirects.get('/about-brad.html')).toBe('/about');
    expect(redirects.get('/testimonials.html')).toBe('/reviews');
    expect(redirects.get('/quote-calculator.html')).toBe('/cash-for-junk-cars');
    expect(redirects.get('/blog/index.html')).toBe('/guides');
  });

  it('preserves the two published location pages before the catch-all', () => {
    const brooklyn = config.redirects.findIndex(
      (redirect) => redirect.source === '/placemarks/brooklyn-center-mn.html',
    );
    const minneapolis = config.redirects.findIndex(
      (redirect) => redirect.source === '/placemarks/minneapolis-mn.html',
    );
    const fallback = config.redirects.findIndex(
      (redirect) => redirect.source === '/placemarks/:slug.html',
    );
    expect(brooklyn).toBeGreaterThan(-1);
    expect(minneapolis).toBeGreaterThan(-1);
    expect(brooklyn).toBeLessThan(fallback);
    expect(minneapolis).toBeLessThan(fallback);
  });

  it('uses permanent redirects for every migration route', () => {
    expect(config.redirects.every((redirect) => redirect.permanent)).toBe(true);
  });

  it('uses normalized blog sources with Vercel clean URLs', () => {
    expect(config.cleanUrls).toBe(true);
    const redirects = new Map(
      config.redirects.map((redirect) => [redirect.source, redirect.destination]),
    );
    const expected = new Map([
      [
        '/blog/auto-recycling-environmental-impact-twin-cities',
        '/guides/what-happens-after-junk-car-pickup',
      ],
      [
        '/blog/what-happens-to-car-after-pickup',
        '/guides/what-happens-after-junk-car-pickup',
      ],
      ['/blog/how-much-is-my-junk-car-worth-minnesota-2026', '/guides/what-affects-a-junk-car-offer'],
      ['/blog/running-vs-non-running-junk-car-prices', '/guides/what-affects-a-junk-car-offer'],
      ['/blog/scrap-value-by-weight-minnesota-guide', '/guides/what-affects-a-junk-car-offer'],
      ['/blog/minnesota-junk-car-title-requirements', '/guides/minnesota-junk-car-documents'],
      ['/blog/mn-license-plates-before-junking', '/guides/minnesota-junk-car-documents'],
      ['/blog/free-junk-car-removal-minneapolis-mn', '/junk-car-removal'],
      ['/blog/junk-vs-tradein-vs-private-sale', '/guides'],
      ['/blog/top-10-most-junked-cars-minnesota', '/guides'],
    ]);

    for (const [source, destination] of expected) {
      expect(redirects.get(source)).toBe(destination);
      expect(redirects.has(`${source}.html`)).toBe(false);
    }
  });

  it('does not contain duplicate redirect sources', () => {
    const sources = config.redirects.map((redirect) => redirect.source);
    expect(new Set(sources).size).toBe(sources.length);
  });
});
