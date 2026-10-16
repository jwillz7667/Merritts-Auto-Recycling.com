// Test-only static server. Production remains on Vercel. No live email or API
// credentials are used; browser tests intercept the contact endpoint explicitly.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
if (!existsSync(root)) throw new Error('Run npm run build before browser tests.');
const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
const redirects = new Map(config.redirects.filter((rule) => !rule.has && !rule.source.includes(':') && !rule.source.includes('(')).map((rule) => [rule.source, rule]));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon' };
createServer((req, res) => {
  let url;
  try { url = new URL(req.url ?? '/', 'http://127.0.0.1:4321'); } catch { res.writeHead(400).end(); return; }
  const redirect = redirects.get(url.pathname);
  if (redirect) { res.writeHead(redirect.permanent ? 308 : 307, { Location: redirect.destination + url.search }).end(); return; }
  if (!['GET', 'HEAD'].includes(req.method ?? '')) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
  const relative = pathname === '/' ? 'index.html' : extname(pathname) ? pathname.slice(1) : `${pathname.replace(/^\//, '').replace(/\/$/, '')}.html`;
  const file = resolve(root, relative);
  if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  const found = existsSync(file) && statSync(file).isFile();
  const target = found ? file : resolve(root, '404.html');
  res.writeHead(found ? 200 : 404, { 'Content-Type': types[extname(target)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  if (req.method === 'HEAD') res.end(); else res.end(readFileSync(target));
}).listen(4321, '127.0.0.1', () => console.log('Preview server listening on http://127.0.0.1:4321'));
