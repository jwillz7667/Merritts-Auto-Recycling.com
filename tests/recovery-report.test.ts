import { describe, expect, it } from 'vitest';
import { compareRecovery, destinationFor, parseCsv, queryGroup } from '../scripts/recovery-report.mjs';

const pages = (rows: string) => `Top pages,Clicks,Impressions,CTR,Position\n${rows}`;
const queries = (rows: string) => `Top queries,Clicks,Impressions,CTR,Position\n${rows}`;
const manifest = () => ({
  siteUrl: 'sc-domain:merritts-auto-recycling.com', searchType: 'web', purpose: 'restoration',
  filters: {}, settledThrough: '2026-10-29',
  before: { start: '2026-10-02', end: '2026-10-15', complete: true, pagesCsv: 'before-pages', queriesCsv: 'before-queries', propertyTotals: { clicks: 15, impressions: 200, source: 'Search Console property header' } },
  after: { start: '2026-10-16', end: '2026-10-29', complete: true, pagesCsv: 'after-pages', queriesCsv: 'after-queries', propertyTotals: { clicks: 12, impressions: 150, source: 'Search Console property header' } },
});
const data: Record<string, string> = {
  'before-pages': pages('http://www.merritts-auto-recycling.com/placemarks/maple-grove-mn.html,8,100,8%,4\nhttps://merritts-auto-recycling.com/service-areas/maple-grove,2,20,10%,6'),
  'after-pages': pages('https://merritts-auto-recycling.com/service-areas/maple-grove,9,90,10%,5'),
  'before-queries': queries('merritts auto recycling,2,10,20%,1\nhow much is a junk car worth,3,40,7.5%,8\njunk cars maple grove,5,50,10%,4'),
  'after-queries': queries('merritts auto recycling,2,10,20%,1\nhow much is a junk car worth,1,30,3.33%,9\njunk cars maple grove,4,40,10%,4'),
};
const run = (value = manifest(), rows = data) => compareRecovery(value, (path: string) => rows[path], '2026-11-01');

describe('migration-aware Search Console comparison', () => {
  it('combines hosts and historical aliases into one destination without losing its prior clicks', () => {
    const report = run();
    expect(report.pages).toHaveLength(1);
    expect(report.pages[0]).toMatchObject({ destination: 'https://merritts-auto-recycling.com/service-areas/maple-grove', before: { clicks: 10, impressions: 120 }, after: { clicks: 9, impressions: 90 }, clickDelta: -1 });
    expect(report.pages[0].before.position).toBeCloseTo(4.333333);
    expect(report.pages[0].aliasesSeen).toHaveLength(2);
  });

  it('retains property totals and reports hidden/exported query coverage separately', () => {
    const report = run();
    expect(report.coverage[0]).toMatchObject({ exportedQueryClicks: 10, unrepresentedQueryClicks: 5, propertyTotals: { clicks: 15 } });
    expect(report.queryGroups.find((row) => row.group === 'informational')).toMatchObject({ before: { clicks: 3 }, after: { clicks: 1 } });
  });

  it('groups brand variants first and leaves unrelated queries available for review', () => {
    expect(queryGroup('Merritt’s junk car title')).toBe('branded');
    expect(queryGroup('car title Minnesota')).toBe('informational');
    expect(queryGroup('junk car removal St. Paul')).toBe('city-service');
    expect(queryGroup('unrelated query')).toBe('other');
  });

  it('maps article and quote aliases but rejects an external host or disguised credential URL', () => {
    expect(destinationFor('https://www.merritts-auto-recycling.com/blog/minnesota-junk-car-title-requirements.html')).toBe('https://merritts-auto-recycling.com/guides/minnesota-junk-car-documents');
    expect(destinationFor('https://merritts-auto-recycling.com/quote-calculator?source=old')).toBe('https://merritts-auto-recycling.com/get-a-quote');
    expect(() => destinationFor('https://example.com/')).toThrow(/outside/);
    const credentialUrl = new URL('https://merritts-auto-recycling.com/');
    credentialUrl.username = 'synthetic-test-user';
    expect(() => destinationFor(credentialUrl.href)).toThrow(/outside/);
    expect(destinationFor('https://merritts-auto-recycling.com/not-a-known-page.html')).toContain('/not-a-known-page.html');
  });

  it('rejects incomplete, unequal, overlapping, or immature windows', () => {
    let value = manifest(); value.after.complete = false;
    expect(() => run(value)).toThrow(/complete/);
    value = manifest(); value.after.end = '2026-10-28';
    expect(() => run(value)).toThrow(/equal whole-week/);
    value = manifest(); value.after.start = '2026-10-02'; value.after.end = '2026-10-15';
    expect(() => run(value)).toThrow(/non-overlapping/);
    value = manifest(); value.settledThrough = '2026-11-01';
    expect(() => run(value)).toThrow(/latest two days/);
    value = manifest(); value.purpose = 'rebuild';
    expect(() => run(value)).toThrow(/baseline/);
  });

  it('refuses comparison-mode exports, duplicate rows and impossible coverage', () => {
    expect(() => run(manifest(), { ...data, 'after-pages': 'Top pages,Clicks Difference\n/page,2' })).toThrow(/single-period/);
    expect(() => run(manifest(), { ...data, 'after-queries': queries('same,1,2,50%,1\nsame,1,2,50%,1') })).toThrow(/duplicated/);
    const value = manifest(); value.before.propertyTotals.clicks = 1;
    expect(() => run(value)).toThrow(/exceed/);
  });

  it('handles quoted queries, escaped quotes, BOMs, CRLF and grouped counts', () => {
    expect(parseCsv('\uFEFFTop queries,Clicks\r\n"a, b and ""c""",1\r\n')).toEqual([['Top queries', 'Clicks'], ['a, b and "c"', '1']]);
    const value = manifest(); value.before.propertyTotals.clicks = 2000;
    const report = run(value, { ...data, 'before-queries': queries('"junk cars, minnesota","1,000","2,000",50%,2') });
    expect(report.coverage[0].exportedQueryClicks).toBe(1000);
    expect(() => parseCsv('a,b\n"unclosed')).toThrow(/Unclosed/);
    expect(() => parseCsv('a,b\n"closed"extra,1')).toThrow(/Unexpected/);
  });
});
