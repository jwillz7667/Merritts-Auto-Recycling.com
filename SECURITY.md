# Security Policy

Merritt's Auto Recycling is a public-facing marketing site operated by
**Viral Ventures LLC** (Maple Grove, MN). We take responsible disclosure
seriously and appreciate the security community's help in keeping the site
and its users safe.

## Supported versions

This is a continuously-deployed single-tenant site. The only supported
version is the current production deployment at
`https://merritts-auto-recycling.com`.

| Version           | Supported |
| ----------------- | --------- |
| `main` / `master` | Yes       |
| Older branches    | No        |

## In scope

- Vulnerabilities affecting `https://merritts-auto-recycling.com` and the
  serverless functions under `/api/*`.
- Misconfigurations in HTTP security headers (CSP, HSTS, frame options,
  referrer policy, permissions policy).
- Authentication / authorization defects in administrative tooling.
- Injection (XSS, SSRF, header injection) in any form handler.
- Personally identifiable information (PII) handling in form submissions.
- Supply-chain risk in our published or built artifacts.

## Out of scope

- Findings only reproducible on staging or preview deployments not linked
  from the production site.
- Reports of missing security headers that are demonstrably present (verify
  with `curl -I` before reporting).
- Reports about `www.merritts-auto-recycling.com` other than verifying that
  it 301-redirects to the apex (this is the intended behavior).
- Social-engineering attacks against employees or contractors.
- Denial-of-service via volumetric traffic or rate-limit testing.
- Findings from automated scanners without a working proof-of-concept.
- Vulnerabilities in third-party services we do not operate (Vercel,
  Cloudflare Turnstile, Resend, Google Analytics, etc.) — report those
  directly to the vendor.

## How to report a vulnerability

Please use **GitHub Security Advisories** to report privately:

<https://github.com/jwillz7667/Merritts-Auto-Recycling.com/security/advisories/new>

If GitHub is unavailable or you need an alternate channel, email
**security@viralventuresllc.com** with the subject line
`[security] Merritt's Auto Recycling — <short summary>`.

Include in your report:

1. A description of the vulnerability.
2. The URL or endpoint affected.
3. Step-by-step reproduction (request payloads, expected vs. actual).
4. Impact: what an attacker could do.
5. Any suggested fix or mitigation.
6. Your name / handle if you want public credit.

## What to expect

| Stage                          | Target response time |
| ------------------------------ | -------------------- |
| Acknowledgment of report       | 2 business days      |
| Initial triage + severity      | 5 business days      |
| Fix in production (Critical)   | 7 days               |
| Fix in production (High)       | 30 days              |
| Fix in production (Medium)     | 90 days              |
| Public disclosure coordination | Mutually agreed      |

We do not currently operate a paid bug-bounty program. We will credit
researchers in release notes upon request and with their consent.

## Safe harbor

We will not pursue legal action or notify law enforcement for security
research conducted in good faith that:

- Stays within the in-scope assets above.
- Avoids privacy violations, destruction of data, and interruption or
  degradation of our services.
- Discloses the issue privately to us and gives us a reasonable window to
  remediate before any public disclosure.

If in doubt about whether something is in scope, ask before testing.
