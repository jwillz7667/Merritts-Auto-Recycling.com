import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { guides } from '@/data/guides';
import { publishedRoutes, serviceAreas } from '@/data/site';
import { serviceRegions } from '@/data/service-regions';
type Redirect = { source: string; destination: string; permanent: boolean; has?: unknown[] };
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as { cleanUrls: boolean; redirects: Redirect[]; buildCommand: string };
const manifest = JSON.parse(readFileSync(new URL('../src/data/legacy-routes.json', import.meta.url), 'utf8')) as { areas: Record<string, string>; blogs: Record<string, string> };
const redirects = new Map(config.redirects.map((item) => [item.source, item.destination]));

describe('legacy URL recovery', () => {
  it('preserves primary destinations', () => {
    expect(redirects.get('/about-brad.html')).toBe('/about');
    expect(redirects.get('/testimonials.html')).toBe('/reviews');
    expect(redirects.get('/quote-calculator.html')).toBe('/get-a-quote');
    expect(redirects.get('/blog/index.html')).toBe('/guides');
  });
  it('accounts for every historical area, including state and county routes', () => {
    expect(Object.keys(manifest.areas)).toHaveLength(53);
    for (const [legacy, destination] of Object.entries(manifest.areas)) {
      expect(destination).not.toBe('/service-areas');
      for (const extension of ['', '.html']) expect(redirects.get(`/placemarks/${legacy}${extension}`)).toBe(destination);
      if (destination.startsWith('/service-regions/')) {
        const region = serviceRegions.find((item) => `/service-regions/${item.slug}` === destination);
        expect(region, legacy).toBeDefined();
      }
    }
    expect(config.redirects.some((item) => item.source === '/placemarks/:slug' || item.source === '/placemarks/:slug.html')).toBe(false);
  });
  it('maps aliases for every published city', () => {
    for (const area of serviceAreas) {
      for (const suffix of ['', '.html']) expect(redirects.get(`/placemarks/${area.slug}-mn${suffix}`)).toBe(`/service-areas/${area.slug}`);
    }
    expect(redirects.get('/service-areas/saint-paul')).toBe('/service-areas/st-paul');
    expect(redirects.get('/placemarks/saint-paul-mn')).toBe('/service-areas/st-paul');
  });
  it('preserves all ten legacy article topics with clean-URL sources', () => {
    expect(config.cleanUrls).toBe(true);
    expect(Object.keys(manifest.blogs)).toHaveLength(10);
    for (const [legacy, destination] of Object.entries(manifest.blogs)) {
      expect(redirects.get(`/blog/${legacy}`)).toBe(destination);
      expect(redirects.has(`/blog/${legacy}.html`)).toBe(false);
      expect(destination).not.toBe('/guides');
    }
  });
  it('uses unique permanent sources and existing final destinations without chains', () => {
    expect(redirects.size).toBe(config.redirects.length);
    const routes = new Set<string>([...publishedRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)]);
    for (const redirect of config.redirects) {
      expect(redirect.permanent).toBe(true);
      if (redirect.destination.startsWith('/') && !redirect.destination.startsWith('/api/')) {
        const retainedImage = redirect.destination.startsWith('/images/') && existsSync(new URL(`../public${redirect.destination}`, import.meta.url));
        expect(routes.has(redirect.destination) || retainedImage, redirect.source).toBe(true);
        expect(redirects.has(redirect.destination), redirect.source).toBe(false);
      }
      expect(redirect.source).not.toBe(redirect.destination);
    }
  });
  it('keeps the complete production validation gate', () => {
    for (const command of ['security:scan', 'lint', 'test', 'build']) expect(config.buildCommand).toContain(`npm run ${command}`);
  });
});
