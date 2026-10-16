import { describe, expect, it } from 'vitest';
import { serviceAreas, coverageCities, publishedRoutes } from '@/data/site';
import { serviceRegions } from '@/data/service-regions';
import { recoveryGuides } from '@/data/recovery-guides';
import { guides } from '@/data/guides';
import productionRoutesBeforeRecovery from './fixtures/production-routes-before-recovery.json';
describe('recovery inventory', () => {
  it('preserves every destination in the pre-recovery production sitemap', () => {
    const routes = new Set([...publishedRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)]);
    for (const route of productionRoutesBeforeRecovery) expect(routes.has(route), route).toBe(true);
  });
  it('restores eighteen approved cities without removing the sixteen existing destinations', () => {
    expect(serviceAreas).toHaveLength(34);
    for (const city of ['Ramsey', 'Rogers', 'Ham Lake', 'Andover', 'Champlin', 'Albertville', 'St. Michael']) expect(serviceAreas.some((area) => area.city === city)).toBe(true);
    for (const area of serviceAreas) expect(coverageCities).toContain(area.city);
  });
  it('gives all six regional guides real content and valid related cities', () => {
    expect(serviceRegions).toHaveLength(6);
    expect(publishedRoutes).toContain('/service-regions');
    for (const region of serviceRegions) {
      expect(publishedRoutes).toContain(`/service-regions/${region.slug}`);
      expect(region.sections.length).toBeGreaterThanOrEqual(3);
      expect(region.sections.flatMap((section) => section.paragraphs).join(' ').length).toBeGreaterThan(1000);
      for (const slug of region.citySlugs) expect(serviceAreas.some((area) => area.slug === slug)).toBe(true);
    }
  });
  it('adds four distinct recovered article topics with sources for legal content', () => {
    expect(recoveryGuides).toHaveLength(4);
    for (const slug of ['minnesota-license-plates-before-junking', 'running-vs-non-running-car-value', 'vehicles-considered-for-recycling', 'auto-recycling-environmental-considerations']) expect(guides.some((guide) => guide.slug === slug)).toBe(true);
    const documents = guides.find((guide) => guide.slug === 'minnesota-junk-car-documents');
    expect(documents?.sources.some((source) => source.href === 'https://www.revisor.mn.gov/statutes/cite/168A.1501')).toBe(true);
    expect(documents?.updatedIso).toBe('2026-10-16');
  });
});
