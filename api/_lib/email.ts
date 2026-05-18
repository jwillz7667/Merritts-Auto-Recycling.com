import { Resend } from 'resend';

import { env } from './env.js';
import type { QuotePayload } from './validate.js';

const resend = new Resend(env.RESEND_API_KEY);

type FormType = 'contact' | 'appointment' | 'quote';

type EmailContext = {
  formType: FormType;
  fields: Record<string, string | undefined>;
  ip: string | undefined;
  userAgent: string | undefined;
  referer: string | undefined;
  receivedAt: Date;
};

const FORM_TITLES: Record<FormType, string> = {
  contact: 'New Contact Form Submission',
  appointment: 'New Appointment Request',
  quote: 'New Cash-Quote Request',
};

const FORM_SUBJECT_LABELS: Record<FormType, string> = {
  contact: 'Contact',
  appointment: 'Appointment',
  quote: 'Cash Quote',
};

/** Brand palette — kept inline so email clients without external CSS still render correctly. */
const BRAND = {
  lime: '#a9e200',
  charcoal: '#131313',
  charcoalMid: '#292929',
  gold: '#fede00',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e7eb',
  bg: '#f6f7f9',
} as const;

const SITE_URL = 'https://merritts-auto-recycling.com';

/**
 * Email client dark-mode handling.
 *
 * Why: iOS Mail and Gmail (Android, iOS app, web) auto-invert or auto-tint
 * white text in dark mode. White text on our intentionally-dark header
 * (gradient charcoal → charcoalMid) gets darkened to ~#777, making it
 * unreadable. Saturated colors (lime `#a9e200`) survive untouched.
 *
 * Strategy:
 *  1. Declare `color-scheme: light dark` so modern clients (Apple Mail,
 *     iOS Mail 13+, Outlook 2021+) know we explicitly support both modes
 *     and stop applying their own transformations.
 *  2. `@media (prefers-color-scheme: dark)` rules with `!important` win
 *     against inline styles in Apple Mail / iOS Mail.
 *  3. Gmail's dark mode ignores `prefers-color-scheme` but exposes the
 *     proprietary `[data-ogsc]` (foreground) and `[data-ogsb]` (background)
 *     attribute hooks. Class targets `.dm-light-text` / `.dm-muted-text`
 *     are referenced from both media queries and `[data-ogsc]` rules.
 *  4. The "u + .body" prefix is the established Gmail-specific selector
 *     trick — `<u>` only exists in Gmail's rendered shadow DOM, so the
 *     rule scopes purely to Gmail without affecting other clients.
 */
const DARK_MODE_STYLE = `<style type="text/css">
  :root { color-scheme: light dark; supported-color-schemes: light dark; }

  @media (prefers-color-scheme: dark) {
    .dm-light-text { color: #ffffff !important; }
    .dm-muted-text { color: #d1d5db !important; }
    .dm-accent-text { color: ${BRAND.lime} !important; }
    .dm-dark-bg { background-color: ${BRAND.charcoal} !important; }
  }

  u + .body .dm-light-text,
  [data-ogsc] .dm-light-text { color: #ffffff !important; }
  u + .body .dm-muted-text,
  [data-ogsc] .dm-muted-text { color: #d1d5db !important; }
  u + .body .dm-accent-text,
  [data-ogsc] .dm-accent-text { color: ${BRAND.lime} !important; }
</style>`;

const COLOR_SCHEME_META = `<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">`;

/**
 * Logo block. PNG over WebP/AVIF — older Outlook and Apple Mail still don't
 * render WebP. 720×456 source at /images/optimized/logo-green.png, displayed
 * at 180×114. Explicit dimensions prevent CLS while the image loads.
 *
 * `display:block` + `border:0` + `outline:none` is the standard Outlook
 * defense — without it, Outlook adds a 1px border and underline link styling
 * when the logo is wrapped in an anchor.
 */
