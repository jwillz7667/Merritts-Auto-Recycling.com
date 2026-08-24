import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Redirect = { source: string; destination: string; permanent: boolean };
type VercelConfig = { redirects: Redirect[] };

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
});
