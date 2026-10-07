import type { APIRoute } from 'astro';
import { guides } from '@/data/guides';
import { business, publishedRoutes, serviceAreas, services } from '@/data/site';

const releaseDate = '2026-10-07';
const modified = new Map<string, string>([
  ['/', releaseDate], ['/service-areas', releaseDate], ['/about', releaseDate], ['/reviews', releaseDate], ['/faq', releaseDate], ['/guides', releaseDate],
  ...services.map((service): [string, string] => [`/${service.slug}`, releaseDate]),
  ...serviceAreas.map((area): [string, string] => [`/service-areas/${area.slug}`, releaseDate]),
  ...guides.map((guide): [string, string] => [`/guides/${guide.slug}`, guide.updatedIso ?? '2026-08-23']),
]);
const routes = [...new Set([...publishedRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)])];
const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export const GET: APIRoute = () => {
  const entries = routes.map((route) => {
    const url = escapeXml(new URL(route, business.siteUrl).toString());
    const date = modified.get(route);
    return `<url><loc>${url}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
