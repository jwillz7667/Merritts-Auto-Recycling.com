import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '../api/_lib/node-http';

// Exercise the deployed handler and all of its real dependencies. Only the
// outbound HTTP boundary is replaced, so these tests never contact a provider.
const verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const deliveryUrl = 'https://api.resend.com/emails';
const inquiry = {
  name: '  Taylor <Owner> & Co  ',
  email: 'taylor@example.com',
  phone: '763-555-0199',
  subject: 'vehicle-question',
  message: '2004 car <script>alert("x")</script> & engine won\'t start.\nParked in Ramsey.',
  companyWebsite: '',
  contactConsent: 'true',
  'cf-turnstile-response': 'synthetic-verification-token',
};

function exchange(body: unknown = JSON.stringify(inquiry), contentType = 'application/json') {
  const req = {
    method: 'POST', body, socket: { remoteAddress: '192.0.2.1' },
    headers: {
      host: 'merritts-auto-recycling.com',
      origin: 'https://merritts-auto-recycling.com',
      referer: 'https://merritts-auto-recycling.com/contact',
      'content-type': contentType,
      'x-forwarded-for': '198.51.100.24, 192.0.2.9',
      'idempotency-key': 'pipeline-inquiry-1234',
      'user-agent': 'Synthetic pipeline test',
    },
  } as unknown as VercelRequest;
  const result = { status: 200, body: undefined as unknown };
  const res = {
    setHeader: vi.fn(),
    status: vi.fn((code: number) => { result.status = code; return res; }),
    json: vi.fn((value: unknown) => { result.body = value; return res; }),
  } as unknown as VercelResponse;
  return { req, res, result };
}

