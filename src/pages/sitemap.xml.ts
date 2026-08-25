import type { APIRoute } from 'astro';
import { guides } from '@/data/guides';
import { business, publishedRoutes } from '@/data/site';

const updated = '2026-08-25';
const routes = [...publishedRoutes, ...guides.map((guide) => `/guides/${guide.slug}`)];

export const GET: APIRoute = () => {
  const entries = routes
    .map((route) => {
      const url = new URL(route, business.siteUrl).toString();
      return `<url><loc>${url}</loc><lastmod>${updated}</lastmod></url>`;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
    {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    },
  );
};
