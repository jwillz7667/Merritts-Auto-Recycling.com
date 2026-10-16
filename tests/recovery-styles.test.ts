import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
describe('recovery styles', () => {
  it('uses a stronger selector than the original pale service-card numeral rule', () => {
    const stylesheet = readFileSync(new URL('../src/styles/recovery.css', import.meta.url), 'utf8');
    expect(stylesheet).toMatch(/\.card\.service-card \.card-number\s*\{\s*color:\s*var\(--muted\)/);
  });
});