function mockProviders(options: { verification?: Response | Error; delivery?: Response | Error } = {}) {
  const fetch = vi.fn<typeof globalThis.fetch>(async (input) => {
    const url = String(input);
    let response: Response | Error;
    if (url === verificationUrl) response = options.verification ?? Response.json({ success: true });
    else if (url === deliveryUrl) response = options.delivery ?? Response.json({ id: 'synthetic-email-id' });
    else throw new Error(`Unexpected outbound request: ${url}`);
    if (response instanceof Error) throw response;
    return response.clone();
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('RESEND_API_KEY', 'synthetic-resend-key');
  vi.stubEnv('RESEND_FROM_EMAIL', 'noreply@merritts-auto-recycling.com');
  vi.stubEnv('RECIPIENT_EMAIL', 'merrittsautorecycling@gmail.com');
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'synthetic-turnstile-secret');
  vi.stubEnv('ALLOWED_ORIGIN', 'https://merritts-auto-recycling.com');
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('contact API through real validation, verification and email serialization', () => {
  it('verifies the token, sends an escaped complete lead and deduplicates delivery retries', async () => {
    const fetch = mockProviders();
    const handle = (await import('../api/contact')).default;
    const first = exchange();
    await handle(first.req, first.res);

    expect(first.result).toMatchObject({ status: 200, body: { ok: true, duplicate: false } });
    expect(first.res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    expect(fetch).toHaveBeenCalledTimes(2);
    const [verificationInput, verification] = fetch.mock.calls[0];
    expect(verificationInput).toBe(verificationUrl);
    expect(verification?.method).toBe('POST');
    expect(new Headers(verification?.headers).get('content-type')).toBe('application/x-www-form-urlencoded');
    expect(Object.fromEntries(new URLSearchParams(String(verification?.body)))).toEqual({
      secret: 'synthetic-turnstile-secret',
      response: inquiry['cf-turnstile-response'],
      remoteip: '198.51.100.24',
    });

    const [deliveryInput, delivery] = fetch.mock.calls[1];
    expect(deliveryInput).toBe(deliveryUrl);
    expect(delivery?.method).toBe('POST');
    const headers = new Headers(delivery?.headers);
    expect(headers.get('authorization')).toBe('Bearer synthetic-resend-key');
    expect(headers.get('content-type')).toBe('application/json');
    expect(headers.get('idempotency-key')).toBe('lead-contact-contact-pipeline-inquiry-1234');
    const email = JSON.parse(String(delivery?.body));
    expect(email).toMatchObject({
      from: 'noreply@merritts-auto-recycling.com', to: ['merrittsautorecycling@gmail.com'], reply_to: inquiry.email,
      subject: '[Merritt\'s website] Contact inquiry — Taylor <Owner> & Co',
      tags: [{ name: 'form_type', value: 'contact' }],
    });
    expect(email.html).toContain('Taylor &lt;Owner&gt; &amp; Co');
    expect(email.html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; engine won&#39;t start.');
    expect(email.html).not.toContain('<script>');
    for (const value of [inquiry.phone, inquiry.email, inquiry.subject, 'Parked in Ramsey.']) {
      expect(email.html).toContain(value);
      expect(email.text).toContain(value);
    }
    expect(email.text).toContain(inquiry.message);
    expect(email.html).toContain('198.51.100.24');
    expect(email.html).toContain('https://merritts-auto-recycling.com/contact');
    for (const value of ['synthetic-verification-token', 'synthetic-turnstile-secret', 'companyWebsite', 'contactConsent']) {
      expect(email.html).not.toContain(value);
      expect(email.text).not.toContain(value);
    }

    const retry = exchange();
    await handle(retry.req, retry.res);
    expect(retry.result).toMatchObject({ status: 200, body: { ok: true, duplicate: true } });
    expect(fetch.mock.calls.filter(([url]) => url === deliveryUrl)).toHaveLength(1);
  });

  it('accepts the real HTML form encoding through the same delivery pipeline', async () => {
    const fetch = mockProviders();
    const handle = (await import('../api/contact')).default;
    const request = exchange(new URLSearchParams(inquiry).toString(), 'application/x-www-form-urlencoded');
    await handle(request.req, request.res);
    expect(request.result).toMatchObject({ status: 200, body: { ok: true } });
    expect(JSON.parse(String(fetch.mock.calls[1][1]?.body)).text).toContain(inquiry.message);
  });

  it('rejects invalid customer input before either provider is contacted', async () => {
    const fetch = mockProviders();
    const handle = (await import('../api/contact')).default;
    const request = exchange(JSON.stringify({ ...inquiry, email: 'invalid-email' }));
    await handle(request.req, request.res);
    expect(request.result).toMatchObject({ status: 400, body: { ok: false, error: 'validation_failed', fields: { email: expect.any(String) } } });
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['rejected token', () => Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] })],
    ['provider HTTP failure', () => Response.json({ error: 'synthetic outage' }, { status: 503 })],
    ['network failure', () => new Error('Synthetic verification network failure')],
  ])('does not deliver after verification %s', async (_label, response) => {
    const fetch = mockProviders({ verification: response() });
    const handle = (await import('../api/contact')).default;
    const request = exchange();
    await handle(request.req, request.res);
    expect(request.result).toMatchObject({ status: 403, body: { ok: false, error: 'turnstile_failed' } });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe(verificationUrl);
  });

  it.each([
    ['HTTP rejection', () => Response.json({ message: 'Synthetic sender rejection' }, { status: 422 })],
    ['network failure', () => new Error('Synthetic delivery network failure')],
  ])('returns an honest delivery error after Resend %s', async (_label, response) => {
    const fetch = mockProviders({ delivery: response() });
    const handle = (await import('../api/contact')).default;
    const request = exchange();
    await handle(request.req, request.res);
    expect(request.result).toMatchObject({ status: 502, body: { ok: false, error: 'send_failed' } });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][0]).toBe(deliveryUrl);
  });

  it('surfaces missing deployment configuration before contacting a provider', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const fetch = mockProviders();
    const handle = (await import('../api/contact')).default;
    const request = exchange();
    await handle(request.req, request.res);
    expect(request.result).toMatchObject({ status: 503, body: { ok: false, error: 'service_unavailable' } });
    expect(fetch).not.toHaveBeenCalled();
  });
});
