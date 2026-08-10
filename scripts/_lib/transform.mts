/**
 * HTML transforms applied to placemark / top-level pages.
 *
 * Idempotent: every block we inject is wrapped in `<!-- BEGIN auto:NAME --> ... <!-- END auto:NAME -->`
 * marker comments so the script can re-run without producing duplicates.
 */

export type Replacement = { begin: string; end: string; content: string };

/**
 * `String.replace` interprets `$&`, `$1`, `$$` etc. in the replacement string as
 * back-references. To pass replacement text verbatim (which is what every helper
 * here wants), use a function replacer so the string is taken literally.
 */
function literalReplace(haystack: string, pattern: RegExp | string, replacement: string): string {
  return haystack.replace(pattern as RegExp, () => replacement);
}

export function applyMarkerBlock(html: string, name: string, content: string): string {
  const begin = `<!-- BEGIN auto:${name} -->`;
  const end = `<!-- END auto:${name} -->`;
  const marker = new RegExp(`${escapeRegex(begin)}[\\s\\S]*?${escapeRegex(end)}`, 'g');
  if (marker.test(html)) {
    return literalReplace(html, marker, content);
  }
  return html;
}

export function injectBeforeClosingHead(html: string, content: string): string {
  if (html.includes(content.split('\n')[0]!)) {
    return html;
  }
  return literalReplace(html, /<\/head>/i, `${content}\n</head>`);
}

export function injectIntoHead(html: string, blockName: string, content: string): string {
  const begin = `<!-- BEGIN auto:${blockName} -->`;
  const end = `<!-- END auto:${blockName} -->`;
  const re = new RegExp(`${escapeRegex(begin)}[\\s\\S]*?${escapeRegex(end)}`, 'g');
  if (re.test(html)) {
    return literalReplace(html, re, content);
  }
  return literalReplace(html, /<\/head>/i, `${content}\n</head>`);
}

export function injectBeforeMainContent(html: string, blockName: string, content: string): string {
  const begin = `<!-- BEGIN auto:${blockName} -->`;
  const end = `<!-- END auto:${blockName} -->`;
  const re = new RegExp(`${escapeRegex(begin)}[\\s\\S]*?${escapeRegex(end)}`, 'g');
  if (re.test(html)) {
    return literalReplace(html, re, content);
  }
  return literalReplace(html, /<div id="pageContent">/, `<div id="pageContent">\n${content}`);
}

export function injectAfterMarker(
  html: string,
  afterMarker: string,
  blockName: string,
  content: string,
): string {
  const begin = `<!-- BEGIN auto:${blockName} -->`;
  const end = `<!-- END auto:${blockName} -->`;
  const re = new RegExp(`${escapeRegex(begin)}[\\s\\S]*?${escapeRegex(end)}`, 'g');
  if (re.test(html)) {
    return literalReplace(html, re, content);
  }
  return literalReplace(html, afterMarker, `${afterMarker}\n${content}`);
}

/**
 * Idempotent inject of a marker-wrapped block immediately before a stable anchor string.
 * If the named block already exists anywhere in the document, replace it in place; otherwise
 * insert directly before the first occurrence of `beforeAnchor`.
 *
 * Used for content that belongs at the bottom of `<div id="pageContent">` (nearby-cities,
 * faq-visible) where the closing marker `<!-- // Content  -->` is the most stable anchor
 * across all 53 placemark templates.
 */
export function injectBeforeMarker(
  html: string,
  beforeAnchor: string,
  blockName: string,
  content: string,
): string {
  const begin = `<!-- BEGIN auto:${blockName} -->`;
  const end = `<!-- END auto:${blockName} -->`;
  const re = new RegExp(`${escapeRegex(begin)}[\\s\\S]*?${escapeRegex(end)}`, 'g');
  if (re.test(html)) {
    return literalReplace(html, re, content);
  }
  return literalReplace(html, beforeAnchor, `${content}\n\t${beforeAnchor}`);
}

