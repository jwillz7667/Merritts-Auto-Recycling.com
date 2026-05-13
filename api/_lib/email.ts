import { Resend } from 'resend';

import type { CalculatorResult } from './calculator.js';
import { env } from './env.js';

const resend = new Resend(env.RESEND_API_KEY);

type FormType = 'contact' | 'quote' | 'appointment' | 'callback';

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
  quote: 'New Quote Request',
  appointment: 'New Appointment Request',
  callback: 'New Cash-Calculator Callback Request',
};

const FORM_SUBJECT_LABELS: Record<FormType, string> = {
  contact: 'Contact',
  quote: 'Quote request',
  appointment: 'Appointment',
  callback: 'Callback request',
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
const PHONE_DISPLAY = '763-533-2775';
const PHONE_TEL = '+17635332775';

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
  const to =
    ctx.formType === 'callback'
      ? (env.QUOTE_RECIPIENT_EMAIL ?? env.RECIPIENT_EMAIL)
      : env.RECIPIENT_EMAIL;

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
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

/* ---------------------------------------------------------------------------------------- */
/* Callback emails (cash-calculator) — dual-send: lead to Brad + branded confirmation to user. */
/* ---------------------------------------------------------------------------------------- */

export type CallbackEmailContext = {
  customer: {
    name: string;
    phone: string;
    email?: string | undefined;
    preferredContactTime?: string | undefined;
    notes?: string | undefined;
    zip?: string | undefined;
  };
  vehicle: {
    classKey: string;
    classLabel: string;
    weightLbs: number;
    year: number;
    yearBucketLabel: string;
    running: boolean;
    catalyticConverter: boolean;
    completeDrivetrain: boolean;
    wheelsAndTires: boolean;
  };
  quote: CalculatorResult;
  ip: string | undefined;
  userAgent: string | undefined;
  referer: string | undefined;
  receivedAt: Date;
};

function yesNo(b: boolean): string {
  return b ? 'Yes' : 'No';
}

function renderLeadHtml(ctx: CallbackEmailContext): string {
  const { customer, vehicle, quote } = ctx;
  const modifierRows =
    quote.modifiersApplied.length === 0
      ? `<tr><td colspan="2" style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.muted};font-style:italic;">No condition bonuses applied.</td></tr>`
      : quote.modifiersApplied
          .map(
            (m) => `
        <tr>
          <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">${escapeHtml(m.label)}</th>
          <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};text-align:right;">+$${m.bonus.toLocaleString('en-US')}</td>
        </tr>`,
          )
          .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>New Cash-Calculator Callback Request</title>
${COLOR_SCHEME_META}
${DARK_MODE_STYLE}
</head>
<body class="body" style="margin:0;padding:24px;background:#f9fafb;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid ${BRAND.border};">
    <tr>
      <td class="dm-dark-bg" style="padding:24px;background:linear-gradient(135deg,${BRAND.charcoal} 0%,${BRAND.charcoalMid} 100%);color:#ffffff;font-family:system-ui,sans-serif;">
        <a href="${SITE_URL}" style="text-decoration:none;display:inline-block;margin-bottom:14px;">${LOGO_IMG}</a>
        <p class="dm-accent-text" style="margin:0 0 6px 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.lime};font-weight:600;">Callback request</p>
        <h1 class="dm-light-text" style="margin:0;font-size:22px;color:#ffffff;font-weight:700;">${escapeHtml(customer.name)} wants a direct quote</h1>
        <p class="dm-muted-text" style="margin:8px 0 0 0;font-size:14px;color:#d1d5db;">Preliminary range from the on-site calculator: <strong class="dm-accent-text" style="color:${BRAND.lime};">${escapeHtml(quote.display)}</strong></p>
      </td>
    </tr>

    <tr>
      <td style="padding:20px 24px 8px 24px;font-family:system-ui,sans-serif;">
        <h2 style="margin:0 0 12px 0;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.muted};">Contact</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;width:38%;">Name</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(customer.name)}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Phone</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};"><a href="tel:${escapeHtml(customer.phone.replace(/[^0-9+]/g, ''))}" style="color:${BRAND.text};text-decoration:none;">${escapeHtml(customer.phone)}</a></td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Email</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${customer.email ? `<a href="mailto:${escapeHtml(customer.email)}" style="color:${BRAND.text};text-decoration:none;">${escapeHtml(customer.email)}</a>` : '—'}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Best time to call</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(customer.preferredContactTime || 'No preference')}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Pickup ZIP</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(customer.zip || '—')}</td>
          </tr>
          ${
            customer.notes
              ? `<tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;vertical-align:top;">Notes</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};white-space:pre-wrap;">${escapeHtml(customer.notes)}</td>
          </tr>`
              : ''
          }
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:20px 24px 8px 24px;font-family:system-ui,sans-serif;">
        <h2 style="margin:0 0 12px 0;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.muted};">Vehicle</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;width:38%;">Class</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${escapeHtml(vehicle.classLabel)} <span style="color:${BRAND.muted};">(${vehicle.weightLbs.toLocaleString('en-US')} lbs typical)</span></td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Year</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${vehicle.year} <span style="color:${BRAND.muted};">(${escapeHtml(vehicle.yearBucketLabel)})</span></td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Runs &amp; drives</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${yesNo(vehicle.running)}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Catalytic converter still on</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${yesNo(vehicle.catalyticConverter)}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Engine + transmission installed</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${yesNo(vehicle.completeDrivetrain)}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">All four wheels w/ tires</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};">${yesNo(vehicle.wheelsAndTires)}</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:20px 24px 8px 24px;font-family:system-ui,sans-serif;">
        <h2 style="margin:0 0 12px 0;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:${BRAND.muted};">Quote breakdown</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;width:62%;">Scrap weight value (${vehicle.weightLbs.toLocaleString('en-US')} lbs &times; $${quote.basis.scrapWeightValue && vehicle.weightLbs ? (quote.basis.scrapWeightValue / vehicle.weightLbs).toFixed(3) : '0.075'}/lb)</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};text-align:right;">$${quote.basis.scrapWeightValue.toLocaleString('en-US')}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:8px 12px;background:${BRAND.bg};border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:13px;color:${BRAND.text};font-weight:500;">Year adjustment (${escapeHtml(quote.yearBucket.label)})</th>
            <td style="padding:8px 12px;border:1px solid ${BRAND.border};font-family:system-ui,sans-serif;font-size:14px;color:${BRAND.text};text-align:right;">${quote.basis.yearModifier >= 0 ? '+' : '−'}$${Math.abs(quote.basis.yearModifier).toLocaleString('en-US')}</td>
          </tr>
          ${modifierRows}
          <tr>
            <th style="text-align:left;padding:10px 12px;background:${BRAND.charcoal};color:${BRAND.lime};border:1px solid ${BRAND.charcoal};font-family:system-ui,sans-serif;font-size:14px;font-weight:700;">Preliminary quote range</th>
            <td style="padding:10px 12px;background:${BRAND.charcoal};color:#fff;border:1px solid ${BRAND.charcoal};font-family:system-ui,sans-serif;font-size:16px;text-align:right;font-weight:700;">${escapeHtml(quote.display)}</td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:12px;color:${BRAND.muted};line-height:1.5;">Preliminary estimate. The on-the-spot price is set after a brief phone call to confirm condition and pickup location.</p>
      </td>
    </tr>

    <tr>
      <td style="padding:20px 24px;font-family:system-ui,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <th style="text-align:left;padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-weight:500;font-size:12px;">Received</th>
            <td style="padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-size:12px;">${escapeHtml(ctx.receivedAt.toISOString())}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-weight:500;font-size:12px;">IP</th>
            <td style="padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-size:12px;">${escapeHtml(ctx.ip ?? 'unknown')}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-weight:500;font-size:12px;">User-Agent</th>
            <td style="padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-size:12px;">${escapeHtml(ctx.userAgent ?? 'unknown')}</td>
          </tr>
          <tr>
            <th style="text-align:left;padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-weight:500;font-size:12px;">Referer</th>
            <td style="padding:6px 12px;font-family:system-ui,sans-serif;color:${BRAND.muted};font-size:12px;">${escapeHtml(ctx.referer ?? 'unknown')}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body></html>`;
}

function renderLeadText(ctx: CallbackEmailContext): string {
  const { customer, vehicle, quote } = ctx;
  const modifiers =
    quote.modifiersApplied.length === 0
      ? '  (none)'
      : quote.modifiersApplied.map((m) => `  + $${m.bonus} — ${m.label}`).join('\n');
  return `NEW CASH-CALCULATOR CALLBACK REQUEST
