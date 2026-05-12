#!/usr/bin/env tsx
/**
 * Normalize every internal `.html` link in the repo to its extension-less, root-relative form.
 * Required because Vercel `cleanUrls: true` serves `/contact` (not `/contact.html`) and we want
 * the on-page link graph to match canonical URLs to avoid 301 hops and equity dilution.
 *
 * Rewrites:
 *   href="contact.html"                  → href="/contact"
 *   href="../contact.html"               → href="/contact"
 *   href="./contact.html"                → href="/contact"
 *   href="placemarks/blaine-mn.html"     → href="/placemarks/blaine-mn"
 *   href="../placemarks/blaine-mn.html"  → href="/placemarks/blaine-mn"
 *   href="blaine-mn.html"                → href="/placemarks/blaine-mn"   (placemark→placemark)
 *   href="index.html"                    → href="/"
 *   href="../index.html"                 → href="/"
 *
 * Leaves untouched: external (http(s)://, //, mailto:, tel:, sms:), anchors (#…), data: URIs,
 * commented-out blocks (rough heuristic: lines inside <!-- … --> still get rewritten because
 * comments rot anyway and we'd rather keep the commented and live versions consistent).
 *
 * Idempotent: re-running on already-normalized files produces no change.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { repoRoot } from './_lib/data.mts';

const TOP_LEVEL_PAGES = new Set([
  'index.html',
  'contact.html',
  'faq.html',
  'testimonials.html',
  'about-brad.html',
]);

function cleanUrlForFile(filename: string): string {
  if (filename === 'index.html') return '/';
  return `/${filename.replace(/\.html$/, '')}`;
}

function rewriteHref(href: string, fileLocation: 'top' | 'placemark'): string | null {
  if (!href) return null;
  if (/^(?:[a-z]+:|\/\/|#|data:)/i.test(href)) return null;

  const [pathRaw, hash] = href.split('#');
  if (!pathRaw) return null;
  const path = pathRaw;
  const fragment = hash ? `#${hash}` : '';

  if (path.startsWith('/') && path.endsWith('.html')) {
    const clean = path.replace(/\.html$/, '');
    if (clean === '/index') return `/${fragment}`;
    return `${clean}${fragment}`;
  }

  let stripped = path;
  if (stripped.startsWith('./')) stripped = stripped.slice(2);
  while (stripped.startsWith('../')) stripped = stripped.slice(3);

  if (!stripped.endsWith('.html')) return null;

  const fileBase = stripped.replace(/\.html$/, '');

  if (stripped.startsWith('placemarks/')) {
    return `/${fileBase}${fragment}`;
  }

  if (TOP_LEVEL_PAGES.has(stripped)) {
    if (stripped === 'index.html') return `/${fragment}`;
    return `/${fileBase}${fragment}`;
  }

  if (
    fileLocation === 'placemark' &&
    /^[a-z0-9-]+-mn\.html$|^minnesota\.html$|^hennepin-county-mn\.html$|^sherburne-county-mn\.html$|^wright-county-mn\.html$|^anoka-county-mn\.html$|^mille-lacs-county-mn\.html$/.test(
      stripped,
    )
  ) {
    return `/placemarks/${fileBase}${fragment}`;
  }

  return null;
}

function normalizeFile(html: string, fileLocation: 'top' | 'placemark'): string {
  return html.replace(/\bhref="([^"]*)"/g, (match, href: string) => {
    const next = rewriteHref(href, fileLocation);
    if (next === null) return match;
    return `href="${next}"`;
  });
}

async function listHtmlFiles(): Promise<{ relPath: string; loc: 'top' | 'placemark' }[]> {
  const out: { relPath: string; loc: 'top' | 'placemark' }[] = [];
  const top = await readdir(repoRoot, { withFileTypes: true });
  for (const entry of top) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push({ relPath: entry.name, loc: 'top' });
    }
  }
  const placemarks = await readdir(resolve(repoRoot, 'placemarks'), { withFileTypes: true });
  for (const entry of placemarks) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push({ relPath: `placemarks/${entry.name}`, loc: 'placemark' });
    }
  }
  return out;
}

async function main(): Promise<void> {
  const files = await listHtmlFiles();
  let touched = 0;
  for (const { relPath, loc } of files) {
    const filePath = resolve(repoRoot, relPath);
    const original = await readFile(filePath, 'utf8');
    const next = normalizeFile(original, loc);
    if (next !== original) {
      await writeFile(filePath, next, 'utf8');
      touched += 1;
      console.info(`  ✓ ${relPath}`);
    }
  }
  console.info(`Done. ${touched}/${files.length} files updated.`);
  void cleanUrlForFile;
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