export function replaceTitle(html: string, title: string): string {
  return literalReplace(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtmlAttr(title)}</title>`,
  );
}

export function replaceMetaDescription(html: string, description: string): string {
  const tag = `<meta name="description" content="${escapeHtmlAttr(description)}">`;
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    return literalReplace(html, /<meta\s+name=["']description["'][^>]*>/i, tag);
  }
  return literalReplace(html, /<\/head>/i, `\t${tag}\n</head>`);
}

export function replaceOgTags(
  html: string,
  args: {
    title: string;
    description: string;
    url: string;
    image: string;
    siteName: string;
    locale?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageType?: string;
    imageAlt?: string;
  },
): string {
  const block = `<!-- BEGIN auto:og -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtmlAttr(args.siteName)}">
<meta property="og:locale" content="${args.locale ?? 'en_US'}">
<meta property="og:title" content="${escapeHtmlAttr(args.title)}">
<meta property="og:description" content="${escapeHtmlAttr(args.description)}">
<meta property="og:url" content="${args.url}">
<meta property="og:image" content="${args.image}">
<meta property="og:image:type" content="${args.imageType ?? 'image/jpeg'}">
<meta property="og:image:width" content="${args.imageWidth ?? 1200}">
<meta property="og:image:height" content="${args.imageHeight ?? 630}">
<meta property="og:image:alt" content="${escapeHtmlAttr(args.imageAlt ?? args.siteName + ' — Cash for Junk Cars')}">
<!-- END auto:og -->`;

  const re = /<!-- BEGIN auto:og -->[\s\S]*?<!-- END auto:og -->/;
  if (re.test(html)) {
    return literalReplace(html, re, block);
  }

  let stripped = html.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*\n?/gi, '');
  stripped = stripped.replace(/<meta\s+name=["']og:[^"']+["'][^>]*>\s*\n?/gi, '');
  return literalReplace(stripped, /<\/head>/i, `\t${block.split('\n').join('\n\t')}\n</head>`);
}

export function replaceCanonical(html: string, url: string): string {
  const tag = `<link rel="canonical" href="${url}">`;
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    return literalReplace(html, /<link\s+rel=["']canonical["'][^>]*>/i, tag);
  }
  return literalReplace(html, /<\/head>/i, `\t${tag}\n</head>`);
}

/**
 * Strip any pre-existing `<script type="application/ld+json">` block that is NOT inside a
 * `<!-- BEGIN auto:jsonld-* -->` marker pair. These are legacy hand-authored blocks (e.g.
 * the AutoRepair type on testimonials.html) that conflict with the canonical generated
 * schema. Safe because we always re-emit the data-driven version after this pass.
 */
export function removeLegacyJsonLd(html: string): string {
  const markers: { start: number; end: number }[] = [];
  const markerRe = /<!-- BEGIN auto:jsonld-[a-z-]+ -->[\s\S]*?<!-- END auto:jsonld-[a-z-]+ -->/g;
  let m: RegExpExecArray | null;
  while ((m = markerRe.exec(html)) !== null) {
    markers.push({ start: m.index, end: m.index + m[0].length });
  }

  const isInsideMarker = (start: number): boolean =>
    markers.some((mk) => start >= mk.start && start < mk.end);

  const scriptRe =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*\n?/gi;
  return html.replace(scriptRe, (match, ..._args) => {
    const offset = _args[_args.length - 2] as number;
    return isInsideMarker(offset) ? match : '';
  });
}

export function removeDeadMapsScript(html: string): string {
  return html
    .replace(
      /<!--\s*Google map\s*-->\s*\n?\s*<!--\s*<script[^>]*Maps-Api-Key-Here[\s\S]*?<\/script>\s*-->\s*\n?/gi,
      '',
    )
    .replace(
      /<script[^>]*src="[^"]*maps\.googleapis\.com\/maps\/api\/js\?key=Maps-Api-Key-Here[^"]*"[^>]*>\s*<\/script>\s*\n?/gi,
      '',
    )
    .replace(
      /<!--\s*<script[^>]*src="[^"]*maps\.googleapis\.com[^"]*Maps-Api-Key-Here[\s\S]*?<\/script>\s*-->\s*\n?/gi,
      '',
    );
}

export function removeGoogleFontsLink(html: string): string {
  return html.replace(
    /<link[^>]*href="https:\/\/fonts\.googleapis\.com\/css(\?|2\?)family=Muli[^"]*"[^>]*>\s*\n?/gi,
    '',
  );
}

/**
 * Defer-load Muli with `font-display: swap` and only the weights actually used (400/600/700).
 * The async pattern (`media="print"` flip on load) eliminates the render-blocking CSS request
 * for the font without dropping FOUC mitigation on browsers that respect the swap.
 */
export function injectFontStylesheet(html: string): string {
  const block = `<!-- BEGIN auto:fonts -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Muli:wght@400;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Muli:wght@400;600;700&display=swap" media="print" onload="this.media='all';this.onload=null;">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Muli:wght@400;600;700&display=swap"></noscript>
