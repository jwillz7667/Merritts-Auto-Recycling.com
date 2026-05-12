## Summary

<!-- One or two sentences describing what changed and why. Link the issue
or ticket if there is one. Keep the title under 72 characters and follow
Conventional Commits (feat, fix, perf, seo, a11y, refactor, docs, …). -->

## Scope

<!-- Tick the surfaces this PR touches so reviewers know where to look. -->

- [ ] HTML content (top-level pages)
- [ ] Placemarks / per-city pages
- [ ] Blog
- [ ] Structured data (JSON-LD)
- [ ] CSS / fonts / theme
- [ ] JavaScript (forms, UI behavior)
- [ ] Images / asset pipeline
- [ ] Build scripts (`scripts/*.mts`)
- [ ] Serverless functions (`api/`)
- [ ] Hosting / DNS / `vercel.json`
- [ ] CI / tooling / dependencies
- [ ] Docs

## Test plan

<!-- How a reviewer can verify this PR. Be specific. -->

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run format:check`
- [ ] `npm run validate` (JSON-LD)
- [ ] `npm run build` if content-affecting
- [ ] Local smoke test (`npm run dev` or `python3 -m http.server 8000`)
- [ ] Lighthouse mobile ≥ 90 on affected pages (paste numbers below)

```
Performance:    __ / 100
Accessibility:  __ / 100
Best Practices: __ / 100
SEO:            __ / 100
```

## Screenshots / before-after

<!-- Drop screenshots, GIFs, or Lighthouse reports for any visual or
performance-affecting change. Mobile + desktop where applicable. -->

## Risk + rollback

<!-- What breaks if this is wrong, and how do we roll it back?
For Vercel: redeploy the previous successful deployment from the dashboard.
For data/JSON changes: revert the commit and rerun `npm run build`. -->

## Checklist

- [ ] PR title follows Conventional Commits
- [ ] One logical change per commit
- [ ] No content edited inside `auto:*` marker blocks (rerun the script instead)
- [ ] No secrets or API keys committed
- [ ] Updated `CHANGELOG.md` if user-visible
- [ ] Updated `CLAUDE.md` if conventions changed
