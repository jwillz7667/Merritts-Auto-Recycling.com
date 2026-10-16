import { expect, test, type Page } from '@playwright/test';
async function fillInquiry(page: Page) {
  await page.getByLabel('Name', { exact: false }).first().fill('Taylor Test');
  await page.locator('#contact-phone').fill('763-555-0199');
  await page.locator('#contact-email').fill('taylor@example.com');
  await page.locator('#contact-message').fill('A non-running vehicle in Ramsey. Please discuss the pickup and offer.');
  await page.locator('#contact-consent').check();
}
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem('merritts.analytics-consent.v1', 'denied'));
  await context.route('https://challenges.cloudflare.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
});
test('the verification widget fits inside the form on a 320px phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  // Model Cloudflare's documented dimensions. Flexible widgets have a 300px
  // minimum width; compact widgets are 150 x 140px. An empty script mock would
  // hide the real clipping found during production browser verification.
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js', (route) => route.fulfill({
    status: 200, contentType: 'application/javascript', body: `
      const widget = document.querySelector('.cf-turnstile');
      const frame = document.createElement('iframe');
      const compact = widget.dataset.size === 'compact';
      frame.title = 'Security verification';
      frame.style.cssText = 'border:0;width:' + (compact ? 150 : 300) + 'px;height:' + (compact ? 140 : 65) + 'px';
      widget.append(frame);
    `,
  }));
  await page.goto('/contact');
  const frame = page.locator('.cf-turnstile iframe');
  await frame.scrollIntoViewIfNeeded();
  const box = await frame.boundingBox();
  const form = await page.locator('.form-shell').boundingBox();
  expect(box).not.toBeNull(); expect(form).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(form!.x);
  expect(box!.x + box!.width).toBeLessThanOrEqual(form!.x + form!.width);
  expect(box!.height).toBe(140);
  const reserved = await page.locator('.turnstile-wrap').boundingBox();
  expect(reserved!.height).toBeGreaterThanOrEqual(box!.height);
});
test('success requires a positive delivery response and emits no form values', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/contact', async (route) => {
    calls++;
    const payload = route.request().postDataJSON();
    expect(payload.subject).toBe('vehicle-question');
    expect(payload.contactConsent).toBe('true');
    expect(route.request().headers()['idempotency-key']).toBeTruthy();
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto('/contact');
  await fillInquiry(page);
  await page.getByRole('button', { name: 'Send vehicle inquiry' }).click();
  await expect(page.locator('[data-form-status]')).toContainText('Message sent');
  const data = await page.evaluate(() => JSON.stringify((window as Window & { dataLayer?: unknown[] }).dataLayer));
  expect(data).toContain('lead_form_success');
  expect(data).not.toContain('Taylor Test');
  expect(data).not.toContain('taylor@example.com');
  expect(data).not.toContain('non-running vehicle');
  await page.waitForURL('**/thank-you?form=contact');
  expect(calls).toBe(1);
});
test('a malformed successful HTTP response never masquerades as delivery', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, json: {} }));
  await page.goto('/contact');
  await fillInquiry(page);
  await page.getByRole('button', { name: 'Send vehicle inquiry' }).click();
  await expect(page.locator('[data-form-status]')).toContainText('could not send');
  await expect(page.getByRole('button', { name: 'Send vehicle inquiry' })).toBeEnabled();
  expect(page.url()).toContain('/contact');
  const data = await page.evaluate(() => JSON.stringify((window as Window & { dataLayer?: unknown[] }).dataLayer));
  expect(data).not.toContain('lead_form_success');
});
test('retries retain an idempotency key unless the inquiry changes', async ({ page }) => {
  const keys: string[] = [];
  await page.route('**/api/contact', async (route) => {
    keys.push(route.request().headers()['idempotency-key']);
    await route.fulfill({ status: 502, json: { ok: false, error: 'send_failed' } });
  });
  await page.goto('/contact');
  await fillInquiry(page);
  for (let n = 0; n < 2; n++) {
    await page.getByRole('button', { name: 'Send vehicle inquiry' }).click();
    await expect(page.locator('[data-form-status]')).toContainText('could not deliver');
    await expect(page.getByRole('button', { name: 'Send vehicle inquiry' })).toBeEnabled();
  }
  expect(keys[0]).toBe(keys[1]);
  await page.locator('#contact-message').fill('Updated vehicle question with corrected location and condition.');
  await page.getByRole('button', { name: 'Send vehicle inquiry' }).click();
  await expect(page.locator('[data-form-status]')).toContainText('could not deliver');
  expect(keys[2]).not.toBe(keys[1]);
});