Merritt's Auto Recycling — website

— Contact —
Name:               ${customer.name}
Phone:              ${customer.phone}
Email:              ${customer.email ?? '—'}
Best time to call:  ${customer.preferredContactTime ?? 'No preference'}
Pickup ZIP:         ${customer.zip ?? '—'}
Notes:              ${customer.notes ?? '—'}

— Vehicle —
Class:                          ${vehicle.classLabel} (${vehicle.weightLbs} lbs typical)
Year:                           ${vehicle.year} (${vehicle.yearBucketLabel})
Runs and drives:                ${yesNo(vehicle.running)}
Catalytic converter still on:   ${yesNo(vehicle.catalyticConverter)}
Engine + transmission in:       ${yesNo(vehicle.completeDrivetrain)}
All four wheels with tires:     ${yesNo(vehicle.wheelsAndTires)}

— Preliminary quote breakdown —
Scrap weight value:   $${quote.basis.scrapWeightValue}
Year adjustment:      ${quote.basis.yearModifier >= 0 ? '+' : '-'}$${Math.abs(quote.basis.yearModifier)}
Condition bonuses:
${modifiers}
Preliminary range:    ${quote.display}

— Meta —
Received:  ${ctx.receivedAt.toISOString()}
IP:        ${ctx.ip ?? 'unknown'}
UA:        ${ctx.userAgent ?? 'unknown'}
Referer:   ${ctx.referer ?? 'unknown'}
`;
}

function renderConfirmationHtml(ctx: CallbackEmailContext): string {
  const { customer, vehicle, quote } = ctx;
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>We received your callback request — Merritt's Auto Recycling</title>
${COLOR_SCHEME_META}
${DARK_MODE_STYLE}
</head>
<body class="body" style="margin:0;padding:24px;background:#f9fafb;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid ${BRAND.border};">
    <tr>
      <td class="dm-dark-bg" style="padding:32px 24px;background:linear-gradient(135deg,${BRAND.charcoal} 0%,${BRAND.charcoalMid} 100%);color:#ffffff;font-family:system-ui,sans-serif;text-align:center;">
        <a href="${SITE_URL}" style="text-decoration:none;display:inline-block;margin-bottom:18px;">${LOGO_IMG}</a>
        <p class="dm-accent-text" style="margin:0 0 8px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.lime};font-weight:700;">We got your request</p>
        <h1 class="dm-light-text" style="margin:0;font-size:26px;color:#ffffff;font-weight:700;line-height:1.2;">Thanks, ${escapeHtml(customer.name.split(' ')[0] ?? customer.name)} — we'll call you shortly.</h1>
        <p class="dm-muted-text" style="margin:14px 0 0 0;font-size:15px;color:#d1d5db;line-height:1.5;">Brad or someone on the team will reach out to ${escapeHtml(customer.phone)} to confirm pickup and lock in your final cash offer.</p>
      </td>
    </tr>

    <tr>
      <td style="padding:24px;font-family:system-ui,sans-serif;color:${BRAND.text};">
        <p style="margin:0 0 8px 0;font-size:14px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Your preliminary quote</p>
        <div style="padding:18px 22px;border:2px solid ${BRAND.lime};border-radius:10px;background:${BRAND.bg};text-align:center;">
          <p style="margin:0;font-size:32px;font-weight:800;color:${BRAND.charcoal};letter-spacing:-0.5px;">${escapeHtml(quote.display)}</p>
          <p style="margin:8px 0 0 0;font-size:13px;color:${BRAND.muted};">Based on a ${vehicle.year} ${escapeHtml(vehicle.classLabel.toLowerCase())}</p>
        </div>
        <p style="margin:16px 0 0 0;font-size:13px;color:${BRAND.muted};line-height:1.6;">This is a conservative range from our online calculator. Once we talk through the details of your vehicle, the actual on-the-spot offer is usually at the high end of the range or above.</p>
      </td>
    </tr>

    <tr>
      <td style="padding:0 24px 24px 24px;font-family:system-ui,sans-serif;">
        <h2 style="margin:0 0 12px 0;font-size:15px;color:${BRAND.text};font-weight:700;">What happens next</h2>
        <ol style="margin:0;padding-left:20px;color:${BRAND.text};font-size:14px;line-height:1.7;">
          <li>We call you at <strong>${escapeHtml(customer.phone)}</strong>${customer.preferredContactTime ? ` (you asked for: ${escapeHtml(customer.preferredContactTime)})` : ''}.</li>
          <li>Quick 2-minute chat to confirm vehicle condition and your pickup address.</li>
          <li>We lock in the final cash offer and schedule pickup — usually same day or next business day.</li>
          <li>Our driver shows up with the tow truck and pays cash on the spot. Free towing, always.</li>
        </ol>
      </td>
    </tr>

    <tr>
      <td style="padding:0 24px 24px 24px;font-family:system-ui,sans-serif;text-align:center;">
        <p style="margin:0 0 12px 0;font-size:14px;color:${BRAND.muted};">Need to talk to us first?</p>
        <a href="tel:${PHONE_TEL}" style="display:inline-block;padding:14px 28px;background:${BRAND.lime};color:${BRAND.charcoal};text-decoration:none;border-radius:6px;font-weight:700;font-size:16px;letter-spacing:0.3px;">Call ${PHONE_DISPLAY}</a>
        <p style="margin:12px 0 0 0;font-size:12px;color:${BRAND.muted};">Open daily, 9 AM &ndash; 6 PM CT</p>
      </td>
    </tr>

    <tr>
      <td style="padding:18px 24px;background:${BRAND.bg};font-family:system-ui,sans-serif;font-size:11px;color:${BRAND.muted};line-height:1.5;text-align:center;border-top:1px solid ${BRAND.border};">
        <p style="margin:0 0 4px 0;font-weight:600;color:${BRAND.text};">Merritt's Auto Recycling</p>
        <p style="margin:0;">3106 68th Ave N, Brooklyn Center, MN 55429 &middot; <a href="${SITE_URL}" style="color:${BRAND.muted};">merritts-auto-recycling.com</a></p>
        <p style="margin:8px 0 0 0;font-size:10px;">You're getting this email because you requested a callback through our cash calculator. We'll only use it to follow up on your quote.</p>
      </td>
    </tr>
  </table>
</body></html>`;
}

