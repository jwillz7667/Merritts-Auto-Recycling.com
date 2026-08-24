import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const primaryRoutes = [
  '/',
  '/cash-for-junk-cars',
  '/junk-car-removal',
  '/auto-recycling',
  '/service-areas',
  '/service-areas/brooklyn-center',
  '/service-areas/minneapolis',
  '/about',
  '/reviews',
  '/faq',
  '/contact',
  '/guides',
  '/privacy',
];

test('home page presents the correct primary conversion path', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Turn an unwanted vehicle into a clear next step.',
  );
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Call 763-533-2775/ }).first()).toHaveAttribute(
    'href',
    'tel:+1-763-533-2775',
  );
  await expect(page.getByText('8:00 AM–8:00 PM', { exact: true }).first()).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test('mobile navigation and sticky actions remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mobile-cta')).toBeVisible();
  await expect(page.locator('.mobile-cta').getByRole('link', { name: 'Call now' })).toHaveAttribute(
    'href',
    'tel:+1-763-533-2775',
  );

  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-navigation')).toHaveAttribute('data-open', 'true');
  await expect(
    page.locator('#mobile-navigation').getByRole('link', { name: /Service areas/ }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('primary routes render unique page structure and metadata', async ({ page }) => {
  for (const route of primaryRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), `${route} status`).toBe(200);
    await expect(page.locator('h1'), `${route} H1`).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), `${route} canonical`).toHaveCount(1);
    await expect(page.locator('meta[name="description"]'), `${route} description`).toHaveAttribute(
      'content',
      /.+/,
    );
  }
});

test('approved imagery is local and no aggregate rating is emitted', async ({ page }) => {
  await page.goto('/');
  const imageSources = await page
    .locator('img')
    .evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).getAttribute('src')),
    );
  expect(
    imageSources.every((src) => src?.startsWith('/images/legacy/') || src?.startsWith('/brand/')),
  ).toBe(true);
  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(jsonLd).not.toContain('aggregateRating');
  expect(jsonLd).toContain('08:00');
  expect(jsonLd).toContain('20:00');
});

test('cash-for-cars page uses direct phone and text actions', async ({ page }) => {
  await page.goto('/cash-for-junk-cars');
  await expect(page.getByRole('link', { name: /Call 763-533-2775/ }).first()).toHaveAttribute(
    'href',
    'tel:+1-763-533-2775',
  );
  await expect(page.getByRole('link', { name: /Text 763-438-2116/ }).first()).toHaveAttribute(
    'href',
    'sms:+1-763-438-2116',
  );
});

test('key pages have no serious or critical axe violations', async ({ page }) => {
  for (const route of ['/', '/cash-for-junk-cars', '/contact', '/service-areas/brooklyn-center']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blocking = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(blocking, `${route}: ${JSON.stringify(blocking, null, 2)}`).toEqual([]);
  }
});

test('unknown routes use the custom 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('That page is not here.');
});
