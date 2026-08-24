import type { ContactPayload, QuotePayload } from './schemas.js';
import { getEnv } from './env.js';

type FormType = 'contact' | 'quote';
type LeadPayload = ContactPayload | QuotePayload;

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

function publicFields(payload: LeadPayload): Array<[string, string]> {
  return Object.entries(payload)
    .filter(([key]) => !['companyWebsite', 'cf-turnstile-response', 'contactConsent'].includes(key))
    .filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0,
    );
}

function leadSubject(formType: FormType, payload: LeadPayload): string {
  if (formType === 'quote' && 'year' in payload) {
    return `[Merritt's website] Offer request — ${payload.year} ${payload.make} ${payload.model}`;
  }
  return `[Merritt's website] Contact inquiry — ${payload.name}`;
}

function renderLeadHtml(formType: FormType, payload: LeadPayload, meta: RequestMeta): string {
  const rows = publicFields(payload)
    .map(
      ([key, value]) => `<tr>
        <th style="text-align:left;padding:10px 12px;background:#eef2f3;border:1px solid #d9dee2;font:700 13px Arial,sans-serif;color:#0b1f33;">${escapeHtml(labelFor(key))}</th>
        <td style="padding:10px 12px;border:1px solid #d9dee2;font:14px Arial,sans-serif;color:#101820;white-space:pre-wrap;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f5f0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:auto;background:#fff;border:1px solid #d9dee2;">
      <tr><td style="background:#0b1f33;padding:24px;color:#fff;font-family:Arial,sans-serif;">
        <div style="color:#f26a21;font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Merritt's Auto Recycling</div>
        <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">New ${formType === 'quote' ? 'vehicle offer request' : 'contact inquiry'}</h1>
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

function renderLeadText(formType: FormType, payload: LeadPayload, meta: RequestMeta): string {
  const fields = publicFields(payload)
    .map(([key, value]) => `${labelFor(key)}: ${value}`)
    .join('\n');
  return `New ${formType} submission — Merritt's Auto Recycling\n\n${fields}\n\nReceived: ${meta.receivedAt.toISOString()}\nIP: ${meta.ip ?? 'unknown'}\nReferer: ${meta.referer ?? 'unknown'}\n`;
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
  formType: FormType,
  payload: LeadPayload,
  meta: RequestMeta,
  idempotencyKey: string,
): Promise<void> {
  const env = getEnv();
  await sendEmail(
    {
      from: env.RESEND_FROM_EMAIL,
      to: [env.RECIPIENT_EMAIL],
      reply_to: payload.email,
      subject: leadSubject(formType, payload),
      html: renderLeadHtml(formType, payload, meta),
      text: renderLeadText(formType, payload, meta),
      tags: [{ name: 'form_type', value: formType }],
    },
    `lead-${formType}-${idempotencyKey}`,
  );
}

export async function sendQuoteConfirmation(
  payload: QuotePayload,
  idempotencyKey: string,
): Promise<void> {
  const env = getEnv();
  const vehicle = `${payload.year} ${payload.make} ${payload.model}`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f5f0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:auto;background:#fff;border:1px solid #d9dee2;">
      <tr><td style="background:#0b1f33;padding:24px;color:#fff;font-family:Arial,sans-serif;">
        <div style="color:#f26a21;font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Merritt's Auto Recycling</div>
        <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">We received your vehicle details</h1>
      </td></tr>
      <tr><td style="padding:24px;color:#101820;font:15px/1.6 Arial,sans-serif;">
        <p style="margin-top:0;">Hello ${escapeHtml(payload.name)},</p>
        <p>We received your request for the <strong>${escapeHtml(vehicle)}</strong> in ${escapeHtml(payload.city)}. A team member will review the information and contact you using your preferred method.</p>
        <p>This confirmation is not a final offer or pickup appointment. Merritt's will confirm any offer, documentation, removal terms, and schedule directly.</p>
        <p>For the fastest response, call <a href="tel:+17635332775">763-533-2775</a>. We are open every day from 8:00 AM to 8:00 PM.</p>
        <p style="margin-bottom:0;color:#617080;font-size:13px;">If you did not send this request, reply to this email and let us know.</p>
      </td></tr>
    </table>
  </body></html>`;
  const text = `Hello ${payload.name},\n\nWe received your request for the ${vehicle} in ${payload.city}. This is not a final offer or pickup appointment. Merritt's will confirm any offer, documentation, removal terms, and schedule directly.\n\nCall 763-533-2775. Open every day, 8:00 AM–8:00 PM.\n`;

  await sendEmail(
    {
      from: env.RESEND_FROM_EMAIL,
      to: [payload.email],
      reply_to: env.RECIPIENT_EMAIL,
      subject: `We received your Merritt's vehicle request — ${vehicle}`,
      html,
      text,
      tags: [{ name: 'form_type', value: 'quote_confirmation' }],
    },
    `confirm-quote-${idempotencyKey}`,
  );
}
