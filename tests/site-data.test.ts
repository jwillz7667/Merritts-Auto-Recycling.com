import { describe, expect, it } from 'vitest';
import { guides } from '@/data/guides';
import { areaServedSchema, business, coverageCities, globalFaqs, homeSeo, publishedRoutes, serviceAreas, services } from '@/data/site';

describe('immutable business information', () => {
  it('preserves call and text numbers', () => {
    expect(business.phone).toBe('763-533-2775');
    expect(business.phoneUri).toBe('tel:+1-763-533-2775');
    expect(business.textPhone).toBe('763-438-2116');
    expect(business.textUri).toBe('sms:+1-763-438-2116');
  });
  it('preserves owner-approved daily hours', () => {
    expect(business.hoursDisplay).toBe('Open every day, 8:00 AM–8:00 PM');
    expect(business.openingHours).toMatchObject({ opens: '08:00', closes: '20:00' });
    expect(business.openingHours.days).toHaveLength(7);
  });
  it('keeps one real business base', () => {
    expect(business.address).toMatchObject({ street: '3106 68th Ave N', city: 'Brooklyn Center', region: 'MN', postalCode: '55429' });
    expect(business.founder).toBe('Brad Emholtz');
    expect(business.foundingDate).toBe('1988');
    expect(business.siteUrl).toBe('https://merritts-auto-recycling.com');
  });
});

describe('metro coverage and content quality', () => {
  it('covers both central cities and every side of the metro', () => {
    expect(coverageCities).toEqual(expect.arrayContaining(['Minneapolis', 'St. Paul', 'Maple Grove', 'Blaine', 'Bloomington', 'Eagan', 'Woodbury', 'Eden Prairie']));
    expect(serviceAreas.length).toBeGreaterThanOrEqual(16);
    expect(new Set(coverageCities).size).toBe(coverageCities.length);
    expect(areaServedSchema).toHaveLength(coverageCities.length);
    expect(areaServedSchema.some((item) => item.name === 'Saint Paul, Minnesota')).toBe(true);
  });
  it('gives each city useful, distinct content and valid related links', () => {
    const slugs = new Set(serviceAreas.map((area) => area.slug));
    expect(slugs.size).toBe(serviceAreas.length);
    expect(new Set(serviceAreas.map((area) => area.intro)).size).toBe(serviceAreas.length);
    expect(new Set(serviceAreas.map((area) => area.sections[0]?.heading)).size).toBe(serviceAreas.length);
    for (const area of serviceAreas) {
      expect(coverageCities).toContain(area.city);
      expect(area.description.length).toBeGreaterThan(70);
      expect(area.sections.flatMap((section) => section.paragraphs).join(' ').length).toBeGreaterThan(500);
      expect(area.details.length).toBeGreaterThanOrEqual(3);
      expect(area.faqs.length).toBeGreaterThan(0);
      expect(area.nearby.every((slug) => slugs.has(slug) && slug !== area.slug)).toBe(true);
    }
  });
  it('keeps all routes and metadata distinct', () => {
    const routes = [...publishedRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)];
    expect(new Set(routes).size).toBe(routes.length);
    const titles = [homeSeo.title, ...services.map((service) => service.seoTitle)];
    expect(new Set(titles).size).toBe(titles.length);
    for (const service of services) {
      expect(service.seoTitle.length).toBeLessThanOrEqual(60);
      expect(service.title.length).toBeGreaterThan(30);
      expect(service.image).toMatch(/^\/images\/legacy\//);
      expect(service.imageAlt.length).toBeGreaterThan(20);
    }
  });
  it('preserves safeguards against invented promises', () => {
    const content = JSON.stringify({ services, serviceAreas, guides, globalFaqs });
    expect(content).not.toMatch(/top dollar|rated #1|best price|paid cash on the spot/i);
    expect(content).not.toMatch(/\$\d{2,}/);
    expect(content).not.toMatch(/virtual office or doorway page|focused area model/i);
  });
  it('retains evergreen articles and adds substantive decision guides', () => {
    expect(guides.length).toBeGreaterThanOrEqual(7);
    const slugs = new Set(guides.map((guide) => guide.slug));
    expect(slugs.size).toBe(guides.length);
    for (const guide of guides) {
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      expect(guide.description.length).toBeGreaterThan(70);
      expect(guide.updatedIso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(guide.publishedIso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const related of guide.related ?? []) expect(slugs.has(related)).toBe(true);
    }
  });
});
