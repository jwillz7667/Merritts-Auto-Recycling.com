import { env } from './env.js';

/**
 * Verify a Turnstile token against Cloudflare's siteverify endpoint.
 *
 * Returns `true` only when Cloudflare returns `success: true`. Logs (without echoing the token)
 * so deployments can be debugged via Vercel logs without leaking secrets.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

type SiteverifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
};

export async function verifyTurnstile(
  token: string,
  remoteIp: string | undefined,
): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', env.TURNSTILE_SECRET_KEY);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  let result: SiteverifyResponse;
  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    result = (await res.json()) as SiteverifyResponse;
  } catch (err) {
    console.error('turnstile.verify.network_error', (err as Error).message);
    return false;
  }

  if (!result.success) {
    console.warn('turnstile.verify.rejected', { codes: result['error-codes'] ?? [] });
    return false;
  }
  return true;
}
