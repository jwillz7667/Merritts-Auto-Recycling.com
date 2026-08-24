import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';

import { sendLeadEmail, sendQuoteConfirmation, type RequestMeta } from './email.js';
import { getEnv } from './env.js';
import type { ContactPayload, QuotePayload } from './schemas.js';
import { verifyTurnstile } from './turnstile.js';

type FormType = 'contact' | 'quote';
type LeadPayload = ContactPayload | QuotePayload;
type DeliveryResult = { confirmation: 'not_applicable' | 'sent' | 'failed' };

const MAX_BODY_BYTES = 20_000;
const MAX_TOKENS = 6;
const REFILL_PER_SECOND = MAX_TOKENS / 60;
const buckets = new Map<string, { tokens: number; updatedAt: number }>();
const inFlight = new Map<string, Promise<DeliveryResult>>();
const completed = new Map<string, { result: DeliveryResult; expiresAt: number }>();

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
}

function takeToken(ip: string): boolean {
  const now = Date.now();
  if (buckets.size > 1_000) {
    for (const [key, entry] of buckets) {
      if (now - entry.updatedAt > 600_000) buckets.delete(key);
    }
  }
  const previous = buckets.get(ip) ?? { tokens: MAX_TOKENS, updatedAt: now };
  const elapsed = (now - previous.updatedAt) / 1000;
  const tokens = Math.min(MAX_TOKENS, previous.tokens + elapsed * REFILL_PER_SECOND);
  if (tokens < 1) {
    buckets.set(ip, { tokens, updatedAt: now });
    return false;
  }
  buckets.set(ip, { tokens: tokens - 1, updatedAt: now });
  return true;
}

function allowedOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const requestHost = String(req.headers['x-forwarded-host'] ?? req.headers.host ?? '')
      .split(',')[0]
      ?.trim();
    const configured = getEnv().ALLOWED_ORIGIN;
    return (
      originUrl.host === requestHost ||
      origin === configured ||
      origin === 'https://merritts-auto-recycling.com'
    );
  } catch {
    return false;
  }
}

function readBody(req: VercelRequest): Record<string, unknown> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body !== 'string') return {};
  const contentType = String(req.headers['content-type'] ?? '');
  if (contentType.includes('application/json'))
    return JSON.parse(req.body) as Record<string, unknown>;
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(req.body));
  }
  return {};
}

function readIdempotencyKey(req: VercelRequest): string {
  const raw = req.headers['idempotency-key'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value && /^[A-Za-z0-9:_-]{8,200}$/.test(value) ? value : randomUUID();
}

function cleanupCompleted(now: number): void {
  for (const [key, entry] of completed) {
    if (entry.expiresAt <= now) completed.delete(key);
  }
  while (completed.size > 1_000) {
    const oldestKey = completed.keys().next().value;
    if (typeof oldestKey !== 'string') break;
    completed.delete(oldestKey);
  }
}

async function deliverOnce(
  key: string,
  formType: FormType,
  payload: LeadPayload,
  meta: RequestMeta,
): Promise<{ result: DeliveryResult; duplicate: boolean }> {
  const now = Date.now();
  cleanupCompleted(now);
  const prior = completed.get(key);
  if (prior) return { result: prior.result, duplicate: true };

  const existing = inFlight.get(key);
  if (existing) return { result: await existing, duplicate: true };

  const task = (async (): Promise<DeliveryResult> => {
    await sendLeadEmail(formType, payload, meta, key);
    if (formType !== 'quote') return { confirmation: 'not_applicable' };
    try {
      await sendQuoteConfirmation(payload as QuotePayload, key);
      return { confirmation: 'sent' };
    } catch (error) {
      console.error('quote.confirmation.failed', {
        message: error instanceof Error ? error.message : 'unknown',
      });
      return { confirmation: 'failed' };
    }
  })();

  inFlight.set(key, task);
  try {
    const result = await task;
    completed.set(key, { result, expiresAt: now + 86_400_000 });
    return { result, duplicate: false };
  } finally {
    inFlight.delete(key);
  }
}

export function createFormHandler<T extends LeadPayload>(options: {
  formType: FormType;
  schema: ZodType<T>;
}) {
  return async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({ ok: false, error: 'method_not_allowed' });
      return;
    }

    const declaredLength = Number(req.headers['content-length'] ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      res.status(413).json({ ok: false, error: 'body_too_large' });
      return;
    }

    try {
      getEnv();
    } catch (error) {
      console.error('environment.invalid', {
        message: error instanceof Error ? error.message : 'unknown',
      });
      res.status(503).json({ ok: false, error: 'service_unavailable' });
      return;
    }

    if (!allowedOrigin(req)) {
      res.status(403).json({ ok: false, error: 'forbidden_origin' });
      return;
    }

    const ip = clientIp(req);
    if (!takeToken(ip)) {
      res.status(429).json({ ok: false, error: 'rate_limited' });
      return;
    }

    let payload: T;
    try {
      payload = options.schema.parse(readBody(req));
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = issue.path.join('.') || 'form';
          fields[field] ??= issue.message;
        }
        res.status(400).json({ ok: false, error: 'validation_failed', fields });
        return;
      }
      res.status(400).json({ ok: false, error: 'invalid_body' });
      return;
    }

    const token = payload['cf-turnstile-response'];
    if (!(await verifyTurnstile(token, ip === 'unknown' ? undefined : ip))) {
      res.status(403).json({ ok: false, error: 'turnstile_failed' });
      return;
    }

    const idempotencyKey = `${options.formType}-${readIdempotencyKey(req)}`;
    const meta: RequestMeta = {
      ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      receivedAt: new Date(),
    };

    try {
      const delivery = await deliverOnce(idempotencyKey, options.formType, payload, meta);
      res.status(200).json({
        ok: true,
        duplicate: delivery.duplicate,
        confirmation: delivery.result.confirmation,
      });
    } catch (error) {
      console.error('lead.delivery.failed', {
        formType: options.formType,
        message: error instanceof Error ? error.message : 'unknown',
      });
      res.status(502).json({ ok: false, error: 'send_failed' });
    }
  };
}
