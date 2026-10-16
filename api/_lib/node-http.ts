import type { IncomingMessage, ServerResponse } from 'node:http';

// Vercel supplies these helpers at runtime. Keep only the HTTP surface used by
// our handlers instead of installing the function builder solely for its types.
export type VercelRequest = IncomingMessage & { body?: unknown };
export type VercelResponse = ServerResponse & {
  status(code: number): VercelResponse;
  json(body: unknown): VercelResponse;
};
