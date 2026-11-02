// Offline comparison of single-period, English Search Console CSV exports.
// No Google credentials, network requests, indexing claims or fabricated data.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const inventory = JSON.parse(readFileSync(new URL('tests/fixtures/pre-overhaul-url-inventory.json', root), 'utf8'));
const redirects = JSON.parse(readFileSync(new URL('vercel.json', root), 'utf8')).redirects;
const legacy = JSON.parse(readFileSync(new URL('src/data/legacy-routes.json', root), 'utf8'));
const directory = JSON.parse(readFileSync(new URL('src/data/city-directory.json', root), 'utf8'));
const origin = 'https://merritts-auto-recycling.com';
const aliases = new Map();
for (const row of inventory.routes) {
  if (row.kind === 'invalid-font-artifact') continue;
  if (row.destination) aliases.set(row.source, row.destination);
}
for (const rule of redirects) {
  if (!rule.has && /^\/[a-z0-9/._-]*$/i.test(rule.source) && rule.destination.startsWith('/')) aliases.set(rule.source, rule.destination);
}
for (const [slug, destination] of Object.entries(legacy.areas)) {
  aliases.set(`/placemarks/${slug}`, destination);
  aliases.set(`/placemarks/${slug}.html`, destination);
}
for (const [slug, destination] of Object.entries(legacy.blogs)) {
  aliases.set(`/blog/${slug}`, destination);
  aliases.set(`/blog/${slug}.html`, destination);
}
const cityTerms = directory.flatMap((region) => region.cities.map((city) => city.city.toLowerCase()));

export function destinationFor(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || !['merritts-auto-recycling.com', 'www.merritts-auto-recycling.com'].includes(url.hostname) || url.port || url.username || url.password) throw new Error(`Page is outside the Domain property: ${value}`);
  let path = url.pathname.replace(/\/+$/, '') || '/';
  const visited = new Set();
  while (aliases.has(path)) {
    if (visited.has(path)) throw new Error(`Redirect cycle at ${path}`);
    visited.add(path);
    path = aliases.get(path);
  }
  return new URL(path, origin).href;
}

export function queryGroup(query) {
  const text = query.toLowerCase().replace(/[’']/g, '');
  if (/\bmerritts?\b/.test(text)) return 'branded';
  if (/\b(how|what|why|when|can i|do i|should i|title|titles|plates?|documents?|paperwork|worth|weight|lien|liens|value|prices?)\b/.test(text)) return 'informational';
  if (/\b(junk|scrap|towing|tow|salvage|car|cars|vehicle|vehicles|auto|recycling|recycle)\b/.test(text) || cityTerms.some((city) => text.includes(city))) return 'city-service';
  return 'other';
}

export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false, closed = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { field += '"'; i++; }
      else if (quoted) { quoted = false; closed = true; }
      else if (field === '' && !closed) quoted = true;
      else throw new Error('Malformed CSV quote.');
    } else if (!quoted && (char === ',' || char === '\n' || char === '\r')) {
      row.push(field); field = ''; closed = false;
      if (char !== ',') {
        if (row.some((value) => value !== '')) rows.push(row);
        row = [];
        if (char === '\r' && input[i + 1] === '\n') i++;
      }
    } else {
      if (closed) throw new Error('Unexpected text after a quoted CSV field.');
      field += char;
    }
  }
  if (quoted) throw new Error('Unclosed CSV quote.');
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function numeric(value, label) {
  if (typeof value === 'string') {
    if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value.trim())) throw new Error(`Invalid ${label}: ${value}`);
    value = Number(value.replaceAll(',', ''));
  }
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error(`Invalid ${label}.`);
  return value;
}

