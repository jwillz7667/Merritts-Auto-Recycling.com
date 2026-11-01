import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateRobots, validateSitemapLastmod } from '../scripts/search-controls.mjs';

const origin = 'https://merritts-auto-recycling.com';
const sitemap = `Sitemap: ${origin}/sitemap.xml`;
const checkRobots = (rules: string, paths = ['/']) => validateRobots(`${rules}\n${sitemap}`, { origin, paths });
const xml = (date?: string) => `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc>${date === undefined ? '' : `<lastmod>${date}</lastmod>`}</url></urlset>`;
const now = new Date('2026-11-01T12:00:00.000Z');

describe('public crawl controls', () => {
  it('accepts the production robots file without changing its simple allow policy', () => {
    const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
    expect(() => validateRobots(robots, { origin, paths: ['/', '/service-areas/maple-grove', '/guides/minnesota-junk-car-documents'] })).not.toThrow();
  });
  it('catches a Googlebot-only block hidden behind a wildcard allow', () => {
    expect(() => checkRobots('User-agent: *\nAllow: /\nUser-agent: Googlebot\nDisallow: /', ['/guides'])).toThrow(/Googlebot.*\/guides/);
  });
  it('checks wildcard permissions even if Googlebot has its own allowed group', () => {
    expect(() => checkRobots('User-agent: *\nDisallow: /guides\nUser-agent: Googlebot\nAllow: /', ['/guides'])).toThrow(/wildcard.*\/guides/);
  });
  it('merges separate equally specific Googlebot groups and uses a longer allow', () => {
    expect(() => checkRobots('User-agent: Googlebot\nDisallow: /guides\nUser-agent: Googlebot/1.2\nAllow: /guides/title', ['/guides/title'])).not.toThrow();
    expect(() => checkRobots('User-agent: Googlebot\nAllow: /\nUser-agent: Googlebot*\nDisallow: /guides', ['/guides'])).toThrow(/Googlebot.*\/guides/);
  });
  it('merges wildcard groups rather than choosing the first one', () => {
    expect(() => checkRobots('User-agent: *\nAllow: /\nUser-agent: *\nDisallow: /service-areas', ['/service-areas/maple-grove'])).toThrow(/wildcard/);
  });
  it('does not combine wildcard restrictions with a specific Googlebot group', () => {
    // The generic restriction affects /private, outside this public inventory.
    expect(() => checkRobots('User-agent: *\nDisallow: /private\nUser-agent: Googlebot\nAllow: /', ['/guides'])).not.toThrow();
  });
  it('ignores unrelated crawler groups without treating Googlebot News as web Googlebot', () => {
    expect(() => checkRobots('User-agent: *\nAllow: /\nUser-agent: Googlebot-News\nDisallow: /')).not.toThrow();
  });
  it('does not let Sitemap, comments, blank lines or unsupported fields split a UA group', () => {
    expect(() => checkRobots(`\uFEFFuSeR-aGeNt: Googlebot\r\n${sitemap}\r\n# comment\r\nCrawl-delay: 5\r\n\r\nUser-agent: otherbot\r\nDisallow: /guides`, ['/guides'])).toThrow(/Googlebot.*\/guides/);
  });
  it('uses longest rule paths, allow on ties, and case-sensitive path matching', () => {
    expect(() => checkRobots('User-agent: *\nDisallow: /guides\nAllow: /guides/title', ['/guides/title'])).not.toThrow();
    expect(() => checkRobots('User-agent: *\nAllow: /guides\nDisallow: /guides', ['/guides'])).not.toThrow();
    expect(() => checkRobots('User-agent: *\nDisallow: /GUIDES', ['/guides'])).not.toThrow();
    expect(() => checkRobots('User-agent: *\nAllow: /page\nDisallow: /*.htm', ['/page.htm'])).toThrow(/wildcard/);
    expect(() => checkRobots('User-agent: *\nAllow: /page\nDisallow: /*.ph', ['/page.php5'])).not.toThrow();
  });
  it('matches wildcard and end anchors without treating them as literal characters', () => {
    expect(() => checkRobots('User-agent: *\nDisallow: /guides/*documents$', ['/guides/minnesota-junk-car-documents'])).toThrow(/wildcard/);
    expect(() => checkRobots('User-agent: *\nDisallow: /guides$', ['/guides/minnesota-junk-car-documents'])).not.toThrow();
    expect(() => checkRobots('User-agent: *\nDisallow: /*\nAllow: /$', ['/guides'])).toThrow(/wildcard/);
    expect(() => checkRobots('User-agent: *\nDisallow: /guides*\nAllow: /guides', ['/guides'])).not.toThrow();
  });
  it('matches percent-encoded unreserved ASCII and ignores empty rule paths', () => {
    expect(() => checkRobots('User-agent: *\nDisallow: /%67uides', ['/guides'])).toThrow(/wildcard/);
    expect(() => checkRobots('User-agent: *\nDisallow:\nAllow:')).not.toThrow();
  });
  it('requires the exact canonical sitemap and keeps it crawlable', () => {
    expect(() => validateRobots('User-agent: *\nAllow: /', { origin, paths: ['/'] })).toThrow(/exact canonical sitemap/);
    expect(() => validateRobots('Sitemap: https://www.merritts-auto-recycling.com/sitemap.xml', { origin, paths: ['/'] })).toThrow(/exact canonical sitemap/);
    expect(() => checkRobots('User-agent: *\nDisallow: /sitemap.xml')).toThrow(/\/sitemap.xml/);
  });
  it('bounds validation to canonical public paths instead of silently normalizing inputs', () => {
    for (const path of ['https://example.com/', '//example.com/', '/guides?x=1', '/guides#title', '/guides/../contact']) expect(() => checkRobots('User-agent: *\nAllow: /', [path])).toThrow(/canonical ASCII public paths/);
  });
});

