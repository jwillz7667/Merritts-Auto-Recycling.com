import type { APIRoute } from 'astro';
// Public release identifier only. No environment values other than a commit
// identifier are exposed. Used to verify the exact Git deployment after a push.
const revision = import.meta.env.VERCEL_GIT_COMMIT_SHA || '';
export const GET: APIRoute = () => new Response(JSON.stringify({
  sourceRevision: /^[a-f0-9]{40}$/.test(revision) ? revision : null,
  recoveryVersion: '2026-10-16',
}), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
