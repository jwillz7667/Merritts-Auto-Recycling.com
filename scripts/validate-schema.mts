#!/usr/bin/env tsx
/**
 * Validate every JSON-LD `<script type="application/ld+json">` block across the site.
 *
 * Walks all `.html` files in the repo root + `placemarks/` and:
 *  - extracts every JSON-LD block,
 *  - parses it as JSON,
 *  - applies schema.org-aware structural checks per @type,
 *  - fails the process (exit 1) on any error.
 *
 * The checks are deliberately strict on shape (required fields, types, URL form) and lenient on
 * content (we don't validate enumerations like ISO 4217 currency codes — schema.org doesn't
 * require it). The goal is to catch authoring regressions before they reach Search Console.
 */
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { repoRoot } from './_lib/data.mts';

type Issue = { file: string; offset: number; message: string };

const issues: Issue[] = [];
let scriptsChecked = 0;
let filesChecked = 0;

function record(file: string, offset: number, message: string): void {
  issues.push({ file, offset, message });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isHttpsUrl(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

function getTypes(node: Record<string, unknown>): string[] {
  const raw = node['@type'];
  if (typeof raw === 'string') return [raw];
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string');
  return [];
}

function ensureField(
  node: Record<string, unknown>,
  field: string,
  predicate: (v: unknown) => boolean,
  description: string,
  ctx: { file: string; offset: number; path: string },
): void {
  if (!(field in node)) {
    record(ctx.file, ctx.offset, `${ctx.path}: missing required field "${field}" (${description})`);
    return;
  }
  if (!predicate(node[field])) {
    record(
      ctx.file,
      ctx.offset,
      `${ctx.path}: field "${field}" failed validation (${description}); got ${JSON.stringify(node[field])}`,
    );
  }
}

function validatePostalAddress(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  if (!isPlainObject(node)) {
    record(ctx.file, ctx.offset, `${ctx.path}: PostalAddress must be an object`);
    return;
  }
  if (node['@type'] !== 'PostalAddress') {
    record(ctx.file, ctx.offset, `${ctx.path}: address @type must be "PostalAddress"`);
  }
  ensureField(node, 'streetAddress', isNonEmptyString, 'non-empty string', ctx);
  ensureField(node, 'addressLocality', isNonEmptyString, 'non-empty string', ctx);
  ensureField(node, 'addressRegion', isNonEmptyString, 'non-empty string', ctx);
  ensureField(node, 'postalCode', isNonEmptyString, 'non-empty string', ctx);
  ensureField(node, 'addressCountry', isNonEmptyString, 'non-empty string', ctx);
}

function validateGeoCoordinates(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  if (!isPlainObject(node)) {
    record(ctx.file, ctx.offset, `${ctx.path}: GeoCoordinates must be an object`);
    return;
  }
  if (node['@type'] !== 'GeoCoordinates') {
    record(ctx.file, ctx.offset, `${ctx.path}: geo @type must be "GeoCoordinates"`);
  }
  const lat = node['latitude'];
  const lng = node['longitude'];
  const isNumberLike = (v: unknown): boolean =>
    typeof v === 'number' || (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v));
  if (!isNumberLike(lat))
    record(ctx.file, ctx.offset, `${ctx.path}: latitude must be a number-like value`);
  if (!isNumberLike(lng))
    record(ctx.file, ctx.offset, `${ctx.path}: longitude must be a number-like value`);
}

function validateLocalBusiness(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  ensureField(
    node,
    '@id',
    (v) => isHttpsUrl(v) && v.includes('#'),
    'absolute URL with fragment identifier',
    ctx,
  );
  ensureField(node, 'name', isNonEmptyString, 'non-empty string', ctx);
  ensureField(node, 'url', isHttpsUrl, 'absolute https URL', ctx);
  ensureField(node, 'telephone', isNonEmptyString, 'non-empty string', ctx);
  ensureField(node, 'priceRange', isNonEmptyString, 'non-empty string', ctx);
  if (isPlainObject(node['address'])) {
    validatePostalAddress(node['address'], { ...ctx, path: `${ctx.path}.address` });
  } else {
    record(ctx.file, ctx.offset, `${ctx.path}: missing PostalAddress at "address"`);
  }
  if (isPlainObject(node['geo'])) {
    validateGeoCoordinates(node['geo'], { ...ctx, path: `${ctx.path}.geo` });
  } else {
    record(ctx.file, ctx.offset, `${ctx.path}: missing GeoCoordinates at "geo"`);
  }
  const hours = node['openingHoursSpecification'];
  if (!Array.isArray(hours) || hours.length === 0) {
    record(
      ctx.file,
      ctx.offset,
      `${ctx.path}: openingHoursSpecification must be a non-empty array`,
    );
  } else {
    hours.forEach((h, i) => {
      if (!isPlainObject(h)) {
        record(
          ctx.file,
          ctx.offset,
          `${ctx.path}.openingHoursSpecification[${i}]: must be an object`,
        );
        return;
      }
      if (h['@type'] !== 'OpeningHoursSpecification') {
        record(
          ctx.file,
          ctx.offset,
          `${ctx.path}.openingHoursSpecification[${i}]: @type must be "OpeningHoursSpecification"`,
        );
      }
      if (!Array.isArray(h['dayOfWeek']) || (h['dayOfWeek'] as unknown[]).length === 0) {
        record(
          ctx.file,
          ctx.offset,
          `${ctx.path}.openingHoursSpecification[${i}]: dayOfWeek must be a non-empty array`,
        );
      }
      if (!isNonEmptyString(h['opens']))
        record(ctx.file, ctx.offset, `${ctx.path}.openingHoursSpecification[${i}]: opens missing`);
      if (!isNonEmptyString(h['closes']))
        record(ctx.file, ctx.offset, `${ctx.path}.openingHoursSpecification[${i}]: closes missing`);
    });
  }
  // aggregateRating only on the canonical entity, not refs. Skip if absent.
  if (node['aggregateRating'] !== undefined) {
    if (!isPlainObject(node['aggregateRating'])) {
      record(ctx.file, ctx.offset, `${ctx.path}.aggregateRating: must be an object`);
    } else {
      const ar = node['aggregateRating'];
      if (ar['@type'] !== 'AggregateRating') {
        record(
          ctx.file,
          ctx.offset,
          `${ctx.path}.aggregateRating: @type must be "AggregateRating"`,
        );
      }
      if (!isNonEmptyString(ar['ratingValue']) && typeof ar['ratingValue'] !== 'number') {
        record(ctx.file, ctx.offset, `${ctx.path}.aggregateRating: ratingValue required`);
      }
      const rc = ar['reviewCount'];
      const rcOk = typeof rc === 'number' || (typeof rc === 'string' && /^\d+$/.test(rc));
      if (!rcOk) {
        record(
          ctx.file,
          ctx.offset,
          `${ctx.path}.aggregateRating: reviewCount must be a positive integer`,
        );
      }
    }
  }
}

function validateBreadcrumb(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  const items = node['itemListElement'];
  if (!Array.isArray(items) || items.length === 0) {
    record(ctx.file, ctx.offset, `${ctx.path}: itemListElement must be a non-empty array`);
    return;
  }
  items.forEach((it, i) => {
    if (!isPlainObject(it)) {
      record(ctx.file, ctx.offset, `${ctx.path}.itemListElement[${i}]: must be an object`);
      return;
    }
    if (it['@type'] !== 'ListItem') {
      record(ctx.file, ctx.offset, `${ctx.path}.itemListElement[${i}]: @type must be "ListItem"`);
    }
    const pos = it['position'];
    if (!(typeof pos === 'number' && Number.isInteger(pos) && pos > 0)) {
      record(
        ctx.file,
        ctx.offset,
        `${ctx.path}.itemListElement[${i}]: position must be a positive integer`,
      );
    }
    if (!isNonEmptyString(it['name'])) {
      record(ctx.file, ctx.offset, `${ctx.path}.itemListElement[${i}]: name required`);
    }
    if (!isHttpsUrl(it['item'])) {
      record(ctx.file, ctx.offset, `${ctx.path}.itemListElement[${i}]: item must be an https URL`);
    }
  });
}

function validateFaqPage(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  const main = node['mainEntity'];
  if (!Array.isArray(main) || main.length === 0) {
    record(ctx.file, ctx.offset, `${ctx.path}: mainEntity must be a non-empty array`);
    return;
  }
  main.forEach((q, i) => {
    if (!isPlainObject(q)) {
      record(ctx.file, ctx.offset, `${ctx.path}.mainEntity[${i}]: must be an object`);
      return;
    }
    if (q['@type'] !== 'Question') {
      record(ctx.file, ctx.offset, `${ctx.path}.mainEntity[${i}]: @type must be "Question"`);
    }
    if (!isNonEmptyString(q['name'])) {
      record(ctx.file, ctx.offset, `${ctx.path}.mainEntity[${i}]: name (question text) required`);
    }
    const a = q['acceptedAnswer'];
    if (!isPlainObject(a) || a['@type'] !== 'Answer' || !isNonEmptyString(a['text'])) {
      record(
        ctx.file,
        ctx.offset,
        `${ctx.path}.mainEntity[${i}]: acceptedAnswer must be { @type: "Answer", text: string }`,
      );
    }
  });
}

function validateWebPage(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  ensureField(node, 'url', isHttpsUrl, 'absolute https URL', ctx);
  ensureField(node, 'name', isNonEmptyString, 'non-empty string', ctx);
  ensureField(node, 'description', isNonEmptyString, 'non-empty string', ctx);
}

function validateService(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  ensureField(node, 'serviceType', isNonEmptyString, 'non-empty string', ctx);
  if (!isPlainObject(node['provider'])) {
    record(ctx.file, ctx.offset, `${ctx.path}: provider must be an object`);
  }
  if (
    node['areaServed'] !== undefined &&
    !Array.isArray(node['areaServed']) &&
    !isPlainObject(node['areaServed'])
  ) {
    record(ctx.file, ctx.offset, `${ctx.path}: areaServed must be an object or array of objects`);
  }
}

function validateItemList(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  const items = node['itemListElement'];
  if (!Array.isArray(items) || items.length === 0) {
    record(ctx.file, ctx.offset, `${ctx.path}: itemListElement must be a non-empty array`);
    return;
  }
  items.forEach((it, i) => {
    if (!isPlainObject(it)) {
      record(ctx.file, ctx.offset, `${ctx.path}.itemListElement[${i}]: must be an object`);
      return;
    }
    if (it['@type'] === 'Review') {
      if (!isNonEmptyString(it['reviewBody']) && !isNonEmptyString(it['description'])) {
        record(ctx.file, ctx.offset, `${ctx.path}.itemListElement[${i}]: Review needs reviewBody`);
      }
      const author = it['author'];
      if (
        !isPlainObject(author) ||
        (author['@type'] !== 'Person' && author['@type'] !== 'Organization')
      ) {
        record(
          ctx.file,
          ctx.offset,
          `${ctx.path}.itemListElement[${i}]: Review.author must be Person or Organization`,
        );
      }
      const rating = it['reviewRating'];
      if (
        !isPlainObject(rating) ||
        rating['@type'] !== 'Rating' ||
        (typeof rating['ratingValue'] !== 'number' && !isNonEmptyString(rating['ratingValue']))
      ) {
        record(
          ctx.file,
          ctx.offset,
          `${ctx.path}.itemListElement[${i}]: Review.reviewRating must include numeric ratingValue`,
        );
      }
    }
  });
}

function validateNode(
  node: Record<string, unknown>,
  ctx: { file: string; offset: number; path: string },
): void {
  if (node['@context'] === undefined) {
    record(ctx.file, ctx.offset, `${ctx.path}: missing "@context"`);
  } else if (typeof node['@context'] === 'string' && !/schema\.org/.test(node['@context'])) {
    record(
      ctx.file,
      ctx.offset,
      `${ctx.path}: @context should reference schema.org; got ${String(node['@context'])}`,
    );
  }

  const types = getTypes(node);
  if (types.length === 0) {
    record(ctx.file, ctx.offset, `${ctx.path}: missing "@type"`);
    return;
  }

  // Dispatch based on the primary type — pick the most specific known check.
  const typeSet = new Set(types);
  if (
    typeSet.has('LocalBusiness') ||
    typeSet.has('AutomotiveBusiness') ||
    typeSet.has('AutoDealer')
  ) {
    validateLocalBusiness(node, ctx);
  }
  if (typeSet.has('BreadcrumbList')) validateBreadcrumb(node, ctx);
  if (typeSet.has('FAQPage')) validateFaqPage(node, ctx);
  if (typeSet.has('WebPage')) validateWebPage(node, ctx);
  if (typeSet.has('Service')) validateService(node, ctx);
  if (typeSet.has('ItemList')) validateItemList(node, ctx);
}

function validateRoot(parsed: unknown, ctx: { file: string; offset: number }): void {
  if (Array.isArray(parsed)) {
    parsed.forEach((entry, i) => {
      if (!isPlainObject(entry)) {
        record(ctx.file, ctx.offset, `[${i}]: top-level array entry must be an object`);
        return;
      }
      validateNode(entry, { ...ctx, path: `[${i}]` });
    });
    return;
  }
  if (!isPlainObject(parsed)) {
    record(ctx.file, ctx.offset, 'JSON-LD root must be an object or array of objects');
    return;
  }
  if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
    (parsed['@graph'] as unknown[]).forEach((entry, i) => {
      if (!isPlainObject(entry)) {
        record(ctx.file, ctx.offset, `@graph[${i}]: must be an object`);
        return;
      }
      validateNode(entry, { ...ctx, path: `@graph[${i}]` });
    });
    return;
  }
  validateNode(parsed, { ...ctx, path: 'root' });
}