function renderConfirmationText(ctx: CallbackEmailContext): string {
  const { customer, vehicle, quote } = ctx;
  const firstName = customer.name.split(' ')[0] ?? customer.name;
  return `Thanks, ${firstName} — we'll call you shortly.

Brad or someone on the team will reach out to ${customer.phone} to confirm pickup and lock in your final cash offer.

Your preliminary quote: ${quote.display}
(Based on a ${vehicle.year} ${vehicle.classLabel.toLowerCase()})

This is a conservative range from our online calculator. Once we talk through the details, the actual on-the-spot offer is usually at the high end of the range or above.

What happens next:
  1. We call you at ${customer.phone}${customer.preferredContactTime ? ` (you asked for: ${customer.preferredContactTime})` : ''}.
  2. Quick 2-minute chat to confirm vehicle condition and your pickup address.
  3. We lock in the final cash offer and schedule pickup — usually same day or next business day.
  4. Our driver shows up with the tow truck and pays cash on the spot. Free towing, always.

Need to talk to us first? Call ${PHONE_DISPLAY} — open daily, 9 AM - 6 PM CT.

—
Merritt's Auto Recycling
3106 68th Ave N, Brooklyn Center, MN 55429
${SITE_URL}
`;
}

export async function sendCallbackEmails(ctx: CallbackEmailContext): Promise<void> {
  const leadTo = env.QUOTE_RECIPIENT_EMAIL ?? env.RECIPIENT_EMAIL;
  const leadSubject = `[Merritt's quote] ${ctx.customer.name} — ${ctx.vehicle.year} ${ctx.vehicle.classLabel} — ${ctx.quote.display}`;

  // 1) Lead email to Brad. This is the load-bearing send; if it fails we surface the error to
  //    the caller so the user sees an explicit retry rather than a silent drop.
  const leadResult = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [leadTo],
    subject: leadSubject,
    html: renderLeadHtml(ctx),
    text: renderLeadText(ctx),
    ...(ctx.customer.email ? { replyTo: ctx.customer.email } : {}),
  });

  if (leadResult.error) {
    console.error('callback.lead.send.failed', {
      code: leadResult.error.name,
      message: leadResult.error.message,
    });
    throw new Error('callback lead email failed');
  }

  // 2) Confirmation to user — non-blocking. Failure here logs but does not fail the request:
  //    Brad already has the lead, so the user's pickup will still happen. We just lose the
  //    polite "we got it" email, which we'd rather know about than break the request over.
  if (ctx.customer.email) {
    const userResult = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: [ctx.customer.email],
      subject: `We received your callback request — Merritt's Auto Recycling`,
      html: renderConfirmationHtml(ctx),
      text: renderConfirmationText(ctx),
      replyTo: env.QUOTE_RECIPIENT_EMAIL ?? env.RECIPIENT_EMAIL,
    });
    if (userResult.error) {
      console.error('callback.user.send.failed', {
        code: userResult.error.name,
        message: userResult.error.message,
      });
    }
  }
}