<!-- END auto:fonts -->`;
  if (html.includes('<!-- BEGIN auto:fonts -->')) {
    return literalReplace(html, /<!-- BEGIN auto:fonts -->[\s\S]*?<!-- END auto:fonts -->/, block);
  }
  return literalReplace(html, /<\/head>/i, `${block}\n</head>`);
}

/**
 * Drop the legacy "loading…" splash that gates rendering behind a `body.loaded` class flip,
 * including its CSS. Modern devices have no need for an artificial preloader and the splash
 * actively delays LCP.
 *
 * Anchored on the `<!-- //Loader -->` closing comment so we cannot over-consume into footer
 * markup if the inner DOM ever drifts. The optional preceding `<!-- Loader -->` opener is
 * dropped too so we don't leave a dangling comment.
 */
export function removeLoaderSplash(html: string): string {
  return html.replace(
    /(?:[\t ]*<!--\s*Loader\s*-->\s*\n?)?[\t ]*<div\s+id="loader-wrapper"[\s\S]*?<!--\s*\/\/Loader\s*-->\s*\n?/i,
    '',
  );
}

/**
 * Add `defer` to every <script src="…js/…"> that points to a local plugin/custom script and
 * doesn't already declare async/defer/type=module. jQuery itself stays sync because legacy
 * plugins assume `$` is defined at parse time.
 */
export function deferLocalScripts(html: string): string {
  return html.replace(
    /<script\b([^>]*\bsrc="(?:\.\.\/)?(?:js\/(?!jquery)[^"]+)")([^>]*)>/gi,
    (match, before: string, after: string) => {
      if (/\b(async|defer)\b/i.test(match)) return match;
      if (/\btype="module"/i.test(match)) return match;
      return `<script${before} defer${after}>`;
    },
  );
}

/**
 * Keep analytics off the critical rendering path. Interaction starts GTM
 * immediately; otherwise it loads after a conservative post-load delay so
 * navigation and conversions are still measured without competing with LCP.
 */
export function deferGoogleTagManager(html: string): string {
  const block = `<!-- Google Tag Manager -->
<script>
  (function (w, d) {
    w.dataLayer = w.dataLayer || [];
    var loaded = false;
    function loadGtm() {
      if (loaded) return;
      loaded = true;
      w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var script = d.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WDZ8L9TN';
      d.head.appendChild(script);
    }
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (eventName) {
      w.addEventListener(eventName, loadGtm, { once: true, passive: true });
    });
    w.addEventListener('load', function () { w.setTimeout(loadGtm, 10000); }, { once: true });
  })(window, document);
</script>
<!-- End Google Tag Manager -->`;
  return literalReplace(
    html,
    /<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/i,
    block,
  );
}

/** Load Turnstile only when its live form approaches the viewport or receives focus. */
export function lazyLoadTurnstile(html: string): string {
  if (!html.includes('<!-- BEGIN auto:turnstile -->')) return html;
  const block = `<!-- BEGIN auto:turnstile -->
<script>
  (function (w, d) {
    function prepare() {
      var widget = d.querySelector('.cf-turnstile');
      if (!widget) return;
      var loaded = false;
      function loadTurnstile() {
        if (loaded) return;
        loaded = true;
        var script = d.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        d.head.appendChild(script);
      }
      var form = widget.closest('form');
      if (form) {
        form.addEventListener('focusin', loadTurnstile, { once: true });
        form.addEventListener('pointerdown', loadTurnstile, { once: true, passive: true });
      }
      if ('IntersectionObserver' in w) {
        var observer = new IntersectionObserver(function (entries) {
          if (entries.some(function (entry) { return entry.isIntersecting; })) {
            observer.disconnect();
            loadTurnstile();
          }
        }, { rootMargin: '200px' });
        observer.observe(widget);
      }
    }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', prepare, { once: true });
    else prepare();
  })(window, document);
</script>
<!-- END auto:turnstile -->`;
  return literalReplace(
    html,
    /<!-- BEGIN auto:turnstile -->[\s\S]*?<!-- END auto:turnstile -->/i,
    block,
  );
}

