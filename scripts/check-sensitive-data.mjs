import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const skippedDirectories = new Set([
  '.astro',
  '.git',
  '.openai',
  '.sites-runtime',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);
const skippedFiles = new Set(['.npmrc']);

const allowedEmails = new Set([
  'merrittsautorecycling@gmail.com',
  'noreply@merritts-auto-recycling.com',
  'jamie@example.com',
  'taylor@example.com',
]);
const allowedPhoneDigits = new Set([
  '17635332775',
  '17634382116',
  '7635332775',
  '7634382116',
  '7635550100',
  '7635550199',
]);

const credentialPatterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['AWS access key', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})\b/g],
  ['OpenAI-style key', /\bsk-[A-Za-z0-9_-]{20,}\b/g],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{30,}\b/g],
  ['Stripe secret key', /\b[rs]k_(?:live|test)_[0-9A-Za-z]{16,}\b/g],
  ['SendGrid key', /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/g],
  ['Resend key', /\bre_[A-Za-z0-9]{20,}\b/g],
  ['Turnstile key', /\b0x4A[A-Za-z0-9_-]{20,}\b/g],
  ['credential-bearing URL', /https?:\/\/[^/@\s:]+:[^/@\s]+@/g],
];

const assignmentPattern =
  /^[ \t]*(?:export[ \t]+)?[A-Z0-9_]*(?:API_KEY|SECRET|TOKEN|PASSWORD|PASSWD|PRIVATE_KEY|CLIENT_SECRET)[A-Z0-9_]*[ \t]*=[ \t]*([^\s#;]+)[ \t]*$/gim;
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phonePattern = /(?<!\d)(?:\+?1[-. (]*)?[2-9][0-9]{2}[-. )]*[0-9]{3}[-. ]*[0-9]{4}(?!\d)/g;
const localPathPattern =
  /(?:(?<![A-Za-z0-9._-])\/(?:Users|home|root|workspace)\/|[A-Za-z]:\\Users\\)/g;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
    if (entry.isFile() && skippedFiles.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(absolutePath)));
    if (entry.isFile()) files.push(absolutePath);
  }

  return files;
}

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

function report(findings, file, label, text, index) {
  findings.push(`${path.relative(root, file)}:${lineNumber(text, index)} — ${label}`);
}

const findings = [];
const files = await collectFiles(root);

for (const file of files) {
  const buffer = await readFile(file);
  if (buffer.includes(0)) continue;

  const text = buffer.toString('utf8');

  for (const [label, pattern] of credentialPatterns) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) report(findings, file, label, text, match.index);
  }

  assignmentPattern.lastIndex = 0;
  for (const match of text.matchAll(assignmentPattern)) {
    const value = match[1].replace(/^['"`]|['"`]$/g, '');
    if (value && !value.startsWith('$') && !/^x+$/i.test(value)) {
      report(findings, file, 'non-empty secret-like environment assignment', text, match.index);
    }
  }

  emailPattern.lastIndex = 0;
  for (const match of text.matchAll(emailPattern)) {
    if (!allowedEmails.has(match[0].toLowerCase())) {
      report(findings, file, 'unapproved email address', text, match.index);
    }
  }

  phonePattern.lastIndex = 0;
  for (const match of text.matchAll(phonePattern)) {
    const digits = match[0].replace(/\D/g, '');
    if (!allowedPhoneDigits.has(digits)) {
      report(findings, file, 'unapproved phone number', text, match.index);
    }
  }

  localPathPattern.lastIndex = 0;
  for (const match of text.matchAll(localPathPattern)) {
    report(findings, file, 'local filesystem path', text, match.index);
  }
}

if (findings.length > 0) {
  console.error('Sensitive-data scan failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Sensitive-data scan passed for ${files.length} publishable files.`);
