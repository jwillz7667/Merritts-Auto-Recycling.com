import { expect, test } from '@playwright/test';
const readEvents = () => Array.from(((window as Window & { dataLayer?: unknown[] }).dataLayer ?? []), (item) => item && typeof item === 'object' && 'length' in item ? Array.from(item as ArrayLike<unknown>) : item);

test('optional analytics waits for consent and sends a path-only page view', async ({ page, context }) => {
  const requests: string[] = [];
  await context.route('https://www.googletagmanager.com/**', async (route) => { requests.push(route.request().url()); await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }); });
  await context.route('https://*.google-analytics.com/**', (route) => route.abort());
  await page.goto('/?private_note=never-send-this', { referer: 'https://www.google.com/search?q=private-referrer-query' });
  await expect(page.locator('[data-analytics-choice]')).toBeVisible();
  expect(requests).toHaveLength(0);
  await page.evaluate(() => (window as Window & { dataLayer?: unknown[] }).dataLayer?.push({ event: 'call_click', occurred_before_consent: true }));
  await page.getByRole('button', { name: 'Allow analytics' }).click();
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0]).toContain('/gtag/js?id=G-TEST1234');
  const events = await page.evaluate(readEvents);
  expect(JSON.stringify(events)).not.toContain('never-send-this');
  expect(JSON.stringify(events)).not.toContain('private-referrer-query');
  expect(JSON.stringify(events)).not.toContain('occurred_before_consent');
  const views = events.filter((item) => Array.isArray(item) && item[0] === 'event' && item[1] === 'page_view');
  expect(views).toHaveLength(1);
  const config = events.find((item) => Array.isArray(item) && item[0] === 'config');
  expect(config).toEqual(['config', 'G-TEST1234', expect.objectContaining({
    send_page_view: false,
    page_location: 'http://127.0.0.1:4321/',
    page_referrer: 'https://www.google.com',
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })]);
  expect(JSON.stringify(events)).toContain('ad_storage');
  await page.getByRole('button', { name: 'Analytics preferences' }).click();
  await page.getByRole('button', { name: 'Only necessary' }).click();
  await page.waitForLoadState('load');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('merritts.analytics-consent.v1'))).toBe('denied');
  expect(requests).toHaveLength(1);
});

test('browser privacy control prevents optional analytics even after saved consent', async ({ page, context }) => {
  const requests: string[] = [];
  await context.addInitScript(() => { localStorage.setItem('merritts.analytics-consent.v1', 'granted'); Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true }); });
  await context.route('https://www.googletagmanager.com/**', async (route) => { requests.push(route.request().url()); await route.fulfill({ status: 200, body: '' }); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Analytics preferences' }).click();
  await expect(page.getByRole('button', { name: 'Allow analytics' })).toBeDisabled();
  expect(requests).toHaveLength(0);
  expect(await page.evaluate(() => localStorage.getItem('merritts.analytics-consent.v1'))).toBe('denied');
});
