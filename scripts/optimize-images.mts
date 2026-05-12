#!/usr/bin/env tsx
/**
 * Image optimization pipeline.
 *
 * For every source image under `images/` (excluding `images/favicon/` and `images/optimized/`):
 *   1. Compute the natural dimensions.
 *   2. Resize down to a sensible max width for its role (or 1920px if unknown).
 *   3. Emit `.webp` (quality 80) and `.avif` (quality 55) siblings into `images/optimized/`.
 *   4. Re-encode the source format with mozjpeg/oxipng-equivalent settings, also written to
 *      `images/optimized/` so the original tree is left untouched (safer for incremental runs).
 *   5. Write `images/optimized/manifest.json` mapping source path → variants + intrinsic dims.
 *
 * Idempotent: outputs are timestamp-compared against inputs — only regenerated when stale.
 */

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';

import sharp from 'sharp';

import { repoRoot } from './_lib/data.mts';

type Role = {
  pattern: RegExp;
  maxWidth: number;
  jpegQuality?: number;
  webpQuality?: number;
  avifQuality?: number;
};

const ROLES: Role[] = [
  { pattern: /\/slider\/slide\d+\.(jpe?g|png)$/i, maxWidth: 1920, jpegQuality: 80 },
  { pattern: /\/footer-tow-truck\.(jpe?g|png)$/i, maxWidth: 1600, jpegQuality: 78 },
  {
    pattern: /\/logo-green\.png$/i,
    maxWidth: 720,
    jpegQuality: 85,
    webpQuality: 90,
    avifQuality: 70,
  },
  {
    pattern: /\/(testimonial|block-bg|header-photo-bg|tabform-bg|coupon-bg)/i,
    maxWidth: 1920,
    jpegQuality: 78,
  },
  { pattern: /\/how-works-img-\d+\.(jpe?g|png)$/i, maxWidth: 760, jpegQuality: 82 },
  { pattern: /\/banner-key\.png$/i, maxWidth: 800 },
  { pattern: /\/(grey-bg|border-(hor|vert)|banner-bg)\.png$/i, maxWidth: 1600 },
  { pattern: /\/img-car-move\.png$/i, maxWidth: 1200 },
];

function roleFor(file: string): Role {
  for (const r of ROLES) {
    if (r.pattern.test(file)) return r;
  }
  return { pattern: /./, maxWidth: 1600 };
}

async function walk(dir: string, skip: (path: string) => boolean): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skip(full)) continue;
      out.push(...(await walk(full, skip)));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

async function isStale(input: string, output: string): Promise<boolean> {
  try {
    const [a, b] = await Promise.all([stat(input), stat(output)]);
    return a.mtimeMs > b.mtimeMs;
  } catch {
    return true;
  }
}

type ManifestEntry = {
  source: string;
  width: number;
  height: number;
  variants: {
    type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
    path: string;
    width: number;
    height: number;
    bytes: number;
  }[];
};

async function main(): Promise<void> {
  const imagesDir = resolve(repoRoot, 'images');
  const optimizedDir = resolve(imagesDir, 'optimized');
  await mkdir(optimizedDir, { recursive: true });

  const skip = (p: string): boolean =>
    p.endsWith('/optimized') ||
    p.endsWith('/favicon') ||
    p.endsWith('/optimized/') ||
    p.endsWith('/favicon/');

  const all = await walk(imagesDir, skip);
  const sources = all.filter((p) => /\.(jpe?g|png)$/i.test(p));

  const manifest: Record<string, ManifestEntry> = {};
  let processed = 0;
  let skipped = 0;

  for (const src of sources) {
    const rel = relative(imagesDir, src);
    const role = roleFor(src);

    const meta = await sharp(src).metadata();
    const srcWidth = meta.width ?? role.maxWidth;
    const srcHeight = meta.height ?? Math.round(role.maxWidth * 0.6);

    const outWidth = Math.min(srcWidth, role.maxWidth);
    const outHeight = Math.round((outWidth / srcWidth) * srcHeight);

    const ext = extname(src).toLowerCase();
    const baseRel = rel.replace(/\.(jpe?g|png)$/i, '');
    const outJpgPath = resolve(
      optimizedDir,
      `${baseRel}${ext === '.png' && /transparent|logo|car-move|banner-key|grey-bg|border|banner-bg/.test(rel) ? '.png' : '.jpg'}`,
    );
    const outWebpPath = resolve(optimizedDir, `${baseRel}.webp`);
    const outAvifPath = resolve(optimizedDir, `${baseRel}.avif`);

    await mkdir(dirname(outJpgPath), { recursive: true });

    const needsAny =
      (await isStale(src, outJpgPath)) ||
      (await isStale(src, outWebpPath)) ||
      (await isStale(src, outAvifPath));

    if (!needsAny) {
      skipped += 1;
    } else {
      const pipeline = sharp(src).resize({ width: outWidth, withoutEnlargement: true });

      const isPng = outJpgPath.endsWith('.png');
      if (isPng) {
        await pipeline.clone().png({ compressionLevel: 9, palette: true }).toFile(outJpgPath);
      } else {
        await pipeline
          .clone()
          .jpeg({ quality: role.jpegQuality ?? 80, mozjpeg: true, progressive: true })
          .toFile(outJpgPath);
      }
      await pipeline
        .clone()
        .webp({ quality: role.webpQuality ?? 80, effort: 5 })
        .toFile(outWebpPath);
      await pipeline
        .clone()
        .avif({ quality: role.avifQuality ?? 55, effort: 5 })
        .toFile(outAvifPath);

      processed += 1;
      console.info(`  ✓ ${rel}  →  ${outWidth}px`);
    }

    const [jStat, wStat, aStat] = await Promise.all([
      stat(outJpgPath),
      stat(outWebpPath),
      stat(outAvifPath),
    ]);

    manifest[rel] = {
      source: rel,
      width: outWidth,
      height: outHeight,
      variants: [
        {
          type: outJpgPath.endsWith('.png') ? 'image/png' : 'image/jpeg',
          path: `images/optimized/${baseRel}${outJpgPath.endsWith('.png') ? '.png' : '.jpg'}`,
          width: outWidth,
          height: outHeight,
          bytes: jStat.size,
        },
        {
          type: 'image/webp',
          path: `images/optimized/${baseRel}.webp`,
          width: outWidth,
          height: outHeight,
          bytes: wStat.size,
        },
        {
          type: 'image/avif',
          path: `images/optimized/${baseRel}.avif`,
          width: outWidth,
          height: outHeight,
          bytes: aStat.size,
        },
      ],
    };
  }

  const manifestPath = resolve(optimizedDir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.info(
    `Done. ${processed} regenerated, ${skipped} skipped. Manifest: ${relative(repoRoot, manifestPath)}`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