const LOGO_URL = `${SITE_URL}/images/optimized/logo-green.png`;
const LOGO_IMG = `<img src="${LOGO_URL}" alt="Merritt's Auto Recycling" width="180" height="114" style="display:block;border:0;outline:none;text-decoration:none;max-width:180px;height:auto;margin:0 auto;" border="0">`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatField(key: string): string {
  // camelCase / snake_case → "Title Case"
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\bMn\b/g, 'MN');
}

function formatValue(key: string, value: string | undefined): string {
  if (value === undefined || value === '') return '—';
  if (value === 'true') return 'Yes';
  if (value === 'false') return 'No';
  if (key === 'phone') return value;
  return value;
}

function renderHtml(ctx: EmailContext): string {
  const rows = Object.entries(ctx.fields)
    .filter(([k]) => k !== 'honeypot' && k !== 'cf-turnstile-response')
    .map(
      ([k, v]) => `
      <tr>
        <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};">${escapeHtml(formatField(k))}</th>
        <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;color:${BRAND.text};">${escapeHtml(formatValue(k, v))}</td>
      </tr>`,
    )
    .join('');

  const meta = `
    <tr><th style="text-align:left;padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-weight:500;font-size:12px;">Received</th><td style="padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-size:12px;">${escapeHtml(ctx.receivedAt.toISOString())}</td></tr>
    <tr><th style="text-align:left;padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-weight:500;font-size:12px;">IP</th><td style="padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-size:12px;">${escapeHtml(ctx.ip ?? 'unknown')}</td></tr>
    <tr><th style="text-align:left;padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-weight:500;font-size:12px;">User-Agent</th><td style="padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-size:12px;">${escapeHtml(ctx.userAgent ?? 'unknown')}</td></tr>
    <tr><th style="text-align:left;padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-weight:500;font-size:12px;">Referer</th><td style="padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-size:12px;">${escapeHtml(ctx.referer ?? 'unknown')}</td></tr>`;

  const title = FORM_TITLES[ctx.formType];

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
${COLOR_SCHEME_META}
${DARK_MODE_STYLE}
</head>
<body class="body" style="margin:0;padding:24px;background:#f9fafb;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid ${BRAND.border};">
    <tr>
      <td class="dm-dark-bg" style="padding:24px;background:${BRAND.charcoal};color:#ffffff;font-family:system-ui,sans-serif;">
        <a href="${SITE_URL}" style="text-decoration:none;display:inline-block;">${LOGO_IMG}</a>
        <h1 class="dm-accent-text" style="margin:16px 0 0 0;font-size:18px;color:${BRAND.lime};">${escapeHtml(title)}</h1>
        <p class="dm-light-text" style="margin:6px 0 0 0;font-size:14px;color:#ffffff;opacity:0.9;">Merritt's Auto Recycling — website</p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">${rows}</table>
        <div style="height:16px;"></div>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${meta}</table>
      </td>
    </tr>
  </table>
</body></html>`;
}

function renderText(ctx: EmailContext): string {
  const lines = Object.entries(ctx.fields)
    .filter(([k]) => k !== 'honeypot' && k !== 'cf-turnstile-response')
    .map(([k, v]) => `${formatField(k)}: ${formatValue(k, v)}`)
    .join('\n');
  return `New ${ctx.formType} submission — Merritt's Auto Recycling

${lines}

— Meta —
Received: ${ctx.receivedAt.toISOString()}
IP:        ${ctx.ip ?? 'unknown'}
UA:        ${ctx.userAgent ?? 'unknown'}
Referer:   ${ctx.referer ?? 'unknown'}
`;
}

export async function sendFormEmail(ctx: EmailContext): Promise<void> {
  const subject = `[Merritt's website] ${FORM_SUBJECT_LABELS[ctx.formType]} — ${ctx.fields['name'] ?? 'unknown'}`;
  const replyTo = ctx.fields['email'];

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [env.RECIPIENT_EMAIL],
    subject,
    html: renderHtml(ctx),
    text: renderText(ctx),
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error('email.send.failed', {
      code: error.name,
      message: error.message,
      formType: ctx.formType,
    });
    throw new Error('email send failed');
  }
}

