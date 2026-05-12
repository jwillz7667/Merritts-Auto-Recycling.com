#!/usr/bin/env tsx
/**
 * Rewrite every HTML page to use:
 *   - <picture> with AVIF + WebP + JPEG/PNG fallback for every <img> referencing /images/<name>
 *   - explicit width/height attributes (CLS prevention)
 *   - loading="lazy" decoding="async" for below-the-fold images
 *   - fetchpriority="high" for the LCP candidate (first slider slide) and the logo
 *   - inline `background-image: url(...)` rewritten to the optimized JPG/PNG (resize wins are
 *     huge even without modern formats; backgrounds keep working everywhere)
 *
 * Reads `images/optimized/manifest.json` (built by `optimize-images.mts`) for variant URLs
 * and intrinsic dimensions.
 *
 * Idempotent: an <img> already wrapped in <picture> with optimized sources is skipped. The
 * detection key is the trailing-slug filename (e.g., `logo-green`), so this works whether the
 * <img> is in a top-level page (`images/logo-green.png`) or a placemark (`../images/...`).
 */

import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';

import { repoRoot } from './_lib/data.mts';

type ManifestEntry = {
  source: string;
  width: number;
  height: number;
  variants: { type: string; path: string; width: number; height: number; bytes: number }[];
};

type Manifest = Record<string, ManifestEntry>;

type AltMap = Record<string, string>;

const SITE_ROOT_ABSOLUTE = '/'; // serve optimized assets via absolute root path

const LCP_FILES = new Set(['slide1', 'logo-green']);

async function loadManifest(): Promise<Manifest> {
  const raw = await readFile(resolve(repoRoot, 'images', 'optimized', 'manifest.json'), 'utf8');
  return JSON.parse(raw) as Manifest;
}

async function loadAltMap(): Promise<AltMap> {
  try {
    const raw = await readFile(resolve(repoRoot, 'data', 'image-alts.json'), 'utf8');
    const parsed = JSON.parse(raw) as { alts?: AltMap };
    return parsed.alts ?? {};
  } catch {
    return {};
  }
}

function altKeyForManifestKey(manifestKey: string): string {
  return manifestKey.replace(/\.(jpg|jpeg|png|webp|avif|svg)$/i, '');
}

function manifestKeyForSrc(src: string): string | null {
  let cleaned = src
    .replace(/^\.\.\//, '')
    .replace(/^\.\//, '')
    .replace(/^\//, '');
  if (cleaned.startsWith('images/optimized/')) {
    cleaned = cleaned.slice('images/optimized/'.length);
    return cleaned.replace(/\.(webp|avif)$/i, (m) =>
      m.toLowerCase() === '.webp' || m.toLowerCase() === '.avif' ? '.jpg' : m,
    );
  }
  if (!cleaned.startsWith('images/')) return null;
  return cleaned.slice('images/'.length);
}

function buildPicture(
  manifestEntry: ManifestEntry,
  altText: string,
  options: {
    className?: string;
    isLcp: boolean;
    extraAttrs?: string;
  },
): string {
  const sources = manifestEntry.variants;
  const avif = sources.find((s) => s.type === 'image/avif');
  const webp = sources.find((s) => s.type === 'image/webp');
  const fallback = sources.find((s) => s.type === 'image/jpeg' || s.type === 'image/png')!;

  const loading = options.isLcp ? '' : ' loading="lazy"';
  const decoding = ' decoding="async"';
  const fetchpriority = options.isLcp ? ' fetchpriority="high"' : '';
  const cls = options.className ? ` class="${options.className}"` : '';
  const extras = options.extraAttrs ? ` ${options.extraAttrs}` : '';

  const escapedAlt = altText.replace(/"/g, '&quot;');

  return (
    `<picture>` +
    (avif ? `<source type="image/avif" srcset="${SITE_ROOT_ABSOLUTE}${avif.path}">` : '') +
    (webp ? `<source type="image/webp" srcset="${SITE_ROOT_ABSOLUTE}${webp.path}">` : '') +
    `<img${cls} src="${SITE_ROOT_ABSOLUTE}${fallback.path}" alt="${escapedAlt}" width="${fallback.width}" height="${fallback.height}"${loading}${decoding}${fetchpriority}${extras}>` +
    `</picture>`
  );
}

function rewriteImgTags(html: string, manifest: Manifest, altMap: AltMap): string {
  return html.replace(/<img\b([^>]*?)>/gi, (match, attrsRaw: string) => {
    if (/\/favicon\//i.test(attrsRaw)) return match;

    const attrs = attrsRaw;
    const srcMatch = /\bsrc="([^"]+)"/i.exec(attrs);
    if (!srcMatch) return match;
    const src = srcMatch[1]!;

    // Already optimized — leave alone (idempotency)
    if (/(?:^|\/)images\/optimized\//.test(src)) return match;

    const key = manifestKeyForSrc(src);
    if (!key || !manifest[key]) return match;

    const altMatch = /\balt="([^"]*)"/i.exec(attrs);
    const existingAlt = altMatch?.[1] ?? '';
    const altKey = altKeyForManifestKey(key);
    const altText = existingAlt.trim() !== '' ? existingAlt : (altMap[altKey] ?? '');

    const classMatch = /\bclass="([^"]*)"/i.exec(attrs);
    const className = classMatch?.[1];

    const idMatch = /\bid="([^"]+)"/i.exec(attrs);
    const styleMatch = /\bstyle="([^"]*)"/i.exec(attrs);

    const baseName = basename(key).replace(extname(key), '');
    const isLcp = LCP_FILES.has(baseName);

    const extraAttrs: string[] = [];
    if (idMatch) extraAttrs.push(`id="${idMatch[1]}"`);
    if (styleMatch) extraAttrs.push(`style="${styleMatch[1]}"`);

    return buildPicture(manifest[key], altText, {
      ...(className !== undefined ? { className } : {}),
      isLcp,
      extraAttrs: extraAttrs.join(' '),
    });
  });
}