/** Defer map embeds until they actually enter the viewport. */
export function lazyLoadMapIframes(html: string): string {
  return html.replace(/<iframe\b[^>]*>/gi, (tag) => {
    const source = tag.match(
      /\bsrc=(['"])([^'"]*(?:google\.com\/maps|maps\.google\.com)[^'"]*)\1/i,
    );
    if (!source?.[2] || /\bdata-map-src=/.test(tag)) return tag;
    let next = tag.replace(source[0], `src="about:blank" data-map-src="${source[2]}"`);
    if (!/\btitle=/.test(next)) {
      next = next.replace('<iframe', '<iframe title="Merritt’s Auto Recycling service area map"');
    }
    return next;
  });
}

/** Add names/levels to repeated legacy controls without changing their visual design. */
export function improveLegacyAccessibility(html: string): string {
  let next = html.replace(
    /<button\b([^>]*\bclass="[^"]*navbar-toggle[^"]*"[^>]*)>/gi,
    (tag, attrs: string) => {
      if (/\baria-label=/.test(tag)) return tag;
      return `<button${attrs} aria-label="Open navigation" aria-controls="slidemenu" aria-expanded="false">`;
    },
  );
  next = next.replace(
    /<a\b([^>]*\bclass="[^"]*icon-facebook-logo[^"]*"[^>]*)>/gi,
    (tag, attrs: string) =>
      /\baria-label=/.test(tag)
        ? tag
        : `<a${attrs} aria-label="Merritt’s Auto Recycling on Facebook">`,
  );
  next = next.replace(
    /<a\b([^>]*\bclass="[^"]*icon-interface-logo[^"]*"[^>]*)>/gi,
    (tag, attrs: string) =>
      /\baria-label=/.test(tag) ? tag : `<a${attrs} aria-label="Contact Merritt’s Auto Recycling">`,
  );
  return next.replace(/<h5\b([^>]*)>/gi, (tag, attrs: string) =>
    /\baria-level=/.test(tag) ? tag : `<h5${attrs} aria-level="3">`,
  );
}

