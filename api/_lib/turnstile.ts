import { getEnv } from './env.js';

type TurnstileResponse = {
  success: boolean;
  hostname?: string;
  action?: string;
  'error-codes'?: string[];
};

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const env = getEnv();
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as TurnstileResponse;
    if (!result.success) {
      console.warn('turnstile.rejected', { codes: result['error-codes'] ?? [] });
      return false;
    }
    return true;
  } catch (error) {
    console.error('turnstile.failed', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    return false;
  }
}