/**
 * Backfill alt text on already-optimized `<picture>` blocks where the inner `<img alt="">` is
 * empty. Skips imgs that already have non-empty alt; idempotent on repeat runs.
 */
function backfillAltOnOptimizedImgs(html: string, altMap: AltMap): string {
  return html.replace(/<img\b([^>]*?)>/gi, (match, attrsRaw: string) => {
    if (/\/favicon\//i.test(attrsRaw)) return match;
    const srcMatch = /\bsrc="([^"]+)"/i.exec(attrsRaw);
    if (!srcMatch) return match;
    const src = srcMatch[1]!;
    if (!/(?:^|\/)images\/optimized\//.test(src)) return match;

    const altMatch = /\balt="([^"]*)"/i.exec(attrsRaw);
    if (!altMatch) return match;
    const existing = altMatch[1] ?? '';
    if (existing.trim() !== '') return match;

    const baseKey = src
      .replace(/^.*\/images\/optimized\//, '')
      .replace(/\.(webp|avif)$/i, (m) =>
        m.toLowerCase() === '.webp' || m.toLowerCase() === '.avif' ? '.jpg' : m,
      );
    const altKey = altKeyForManifestKey(baseKey);
    const replacement = altMap[altKey];
    if (!replacement) return match;

    return match.replace(/alt="[^"]*"/i, `alt="${replacement.replace(/"/g, '&quot;')}"`);
  });
}

/**
 * One-pass repair for HTML that was double-wrapped by an earlier buggy run:
 *
 *   <picture><source ...><source ...><picture><source ...><source ...><img ...></picture></picture>
 *
 * Becomes the inner picture's contents (we drop the outer wrapper and its sources because the
 * inner <img> already points at the optimized fallback). Repeated until no nested <picture> tags
 * remain. Safe to run on clean HTML — does nothing.
 *
 * Implementation: walks `<picture>` opens with explicit depth counting so a separate sibling
 * `<picture>...</picture>` is never confused with a nested one. A previous regex-only version
 * was catastrophically greedy across siblings and destroyed page content.
 */
function flattenNestedPictures(html: string): string {
  const OPEN = '<picture>';
  const CLOSE = '</picture>';

  for (;;) {
    const found = findFirstNestedPicture(html);
    if (!found) return html;
    const { outerStart, outerEnd, innerStart, innerEnd } = found;
    html = html.slice(0, outerStart) + html.slice(innerStart, innerEnd) + html.slice(outerEnd);
    void OPEN;
    void CLOSE;
  }
}

function findFirstNestedPicture(
  html: string,
): { outerStart: number; outerEnd: number; innerStart: number; innerEnd: number } | null {
  const OPEN = '<picture>';
  const CLOSE = '</picture>';
  let searchFrom = 0;
  while (searchFrom < html.length) {
    const outerStart = html.indexOf(OPEN, searchFrom);
    if (outerStart === -1) return null;
    const outerInnerScanStart = outerStart + OPEN.length;
    const nextClose = html.indexOf(CLOSE, outerInnerScanStart);
    if (nextClose === -1) return null;
    const nextOpen = html.indexOf(OPEN, outerInnerScanStart);
    if (nextOpen !== -1 && nextOpen < nextClose) {
      // Truly nested: outerStart has an inner <picture> before its own </picture>.
      const innerStart = nextOpen;
      const innerClose = html.indexOf(CLOSE, innerStart + OPEN.length);
      if (innerClose === -1) return null;
      const innerEnd = innerClose + CLOSE.length;
      const outerEnd = (() => {
        // Find the matching outer </picture> by depth counting from outerStart.
        let depth = 1;
        let cursor = outerInnerScanStart;
        while (cursor < html.length) {
          const o = html.indexOf(OPEN, cursor);
          const c = html.indexOf(CLOSE, cursor);
          if (c === -1) return -1;
          if (o !== -1 && o < c) {
            depth++;
            cursor = o + OPEN.length;
          } else {
            depth--;
            cursor = c + CLOSE.length;
            if (depth === 0) return cursor;
          }
        }
        return -1;
      })();
      if (outerEnd === -1) return null;
      return { outerStart, outerEnd, innerStart, innerEnd };
    }
    // Move past this (sibling) <picture> entirely
    searchFrom = nextClose + CLOSE.length;
  }
  return null;
}

function rewriteBackgroundImageInline(html: string, manifest: Manifest): string {
  // Match ONLY the `background-image: url(...)` declaration. We never try to capture the
  // optional trailing `image-set(...)` because (a) it's not needed for the substitution and
  // (b) any unbounded `[^)]*` style sub-pattern is one bad backtrack from eating the entire
  // file. Idempotency is enforced by skipping urls already in `images/optimized/`.
  return html.replace(
    /background-image:\s*url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/gi,
    (match, _quote: string, url: string) => {
      if (url.includes('/images/optimized/')) return match;
      const key = manifestKeyForSrc(url);
      if (!key || !manifest[key]) return match;
      const entry = manifest[key];
      const fallback = entry.variants.find(
        (v) => v.type === 'image/jpeg' || v.type === 'image/png',
      );
      if (!fallback) return match;
      const avif = entry.variants.find((v) => v.type === 'image/avif');
      const webp = entry.variants.find((v) => v.type === 'image/webp');

      const fallbackDecl = `background-image: url('${SITE_ROOT_ABSOLUTE}${fallback.path}')`;
      if (!avif && !webp) return fallbackDecl;

      const imageSetItems: string[] = [];
      if (avif) imageSetItems.push(`url('${SITE_ROOT_ABSOLUTE}${avif.path}') type('image/avif')`);
      if (webp) imageSetItems.push(`url('${SITE_ROOT_ABSOLUTE}${webp.path}') type('image/webp')`);
      imageSetItems.push(`url('${SITE_ROOT_ABSOLUTE}${fallback.path}') type('${fallback.type}')`);
      return `${fallbackDecl}; background-image: image-set(${imageSetItems.join(', ')})`;
    },
  );
}

async function main(): Promise<void> {
  const manifest = await loadManifest();
  const altMap = await loadAltMap();

  const files: string[] = [];
  const top = ['index.html', 'contact.html', 'faq.html', 'testimonials.html'];
  for (const f of top) files.push(f);
  const { readdir } = await import('node:fs/promises');
  const placemarkDir = resolve(repoRoot, 'placemarks');
  const placemarks = await readdir(placemarkDir, { withFileTypes: true });
  for (const e of placemarks) {
    if (e.isFile() && e.name.endsWith('.html')) {
      files.push(`placemarks/${e.name}`);
    }
  }

  let touched = 0;
  for (const rel of files) {
    const fullPath = resolve(repoRoot, rel);
    const original = await readFile(fullPath, 'utf8');
    let next = original;
    next = flattenNestedPictures(next);
    next = rewriteImgTags(next, manifest, altMap);
    next = backfillAltOnOptimizedImgs(next, altMap);
    next = rewriteBackgroundImageInline(next, manifest);
    if (next !== original) {
      await writeFile(fullPath, next, 'utf8');
      touched += 1;
      console.info(`  ✓ ${rel}`);
    }
  }
  console.info(`Done. ${touched}/${files.length} files updated.`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
