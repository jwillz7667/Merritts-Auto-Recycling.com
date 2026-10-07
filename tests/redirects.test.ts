import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { guides } from '@/data/guides';
import { publishedRoutes, serviceAreas } from '@/data/site';
type Redirect = { source: string; destination: string; permanent: boolean; has?: unknown[] };
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as { cleanUrls: boolean; redirects: Redirect[]; buildCommand: string };
const redirects = new Map(config.redirects.map((item) => [item.source, item.destination]));

describe('legacy redirects', () => {
  it('preserves the existing primary page destinations', () => {
    expect(redirects.get('/about-brad.html')).toBe('/about');
    expect(redirects.get('/testimonials.html')).toBe('/reviews');
    expect(redirects.get('/quote-calculator.html')).toBe('/cash-for-junk-cars');
    expect(redirects.get('/blog/index.html')).toBe('/guides');
  });
  it('maps every published city before either catch-all', () => {
    const fallback = config.redirects.findIndex((item) => item.source === '/placemarks/:slug.html');
    expect(fallback).toBeGreaterThan(-1);
    for (const area of serviceAreas) {
      for (const suffix of ['', '.html']) {
        const source = `/placemarks/${area.slug}-mn${suffix}`;
        expect(redirects.get(source)).toBe(`/service-areas/${area.slug}`);
        const index = config.redirects.findIndex((item) => item.source === source);
        expect(index).toBeGreaterThan(-1);
        expect(index).toBeLessThan(fallback);
      }
    }
    expect(redirects.get('/service-areas/saint-paul')).toBe('/service-areas/st-paul');
    expect(redirects.get('/placemarks/saint-paul-mn')).toBe('/service-areas/st-paul');
  });
  it('retains useful blog intent with normalized clean URLs', () => {
    expect(config.cleanUrls).toBe(true);
    const expected = new Map([
      ['/blog/auto-recycling-environmental-impact-twin-cities', '/guides/what-happens-after-junk-car-pickup'],
      ['/blog/what-happens-to-car-after-pickup', '/guides/what-happens-after-junk-car-pickup'],
      ['/blog/how-much-is-my-junk-car-worth-minnesota-2026', '/guides/what-affects-a-junk-car-offer'],
      ['/blog/running-vs-non-running-junk-car-prices', '/guides/what-affects-a-junk-car-offer'],
      ['/blog/scrap-value-by-weight-minnesota-guide', '/guides/scrap-car-value-by-weight'],
      ['/blog/minnesota-junk-car-title-requirements', '/guides/minnesota-junk-car-documents'],
      ['/blog/mn-license-plates-before-junking', '/guides/minnesota-junk-car-documents'],
      ['/blog/free-junk-car-removal-minneapolis-mn', '/junk-car-removal'],
      ['/blog/junk-vs-tradein-vs-private-sale', '/guides/repair-trade-in-or-sell-a-junk-car'],
      ['/blog/top-10-most-junked-cars-minnesota', '/guides'],
    ]);
    for (const [source, destination] of expected) {
      expect(redirects.get(source)).toBe(destination);
      expect(redirects.has(`${source}.html`)).toBe(false);
    }
  });
  it('has unique permanent sources and real destinations', () => {
    expect(redirects.size).toBe(config.redirects.length);
    const routes = new Set<string>([...publishedRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)]);
    for (const redirect of config.redirects) {
      expect(redirect.permanent).toBe(true);
      if (redirect.destination.startsWith('/') && !redirect.destination.startsWith('/api/')) expect(routes.has(redirect.destination)).toBe(true);
      expect(redirect.source).not.toBe(redirect.destination);
    }
  });
  it('runs security, lint, and unit checks before the production build', () => {
    for (const command of ['security:scan', 'lint', 'test', 'build']) expect(config.buildCommand).toContain(`npm run ${command}`);
  });
});
