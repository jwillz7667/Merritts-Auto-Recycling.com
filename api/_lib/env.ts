import { z } from 'zod';

/**
 * Typed, fail-fast env loading. Imported once at function-cold-start so a misconfigured deploy
 * crashes loudly rather than silently dropping form submissions.
 *
 * `ALLOWED_ORIGIN` is optional in dev (defaults to localhost) but required in production —
 * the handler enforces this separately.
 */
const EnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY required'),
  RESEND_FROM_EMAIL: z.string().email('RESEND_FROM_EMAIL must be a valid email'),
  RECIPIENT_EMAIL: z.string().email('RECIPIENT_EMAIL must be a valid email'),
  TURNSTILE_SECRET_KEY: z.string().min(1, 'TURNSTILE_SECRET_KEY required'),
  ALLOWED_ORIGIN: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
});

export type Env = z.infer<typeof EnvSchema>;

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Environment validation failed:\n${issues}`);
}

export const env: Env = parsed.data;
