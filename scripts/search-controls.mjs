// Release guards for this site's generated sitemaps and public ASCII paths.
// These helpers are not a general XML validator or a complete REP implementation.
// Google grouping/rule precedence: https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec
// Truthful lastmod values: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

const normalizeEscapes = (value) => [...value].map((character) => character.codePointAt(0) > 127 ? encodeURIComponent(character) : character).join('').replace(/%([\da-f]{2})/gi, (escape, hex) => {
  const character = String.fromCharCode(Number.parseInt(hex, 16));
  return /[a-z\d._~-]/i.test(character) ? character : escape.toUpperCase();
});

// Greedy wildcard matching avoids constructing a backtracking regular expression.
const matchesPath = (rule, path) => {
  let pattern = rule.endsWith('$') ? rule.slice(0, -1) : `${rule}*`;
  pattern = pattern.replace(/\*+/g, '*');
  let position = 0, cursor = 0, star = -1, retry = 0;
  while (cursor < path.length) {
    if (pattern[position] === path[cursor]) { position++; cursor++; }
    else if (pattern[position] === '*') { star = position++; retry = cursor; }
    else if (star >= 0) { position = star + 1; cursor = ++retry; }
    else return false;
  }
  while (pattern[position] === '*') position++;
  return position === pattern.length;
};

/**
 * Ensure this site's canonical sitemap and indexable ASCII paths remain crawlable
 * for wildcard agents and Google's web Googlebot. Unknown directives are ignored;
 * Sitemap does not split groups. Specific Googlebot groups override wildcard groups.
 * @param {string} robotsText
 * @param {{origin: string, paths: Iterable<string>}} options
 */
export function validateRobots(robotsText, { origin, paths }) {
  let site;
  try { site = new URL(origin); } catch { throw new Error('Robots validation needs the absolute canonical HTTPS origin.'); }
  if (site.protocol !== 'https:' || site.username || site.password || site.pathname !== '/' || site.search || site.hash) throw new Error('Robots validation needs a canonical HTTPS origin without a path, credentials, query or fragment.');
  if (typeof robotsText !== 'string' || Buffer.byteLength(robotsText, 'utf8') > 500 * 1024) throw new Error('robots.txt must be UTF-8 text within Google’s 500 KiB parsing limit.');
  const expectedSitemap = new URL('/sitemap.xml', site).href;
  const groups = [], sitemaps = [];
  let group;
  for (const [index, original] of robotsText.replace(/^\uFEFF/, '').split(/\r\n|\r|\n/).entries()) {
    const line = original.split('#')[0].trim();
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (field === 'sitemap') { sitemaps.push(value); continue; }
    if (field === 'user-agent' && value) {
      if (!group || group.hasRules) { group = { agents: [], rules: [], hasRules: false }; groups.push(group); }
      // Google ignores a version or trailing wildcard on its crawler product token.
      group.agents.push(value === '*' ? '*' : value.toLowerCase().match(/^[a-z_-]+/)?.[0] ?? value.toLowerCase());
    } else if ((field === 'allow' || field === 'disallow') && group) {
      group.hasRules = true;
      if (!value.startsWith('/')) continue; // Empty or invalid rules do not restrict crawling.
      const pattern = normalizeEscapes(value).replace(/\*+$/, '');
      group.rules.push({ field, pattern, line: index + 1 });
    }
  }
  if (!sitemaps.includes(expectedSitemap)) throw new Error(`robots.txt must declare the exact canonical sitemap: Sitemap: ${expectedSitemap}`);
  if (!paths || typeof paths === 'string' || typeof paths[Symbol.iterator] !== 'function') throw new Error('Robots validation needs an iterable of canonical public paths.');
  const targets = new Set([...paths, '/sitemap.xml']);
  for (const path of targets) {
    if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || path.includes('?') || path.includes('#') || [...path].some((character) => character.charCodeAt(0) < 33 || character.charCodeAt(0) > 126) || new URL(path, site).pathname !== path) throw new Error(`Robots validation only supports canonical ASCII public paths; review ${JSON.stringify(path)} separately.`);
  }
  const wildcard = groups.filter((item) => item.agents.includes('*'));
  const googlebot = groups.filter((item) => item.agents.includes('googlebot'));
  for (const [agent, applicable] of [['wildcard (*)', wildcard], ['Googlebot', googlebot.length ? googlebot : wildcard]]) {
    const rules = applicable.flatMap((item) => item.rules);
    for (const target of targets) {
      const path = normalizeEscapes(target);
      let winner;
      for (const rule of rules) {
        if (matchesPath(rule.pattern, path) && (!winner || rule.pattern.length > winner.pattern.length || (rule.pattern.length === winner.pattern.length && rule.field === 'allow'))) winner = rule;
      }
      if (winner?.field === 'disallow') throw new Error(`robots.txt blocks ${agent} from public path ${target}: Disallow: ${winner.pattern} (line ${winner.line}). Remove the block or add the appropriate more-specific Allow rule.`);
    }
  }
}

/**
 * Check optional lastmod text elements emitted by this site's XML serializer.
 * Accept date-only or complete ISO timestamps with a timezone; never invent dates.
 * @param {string} xml
 * @param {{now?: Date}} [options]
 */
export function validateSitemapLastmod(xml, { now = new Date() } = {}) {
  if (typeof xml !== 'string') throw new Error('Sitemap lastmod validation needs XML text.');
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('Sitemap lastmod validation needs a valid current Date.');
  const content = xml.replace(/<!--[\s\S]*?-->/g, '');
  const openings = [...content.matchAll(/<(?:[\w.-]+:)?lastmod\b[^>]*>/g)];
  const entries = [...content.matchAll(/<((?:[\w.-]+:)?lastmod)\b[^>]*>([^<>]*)<\/\1\s*>/g)];
  if (openings.length !== entries.length) throw new Error('Malformed sitemap <lastmod>: use a text date value, or omit the optional element when the modification date is unknown.');
  for (const entry of entries) {
    const value = entry[2].trim();
    const parts = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-](\d{2}):(\d{2})))?$/);
    const invalid = () => { throw new Error(`Invalid sitemap <lastmod> ${JSON.stringify(value)}: use a real ISO date or timestamp with timezone for the last significant update, or omit unknown dates.`); };
    if (!parts) invalid();
    const year = Number(parts[1]), month = Number(parts[2]), day = Number(parts[3]);
    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1] || (parts[4] !== undefined && (Number(parts[4]) > 23 || Number(parts[5]) > 59 || Number(parts[6]) > 59 || Number(parts[9] ?? 0) > 23 || Number(parts[10] ?? 0) > 59))) invalid();
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) invalid();
    // Date stores milliseconds; retain a positive sub-millisecond remainder when
    // comparing a more precise timestamp exactly against the current instant.
    const preciseFuture = timestamp === now.getTime() && /[1-9]/.test(parts[7]?.slice(3) ?? '');
    if (timestamp > now.getTime() || preciseFuture) throw new Error(`Future sitemap <lastmod> ${JSON.stringify(value)} exceeds ${now.toISOString()}. Preserve the real last significant update date; do not refresh dates automatically.`);
  }
}
