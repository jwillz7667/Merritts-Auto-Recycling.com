import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const CATEGORY_BUDGETS = [
  { id: 'performance', label: 'Performance', minimum: 0.9 },
  { id: 'accessibility', label: 'Accessibility', minimum: 0.9 },
  { id: 'best-practices', label: 'Best Practices', minimum: 0.9 },
  { id: 'seo', label: 'SEO', minimum: 0.9 },
] as const;

const PAGES = [
  { name: 'home', pathname: '/' },
  { name: 'contact', pathname: '/contact' },
  { name: 'faq', pathname: '/faq' },
  { name: 'testimonials', pathname: '/testimonials' },
  { name: 'maple-grove', pathname: '/placemarks/maple-grove-mn' },
  {
    name: 'blog-junk-car-value',
    pathname: '/blog/how-much-is-my-junk-car-worth-minnesota-2026',
  },
] as const;

interface BudgetFailure {
  page: string;
  category: string;
  actual: number;
  minimum: number;
}

const baseUrl = new URL(process.env.LIGHTHOUSE_BASE_URL ?? 'https://merritts-auto-recycling.com');
const reportDirectory = path.resolve(process.cwd(), 'lighthouse-reports');

async function auditPage(
  chromePort: number,
  page: (typeof PAGES)[number],
): Promise<BudgetFailure[]> {
  const url = new URL(page.pathname, baseUrl).toString();
  console.info(`\nAuditing ${url}`);

  const result = await lighthouse(url, {
    port: chromePort,
    output: 'html',
    logLevel: 'error',
    onlyCategories: CATEGORY_BUDGETS.map(({ id }) => id),
    formFactor: 'mobile',
  });

  if (!result) {
    throw new Error(`Lighthouse returned no result for ${url}`);
  }

  await Promise.all([
    writeFile(path.join(reportDirectory, `${page.name}.html`), result.report, 'utf8'),
    writeFile(
      path.join(reportDirectory, `${page.name}.json`),
      JSON.stringify(result.lhr, null, 2),
      'utf8',
    ),
  ]);

  const failures: BudgetFailure[] = [];
  for (const budget of CATEGORY_BUDGETS) {
    const score = result.lhr.categories[budget.id]?.score ?? 0;
    console.info(
      `${budget.label.padEnd(16)} ${Math.round(score * 100)} (minimum ${Math.round(
        budget.minimum * 100,
      )})`,
    );

    if (score < budget.minimum) {
      failures.push({
        page: page.name,
        category: budget.label,
        actual: score,
        minimum: budget.minimum,
      });
    }
  }

  return failures;
}

async function main(): Promise<void> {
  await mkdir(reportDirectory, { recursive: true });

  const chrome = await launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const failures: BudgetFailure[] = [];
  try {
    for (const page of PAGES) {
      failures.push(...(await auditPage(chrome.port, page)));
    }
  } finally {
    chrome.kill();
  }

  if (failures.length > 0) {
    console.error('\nLighthouse budgets failed:');
    for (const failure of failures) {
      console.error(
        `- ${failure.page}: ${failure.category} ${Math.round(
          failure.actual * 100,
        )} < ${Math.round(failure.minimum * 100)}`,
      );
    }
    process.exitCode = 1;
    return;
  }

  console.info(`\nAll ${PAGES.length} representative pages meet the Lighthouse budgets.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