/** Remove form/date bundles from pages that have no live matching controls. */
export function pruneUnusedPageAssets(html: string): string {
  // The legacy appointment modal is commented out with a comment that also contains
  // ordinary HTML comments. Remove that whole block first so its form controls do not
  // make date/form bundles look live on every page.
  const visible = html
    .replace(/<!--<div\b[^>]*class="[^"]*modal fade[^"]*"[\s\S]*?<\/div>-->/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const hasForm = /<form\b/i.test(visible);
  const hasDatePicker =
    /<(?:input|select)\b[^>]*(?:class=["'][^"']*(?:datetimepicker|timepicker)|name=["'](?:date|time)["'])/i.test(
      visible,
    );
  const removeScript = (source: string, fragment: string): string =>
    source.replace(
      new RegExp(
        `<script\\b[^>]*src=["'][^"']*${escapeRegex(fragment)}[^"']*["'][^>]*>\\s*<\\/script>\\s*`,
        'gi',
      ),
      '',
    );
  const removeStylesheet = (source: string, fragment: string): string =>
    source.replace(
      new RegExp(`<link\\b[^>]*href=["'][^"']*${escapeRegex(fragment)}[^"']*["'][^>]*>\\s*`, 'gi'),
      '',
    );

  let next = html.replace(
    /src="((?:\.\.\/)?js)\/plugins\/jquery\.min\.js"/gi,
    'src="$1/jquery.js"',
  );
  if (!hasForm) {
    for (const asset of ['jquery.form.js', 'jquery.validate.min.js', 'forms.js']) {
      next = removeScript(next, asset);
    }
  }
  if (!hasDatePicker) {
    for (const asset of ['moment.js', 'bootstrap-datetimepicker.min.js']) {
      next = removeScript(next, asset);
    }
    next = removeStylesheet(next, 'bootstrap-datetimepicker.css');
  }
  return next;
}

/**
 * LCP preload for the first slider slide (the hero LCP candidate on every page).
 * Targets AVIF first with `type` so unsupported browsers don't race-download it; WebP comes
 * as a fallback preload with the same imagesrcset behavior.
 */
export function injectLcpPreload(html: string): string {
  const href = html.includes('id="mainSlider"')
    ? '/images/optimized/slider/slide1.avif'
    : html.includes('id="pageTitle"')
      ? '/images/optimized/header-photo-bg.avif'
      : null;
  if (!href) return html;
  const block = `<!-- BEGIN auto:lcp-preload -->
<link rel="preload" as="image" type="image/avif" href="${href}" fetchpriority="high">
<!-- END auto:lcp-preload -->`;
  if (html.includes('<!-- BEGIN auto:lcp-preload -->')) {
    return literalReplace(
      html,
      /<!-- BEGIN auto:lcp-preload -->[\s\S]*?<!-- END auto:lcp-preload -->/,
      block,
    );
  }
  return literalReplace(html, /<\/head>/i, `${block}\n</head>`);
}

export function updateYearsInBusiness(html: string, years: number): string {
  return html
    .replace(
      /Over\s+17\s+Years\s+Of\s+Trusted\s+Auto\s+Recycling/gi,
      `Over ${years} Years Of Trusted Auto Recycling`,
    )
    .replace(/for\s+over\s+17\s+years/gi, `for over ${years} years`)
    .replace(
      /data-to="36"\s+data-speed="1000">36/g,
      `data-to="${years}" data-speed="1000">${years}`,
    )
    .replace(
      /data-to="37"\s+data-speed="1000">37/g,
      `data-to="${years}" data-speed="1000">${years}`,
    );
}

export function setLangAttribute(html: string, lang: string): string {
  return html.replace(/<html[^>]*>/i, (match) => {
    if (/\blang=["']/.test(match)) {
      return match.replace(/\blang=["'][^"']*["']/, `lang="${lang}"`);
    }
    return match.replace(/<html/, `<html lang="${lang}"`);
  });
}

export function setBodyClass(html: string, additionalClass: string): string {
  return html.replace(/<body\s+class="([^"]*)">/, (_match, classes: string) => {
    const set = new Set(classes.split(/\s+/).filter(Boolean));
    set.add(additionalClass);
    return `<body class="${Array.from(set).join(' ')}">`;
  });
}

/**
 * Promote `<div id="pageContent">` to an ARIA main landmark in-place. Adding `role="main"`
 * + `tabindex="-1"` rather than retagging to `<main>` keeps the closing tag stable across
 * 57 templates with nested divs and existing JS selectors. `tabindex="-1"` lets the skip
 * link land focus inside the landmark.
 */
export function addRoleMainToPageContent(html: string): string {
  if (/<div\s+id="pageContent"[^>]*\brole="main"/i.test(html)) return html;
  return html.replace(
    /<div\s+id="pageContent"([^>]*)>/i,
    (_match, attrs: string) => `<div id="pageContent"${attrs} role="main" tabindex="-1">`,
  );
}

/**
 * Insert a visible-on-focus skip link as the first child of `<body>` so keyboard users can
 * bypass header + nav. Idempotent — bails if the link already exists.
 */
export function addSkipLink(html: string): string {
  if (/class="skip-link"/.test(html)) return html;
  const link = `\t<a class="skip-link" href="#pageContent">Skip to main content</a>`;
  return html.replace(/<body([^>]*)>/i, (_match, attrs: string) => `<body${attrs}>\n${link}`);
}

/**
 * Ensure the primary navbar carries `aria-label="Primary"` so screen readers can distinguish
 * it from any other future `<nav>` landmark (e.g. breadcrumb, footer nav).
 */
export function addNavAriaLabel(html: string): string {
  return html.replace(
    /<nav\b([^>]*)\bid="slide-nav"([^>]*)>/i,
    (match, pre: string, post: string) => {
      if (/\baria-label=/.test(match)) return match;
      return `<nav${pre}id="slide-nav"${post} aria-label="Primary">`;
    },
  );
}

/**
 * Mark the currently-active nav anchor with `aria-current="page"`. The match is by `href`
 * value (URL-suffix match to handle both `/contact` and `contact.html`). Existing matching
 * anchors are not duplicated.
 */
