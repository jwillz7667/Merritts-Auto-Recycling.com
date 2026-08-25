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

  it('preserves blog migrations after Vercel clean-URL normalization', () => {
    expect(config.cleanUrls).toBe(true);
    const redirects = new Map(
      config.redirects.map((redirect) => [redirect.source, redirect.destination]),
    );
    const blogHtmlRedirects = config.redirects.filter(
      (redirect) =>
        redirect.source.startsWith('/blog/') &&
        redirect.source.endsWith('.html') &&
        redirect.source !== '/blog/index.html',
    );

    expect(blogHtmlRedirects).toHaveLength(10);
    for (const redirect of blogHtmlRedirects) {
      const cleanSource = redirect.source.slice(0, -'.html'.length);
      expect(redirects.get(cleanSource)).toBe(redirect.destination);
    }
  });

  it('does not contain duplicate redirect sources', () => {
    const sources = config.redirects.map((redirect) => redirect.source);
    expect(new Set(sources).size).toBe(sources.length);
  });
});
