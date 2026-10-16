import { expect, test } from '@playwright/test';
import cityDirectory from '../../src/data/city-directory.json' with { type: 'json' };

test('every displayed city links directly to its own real indexable page', async ({ page, request }) => {
  test.setTimeout(180000);
  await page.goto('/service-areas');
  const cities = cityDirectory.flatMap((region) => region.cities);
  const items = page.locator('.coverage-directory .city-links li');
  await expect(items).toHaveCount(cities.length);
  await expect(items.locator('span')).toHaveCount(0);
  for (const city of cities) {
    const path = `/service-areas/${city.slug}`;
    const link = items.getByRole('link', { name: city.city, exact: true });
    await expect(link, city.city).toHaveCount(1);
    await expect(link).toHaveAttribute('href', path);
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toContain(`href="https://merritts-auto-recycling.com${path}"`);
    expect(html, path).not.toMatch(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/);
    expect(html, path).toContain(`Cash for junk cars in ${city.city}, MN`);
  }
});