export function addAriaCurrentToNav(html: string, currentHref: string): string {
  const headerStart = html.indexOf('<header');
  const headerEnd = html.indexOf('</header>', headerStart);
  if (headerStart === -1 || headerEnd === -1) return html;

  const before = html.slice(0, headerStart);
  const header = html.slice(headerStart, headerEnd);
  const after = html.slice(headerEnd);

  const updated = header.replace(
    /<a\b([^>]*?)\bhref="([^"]+)"([^>]*)>/gi,
    (match, pre: string, href: string, post: string) => {
      const norm = href.replace(/\.html$/, '').replace(/\/$/, '');
      const target = currentHref.replace(/\.html$/, '').replace(/\/$/, '');
      if (norm !== target && norm !== `/${target}` && href !== currentHref) return match;
      if (/\baria-current=/.test(match)) return match;
      return `<a${pre}href="${href}"${post} aria-current="page">`;
    },
  );

  return `${before}${updated}${after}`;
}

/**
 * Demote every `<h1>` that lives outside the `<!-- BEGIN auto:hero --> … <!-- END auto:hero -->`
 * block to `<h2>`. Page templates from the original site frequently shipped multiple H1s — we
 * keep exactly one (the SEO-tuned hero) and downgrade the rest.
 *
 * Idempotent: H1s already replaced by H2s simply aren't matched on the second run.
 */
export function demoteLegacyH1s(html: string): string {
  const heroStart = html.indexOf('<!-- BEGIN auto:hero -->');
  const heroEnd = heroStart === -1 ? -1 : html.indexOf('<!-- END auto:hero -->', heroStart);
  const heroBlockEnd = heroEnd === -1 ? -1 : heroEnd + '<!-- END auto:hero -->'.length;

  const rewriteOutsideHero = (segment: string): string =>
    segment
      .replace(/<h1(\s[^>]*)?>/gi, (_match, attrs: string | undefined) => `<h2${attrs ?? ''}>`)
      .replace(/<\/h1>/gi, '</h2>');

  if (heroStart === -1 || heroBlockEnd === -1) {
    return rewriteOutsideHero(html);
  }

  const before = html.slice(0, heroStart);
  const hero = html.slice(heroStart, heroBlockEnd);
  const after = html.slice(heroBlockEnd);
  return `${rewriteOutsideHero(before)}${hero}${rewriteOutsideHero(after)}`;
}

/**
 * Insert "About Brad" as a primary nav link if it is missing. Idempotent — bails when the
 * link already exists. Honors the page's own URL style (placemarks use `../about-brad.html`,
 * top-level pages use `/about-brad`).
 */
export function insertAboutBradNavLink(html: string, hrefStyle: 'absolute' | 'relative'): string {
  // Detect existing About Brad nav link in any of the supported href forms (/about-brad,
  // /about-brad.html, ../about-brad.html, about-brad.html). The earlier guard required no
  // leading slash and silently inserted dupes on top-level pages.
  if (
    /<a[^>]*href="(?:\/|\.\.\/)?about-brad(?:\.html)?"[^>]*>\s*<span>\s*About\s+Brad\s*<\/span>/i.test(
      html,
    )
  ) {
    return html;
  }
  const href = hrefStyle === 'absolute' ? '/about-brad' : '../about-brad.html';
  const newLi = `<li><a href="${href}"><span>About Brad</span></a></li>`;
  return html.replace(
    /(<ul class="nav navbar-nav">\s*<li\b[^>]*><a href="(?:\.\.\/)?(?:index\.html)?\/?"[^>]*><span>Home<\/span><\/a><\/li>)/i,
    (_match, opening: string) => `${opening}\n\t\t\t\t\t\t\t\t\t${newLi}`,
  );
}

/**
 * Removes any duplicate "About Brad" <li> nav entries that may have been inserted by an
 * earlier-buggy version of `insertAboutBradNavLink`. Keeps the first occurrence and strips
 * the rest, preserving the `class="active"` flag on the survivor if it was on a duplicate.
 */