function timestamp(value) {
  const time = Date.parse(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new Error(`Invalid date: ${value}`);
  return time;
}

function readRows(csv, kind) {
  const [header, ...rows] = parseCsv(csv);
  const expected = kind === 'page' ? 'Top pages' : 'Top queries';
  if (!header || new Set(header).size !== header.length || header[0] !== expected || !header.includes('Clicks') || !header.includes('Impressions') || !header.includes('Position')) throw new Error(`Expected single-period English ${expected} export, including Clicks, Impressions and Position.`);
  const seen = new Set();
  return rows.map((row) => {
    if (row.length !== header.length) throw new Error('CSV row does not match its header.');
    const key = row[0];
    if (!key || seen.has(key)) throw new Error(`Empty or duplicated ${kind} row: ${key}`);
    seen.add(key);
    const clicks = numeric(row[header.indexOf('Clicks')], 'clicks');
    const impressions = numeric(row[header.indexOf('Impressions')], 'impressions');
    const position = impressions ? numeric(row[header.indexOf('Position')], 'position') : 0;
    if (!Number.isInteger(clicks) || !Number.isInteger(impressions)) throw new Error('Clicks and impressions must be integer counts.');
    return { key, clicks, impressions, position };
  });
}

function emptyMetrics() { return { clicks: 0, impressions: 0, positionSum: 0 }; }
function add(target, row) {
  target.clicks += row.clicks;
  target.impressions += row.impressions;
  target.positionSum += row.position * row.impressions;
}
function metrics(value) {
  return { clicks: value.clicks, impressions: value.impressions, ctrPercent: value.impressions ? 100 * value.clicks / value.impressions : null, position: value.impressions ? value.positionSum / value.impressions : null };
}
function compare(before, after) {
  return { before: metrics(before), after: metrics(after), clickDelta: after.clicks - before.clicks, impressionDelta: after.impressions - before.impressions };
}

// Results describe only exported rows. Property totals stay separate because
// page aggregation and hidden query rows can differ from property-level totals.
export function compareRecovery(manifest, read = (path) => readFileSync(path, 'utf8'), today = new Date().toISOString().slice(0, 10)) {
  if (manifest.siteUrl !== 'sc-domain:merritts-auto-recycling.com' || manifest.searchType !== 'web') throw new Error('Use the existing Domain property and web search.');
  if (!manifest.filters || typeof manifest.filters !== 'object' || Array.isArray(manifest.filters)) throw new Error('Record the common filters explicitly, using {} when unfiltered.');
  const settled = timestamp(manifest.settledThrough);
  if (settled > timestamp(today) - 2 * 86400000) throw new Error('Leave at least the latest two days out of settled data.');
  const windows = [manifest.before, manifest.after];
  const counts = windows.map((window) => {
    if (!window || window.complete !== true) throw new Error('Confirm each reporting window is complete.');
    const start = timestamp(window.start), end = timestamp(window.end);
    if (end < start || end > settled) throw new Error('Window exceeds settled data or ends before it starts.');
    return (end - start) / 86400000 + 1;
  });
  if (counts[0] !== counts[1] || counts[0] % 7 !== 0) throw new Error('Use equal whole-week windows to preserve weekday mix.');
  if (timestamp(manifest.before.end) >= timestamp(manifest.after.start)) throw new Error('Windows must be chronological and non-overlapping.');
  if (manifest.purpose === 'rebuild' && manifest.before.end >= '2026-08-23') throw new Error('The pre-rebuild baseline must end before August 23.');
  if (manifest.purpose === 'rebuild' && manifest.after.start < '2026-08-23') throw new Error('The post-rebuild window must start on or after August 23.');
  if (manifest.purpose === 'restoration' && (manifest.before.end >= '2026-10-16' || manifest.after.start < '2026-10-16')) throw new Error('Restoration windows must fall on either side of October 16.');
  if (!['rebuild', 'restoration', 'monitoring'].includes(manifest.purpose)) throw new Error('Record purpose as rebuild, restoration or monitoring.');
  const pages = new Map(), queries = new Map(), segments = new Map();
  const coverage = [];
  windows.forEach((window, index) => {
    const side = index ? 'after' : 'before';
    const pageRows = readRows(read(window.pagesCsv), 'page');
    const queryRows = readRows(read(window.queriesCsv), 'query');
    for (const row of pageRows) {
      const destination = destinationFor(row.key);
      const entry = pages.get(destination) ?? { destination, aliasesSeen: new Set(), before: emptyMetrics(), after: emptyMetrics() };
      entry.aliasesSeen.add(row.key);
      add(entry[side], row);
      pages.set(destination, entry);
    }
    const querySum = emptyMetrics();
    for (const row of queryRows) {
      const entry = queries.get(row.key) ?? { query: row.key, group: queryGroup(row.key), before: emptyMetrics(), after: emptyMetrics() };
      add(entry[side], row); add(querySum, row);
      queries.set(row.key, entry);
      const segment = segments.get(entry.group) ?? { group: entry.group, before: emptyMetrics(), after: emptyMetrics() };
      add(segment[side], row); segments.set(entry.group, segment);
    }
    const totals = window.propertyTotals;
    if (totals && (!totals.source || !Number.isInteger(numeric(totals.clicks, 'property clicks')) || !Number.isInteger(numeric(totals.impressions, 'property impressions')))) throw new Error('Property totals require a source and integer counts.');
    if (totals && querySum.clicks > totals.clicks) throw new Error('Exported query clicks exceed property clicks; check filters and dates.');
    coverage.push({ side, pageRows: pageRows.length, queryRows: queryRows.length, exportedQueryClicks: querySum.clicks, propertyTotals: totals ?? null, unrepresentedQueryClicks: totals ? totals.clicks - querySum.clicks : null });
  });
  const pageResults = [...pages.values()].map((row) => ({ destination: row.destination, aliasesSeen: [...row.aliasesSeen].sort(), ...compare(row.before, row.after) })).sort((a, b) => a.clickDelta - b.clickDelta || a.impressionDelta - b.impressionDelta);
  return {
    siteUrl: manifest.siteUrl, searchType: manifest.searchType, filters: manifest.filters, purpose: manifest.purpose,
    windows: windows.map((window) => ({ start: window.start, end: window.end })), settledThrough: manifest.settledThrough, daysPerWindow: counts[0],
    coverage, pages: pageResults,
    queryGroups: [...segments.values()].map((row) => ({ group: row.group, ...compare(row.before, row.after) })),
    queries: [...queries.values()].map((row) => ({ query: row.query, group: row.group, ...compare(row.before, row.after) })).sort((a, b) => a.clickDelta - b.clickDelta || a.impressionDelta - b.impressionDelta),
    limits: [
      'This is an analysis of exported rows, not an indexing report or a complete inventory.',
      'Missing query rows include anonymized queries and export limits; zero in an export does not prove zero demand.',
      'Page totals use page aggregation and must not be presented as property totals. Do not sum page impressions to infer property impressions.',
      'Query groups are heuristic and mutually exclusive: branded first, informational next, city/service next, other last. Review ambiguous queries.',
      'Average positions are impression-weighted within exported rows; changed query mix can change average position.',
      'A CTR decline alone does not justify changing a title. Check query mix, position and search-result appearance first.',
      'Date and filter metadata must match the exports. Completeness is a caller assertion, not independently verified by this offline tool.',
    ],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw new Error('Usage: node scripts/recovery-report.mjs /private/comparison.json /private/report.json');
  const absolute = resolve(input);
  if (absolute === resolve(output)) throw new Error('The output must not overwrite the comparison input.');
  const manifest = JSON.parse(readFileSync(absolute, 'utf8'));
  const report = compareRecovery(manifest, (path) => readFileSync(resolve(dirname(absolute), path), 'utf8'));
  writeFileSync(resolve(output), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Compared ${report.pages.length} destination groups over ${report.daysPerWindow}-day windows. See ${resolve(output)}; review coverage limits before quoting totals.`);
}
