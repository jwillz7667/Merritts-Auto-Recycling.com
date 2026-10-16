import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import retainedImages from './fixtures/retained-image-migrations.json';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

// This inventory was independently reconstructed from pre-overhaul 94010cc's
// image files, optimized-image manifest, and HTML/social/Article references.
// These photographs survive under new names; unrelated removed graphics do not.
describe('retained pre-overhaul photograph URLs', () => {
  it('preserves every retained image URL with an exact permanent redirect', () => {
    expect(retainedImages).toHaveLength(12);
    expect(new Set(retainedImages.map((image) => image.source)).size).toBe(retainedImages.length);
    for (const image of retainedImages) {
      const matches = config.redirects.filter((rule: { source: string }) => rule.source === image.source);
      expect(matches, image.source).toEqual([{ ...image, permanent: true }]);
    }
  });

  it('points to existing image files rather than a page or another migration', () => {
    for (const destination of new Set(retainedImages.map((image) => image.destination))) {
      const bytes = readFileSync(new URL(`../public${destination}`, import.meta.url));
      expect(bytes.length, destination).toBeGreaterThan(1000);
      if (destination.endsWith('.jpg')) expect(bytes.subarray(0, 3).toString('hex')).toBe('ffd8ff');
      if (destination.endsWith('.avif')) expect(bytes.subarray(4, 12).toString('ascii')).toBe('ftypavif');
      if (destination.endsWith('.webp')) {
        expect(bytes.subarray(0, 4).toString('ascii')).toBe('RIFF');
        expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP');
      }
      expect(config.redirects.some((rule: { source: string }) => rule.source === destination), destination).toBe(false);
    }
  });

  it('does not route missing or unrelated old imagery to a retained photograph', () => {
    const imageRules = config.redirects.filter((rule: { source: string }) => rule.source.startsWith('/images/'));
    for (const rule of imageRules) expect(retainedImages.some((image) => image.source === rule.source), rule.source).toBe(true);
    expect(imageRules.some((rule: { source: string }) => rule.source === '/images/fb-merritts-auto-recycling-v2.jpg')).toBe(false);
  });
});