function renderQuoteConfirmationHtml(payload: QuotePayload): string {
  const vehicle = `${payload.year} ${payload.make} ${payload.model}`;
  const notes = payload.notes ? escapeHtml(payload.notes) : '';
  const notesRow = notes
    ? `<tr><th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};">Notes</th><td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;color:${BRAND.text};">${notes}</td></tr>`
    : '';

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>We received your cash-quote request</title>
${COLOR_SCHEME_META}
${DARK_MODE_STYLE}
</head>
<body class="body" style="margin:0;padding:24px;background:#f9fafb;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid ${BRAND.border};">
    <tr>
      <td class="dm-dark-bg" style="padding:24px;background:${BRAND.charcoal};color:#ffffff;font-family:system-ui,sans-serif;text-align:center;">
        <a href="${SITE_URL}" style="text-decoration:none;display:inline-block;">${LOGO_IMG}</a>
        <h1 class="dm-accent-text" style="margin:16px 0 0 0;font-size:20px;color:${BRAND.lime};">Thanks ${escapeHtml(payload.name)} — we got your request</h1>
        <p class="dm-light-text" style="margin:6px 0 0 0;font-size:14px;color:#ffffff;opacity:0.9;">Brad will reach out shortly with your cash offer.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px;font-family:system-ui,sans-serif;color:${BRAND.text};font-size:15px;line-height:1.55;">
        <p style="margin:0 0 12px 0;">Here's what you sent us for the <strong>${escapeHtml(vehicle)}</strong> in ${escapeHtml(payload.city)}:</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:8px 0 16px 0;">
          <tr><th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};">Year</th><td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(payload.year)}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};">Make</th><td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(payload.make)}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};">Model</th><td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(payload.model)}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};">City</th><td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(payload.city)}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};">Phone</th><td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(payload.phone)}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};">Email</th><td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(payload.email)}</td></tr>
          ${notesRow}
        </table>
        <p style="margin:0 0 12px 0;">Need it picked up today? Call or text Brad now:</p>
        <p style="margin:0 0 16px 0;font-size:18px;"><a href="tel:+17635332775" style="color:${BRAND.text};text-decoration:none;font-weight:600;">📞 763-533-2775</a> &nbsp;·&nbsp; <a href="sms:+17634382116" style="color:${BRAND.text};text-decoration:none;font-weight:600;">💬 763-438-2116</a></p>
        <p style="margin:16px 0 0 0;font-size:13px;color:${BRAND.muted};">If anything above looks wrong, just reply to this email — it goes straight to us.</p>
      </td>
    </tr>
  </table>
</body></html>`;
}

function renderQuoteConfirmationText(payload: QuotePayload): string {
  const vehicle = `${payload.year} ${payload.make} ${payload.model}`;
  return `Thanks ${payload.name} — we received your cash-quote request.

Vehicle: ${vehicle}
City:    ${payload.city}
Phone:   ${payload.phone}
Email:   ${payload.email}${payload.notes ? `\nNotes:   ${payload.notes}` : ''}

Brad will follow up shortly with your no-obligation cash offer.

Need it picked up today? Call 763-533-2775 or text 763-438-2116.

— Merritt's Auto Recycling
${SITE_URL}
`;
}

export async function sendQuoteConfirmation(payload: QuotePayload): Promise<void> {
  const subject = `We got your cash-quote request — ${payload.year} ${payload.make} ${payload.model}`;

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [payload.email],
    subject,
    html: renderQuoteConfirmationHtml(payload),
    text: renderQuoteConfirmationText(payload),
    replyTo: env.RECIPIENT_EMAIL,
  });

  if (error) {
    console.error('email.confirmation.failed', {
      code: error.name,
      message: error.message,
    });
    throw new Error('confirmation email send failed');
  }
}
