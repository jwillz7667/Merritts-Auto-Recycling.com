import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Cache-Control', 'no-store');
  res.status(410).json({
    ok: false,
    error: 'appointment_form_retired',
    message: 'Online appointment booking is not available. Call 763-533-2775.',
  });
}
