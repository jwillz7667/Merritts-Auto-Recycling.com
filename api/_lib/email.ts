import type { ContactPayload } from './schemas.js';
import { getEnv } from './env.js';

export type RequestMeta = {
  ip?: string;
  userAgent?: string;
  referer?: string;
  receivedAt: Date;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function labelFor(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase());
}

function publicFields(payload: ContactPayload): Array<[string, string]> {
  return Object.entries(payload)
    .filter(([key]) => !['companyWebsite', 'cf-turnstile-response', 'contactConsent'].includes(key))
    .filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0,
    );
}

function leadSubject(payload: ContactPayload): string {
  return `[Merritt's website] Contact inquiry — ${payload.name}`;
}

function renderLeadHtml(payload: ContactPayload, meta: RequestMeta): string {
  const rows = publicFields(payload)
    .map(
      ([key, value]) => `<tr>
        <th style="text-align:left;padding:10px 12px;background:#eef2f3;border:1px solid #d9dee2;font:700 13px Arial,sans-serif;color:#0a1c2d;">${escapeHtml(labelFor(key))}</th>
        <td style="padding:10px 12px;border:1px solid #d9dee2;font:14px Arial,sans-serif;color:#101820;white-space:pre-wrap;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f5f0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:auto;background:#fff;border:1px solid #d9dee2;">
      <tr><td style="background:#0a1c2d;padding:24px;color:#fff;font-family:Arial,sans-serif;">
        <div style="color:#ff6b24;font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Merritt's Auto Recycling</div>
        <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">New contact inquiry</h1>
      </td></tr>
      <tr><td style="padding:22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table></td></tr>
      <tr><td style="padding:0 22px 22px;color:#617080;font:12px/1.5 Arial,sans-serif;">
        Received ${escapeHtml(meta.receivedAt.toISOString())}<br>
        IP ${escapeHtml(meta.ip ?? 'unknown')} · Referer ${escapeHtml(meta.referer ?? 'unknown')}<br>
        User agent ${escapeHtml(meta.userAgent ?? 'unknown')}
      </td></tr>
    </table>
  </body></html>`;
}

function renderLeadText(payload: ContactPayload, meta: RequestMeta): string {
  const fields = publicFields(payload)
    .map(([key, value]) => `${labelFor(key)}: ${value}`)
    .join('\n');
  return `New contact inquiry — Merritt's Auto Recycling\n\n${fields}\n\nReceived: ${meta.receivedAt.toISOString()}\nIP: ${meta.ip ?? 'unknown'}\nReferer: ${meta.referer ?? 'unknown'}\n`;
}

async function sendEmail(payload: Record<string, unknown>, idempotencyKey: string): Promise<void> {
  const env = getEnv();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
      'idempotency-key': idempotencyKey,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error('resend.rejected', { status: response.status, body: errorBody.slice(0, 300) });
    throw new Error('Email provider rejected the request.');
  }
}

export async function sendLeadEmail(
  payload: ContactPayload,
  meta: RequestMeta,
  idempotencyKey: string,
): Promise<void> {
  const env = getEnv();
  await sendEmail(
    {
      from: env.RESEND_FROM_EMAIL,
      to: [env.RECIPIENT_EMAIL],
      reply_to: payload.email,
      subject: leadSubject(payload),
      html: renderLeadHtml(payload, meta),
      text: renderLeadText(payload, meta),
      tags: [{ name: 'form_type', value: 'contact' }],
    },
    `lead-contact-${idempotencyKey}`,
  );
}
