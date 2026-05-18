import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ZodError, type ZodSchema } from 'zod';

import { sendFormEmail } from './email.js';
import { env } from './env.js';
import { verifyTurnstile } from './turnstile.js';

/**
 * Per-IP token bucket. NOT durable — serverless cold starts reset state. With Turnstile this
 * is acceptable belt-and-braces: it stops a single warm instance from being hammered.
 */
const MAX_TOKENS = 6;
const REFILL_PER_SECOND = MAX_TOKENS / 60;
const buckets = new Map<string, { tokens: number; updatedAt: number }>();

function takeToken(ip: string): boolean {
  const now = Date.now();
  const prev = buckets.get(ip) ?? { tokens: MAX_TOKENS, updatedAt: now };
  const elapsed = (now - prev.updatedAt) / 1000;
  const refilled = Math.min(MAX_TOKENS, prev.tokens + elapsed * REFILL_PER_SECOND);
  if (refilled < 1) {
    buckets.set(ip, { tokens: refilled, updatedAt: now });
    return false;
  }
  buckets.set(ip, { tokens: refilled - 1, updatedAt: now });
  return true;
}

function originAllowed(req: VercelRequest): boolean {
  if (env.NODE_ENV !== 'production') return true;
  const origin = req.headers.origin ?? '';
  const allowed = env.ALLOWED_ORIGIN ?? 'https://merritts-auto-recycling.com';
  // Same-origin requests sent via fetch with credentials="same-origin" usually omit Origin
  // for same-doc XHR; treat missing-origin as same-origin (browser policy) and accept.
  if (!origin) return true;
  return origin === allowed;
}

function readClientIp(req: VercelRequest): string {
  const xfwd = req.headers['x-forwarded-for'];
  if (Array.isArray(xfwd)) return (xfwd[0] ?? '').split(',')[0]!.trim();
  if (typeof xfwd === 'string') return xfwd.split(',')[0]!.trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

function readBody(req: VercelRequest): Record<string, unknown> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    const ct = String(req.headers['content-type'] ?? '');
    if (ct.includes('application/json')) return JSON.parse(req.body) as Record<string, unknown>;
    if (ct.includes('application/x-www-form-urlencoded')) {
      return Object.fromEntries(new URLSearchParams(req.body));
    }
  }
  return {};
}

export type HandlerRequestMeta = {
  ip: string;
  userAgent: string | undefined;
  referer: string | undefined;
  receivedAt: Date;
};

export function createFormHandler<S extends ZodSchema>(opts: {
  schema: S;
  formType: 'contact' | 'appointment' | 'quote';
  /**
   * Optional override for the "what to do with the validated payload" step. When provided, this
   * runs INSTEAD of `sendFormEmail` so endpoints with bespoke email semantics can reuse the
   * rate-limit / origin / Turnstile / validation pipeline without duplicating it.
   *
   * The handler still owns response codes: throwing here yields a 502 to the client, matching
   * the existing failure mode for email sends.
   */
  onValidPayload?: (payload: ReturnType<S['parse']>, meta: HandlerRequestMeta) => Promise<void>;
}) {
  return async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({ ok: false, error: 'method_not_allowed' });
      return;
    }
    if (!originAllowed(req)) {
      res.status(403).json({ ok: false, error: 'forbidden_origin' });
      return;
    }

    const ip = readClientIp(req);
    if (!takeToken(ip)) {
      res.status(429).json({ ok: false, error: 'rate_limited' });
      return;
    }

    let raw: Record<string, unknown>;
    try {
      raw = readBody(req);
    } catch {
      res.status(400).json({ ok: false, error: 'invalid_body' });
      return;
    }

    let payload: ReturnType<S['parse']>;
    try {
      payload = opts.schema.parse(raw) as ReturnType<S['parse']>;
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of err.issues) {
          const key = issue.path.join('.') || '_';
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        res.status(400).json({ ok: false, error: 'validation_failed', fields: fieldErrors });
        return;
      }
      throw err;
    }

    const turnstileToken = (payload as Record<string, unknown>)['cf-turnstile-response'] as string;
    const turnstileOk = await verifyTurnstile(turnstileToken, ip === 'unknown' ? undefined : ip);
    if (!turnstileOk) {
      res.status(403).json({ ok: false, error: 'turnstile_failed' });
      return;
    }

    const meta: HandlerRequestMeta = {
      ip,
      userAgent: req.headers['user-agent'] ?? undefined,
      referer: req.headers.referer ?? undefined,
      receivedAt: new Date(),
    };

    try {
      if (opts.onValidPayload) {
        await opts.onValidPayload(payload, meta);
      } else {
        const fields: Record<string, string | undefined> = {};
        for (const [k, v] of Object.entries(payload as Record<string, unknown>)) {
          if (k === 'honeypot' || k === 'cf-turnstile-response') continue;
          fields[k] = v === null || v === undefined ? undefined : String(v);
        }
        await sendFormEmail({
          formType: opts.formType,
          fields,
          ip: meta.ip,
          userAgent: meta.userAgent,
          referer: meta.referer,
          receivedAt: meta.receivedAt,
        });
      }
    } catch (err) {
      console.error('handler.send.failed', (err as Error).message);
      res.status(502).json({ ok: false, error: 'send_failed' });
      return;
    }

    res.status(200).json({ ok: true });
  };
}
