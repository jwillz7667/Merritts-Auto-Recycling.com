# Contributing

Thanks for working on the Merritt's Auto Recycling site. This document
covers the conventions we follow and the workflow we expect for every
change, big or small.

This is a proprietary codebase owned by **Viral Ventures LLC** (Maple
Grove, MN). External contributions are accepted only by prior written
agreement. See [`LICENSE`](LICENSE) for terms.

---

## Quickstart

```bash
# Prerequisites: Node 20.18+, npm 10+, git
git clone https://github.com/jwillz7667/Merritts-Auto-Recycling.com.git
cd Merritts-Auto-Recycling.com

# Use the pinned Node version.
nvm use                 # picks up .nvmrc

# Install dependencies and wire husky hooks.
npm install

# Run the full content pipeline once so generated artifacts match.
npm run build

# Spin up vercel dev (serverless functions + static site).
cp .env.example .env.local   # fill in real values
npm run dev
```

For a quick static preview without serverless functions:

```bash
python3 -m http.server 8000
# Forms will not submit; everything else works.
```

---

## Branching

- `master` (default) — protected; only PRs.
- Feature branches: `feat/<short-slug>` (e.g. `feat/sticky-call-button`).
- Bug fixes: `fix/<short-slug>` (e.g. `fix/blaine-canonical`).
- Chores / docs: `chore/<slug>`, `docs/<slug>`.

One logical change per branch. Don't bundle unrelated edits.

---

## Conventional Commits

Every commit message must match
[Conventional Commits](https://www.conventionalcommits.org/). `commitlint`
enforces this via a git hook and CI. Allowed types:

| Type       | Use                                            |
| ---------- | ---------------------------------------------- |
| `feat`     | User-facing feature                            |
| `fix`      | Bug fix                                        |
| `perf`     | Performance work (LCP, INP, bundle size)       |
| `seo`      | SEO surface — meta, schema, sitemap, content   |
| `a11y`     | Accessibility — WCAG, ARIA, contrast, keyboard |
| `refactor` | No behavior change                             |
| `style`    | Formatting only, no logic                      |
| `docs`     | README, CLAUDE.md, comments                    |
| `test`     | Adding/refactoring tests                       |
| `build`    | Build system, deps, scripts                    |
| `ci`       | CI/CD configuration                            |
| `chore`    | Tooling, housekeeping                          |
| `revert`   | `git revert`                                   |
| `content`  | Copy edits, blog posts, FAQ updates            |
| `infra`    | Hosting, DNS, `vercel.json`, env vars          |

Common scopes: `forms`, `blog`, `placemarks`, `images`, `schema`, `sitemap`,
`hub`, `redirects`, `headers`.

Examples:

```
feat(forms): wire Turnstile token verification to /api/contact
perf(images): replace footer-tow-truck.jpg with WebP/AVIF pair
seo(placemarks): add geo meta tags to all 53 location pages
fix(redirects): scope www-to-apex 301 to host predicate only
infra(vercel): tighten CSP and add Permissions-Policy
```

Subject line: imperative mood, ≤ 100 characters, no trailing period.

---

## Code style

- **TypeScript** (strict): no `any`, no `as` casts unless unavoidable, all
  external input validated by Zod. See the global rules in
  [`CLAUDE.md`](CLAUDE.md).
- **Prettier** is the formatter — `npm run format` before pushing or rely
  on the `format-on-save` editor setting (see `.vscode/settings.json`).
- **ESLint** is the linter — `npm run lint`. CI fails on warnings.
- **EditorConfig** handles whitespace, line endings, and final newlines.
- **HTML/CSS** use **tabs** (matches legacy markup); TS/JS use **2 spaces**.
- No emojis in source files. UI copy may include emoji only when explicitly
  requested by the user.

---

## The cross-file edit rule

The site is 57+ hand-maintained HTML pages. **Do not** sweep manual edits
across all of them — every shared region lives between
`<!-- BEGIN auto:NAME -->` / `<!-- END auto:NAME -->` markers and is
regenerated from data + templates by build scripts in `scripts/`.

If you need to change a shared region:

1. Edit the source — `data/blocks/*.html`, `data/cities.json`,
   `data/business.json`, `data/faqs.json`, etc.
2. Rerun the relevant script(s):
   - `npm run build:placemarks` for per-city content
   - `npm run build:shared` for header/footer/nav/scripts
   - `npm run build:blog` for blog hub + posts
   - `npm run build:sitemap` and `npm run build:llms` after content changes
3. Commit both the data change and the regenerated HTML in the same commit.

Hand-editing inside `auto:*` markers is a merge-conflict generator — the
next script run will overwrite it.

---

## Pre-commit hooks (husky)

Installed by `npm install`. They run automatically on `git commit` /
`git push`:

| Hook         | What runs                                                  |
| ------------ | ---------------------------------------------------------- |
| `pre-commit` | `lint-staged` — Prettier + ESLint on staged files only     |
| `commit-msg` | `commitlint` — Conventional Commits format                 |
| `pre-push`   | `tsc --noEmit` + `npm run validate` (JSON-LD schema check) |

**Do not** use `--no-verify` to bypass them. If a hook fails, fix the
underlying issue and recommit.

---

## Required checks before opening a PR

```bash
npm run typecheck
npm run lint
npm run format:check
npm run validate         # JSON-LD across every page
npm run build            # content pipeline; commit the regenerated HTML
```

For performance-affecting changes, run Lighthouse on a representative page
and paste the numbers in the PR body. The CI weekly job will catch
regressions on production after merge.

---

## Pull-request etiquette

- PR title matches Conventional Commits.
- Fill out the PR template — Summary, Scope, Test plan, Risk + rollback.
- Keep PRs small (< ~400 lines diff, excluding generated files). If your
  change affects all 57 pages because of a build-script edit, call that
  out in the PR body.
- A reviewer from `CODEOWNERS` is required to approve.
- Never merge a red CI build.

---

## Reporting bugs

Use the [Bug report](https://github.com/jwillz7667/Merritts-Auto-Recycling.com/issues/new?template=bug_report.yml)
issue template.

For security vulnerabilities, **do not** open a public issue — follow
[`SECURITY.md`](SECURITY.md) instead.

---

## License

By contributing, you agree that your contributions are assigned to
**Viral Ventures LLC** and become part of the proprietary work covered by
the project [`LICENSE`](LICENSE).
