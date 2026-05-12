#!/usr/bin/env tsx
/**
 * Build-time substitution of public env-var placeholders into HTML.
 *
 * Why: Cloudflare Turnstile site keys and Google Maps JS keys must be present in client HTML
 * (they're inherently public). To keep the repo free of any project-specific credentials, the
 * HTML carries opaque placeholders. This script swaps them with values from the build env
 * before deploy.
 *
 * Triggers:
 *   - Locally:   `npm run build:env` (after sourcing .env)
 *   - On Vercel: invoked by `vercel-build` after `npm run build`
 *
 * Behavior:
 *   - For each placeholder, if the corresponding env var is set, every HTML file gets the
 *     replacement applied in-place.
 *   - If the env var is missing, the script exits non-zero — a deploy with no Turnstile key
 *     would ship a non-working form, which we'd rather catch in CI than at runtime.
 *   - Already-substituted pages are detected via the absence of the placeholder; re-runs are
 *     no-ops (idempotent).
 */

import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { repoRoot } from './_lib/data.mts';

type Substitution = {
  placeholder: string;
  envVar: string;
  required: boolean;
};

const SUBSTITUTIONS: Substitution[] = [
  { placeholder: '__TURNSTILE_SITE_KEY__', envVar: 'TURNSTILE_SITE_KEY', required: true },
  { placeholder: '__GOOGLE_MAPS_API_KEY__', envVar: 'GOOGLE_MAPS_API_KEY', required: false },
];

async function collectHtmlFiles(): Promise<string[]> {
  const top = await readdir(repoRoot, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of top) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(resolve(repoRoot, entry.name));
    }
  }
  const placemarksDir = resolve(repoRoot, 'placemarks');
  const placemarks = await readdir(placemarksDir);
  for (const name of placemarks) {
    if (name.endsWith('.html')) out.push(join(placemarksDir, name));
  }
  return out;
}

function escapeForRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function applyToFile(path: string, applied: Map<string, string>): Promise<boolean> {
  const raw = await readFile(path, 'utf8');
  let out = raw;
  for (const [placeholder, value] of applied) {
    const re = new RegExp(escapeForRegex(placeholder), 'g');
    out = out.replace(re, value);
  }
  if (out === raw) return false;
  await writeFile(path, out, 'utf8');
  return true;
}

async function main(): Promise<void> {
  const applied = new Map<string, string>();
  const missing: string[] = [];

  for (const sub of SUBSTITUTIONS) {
    const value = process.env[sub.envVar];
    if (value && value.length > 0) {
      applied.set(sub.placeholder, value);
    } else if (sub.required) {
      missing.push(sub.envVar);
    }
  }

  if (missing.length > 0) {
    console.error(
      `apply-env: required env vars missing — refusing to build:\n  ${missing.join('\n  ')}`,
    );
    process.exit(1);
  }

  if (applied.size > 0) {
    const files = await collectHtmlFiles();
    let changed = 0;
    for (const file of files) {
      const wasChanged = await applyToFile(file, applied);
      if (wasChanged) changed += 1;
    }
    console.log(
      `apply-env: substituted ${applied.size} placeholder(s) across ${changed}/${files.length} HTML file(s).`,
    );
  } else {
    console.log('apply-env: no public placeholders to substitute.');
  }

  await writeIndexNowKey();
}

/**
 * IndexNow requires that the verification key be reachable at `https://<host>/<key>.txt`,
 * with the file contents equal to the key string. The key is opaque (alphanumeric, 8–128
 * chars), so it can't live in a fixed path. We write it at build time from $INDEXNOW_KEY.
 *
 * Existing `/indexnow-key-*.txt` files left over from previous keys are deleted so the
 * site never advertises stale verification material.
 */
async function writeIndexNowKey(): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  const entries = await readdir(repoRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && /^indexnow-key-[A-Za-z0-9]+\.txt$/.test(entry.name)) {
      if (!key || entry.name !== `indexnow-key-${key}.txt`) {
        await unlink(resolve(repoRoot, entry.name));
        console.log(`apply-env: removed stale IndexNow key file ${entry.name}`);
      }
    }
  }
  if (!key) {
    console.log('apply-env: INDEXNOW_KEY not set — skipping IndexNow key file.');
    return;
  }
  if (!/^[A-Za-z0-9]{8,128}$/.test(key)) {
    console.error('apply-env: INDEXNOW_KEY must be alphanumeric, 8–128 chars. Refusing to write.');
    process.exit(1);
  }
  const path = resolve(repoRoot, `indexnow-key-${key}.txt`);
  await writeFile(path, key, 'utf8');
  console.log(`apply-env: wrote IndexNow verification file indexnow-key-${key}.txt`);
}

main().catch((err: unknown) => {
  console.error('apply-env: failed', err);
  process.exit(1);
});
