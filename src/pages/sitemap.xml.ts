import type { APIRoute } from 'astro';
import { guides } from '@/data/guides';
import { business, publishedRoutes, serviceAreas, services } from '@/data/site';
import { serviceRegions, regionalRoutes } from '@/data/service-regions';

const modified = new Map<string, string>([
  ['/', '2026-10-16'], ['/service-areas', '2026-10-16'], ['/service-regions', '2026-10-16'],
  ['/about', '2026-10-07'], ['/reviews', '2026-10-07'], ['/faq', '2026-10-07'], ['/guides', '2026-10-16'], ['/contact', '2026-10-16'],
  ...services.map((service): [string, string] => [`/${service.slug}`, '2026-10-16']),
  ...serviceAreas.map((area): [string, string] => [`/service-areas/${area.slug}`, '2026-10-16']),
  ...serviceRegions.map((region): [string, string] => [`/service-regions/${region.slug}`, region.updated]),
  ...guides.map((guide): [string, string] => [`/guides/${guide.slug}`, guide.updatedIso ?? '2026-08-23']),
]);
const routes = [...new Set([...publishedRoutes, '/service-regions', ...regionalRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)])];
const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export const GET: APIRoute = () => {
  const entries = routes.map((route) => {
    const url = escapeXml(new URL(route, business.siteUrl).toString());
    const date = modified.get(route);
    return `<url><loc>${url}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
