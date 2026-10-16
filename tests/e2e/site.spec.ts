import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { publishedRoutes, homeSeo } from '../../src/data/site';
import { guides } from '../../src/data/guides';

// Tests never send traffic to Google analytics or live form providers.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem('merritts.analytics-consent.v1', 'denied'));
  await context.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await context.route('https://*.google-analytics.com/**', (route) => route.abort());
  await context.route('https://challenges.cloudflare.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
});

test('homepage preserves current design, message, and contact actions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText(homeSeo.heading);
  await expect(page.locator('.hero')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Call 763-533-2775/ }).first()).toHaveAttribute('href', 'tel:+1-763-533-2775');
  await expect(page.getByText('8:00 AM–8:00 PM', { exact: true }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
});

test('mobile navigation and sticky contact actions work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mobile-cta')).toBeVisible();
  await expect(page.locator('.mobile-cta').getByRole('link', { name: 'Call now' })).toHaveAttribute('href', 'tel:+1-763-533-2775');
  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-navigation')).toHaveAttribute('data-open', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('every published page has a successful response and a self canonical', async ({ page }) => {
  test.setTimeout(180000);
  for (const route of [...publishedRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1'), route).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), route).toHaveAttribute('href', new URL(route, 'https://merritts-auto-recycling.com').href);
    await expect(page.locator('meta[name="description"]'), route).toHaveAttribute('content', /.{40,}/);
  }
});

test('approved imagery and business identity remain intact', async ({ page }) => {
  await page.goto('/');
  const sources = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src')));
  expect(sources.every((src) => src?.startsWith('/images/legacy/') || src?.startsWith('/brand/'))).toBe(true);
  const schema = await page.locator('script[type="application/ld+json"]').textContent();
  expect(schema).not.toContain('aggregateRating');
  expect(schema).toContain('08:00');
  expect(schema).toContain('20:00');
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
  test(`key restored destinations are accessible at ${viewport.width}px`, async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize(viewport);
    for (const route of ['/', '/contact', '/service-areas/ramsey', '/service-regions/sherburne-county', '/guides/minnesota-license-plates-before-junking', '/guides/cash-for-junkers-mn-vs-merritts']) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const blocking = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
      expect(blocking, `${route}: ${JSON.stringify(blocking)}`).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), route).toBe(false);
    }
  });
}

test('unknown current and legacy routes remain real 404 responses', async ({ page }) => {
  for (const route of ['/this-page-does-not-exist', '/placemarks/never-existed-mn']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('That page is not here.');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  }
});
