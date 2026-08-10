#!/usr/bin/env tsx
/**
 * Apply Phase 3 performance transforms to every page:
 *   - Remove the full-fat Google Fonts <link> (loads 7 weights × italic) and replace with a
 *     defer-loaded `display=swap` stylesheet for the 3 weights actually used.
 *   - Inject LCP preload tags for the hero slider's first slide.
 *   - Defer every local plugin/custom script (jQuery stays sync — plugins depend on $).
 *   - Strip the legacy `#loader-wrapper` splash and its body.loaded gate.
 *
 * Idempotent.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { repoRoot } from './_lib/data.mts';
import {
  deferLocalScripts,
  deferGoogleTagManager,
  improveLegacyAccessibility,
  injectFontStylesheet,
  injectLcpPreload,
  lazyLoadMapIframes,
  lazyLoadTurnstile,
  pruneUnusedPageAssets,
  removeGoogleFontsLink,
  removeLoaderSplash,
} from './_lib/transform.mts';

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
  const blog = await readdir(resolve(repoRoot, 'blog'), { withFileTypes: true });
  for (const e of blog) {
    if (e.isFile() && e.name.endsWith('.html')) out.push(`blog/${e.name}`);
  }
  return out;
}

async function main(): Promise<void> {
  const files = await listHtml();
  let touched = 0;
  for (const rel of files) {
    const fullPath = resolve(repoRoot, rel);
    const original = await readFile(fullPath, 'utf8');

    let next = original;
    next = deferGoogleTagManager(next);
    next = lazyLoadTurnstile(next);
    next = removeGoogleFontsLink(next);
    next = injectFontStylesheet(next);
    next = injectLcpPreload(next);
    next = lazyLoadMapIframes(next);
    next = improveLegacyAccessibility(next);
    next = pruneUnusedPageAssets(next);
    next = deferLocalScripts(next);
    next = removeLoaderSplash(next);

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
