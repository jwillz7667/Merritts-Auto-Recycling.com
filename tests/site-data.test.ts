import { describe, expect, it } from 'vitest';
import { guides } from '@/data/guides';
import { business, publishedRoutes, serviceAreas, services } from '@/data/site';

describe('immutable business information', () => {
  it('uses the approved call and text numbers', () => {
    expect(business.phone).toBe('763-533-2775');
    expect(business.phoneUri).toBe('tel:+1-763-533-2775');
    expect(business.textPhone).toBe('763-438-2116');
    expect(business.textUri).toBe('sms:+1-763-438-2116');
  });

  it('uses the owner-corrected hours every day', () => {
    expect(business.hoursDisplay).toBe('Open every day, 8:00 AM–8:00 PM');
    expect(business.openingHours.opens).toBe('08:00');
    expect(business.openingHours.closes).toBe('20:00');
    expect(business.openingHours.days).toHaveLength(7);
  });

  it('keeps the canonical real-world entity details', () => {
    expect(business.address).toMatchObject({
      street: '3106 68th Ave N',
      city: 'Brooklyn Center',
      region: 'MN',
      postalCode: '55429',
    });
    expect(business.founder).toBe('Brad Emholtz');
    expect(business.foundingDate).toBe('1988');
  });
});

describe('content policy', () => {
  it('publishes only the confirmed focused service-area set', () => {
    expect(serviceAreas.map((area) => area.slug)).toEqual(['brooklyn-center', 'minneapolis']);
    expect(JSON.stringify(serviceAreas)).not.toMatch(/saint paul/i);
  });

  it('has unique published routes', () => {
    expect(new Set(publishedRoutes).size).toBe(publishedRoutes.length);
  });

  it('uses only approved legacy image paths for service content', () => {
    for (const service of services) {
      expect(service.image).toMatch(/^\/images\/legacy\//);
      expect(service.imageAlt.length).toBeGreaterThan(20);
    }
  });

  it('does not contain disallowed marketing claims', () => {
    const content = JSON.stringify({ services, serviceAreas, guides });
    expect(content).not.toMatch(/top dollar|rated #1|best price|paid cash on the spot/i);
    expect(content).not.toMatch(/\$\d{2,}/);
  });

  it('provides five substantive evergreen guides', () => {
    expect(guides).toHaveLength(5);
    for (const guide of guides) {
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      expect(guide.description.length).toBeGreaterThan(70);
    }
  });
});
