import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import preOverhaul from './fixtures/pre-overhaul-url-inventory.json';
import { guides } from '@/data/guides';
import { publishedRoutes } from '@/data/site';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as { redirects: Array<{ source: string; destination: string; permanent: boolean }> };

describe('August migration coverage', () => {
  it('accounts for every pre-overhaul HTML URL and preserves all 70 real content destinations', () => {
    expect(preOverhaul.routes).toHaveLength(76);
    const content = preOverhaul.routes.filter((route) => route.destination !== null);
    expect(content).toHaveLength(70);
    const destinations = new Set<string>([...publishedRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)]);
    for (const route of content) {
      expect(destinations.has(route.destination!), route.source).toBe(true);
      const cleanSource = route.source.slice(0, -5);
      const redirect = config.redirects.find((rule) => rule.source === route.source || rule.source === cleanSource);
      expect(redirect, route.source).toBeDefined();
      expect(redirect?.destination, route.source).toBe(route.destination);
      expect(redirect?.permanent, route.source).toBe(true);
      if (route.kind === 'city-landing') expect(route.destination, route.source).toBe(`/service-areas/${cleanSource.replace('/placemarks/', '').replace(/-mn$/, '')}`);
    }
  });
});
