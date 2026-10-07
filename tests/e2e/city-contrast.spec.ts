import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { serviceAreas } from '../../src/data/metro';

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
  test.describe(`city-page contrast at ${viewport.width}px`, () => {
    test.use({ viewport });

    for (const area of serviceAreas) {
      test(`${area.city} process captions are readable`, async ({ page }) => {
        // The existing E2E server serves dist with Python, so use the emitted
        // .html path. Production clean-URL routing redirects this path normally.
        const response = await page.goto(`/service-areas/${area.slug}.html`);
        expect(response?.status()).toBe(200);

        const steps = page.locator('.section--soft .steps');
        await expect(steps).toHaveCount(1);
        await steps.scrollIntoViewIfNeeded();
        const paragraphs = steps.locator('.step p');
        await expect(paragraphs).toHaveCount(3);
        for (const paragraph of await paragraphs.all()) {
          await expect(paragraph).toHaveCSS('color', 'rgb(75, 92, 105)');
        }

        const results = await new AxeBuilder({ page })
          .include('.section--soft .steps')
          .withRules(['color-contrast'])
          .analyze();
        expect(results.violations, `${area.city}: ${JSON.stringify(results.violations)}`).toEqual([]);
      });
    }
  });
}
