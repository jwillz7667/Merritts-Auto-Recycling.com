/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Subject line: imperative, no trailing period, sentence-case body
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],

    // Type — allow the standard set + a few project-specific ones
    'type-enum': [
      2,
      'always',
      [
        'feat', // user-facing feature
        'fix', // bug fix
        'perf', // performance work (LCP, INP, bundle size)
        'seo', // SEO surface — meta, schema, sitemap, content
        'a11y', // accessibility — WCAG, ARIA, contrast, keyboard
        'refactor', // no behavior change
        'style', // formatting only, no logic
        'docs', // README, CLAUDE.md, comments
        'test', // adding/refactoring tests
        'build', // build system, deps, scripts
        'ci', // CI/CD configuration
        'chore', // tooling, housekeeping
        'revert', // git revert
        'content', // copy edits, blog posts, FAQ updates
        'infra', // hosting, DNS, vercel.json, env vars
      ],
    ],

    // Scope is optional but encouraged. Common scopes: forms, blog, placemarks,
    // images, schema, sitemap, hub, redirects, headers.
    'scope-case': [2, 'always', 'lower-case'],

    // Body lines should wrap at 100 — long links get a pass.
    'body-max-line-length': [1, 'always', 100],

    // Footer for issue refs / breaking changes
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [1, 'always', 100],
  },
};
