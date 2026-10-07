import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { guides as previousGuides } from '@/data/guide-base';
import { guides } from '@/data/guides';
import { buyerComparisonGuide } from '@/data/buyer-comparison';
import { publishedRoutes } from '@/data/site';

const getGuide = (slug: string) => {
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Missing guide: ${slug}`);
  return guide;
};

describe('search-language content without duplicate landing pages', () => {
  it('preserves every established guide URL and publication date', () => {
    expect(guides).toHaveLength(previousGuides.length + 1);
    for (const oldGuide of previousGuides) {
      expect(getGuide(oldGuide.slug).publishedIso).toBe(oldGuide.publishedIso);
    }
    expect(new Set(guides.map((guide) => guide.slug)).size).toBe(guides.length);
  });

  it('answers engine and transmission questions on the established non-running guide', () => {
    const guide = getGuide('non-running-car-removal-checklist');
    expect(guide.seoTitle).toBe("Sell a Non-Running Car in the Twin Cities | Merritt's");
    expect(guide.sections.map((section) => section.heading)).toEqual(expect.arrayContaining([
      'Can I sell a car with a blown engine?', 'What about a car with a bad transmission?',
      'How much is a non-running car worth?', 'Can you pick up a car that will not move?',
    ]));
    expect(guide.publishedIso).toBe('2026-08-23');
    expect(guide.updatedIso).toBe('2026-10-07');
  });

  it('keeps concise unique titles and useful descriptions for changed guides', () => {
    const slugs = ['non-running-car-removal-checklist', 'repair-trade-in-or-sell-a-junk-car', buyerComparisonGuide.slug];
    for (const slug of slugs) {
      const guide = getGuide(slug);
      expect(guide.seoTitle?.length).toBeLessThanOrEqual(65);
      expect(guide.description.length).toBeGreaterThan(70);
      expect(guide.description.length).toBeLessThanOrEqual(190);
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
    }
    const titles = guides.map((guide) => guide.seoTitle ?? guide.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('sourced, clearly attributed buyer comparison', () => {
  it('publishes exactly one comparator and makes the publisher and independence limits explicit', () => {
    expect(guides.filter((guide) => guide.comparison)).toHaveLength(1);
    const { comparison } = buyerComparisonGuide;
    expect(comparison.disclosure).toContain('Published by Merritt’s Auto Recycling');
    expect(comparison.disclosure).toContain('not affiliated with or endorsed by');
    expect(comparison.disclosure).toContain('not an independent review');
    expect(comparison.checkedIso).toBe(buyerComparisonGuide.updatedIso);
    expect(buyerComparisonGuide.sections.map((section) => section.paragraphs.join(' ')).join(' ')).toContain('does not claim that either business pays more');
  });

  it('provides an original source for both businesses in every comparison row', () => {
    const comparison = buyerComparisonGuide.comparison;
    expect(comparison.rows).toHaveLength(5);
    for (const row of comparison.rows) {
      const source = new URL(row.competitorSource.href);
      expect(source.protocol).toBe('https:');
      expect(source.hostname).toBe('www.cashforjunkersmn.com');
      expect(['/', '/areas/']).toContain(source.pathname);
      expect(publishedRoutes).toContain(row.merrittsSource.href);
      expect(row.competitor.toLowerCase()).toMatch(/its (website|process|area directory)/);
      expect(row.question.endsWith('?')).toBe(true);
    }
  });

  it('does not add fake scores, prices, affiliation schema, or competitor branding', () => {
    const content = JSON.stringify(buyerComparisonGuide);
    expect(content).not.toMatch(/aggregateRating|reviewRating|"logo"|"sameAs"|\$\d|rated #1|highest-paying/i);
    const component = readFileSync(new URL('../src/components/BuyerComparison.astro', import.meta.url), 'utf8');
    expect(component).not.toMatch(/<img|<iframe|set:html/);
    expect(component).toContain('color: var(--muted)');
    expect(component).toContain('background: var(--paper)');
    expect(component).toContain('grid-template-columns: minmax(0, 1fr)');
  });

  it('links the comparison from established guides and service pages', () => {
    expect(getGuide('what-affects-a-junk-car-offer').related).toContain(buyerComparisonGuide.slug);
    expect(getGuide('repair-trade-in-or-sell-a-junk-car').related).toContain(buyerComparisonGuide.slug);
    const serviceTemplate = readFileSync(new URL('../src/components/ServicePage.astro', import.meta.url), 'utf8');
    expect(serviceTemplate).toContain(buyerComparisonGuide.slug);
    const template = readFileSync(new URL('../src/pages/guides/[slug].astro', import.meta.url), 'utf8');
    expect(template).toContain('guide.comparison.disclosure');
    expect(template).toContain('BuyerComparison comparison={guide.comparison}');
  });
});
