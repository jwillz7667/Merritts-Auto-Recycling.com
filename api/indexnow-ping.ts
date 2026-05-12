/**
 * IndexNow ping endpoint.
 *
 *  POST /api/indexnow-ping
 *    Authorization: Bearer <INDEXNOW_KEY>
 *    Body (optional): { "urls": ["https://merritts-auto-recycling.com/contact", ...] }
 *
 *  - If `urls` is provided, those URLs are forwarded to IndexNow.
 *  - Otherwise, every URL from /sitemap.xml is forwarded.
 *
 *  This endpoint:
 *    1. Validates the bearer token against $INDEXNOW_KEY (fast-fail if env missing).
 *    2. Loads sitemap.xml from the same host so the ping always uses canonical URLs.
 *    3. POSTs the batch to https://api.indexnow.org/indexnow.
 *
 *  Trigger this from a Vercel deploy hook (or `curl`) after each production deploy.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

const SITE_HOST = 'merritts-auto-recycling.com';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const Body = z.object({
  urls: z.array(z.string().url()).max(10_000).optional(),
});

function readBearer(req: VercelRequest): string | null {
  const auth = req.headers.authorization;
  if (typeof auth !== 'string') return null;
  const match = /^Bearer\s+(.+)$/i.exec(auth.trim());
  return match ? match[1]!.trim() : null;
}

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE_ORIGIN}/sitemap.xml`, {
    headers: { 'user-agent': 'merritts-indexnow/1.0' },
  });
  if (!res.ok) {
    throw new Error(`sitemap fetch failed: ${res.status}`);
  }
  const xml = await res.text();
  const urls: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const loc = m[1]!.trim();
    if (loc.startsWith(SITE_ORIGIN)) urls.push(loc);
  }
  return urls;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const key = process.env.INDEXNOW_KEY;
  if (!key || !/^[A-Za-z0-9]{8,128}$/.test(key)) {
    res.status(500).json({ ok: false, error: 'indexnow_key_not_configured' });
    return;
  }

  const token = readBearer(req);
  if (!token || token !== key) {
    res.status(401).json({ ok: false, error: 'unauthorized' });
    return;
  }

  const parsed = Body.safeParse(
    typeof req.body === 'string' ? safeJson(req.body) : (req.body ?? {}),
  );
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: 'invalid_body', issues: parsed.error.issues });
    return;
  }

  let urlList: string[];
  try {
    urlList =
      parsed.data.urls && parsed.data.urls.length > 0 ? parsed.data.urls : await fetchSitemapUrls();
  } catch (err) {
    res
      .status(502)
      .json({ ok: false, error: 'sitemap_fetch_failed', detail: (err as Error).message });
    return;
  }

  const onHost = urlList.filter((u) => u.startsWith(SITE_ORIGIN));
  if (onHost.length === 0) {
    res.status(400).json({ ok: false, error: 'no_eligible_urls' });
    return;
  }

  const payload = {
    host: SITE_HOST,
    key,
    keyLocation: `${SITE_ORIGIN}/indexnow-key-${key}.txt`,
    urlList: onHost,
  };

  const pingRes = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const detail = await pingRes.text().catch(() => '');
  if (!pingRes.ok && pingRes.status !== 202) {
    console.error('indexnow.failed', pingRes.status, detail);
    res.status(502).json({
      ok: false,
      error: 'indexnow_rejected',
      status: pingRes.status,
      detail: detail.slice(0, 500),
    });
    return;
  }

  res.status(200).json({ ok: true, submitted: onHost.length, status: pingRes.status });
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
