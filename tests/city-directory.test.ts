import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import cityDirectory from '@/data/city-directory.json';
import { publishedRoutes, serviceAreas } from '@/data/site';

const listed = cityDirectory.flatMap((region) => region.cities);
const legacy = JSON.parse(readFileSync(new URL('../src/data/legacy-routes.json', import.meta.url), 'utf8')) as { areas: Record<string, string> };

describe('complete city coverage', () => {
  it('keeps a unique dedicated page for all 66 metro and 22 historical communities', () => {
    expect(listed).toHaveLength(88);
    expect(new Set(listed.map((city) => city.slug)).size).toBe(listed.length);
    expect(new Set(listed.map((city) => city.city)).size).toBe(listed.length);
    expect(serviceAreas).toHaveLength(listed.length);
    for (const city of listed) {
      const page = serviceAreas.find((area) => area.slug === city.slug);
      expect(page, city.city).toBeDefined();
      expect(page?.city).toBe(city.city);
      expect(publishedRoutes).toContain(`/service-areas/${city.slug}`);
    }
  });

  it('takes each historical city URL to that same city rather than a regional hub', () => {
    for (const [source, destination] of Object.entries(legacy.areas)) {
      if (source === 'minnesota' || source.includes('county')) continue;
      expect(destination, source).toBe(`/service-areas/${source.replace(/-mn$/, '')}`);
    }
  });
});
