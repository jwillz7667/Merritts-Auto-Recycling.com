import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('article image metadata', () => {
  it('uses the same approved photograph in Article schema and visible content', () => {
    const template = readFileSync(new URL('../src/pages/guides/[slug].astro', import.meta.url), 'utf8');
    expect(template).toContain('const articleImage = `${business.siteUrl}/images/legacy/merritts-tow-truck.jpg`');
    expect(template).toContain('image: [articleImage]');
    expect(template).toContain('src="/images/legacy/merritts-tow-truck.jpg"');
    expect(template).toContain('width={1600} height={1070}');
    expect(template).toContain('A Merritt’s Auto Recycling truck.');
  });
});