describe('truthful sitemap lastmod values', () => {
  it('allows optional dates and real date-only or full ISO timestamps', () => {
    for (const date of [undefined, '2024-02-29', '2026-11-01', '2026-10-16T09:30:00Z', '2026-11-01T07:00:00-05:00', '2026-11-01T14:00:00+02:00', '2026-11-01T12:00:00.000Z']) expect(() => validateSitemapLastmod(xml(date), { now })).not.toThrow();
  });
  it.each(['', '2026-02-29', '2026-02-30', '2026-04-31', '2026-13-01', '0000-01-01', '2026-10-16T24:00:00Z', '2026-10-16T12:60:00Z', '2026-10-16T12:00:60Z', '2026-10-16T12:00:00+24:00', '2026-10-16T12:00:00+00:60', '2026-10-16T12:00:00', 'October 16, 2026'])('rejects invalid or ambiguous lastmod %j', (date) => {
    expect(() => validateSitemapLastmod(xml(date), { now })).toThrow(/Invalid sitemap <lastmod>/);
  });
  it.each(['2026-11-02', '2026-11-01T12:00:00.001Z', '2026-11-01T07:00:01-05:00', '2026-11-01T12:00:00.0001Z'])('rejects future lastmod %j using the actual instant', (date) => {
    expect(() => validateSitemapLastmod(xml(date), { now })).toThrow(/Future sitemap <lastmod>/);
  });
  it('checks every entry, permits namespace prefixes, and ignores commented examples', () => {
    expect(() => validateSitemapLastmod('<!-- <lastmod>2099-01-01</lastmod> --><urlset><url><sm:lastmod>2024-02-29</sm:lastmod></url></urlset>', { now })).not.toThrow();
    expect(() => validateSitemapLastmod('<urlset><url><lastmod>2026-10-16</lastmod></url><url><lastmod>2026-02-30</lastmod></url></urlset>', { now })).toThrow(/2026-02-30/);
  });
  it('fails malformed or empty elements instead of silently skipping their dates', () => {
    for (const content of ['<lastmod/>', '<lastmod>2026-10-16', '<lastmod><b>2026-10-16</b></lastmod>']) expect(() => validateSitemapLastmod(content, { now })).toThrow(/Malformed sitemap/);
  });
  it('rejects an invalid comparison clock', () => {
    expect(() => validateSitemapLastmod(xml('2026-10-16'), { now: new Date('invalid') })).toThrow(/valid current Date/);
  });
});