export function dedupeAboutBradNavLinks(html: string): string {
  const navMatch = html.match(/(<ul class="nav navbar-nav">[\s\S]*?<\/ul>)/);
  if (!navMatch) return html;
  const navBlock = navMatch[1]!;
  const liRegex =
    /<li(?:\s+class="active")?[^>]*>\s*<a [^>]*href="(?:\/|\.\.\/)?about-brad(?:\.html)?"[^>]*>\s*<span>\s*About\s+Brad\s*<\/span>\s*<\/a>\s*<\/li>/gi;
  const matches = navBlock.match(liRegex) ?? [];
  if (matches.length <= 1) return html;
  const hasActive = matches.some((s) => /class="active"/.test(s));
  let kept = false;
  const newNav = navBlock.replace(liRegex, () => {
    if (kept) return '';
    kept = true;
    // Promote the kept one to active if any of the dupes was active.
    return hasActive
      ? matches[0]!.replace(/<li(?:\s+class="active")?/, '<li class="active"')
      : matches[0]!;
  });
  return html.replace(navBlock, newNav);
}

/**
 * Insert "Blog" as a primary nav link if it is missing. Idempotent — bails when the link
 * already exists. Honors the page's URL style: `/blog/` for top-level and blog pages,
 * `../blog/` for placemarks (relative two-deep paths).
 */
export function insertBlogNavLink(html: string, hrefStyle: 'absolute' | 'relative'): string {
  // Detect existing Blog link in supported href forms.
  if (/<a[^>]*href="(?:\/|\.\.\/)?blog\/?"[^>]*>\s*<span>\s*Blog\s*<\/span>/i.test(html)) {
    return html;
  }
  const href = hrefStyle === 'absolute' ? '/blog/' : '../blog/';
  const newLi = `<li><a href="${href}"><span>Blog</span></a></li>`;
  return html.replace(
    /(<ul class="nav navbar-nav">\s*<li\b[^>]*><a href="(?:\.\.\/)?(?:index\.html)?\/?"[^>]*><span>Home<\/span><\/a><\/li>)/i,
    (_match, opening: string) => `${opening}\n\t\t\t\t\t\t\t\t\t${newLi}`,
  );
}

/**
 * Removes any duplicate "Blog" <li> nav entries that may have been inserted by an earlier
 * run before the guard regex was tightened.
 */
export function dedupeBlogNavLinks(html: string): string {
  const navMatch = html.match(/(<ul class="nav navbar-nav">[\s\S]*?<\/ul>)/);
  if (!navMatch) return html;
  const navBlock = navMatch[1]!;
  const liRegex =
    /<li(?:\s+class="active")?[^>]*>\s*<a [^>]*href="(?:\/|\.\.\/)?blog\/?"[^>]*(?:\s+aria-current="page")?>\s*<span>\s*Blog\s*<\/span>\s*<\/a>\s*<\/li>/gi;
  const matches = navBlock.match(liRegex) ?? [];
  if (matches.length <= 1) return html;
  const hasActive = matches.some((s) => /class="active"|aria-current="page"/.test(s));
  let kept = false;
  const newNav = navBlock.replace(liRegex, () => {
    if (kept) return '';
    kept = true;
    return hasActive
      ? matches[0]!.replace(/<li(?:\s+class="active")?/, '<li class="active"')
      : matches[0]!;
  });
  return html.replace(navBlock, newNav);
}

/**
 * Removes every "Cash Calculator" primary-nav `<li>` from the navbar. The calculator page has
 * been deprecated; this transform cleans up the link that earlier runs of
 * `insertQuoteCalculatorNavLink` inserted across all 70 pages.
 */
export function removeQuoteCalculatorNavLink(html: string): string {
  const navMatch = html.match(/(<ul class="nav navbar-nav">[\s\S]*?<\/ul>)/);
  if (!navMatch) return html;
  const navBlock = navMatch[1]!;
  const liRegex =
    /\s*<li(?:\s+class="active")?[^>]*>\s*<a [^>]*href="(?:\/|\.\.\/)?quote-calculator(?:\.html)?"[^>]*(?:\s+aria-current="page")?>\s*<span>\s*Cash\s+Calculator\s*<\/span>\s*<\/a>\s*<\/li>/gi;
  if (!liRegex.test(navBlock)) return html;
  liRegex.lastIndex = 0;
  const newNav = navBlock.replace(liRegex, '');
  return html.replace(navBlock, newNav);
}

