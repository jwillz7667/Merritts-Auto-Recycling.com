type AnalyticsWindow = Window & { dataLayer?: Array<Record<string, unknown>> };
const events = new Set(['site_page_view', 'call_click', 'text_click', 'review_profile_click', 'lead_form_start', 'lead_form_validation_error', 'lead_form_success', 'lead_form_error']);
const placements = new Set(['header', 'footer', 'hero', 'cta_band', 'body', 'mobile']);

// Only fixed event fields reach analytics. Form values, query strings, VINs,
// customer addresses and arbitrary URLs are never copied into an event.
export function track(event: string, details: Record<string, unknown> = {}): void {
  if (!events.has(event)) return;
  const pathname = window.location.pathname;
  // Require the separator inside the repeated group. An optional separator
  // makes a long rejected path (such as a .html alias) backtrack exponentially
  // and can freeze the page before navigation finishes.
  const pagePath = /^\/(?:[a-z0-9-]+\/)*[a-z0-9-]*$/.test(pathname) ? pathname : '/unknown';
  const pageGroup = pagePath.startsWith('/service-areas/') ? 'city' : pagePath.startsWith('/service-regions/') ? 'region' : pagePath.startsWith('/guides/') ? 'guide' : pagePath === '/' ? 'home' : 'other';
  const payload: Record<string, unknown> = { event, page_path: pagePath, page_group: pageGroup };
  if (details.form_type === 'contact') payload.form_type = 'contact';
  if (typeof details.cta_location === 'string' && placements.has(details.cta_location)) payload.cta_location = details.cta_location;
  if (details.link_url === 'tel:+1-763-533-2775' || details.link_url === 'sms:+1-763-438-2116') payload.link_url = details.link_url;
  const target = window as AnalyticsWindow;
  target.dataLayer ??= [];
  target.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent('merritts:analytics', { detail: payload }));
}
