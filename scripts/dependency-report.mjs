// Read-only diagnostic. Source-sensitive-data scanning is not a dependency audit.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const summaries = [];
for (const omitDev of [false, true]) {
  const result = spawnSync('npm', ['audit', '--json', ...(omitDev ? ['--omit=dev'] : [])], { encoding: 'utf8' });
  let report;
  try { report = JSON.parse(result.stdout); } catch { throw new Error('Dependency audit did not return usable JSON.'); }
  if (report.error) throw new Error('Dependency audit could not be completed.');
  summaries.push({ scope: omitDev ? 'production dependency tree' : 'complete dependency tree', totals: report.metadata?.vulnerabilities, issues: Object.entries(report.vulnerabilities ?? {}).map(([name, issue]) => ({ name, severity: issue.severity, direct: issue.isDirect, range: issue.range, fixAvailable: issue.fixAvailable, advisories: issue.via.filter((entry) => typeof entry !== 'string').map((entry) => ({ title: entry.title, url: entry.url, range: entry.range })) })) });
}
mkdirSync('.sites-runtime', { recursive: true });
writeFileSync('.sites-runtime/dependency-audit.json', JSON.stringify(summaries, null, 2));
console.log(JSON.stringify(summaries, null, 2));