/**
 * Repoint the header CTA at `/contact`. The button originally routed to `/quote-calculator`;
 * after deprecating the calculator we send the highest-visibility header slot to the contact
 * form (the next-highest-intent surface). Also handles legacy `<div class="appointment">…
 * Appointment…</div>` markup on pages the calculator transform never touched.
 *
 * Idempotent: leaves the anchor untouched when it already points at `/contact`.
 */
export function pointAppointmentButtonAtContact(
  html: string,
  hrefStyle: 'absolute' | 'relative',
): string {
  const href = hrefStyle === 'absolute' ? '/contact' : '../contact.html';
  const replacement = `<a class="appointment appointment-cta" href="${href}" aria-label="Request a cash quote — contact Merritt's Auto Recycling"><i class="icon-shape icon" aria-hidden="true"></i><span>Get Cash Quote</span></a>`;

  let next = html;

  // Repoint any existing calculator anchor at /contact. The opening-tag match uses `[^>]*?` so it
  // stays within a single `<a …>` and cannot span across an earlier unrelated `<a>` (e.g. the
  // skip-link). Closing tag accepts both the inline and prettier-multiline (`</a\n>`) forms.
  const calcAnchorRe =
    /<a[^>]*?class="appointment appointment-cta"[^>]*?href="(?:\/|\.\.\/)?quote-calculator(?:\.html)?"[^>]*?>\s*<i\s+class="icon-shape icon"[^>]*>\s*<\/i>\s*<span>[^<]*<\/span>\s*<\/a\s*>/i;
  if (calcAnchorRe.test(next)) {
    next = literalReplace(next, calcAnchorRe, replacement);
  }

  // Legacy decorative `<div class="appointment">…Appointment…</div>` markup.
  const headerDivRe =
    /<div\s+class="appointment">\s*(?:<a\s+href="tel:[^"]*">)?\s*<i\s+class="icon-shape icon"[^>]*>\s*<\/i>\s*<span>\s*Appointment\s*<\/span>\s*(?:<\/a>\s*)?<\/div>/i;
  if (headerDivRe.test(next)) {
    next = literalReplace(next, headerDivRe, replacement);
  }

  return next;
}

/**
 * Inject a sticky mobile click-to-call + SMS bar as the last child of `<body>`. Visible only on
 * narrow viewports via the `.sticky-call` CSS rule. Idempotent via marker block.
 */
export function addStickyMobileCall(html: string, phone: string, smsPhone: string): string {
  const block = `<!-- BEGIN auto:sticky-call -->
<aside class="sticky-call" aria-label="Call or text Merritt's Auto Recycling">
\t<a class="sticky-call__btn sticky-call__btn--call" href="tel:+1-${phone}">
\t\t<span class="sticky-call__icon" aria-hidden="true"><i class="icon-phone"></i></span>
\t\t<span class="sticky-call__label">Call <strong>${phone}</strong></span>
\t</a>
\t<a class="sticky-call__btn sticky-call__btn--sms" href="sms:+1-${smsPhone}">
\t\t<span class="sticky-call__icon" aria-hidden="true"><i class="icon-mail"></i></span>
\t\t<span class="sticky-call__label">Text Us</span>
\t</a>
</aside>
<!-- END auto:sticky-call -->`;
  if (html.includes('<!-- BEGIN auto:sticky-call -->')) {
    return html.replace(
      /<!-- BEGIN auto:sticky-call -->[\s\S]*?<!-- END auto:sticky-call -->/,
      () => block,
    );
  }
  return html.replace(/(\s*)<\/body>/i, (_match, ws: string) => `\n${block}${ws}</body>`);
}

/**
 * Replace commented-out `sms:` link variants with active ones. Source pages had jQuery-toggled
 * SMS buttons that were commented out — bring them back so mobile users get the text option.
 */
export function activateSmsLinks(html: string): string {
  return html
    .replace(
      /<!--\s*(<h2[^>]*class="h-phone visible-xs"[^>]*>\s*Text:\s*<a[^>]*href="sms:[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/h2>)\s*-->/gi,
      '$1',
    )
    .replace(
      /<!--\s*(<div class="visible-xs"><br\s*\/?>\s*<a[^>]*href="sms:[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/div>)\s*-->/gi,
      '$1',
    );
}

export function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
