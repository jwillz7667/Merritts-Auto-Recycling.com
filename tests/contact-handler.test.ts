import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '../api/_lib/node-http';

const dependencies = vi.hoisted(() => ({
  getEnv: vi.fn(() => ({ ALLOWED_ORIGIN: 'https://merritts-auto-recycling.com' })),
  verifyTurnstile: vi.fn(async () => true),
  sendLeadEmail: vi.fn(async (): Promise<void> => undefined),
}));
vi.mock('../api/_lib/env.js', () => ({ getEnv: dependencies.getEnv }));
vi.mock('../api/_lib/turnstile.js', () => ({ verifyTurnstile: dependencies.verifyTurnstile }));
vi.mock('../api/_lib/email.js', () => ({ sendLeadEmail: dependencies.sendLeadEmail }));

const inquiry = {
  name: 'Taylor Test', email: 'taylor@example.com', phone: '763-555-0199',
  subject: 'vehicle-question', message: 'Please discuss a non-running vehicle in Ramsey.',
  companyWebsite: '', contactConsent: 'true', 'cf-turnstile-response': 'test-token',
};

function exchange(overrides: Partial<VercelRequest> = {}) {
  const req = {
    method: 'POST', body: inquiry, socket: { remoteAddress: '192.0.2.1' },
    headers: { host: 'merritts-auto-recycling.com', origin: 'https://merritts-auto-recycling.com', 'idempotency-key': 'test-inquiry-1234' },
    ...overrides,
  } as VercelRequest;
  const result = { status: 200, body: undefined as unknown };
  const res = {
    setHeader: vi.fn(),
    status: vi.fn((code: number) => { result.status = code; return res; }),
    json: vi.fn((body: unknown) => { result.body = body; return res; }),
  } as unknown as VercelResponse;
  return { req, res, result };
}

async function handler() { return (await import('../api/contact')).default; }

beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); });
afterEach(() => vi.restoreAllMocks());

describe('contact API with the Node HTTP types and mocked providers', () => {
  it('accepts delivery once and recognizes a retry without sending another lead', async () => {
    const handle = await handler();
    const first = exchange();
    await handle(first.req, first.res);
    expect(first.result).toMatchObject({ status: 200, body: { ok: true, duplicate: false } });
    const retry = exchange();
    await handle(retry.req, retry.res);
    expect(retry.result.body).toMatchObject({ ok: true, duplicate: true });
    expect(dependencies.sendLeadEmail).toHaveBeenCalledTimes(1);
    expect(dependencies.sendLeadEmail.mock.calls[0]).toEqual([
      expect.objectContaining({ name: 'Taylor Test' }), expect.any(Object), 'contact-test-inquiry-1234',
    ]);
  });

  it('shares an in-flight delivery across simultaneous submissions', async () => {
    let release!: () => void;
    dependencies.sendLeadEmail.mockImplementationOnce(() => new Promise<void>((resolve) => { release = resolve; }));
    const handle = await handler();
    const first = exchange(); const retry = exchange();
    const pending = [handle(first.req, first.res), handle(retry.req, retry.res)];
    await vi.waitFor(() => expect(dependencies.sendLeadEmail).toHaveBeenCalledTimes(1));
    release();
    await Promise.all(pending);
    expect(first.result.body).toMatchObject({ ok: true, duplicate: false });
    expect(retry.result.body).toMatchObject({ ok: true, duplicate: true });
  });

  it('reports provider failure and allows a later retry with the same key', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    dependencies.sendLeadEmail.mockRejectedValueOnce(new Error('Synthetic provider failure'));
    const handle = await handler(); const first = exchange();
    await handle(first.req, first.res);
    expect(first.result).toMatchObject({ status: 502, body: { ok: false, error: 'send_failed' } });
    const retry = exchange(); await handle(retry.req, retry.res);
    expect(retry.result.body).toMatchObject({ ok: true, duplicate: false });
    expect(dependencies.sendLeadEmail).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['wrong method', { method: 'GET' }, 405, 'method_not_allowed'],
    ['oversize request', { headers: { 'content-length': '40000' } }, 413, 'body_too_large'],
    ['foreign origin', { headers: { origin: 'https://other.example', host: 'merritts-auto-recycling.com' } }, 403, 'forbidden_origin'],
    ['invalid JSON', { body: '{', headers: { 'content-type': 'application/json' } }, 400, 'invalid_body'],
    ['honeypot', { body: { ...inquiry, companyWebsite: 'https://spam.example' } }, 400, 'validation_failed'],
    ['missing consent', { body: { ...inquiry, contactConsent: 'false' } }, 400, 'validation_failed'],
  ])('rejects %s before contacting providers', async (_label, overrides, status, error) => {
    const handle = await handler(); const request = exchange(overrides);
    await handle(request.req, request.res);
    expect(request.result).toMatchObject({ status, body: { ok: false, error } });
    expect(dependencies.verifyTurnstile).not.toHaveBeenCalled();
    expect(dependencies.sendLeadEmail).not.toHaveBeenCalled();
  });

  it('rejects an expired Turnstile token without delivery', async () => {
    dependencies.verifyTurnstile.mockResolvedValueOnce(false);
    const handle = await handler(); const request = exchange();
    await handle(request.req, request.res);
    expect(request.result).toMatchObject({ status: 403, body: { ok: false, error: 'turnstile_failed' } });
    expect(dependencies.sendLeadEmail).not.toHaveBeenCalled();
  });

  it('limits repeated attempts from one IP', async () => {
    const handle = await handler();
    for (let index = 0; index < 7; index++) {
      const request = exchange(); await handle(request.req, request.res);
      expect(request.result.status).toBe(index < 6 ? 200 : 429);
    }
    expect(dependencies.sendLeadEmail).toHaveBeenCalledTimes(1);
  });
});
