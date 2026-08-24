import { z } from 'zod';

const EnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.email(),
  RECIPIENT_EMAIL: z.email(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  ALLOWED_ORIGIN: z.url().optional(),
  NODE_ENV: z.string().default('production'),
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cachedEnv: AppEnv | undefined;

export function getEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error(`Missing or invalid server environment: ${fields}`);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}
