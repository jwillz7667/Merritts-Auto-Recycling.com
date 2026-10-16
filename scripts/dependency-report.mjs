// Report separately from source-secret scanning; no credentials or dependency
// upgrades are made by this read-only diagnostic.
import { spawnSync } from 'node:child_process';
for (const omitDev of [false, true]) {
  const result = spawnSync('npm', ['audit', '--json', ...(omitDev ? ['--omit=dev'] : [])], { encoding: 'utf8' });
  let report;
  try { report = JSON.parse(result.stdout); } catch { throw new Error('Dependency audit did not return usable JSON.'); }
  if (report.error) throw new Error('Dependency audit could not be completed.');
  console.log(JSON.stringify({ scope: omitDev ? 'production dependency tree' : 'complete dependency tree', totals: report.metadata?.vulnerabilities, issues: Object.entries(report.vulnerabilities ?? {}).map(([name, issue]) => ({ name, severity: issue.severity, direct: issue.isDirect, range: issue.range, fixAvailable: issue.fixAvailable, advisories: issue.via.filter((entry) => typeof entry !== 'string').map((entry) => ({ title: entry.title, url: entry.url, range: entry.range })) })) }, null, 2));
}