function extractJsonLdBlocks(html: string): { offset: number; raw: string }[] {
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const out: { offset: number; raw: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push({ offset: m.index, raw: m[1]! });
  }
  return out;
}

async function listHtml(): Promise<string[]> {
  const out: string[] = [];
  const top = await readdir(repoRoot, { withFileTypes: true });
  for (const e of top) {
    if (e.isFile() && e.name.endsWith('.html')) out.push(e.name);
  }
  const placemarks = await readdir(resolve(repoRoot, 'placemarks'), { withFileTypes: true });
  for (const e of placemarks) {
    if (e.isFile() && e.name.endsWith('.html')) out.push(`placemarks/${e.name}`);
  }
  const blog = await readdir(resolve(repoRoot, 'blog'), { withFileTypes: true }).catch(() => []);
  for (const e of blog) {
    if (e.isFile() && e.name.endsWith('.html')) out.push(`blog/${e.name}`);
  }
  return out.sort();
}

async function main(): Promise<void> {
  const files = await listHtml();
  for (const rel of files) {
    filesChecked += 1;
    const html = await readFile(resolve(repoRoot, rel), 'utf8');
    const blocks = extractJsonLdBlocks(html);
    if (blocks.length === 0) {
      record(rel, 0, 'no JSON-LD blocks found');
      continue;
    }
    for (const block of blocks) {
      scriptsChecked += 1;
      let parsed: unknown;
      try {
        parsed = JSON.parse(block.raw);
      } catch (err) {
        record(rel, block.offset, `invalid JSON: ${(err as Error).message}`);
        continue;
      }
      validateRoot(parsed, { file: rel, offset: block.offset });
    }
  }

  console.info(`Validated ${scriptsChecked} JSON-LD blocks across ${filesChecked} files.`);

  if (issues.length === 0) {
    console.info('All schema blocks valid.');
    return;
  }
  console.error(`\n${issues.length} issue(s) found:`);
  for (const issue of issues) {
    console.error(`  ${issue.file}@${issue.offset}: ${issue.message}`);
  }
  process.exit(1);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
