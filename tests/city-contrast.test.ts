import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const template = readFileSync(
  new URL('../src/pages/service-areas/[slug].astro', import.meta.url),
  'utf8',
);
const styles = template.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';

function requiredHex(value: string | undefined): string {
  if (!value || !/^#[a-f\d]{6}$/i.test(value)) {
    throw new Error('Expected an opaque six-digit CSS color for the contrast check.');
  }
  return value;
}

function luminance(hex: string): number {
  const weights = [0.2126, 0.7152, 0.0722];
  return weights.reduce((total, weight, channel) => {
    const value = parseInt(hex.slice(1 + channel * 2, 3 + channel * 2), 16) / 255;
    const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return total + weight * linear;
  }, 0);
}

function contrast(foreground: string, background: string): number {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

describe('city-page process text contrast', () => {
  it('overrides dark-surface step text only on the city template light surface', () => {
    expect(styles).toMatch(/\.section--soft\s+\.step\s+p\s*\{\s*color:\s*var\(--muted\);\s*\}/);
    expect(styles).toMatch(/\.section--soft\s+\.step\s*\{\s*border-top-color:\s*var\(--line\);\s*\}/);
    expect(template).not.toMatch(/<style[^>]*is:global/);
  });

  it('keeps normal-sized captions above 4.5:1 across the light gradient', () => {
    const foreground = requiredHex(css.match(/--muted:\s*(#[a-f\d]{6})/i)?.[1]);
    const surface = css.match(/\.section--soft\s*\{([^}]+)\}/)?.[1] ?? '';
    const background = requiredHex(surface.match(/(#[a-f\d]{6})\s*;/i)?.[1]);
    // This surface overlays translucent white on its base, so the base is the
    // darkest stop. Check both ends; the white overlay only increases contrast.
    expect(surface).toMatch(/rgba\(255,\s*255,\s*255,/);
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(foreground, '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('preserves the readable global step palette used by dark sections', () => {
    const navy = requiredHex(css.match(/--navy:\s*(#[a-f\d]{6})/i)?.[1]);
    const stepRule = css.match(/\.step\s+p\s*\{([^}]+)\}/)?.[1] ?? '';
    const foreground = requiredHex(stepRule.match(/color:\s*(#[a-f\d]{6})/i)?.[1]);
    expect(contrast(foreground, navy)).toBeGreaterThanOrEqual(4.5);
  });
});
