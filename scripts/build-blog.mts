#!/usr/bin/env tsx
/**
 * Generates the blog content hub:
 *   - blog/<slug>.html  — one file per post, scaffolded from the per-post body module
 *     in scripts/_blog-bodies/<slug>.ts (article HTML) + a shared HTML skeleton that
 *     leaves auto:* marker blocks empty for apply-shared-blocks.mts to fill in.
 *   - blog/index.html   — the hub page with a regenerated post-card grid and the
 *     blog index JSON-LD block.
 *   - Adds an `auto:related` sidebar to each post and the hub.
 *
 * Authoring workflow:
 *   1. Add the post metadata to data/blog-posts.json.
 *   2. Create scripts/_blog-bodies/<slug>.ts exporting `articleBody: string` (HTML).
 *   3. Run `npm run build:blog` to write blog/<slug>.html.
 *   4. Run `npx tsx scripts/apply-shared-blocks.mts` to install the head meta + JSON-LD.
 *
 * The script is idempotent: rerunning with no changes produces no file writes.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  loadBlogPosts,
  loadBusiness,
  loadCities,
  repoRoot,
  type BlogData,
  type BlogPost,
  type Business,
  type City,
} from './_lib/data.mts';
import { renderBlogIndexJsonLd, renderRelatedLinks } from './_lib/render.mts';
import { applyMarkerBlock } from './_lib/transform.mts';

const SITE = 'https://merritts-auto-recycling.com';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

function imageUrlFor(post: BlogPost, base: string): string {
  return `${base}/${post.image}`;
}

async function loadBody(slug: string): Promise<string> {
  const path = resolve(repoRoot, 'scripts', '_blog-bodies', `${slug}.ts`);
  try {
    const mod = (await import(path)) as { articleBody?: string };
    if (typeof mod.articleBody === 'string' && mod.articleBody.length > 0) {
      return mod.articleBody;
    }
  } catch {
    // ignore
  }
  return `\t\t\t\t\t<article class="blog-article">\n\t\t\t\t\t\t<p><em>Article body is still being authored. Check back soon.</em></p>\n\t\t\t\t\t</article>`;
}

function renderHeadSkeleton(post: BlogPost, biz: Business, imageBase: string): string {
  const canonical = `${SITE}/blog/${post.slug}`;
  const ogImage = imageUrlFor(post, imageBase);
  return `<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WDZ8L9TN');</script>
<!-- End Google Tag Manager -->
\t<meta charset="utf-8">
\t<meta http-equiv="X-UA-Compatible" content="IE=edge">
\t<meta name="viewport" content="width=device-width, initial-scale=1">
\t<meta name="description" content="${escapeHtml(post.description)}">
\t<meta name="format-detection" content="telephone=yes">
\t<link rel="icon" type="image/png" href="/images/favicon/favicon-96x96.png" sizes="96x96" />
\t<link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg" />
\t<link rel="shortcut icon" href="/images/favicon/favicon.ico" />
\t<link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
\t<meta name="apple-mobile-web-app-title" content="Merritt's" />
\t<link rel="manifest" href="/images/favicon/site.webmanifest" />
\t<link rel="canonical" href="${canonical}">
\t<title>${escapeHtml(post.title)} | ${escapeHtml(biz.name)}</title>
\t<link href="../css/plugins/bootstrap.min.css" rel="stylesheet">
\t<link href="../css/plugins/bootstrap-submenu.css" rel="stylesheet">
\t<link href="../css/plugins/animate.min.css" rel="stylesheet">
\t<link href="../css/plugins/slick.css" rel="stylesheet">
\t<link href="../css/custom.css" rel="stylesheet">
\t<link href="../css/color/color-green.css" rel="stylesheet">
\t<link href="../iconfont/style.css" rel="stylesheet">
\t<!-- Google Tag Manager (noscript) -->
\t<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WDZ8L9TN" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
\t<!-- End Google Tag Manager (noscript) -->
\t<!-- BEGIN auto:fonts --><!-- END auto:fonts -->
\t<!-- BEGIN auto:og --><!-- END auto:og -->
\t<!-- BEGIN auto:twitter --><!-- END auto:twitter -->
\t<!-- BEGIN auto:geo --><!-- END auto:geo -->
\t<!-- BEGIN auto:pwa --><!-- END auto:pwa -->
\t<!-- BEGIN auto:preconnect --><!-- END auto:preconnect -->
\t<!-- BEGIN auto:verification --><!-- END auto:verification -->
\t<!-- BEGIN auto:jsonld-business --><!-- END auto:jsonld-business -->
\t<!-- BEGIN auto:jsonld-breadcrumb --><!-- END auto:jsonld-breadcrumb -->
\t<!-- BEGIN auto:jsonld-webpage --><!-- END auto:jsonld-webpage -->
\t<!-- BEGIN auto:jsonld-article --><!-- END auto:jsonld-article -->
\t<meta property="og:image" content="${escapeHtml(ogImage)}">
</head>`;
}

function renderHeader(): string {
  return `\t<header class="page-header header-sticky">
\t\t<nav class="navbar" id="slide-nav" aria-label="Primary">
\t\t\t<div class="container">
\t\t\t\t<div class="header-row">
\t\t\t\t\t<div class="logo">
\t\t\t\t\t\t<a href="/"><picture><source type="image/avif" srcset="/images/optimized/logo-green.avif"><source type="image/webp" srcset="/images/optimized/logo-green.webp"><img src="/images/optimized/logo-green.png" alt="Merritt's Auto Recycling Logo" width="720" height="456" decoding="async"></picture></a>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="header-right">
\t\t\t\t\t\t<button type="button" class="navbar-toggle"><i class="icon icon-lines-menu"></i></button>
\t\t\t\t\t\t<div class="header-right-top">
\t\t\t\t\t\t\t<div class="address">Monday-Saturday <span class="custom-color">9:00AM - 6:00PM</span></div>
\t\t\t\t\t\t\t<div class="appointment"><i class="icon-shape icon"></i><span>Appointment</span></div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="header-right-bottom">
\t\t\t\t\t\t\t<div class="header-phone"><span class="text">CALL NOW FOR INSTANT QUOTE</span><a style="color:#fff;text-decoration:none;" href="tel:+1-763-533-2775" title="click to call now!"><span class="phone-number">1-<span class="code">763</span>-533-2775</span></a></div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div id="slidemenu">
\t\t\t\t\t<div class="row">
\t\t\t\t\t\t<div class="col-md-12">
\t\t\t\t\t\t\t<div class="close-menu"><i class="icon-close-cross"></i></div>
\t\t\t\t\t\t\t<ul class="nav navbar-nav">
\t\t\t\t\t\t\t\t<li><a href="/"><span>Home</span></a></li>
\t\t\t\t\t\t\t\t<li><a href="/blog/" aria-current="page"><span>Blog</span></a></li>
\t\t\t\t\t\t\t\t<li><a href="/testimonials"><span>Testimonials</span></a></li>
\t\t\t\t\t\t\t\t<li><a href="/faq"><span>FAQ</span></a></li>
\t\t\t\t\t\t\t\t<li><a href="/contact"><span>Contact</span></a></li>
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</nav>
\t</header>`;
}

function renderFooter(): string {
  return `\t<div class="page-footer">
\t\t<div class="footer-content">
\t\t\t<div class="footer-col-left">
\t\t\t\t<div class="inside">
\t\t\t\t\t<div class="footer-phone">
\t\t\t\t\t\t<h2 class="h-phone visible-lg">Call: <span class="number">763-533-2775</span></h2>
\t\t\t\t\t\t<h2 class="h-phone visible-xs">Call: <a class="number" style="text-decoration:none;" href="tel:+1-763-533-2775">763-533-2775</a></h2>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="contact-info"><i class="icon icon-locate"></i>Mailing Address:<br>Merritt's Auto Recycling<br>3106 68th Ave N<br>Brooklyn Center, MN 55429<br><br><a class="color" href="tel:+1-763-533-2775">Call For Instant Vehicle Quote Now!</a></div>
\t\t\t\t\t<div class="contact-info"><i class="icon icon-clock"></i>Monday-Saturday <span class="color">9:00AM - 6:00PM</span><br>Sunday Closed</div>
\t\t\t\t\t<div class="contact-info visible-xs"><a class="color" href="/faq">FAQ</a> | <a class="color" href="/testimonials">Testimonials</a></div>
\t\t\t\t\t<div class="social-links"><ul><li><a class="icon icon-facebook-logo" href="https://www.facebook.com/profile.php?id=61565403974405&sk=about/" target="_blank" rel="noopener"></a></li><li><a class="icon icon-interface-logo" href="/contact"></a></li></ul></div>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class="footer-col-right">
\t\t\t\t<div style="margin-top:75px; text-align:center;">
\t\t\t\t\t<picture><source type="image/avif" srcset="/images/optimized/footer-tow-truck.avif"><source type="image/webp" srcset="/images/optimized/footer-tow-truck.webp"><img class="img-responsive" src="/images/optimized/footer-tow-truck.jpg" alt="Merritt's Auto Recycling" width="1600" height="1070" loading="lazy" decoding="async"></picture>
\t\t\t\t\t<br>
\t\t\t\t\t<h2 class="h-lg" style="color:#fff;">Merritt's Auto Recycling</h2>
\t\t\t\t\t<p class="info color"><em>Cash For Junk Cars!</em></p>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t\t<div class="footer-bottom">
\t\t\t<div class="container">
\t\t\t\t<div class="copyright">© <script>var today = new Date(); var year = today.getFullYear(); document.write(year)</script> Merritt's Auto Recycling, All Rights Reserved</div>
\t\t\t</div>
\t\t</div>
\t</div>`;
}

function postFilePath(slug: string): string {
  return resolve(repoRoot, 'blog', `${slug}.html`);
}

function renderPostHeroMeta(post: BlogPost): string {
  return `\t<div id="pageTitle">
\t\t<div class="container">
\t\t\t<div class="breadcrumbs">
\t\t\t\t<ul class="breadcrumb">
\t\t\t\t\t<li><a href="/">Home</a></li>
\t\t\t\t\t<li><a href="/blog/">Blog</a></li>
\t\t\t\t\t<li>${escapeHtml(post.category)}</li>
\t\t\t\t</ul>
\t\t\t</div>
\t\t\t<!-- BEGIN auto:hero -->
\t\t\t<h1>${escapeHtml(post.title)}</h1>
\t\t\t<!-- END auto:hero -->
\t\t</div>
\t</div>`;
}

function renderPostMetaStrip(post: BlogPost): string {
  return `\t\t\t\t<div class="blog-meta">
\t\t\t\t\t<span class="blog-meta__author">By <a href="/about-brad">Brad Emholtz</a></span>
\t\t\t\t\t<span class="blog-meta__sep">·</span>
\t\t\t\t\t<span class="blog-meta__date">Published ${formatDateLong(post.datePublished)}</span>
\t\t\t\t\t<span class="blog-meta__sep">·</span>
\t\t\t\t\t<span class="blog-meta__readtime">${post.readTimeMinutes} min read</span>
\t\t\t\t</div>`;
}

function relatedForPost(
  post: BlogPost,
  cities: Record<string, City>,
  postsBySlug: Record<string, BlogPost>,
): string {
  const cityList = post.relatedCitySlugs
    .map((slug) => ({ slug, name: cities[slug]?.name ?? '' }))
    .filter((x) => x.name.length > 0);
  const postList = post.relatedPostSlugs
    .map((slug) => ({ slug, title: postsBySlug[slug]?.title ?? '' }))
    .filter((x) => x.title.length > 0);
  return renderRelatedLinks({ cities: cityList, posts: postList });
}

async function buildPostHtml(
  post: BlogPost,
  biz: Business,
  data: BlogData,
  cities: Record<string, City>,
  postsBySlug: Record<string, BlogPost>,
): Promise<string> {
  const body = await loadBody(post.slug);
  const head = renderHeadSkeleton(post, biz, data._meta.imageBase);
  const header = renderHeader();
  const footer = renderFooter();
  const heroMeta = renderPostHeroMeta(post);
  const metaStrip = renderPostMetaStrip(post);
  const related = relatedForPost(post, cities, postsBySlug);
  return `<!DOCTYPE html>
<html lang="en-US">
${head}
<body class="page-toplevel page-blog">
\t<a class="skip-link" href="#pageContent">Skip to main content</a>
${header}
${heroMeta}
\t<div id="pageContent" role="main" tabindex="-1">
\t\t<div class="block offset-sm">
\t\t\t<div class="container">
\t\t\t\t<div class="blog-layout">
${metaStrip}
${body}
${related}
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</div>
${footer}
\t<div class="darkout-menu"></div>
\t<script src="../js/plugins/jquery.min.js" defer></script>
\t<script src="../js/plugins/bootstrap.min.js" defer></script>
\t<script src="../js/custom.js" defer></script>
</body>
</html>
`;
}

function renderPostCard(post: BlogPost, imageBase: string): string {
  return `\t\t<article class="blog-card">
\t\t\t<a class="blog-card__media" href="/blog/${post.slug}" aria-label="Read: ${escapeHtml(post.title)}">
\t\t\t\t<picture>
\t\t\t\t\t<source type="image/avif" srcset="${imageBase.replace('https://merritts-auto-recycling.com', '..')}/${post.image.replace(/\.(jpg|png)$/, '.avif')}">
\t\t\t\t\t<source type="image/webp" srcset="${imageBase.replace('https://merritts-auto-recycling.com', '..')}/${post.image.replace(/\.(jpg|png)$/, '.webp')}">
\t\t\t\t\t<img src="${imageBase.replace('https://merritts-auto-recycling.com', '..')}/${post.image}" alt="${escapeHtml(post.imageAlt)}" width="900" height="600" loading="lazy" decoding="async">
\t\t\t\t</picture>
\t\t\t</a>
\t\t\t<div class="blog-card__body">
\t\t\t\t<span class="blog-card__category">${escapeHtml(post.category)}</span>
\t\t\t\t<h3 class="blog-card__title"><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h3>
\t\t\t\t<p class="blog-card__summary">${escapeHtml(post.summary)}</p>
\t\t\t\t<div class="blog-card__meta">
\t\t\t\t\t<span>${formatDateLong(post.datePublished)}</span>
\t\t\t\t\t<span class="blog-card__sep">·</span>
\t\t\t\t\t<span>${post.readTimeMinutes} min read</span>
\t\t\t\t</div>
\t\t\t</div>
\t\t</article>`;
}

function renderHubBody(data: BlogData): string {
  const cards = data.posts
    .slice()
    .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
    .map((p) => renderPostCard(p, data._meta.imageBase))
    .join('\n');
  return `<!-- BEGIN auto:blog-cards -->
<section class="blog-grid" aria-label="Blog posts">
${cards}
</section>
<!-- END auto:blog-cards -->`;
}

function renderHubHead(biz: Business): string {
  const title = `Blog — Cash for Junk Cars Guides for Minnesota Sellers | ${biz.name}`;
  const desc =
    'Practical, no-fluff guides on selling junk cars in Minnesota — pricing, titles, scrap value, the auto-recycling process, and how to get the most cash for your old vehicle.';
  return `<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WDZ8L9TN');</script>
<!-- End Google Tag Manager -->
\t<meta charset="utf-8">
\t<meta http-equiv="X-UA-Compatible" content="IE=edge">
\t<meta name="viewport" content="width=device-width, initial-scale=1">
\t<meta name="description" content="${escapeHtml(desc)}">
\t<meta name="format-detection" content="telephone=yes">
\t<link rel="icon" type="image/png" href="/images/favicon/favicon-96x96.png" sizes="96x96" />
\t<link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg" />
\t<link rel="shortcut icon" href="/images/favicon/favicon.ico" />
\t<link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
\t<meta name="apple-mobile-web-app-title" content="Merritt's" />
\t<link rel="manifest" href="/images/favicon/site.webmanifest" />
\t<link rel="canonical" href="${SITE}/blog/">
\t<title>${escapeHtml(title)}</title>
\t<link href="../css/plugins/bootstrap.min.css" rel="stylesheet">
\t<link href="../css/plugins/bootstrap-submenu.css" rel="stylesheet">
\t<link href="../css/plugins/animate.min.css" rel="stylesheet">
\t<link href="../css/plugins/slick.css" rel="stylesheet">
\t<link href="../css/custom.css" rel="stylesheet">
\t<link href="../css/color/color-green.css" rel="stylesheet">
\t<link href="../iconfont/style.css" rel="stylesheet">
\t<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WDZ8L9TN" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
\t<!-- BEGIN auto:fonts --><!-- END auto:fonts -->
\t<!-- BEGIN auto:og --><!-- END auto:og -->
\t<!-- BEGIN auto:twitter --><!-- END auto:twitter -->
\t<!-- BEGIN auto:geo --><!-- END auto:geo -->
\t<!-- BEGIN auto:pwa --><!-- END auto:pwa -->
\t<!-- BEGIN auto:preconnect --><!-- END auto:preconnect -->
\t<!-- BEGIN auto:verification --><!-- END auto:verification -->
\t<!-- BEGIN auto:jsonld-business --><!-- END auto:jsonld-business -->
\t<!-- BEGIN auto:jsonld-breadcrumb --><!-- END auto:jsonld-breadcrumb -->
\t<!-- BEGIN auto:jsonld-webpage --><!-- END auto:jsonld-webpage -->
\t<!-- BEGIN auto:jsonld-blog --><!-- END auto:jsonld-blog -->
</head>`;
}

function buildHubHtml(data: BlogData, biz: Business): string {
  const head = renderHubHead(biz);
  const header = renderHeader();
  const footer = renderFooter();
  const cards = renderHubBody(data);
  return `<!DOCTYPE html>
<html lang="en-US">
${head}
<body class="page-toplevel page-blog page-blog-index">
\t<a class="skip-link" href="#pageContent">Skip to main content</a>
${header}
\t<div id="pageTitle">
\t\t<div class="container">
\t\t\t<div class="breadcrumbs">
\t\t\t\t<ul class="breadcrumb">
\t\t\t\t\t<li><a href="/">Home</a></li>
\t\t\t\t\t<li>Blog</li>
\t\t\t\t</ul>
\t\t\t</div>
\t\t\t<!-- BEGIN auto:hero -->
\t\t\t<h1>Blog — Cash for Junk Cars in Minnesota</h1>
\t\t\t<!-- END auto:hero -->
\t\t</div>
\t</div>
\t<div id="pageContent" role="main" tabindex="-1">
\t\t<div class="block offset-sm">
\t\t\t<div class="container">
\t\t\t\t<p class="blog-hub-lede">Practical, no-fluff guides from <a href="/about-brad">Brad Emholtz</a> on how to sell a junk car in Minnesota — what it's worth, what paperwork you need, how scrap-metal pricing actually works, and the (sometimes surprising) details of the auto-recycling process. Need a quote right now? <a href="tel:+1-763-533-2775"><strong>Call 763-533-2775</strong></a>.</p>
${cards}
\t\t\t</div>
\t\t</div>
\t</div>
${footer}
\t<div class="darkout-menu"></div>
\t<script src="../js/plugins/jquery.min.js" defer></script>
\t<script src="../js/plugins/bootstrap.min.js" defer></script>
\t<script src="../js/custom.js" defer></script>
</body>
</html>
`;
}

async function writeIfChanged(path: string, contents: string): Promise<boolean> {
  const previous = await readFile(path, 'utf8').catch(() => '');
  if (previous === contents) return false;
  await writeFile(path, contents, 'utf8');
  return true;
}

async function regenerateExistingPostBlocks(
  data: BlogData,
  cities: Record<string, City>,
  postsBySlug: Record<string, BlogPost>,
): Promise<number> {
  // If a post HTML file already exists (was scaffolded earlier), refresh only the
  // auto:related sidebar block from current metadata. The article body stays as-is.
  let changed = 0;
  for (const post of data.posts) {
    const path = postFilePath(post.slug);
    const html = await readFile(path, 'utf8').catch(() => null);
    if (!html) continue;
    if (!/<!-- BEGIN auto:related -->/.test(html)) continue;
    const related = relatedForPost(post, cities, postsBySlug);
    const next = applyMarkerBlock(html, 'related', related);
    if (next !== html) {
      await writeFile(path, next, 'utf8');
      changed += 1;
    }
  }
  return changed;
}

async function main(): Promise<void> {
  const [data, biz, citiesData] = await Promise.all([
    loadBlogPosts(),
    loadBusiness(),
    loadCities(),
  ]);

  const cities = citiesData.cities;
  const postsBySlug: Record<string, BlogPost> = {};
  for (const p of data.posts) postsBySlug[p.slug] = p;

  // Ensure blog/ directory exists.
  const blogDir = resolve(repoRoot, 'blog');
  await readdir(blogDir).catch(async () => {
    const { mkdir } = await import('node:fs/promises');
    await mkdir(blogDir, { recursive: true });
  });

  let postsScaffolded = 0;
  let postsRefreshed = 0;
  for (const post of data.posts) {
    const path = postFilePath(post.slug);
    const existing = await readFile(path, 'utf8').catch(() => null);
    if (existing === null) {
      const html = await buildPostHtml(post, biz, data, cities, postsBySlug);
      await writeFile(path, html, 'utf8');
      postsScaffolded += 1;
      console.info(`  ✓ blog/${post.slug}.html (scaffolded)`);
    }
  }
  postsRefreshed = await regenerateExistingPostBlocks(data, cities, postsBySlug);

  // Hub: scaffold from scratch only if missing. On reruns, refresh just the
  // auto:blog-cards block so apply-shared-blocks's head/JSON-LD work is preserved.
  const hubPath = resolve(blogDir, 'index.html');
  const existingHub = await readFile(hubPath, 'utf8').catch(() => null);
  let hubChanged = false;
  if (existingHub === null) {
    const hubHtml = buildHubHtml(data, biz);
    await writeFile(hubPath, hubHtml, 'utf8');
    hubChanged = true;
    console.info('  ✓ blog/index.html (scaffolded)');
  } else {
    const cardsBlock = renderHubBody(data);
    const next = applyMarkerBlock(existingHub, 'blog-cards', cardsBlock);
    if (next !== existingHub) {
      await writeFile(hubPath, next, 'utf8');
      hubChanged = true;
      console.info('  ✓ blog/index.html (cards refreshed)');
    }
  }

  // Blog index JSON-LD lives in the hub via apply-shared-blocks's extraJsonLd hook, so we
  // don't write it here — just verify the marker exists in the hub file.
  void renderBlogIndexJsonLd;
  void writeIfChanged;

  console.info(
    `Done. Scaffolded ${postsScaffolded} new post(s), refreshed ${postsRefreshed} related sidebar(s), hub ${hubChanged ? 'updated' : 'unchanged'}.`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
