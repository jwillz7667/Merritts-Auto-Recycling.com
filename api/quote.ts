import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Cache-Control', 'no-store');
  res.status(410).json({
    ok: false,
    error: 'cash_offer_form_retired',
    message: 'The online offer form is retired. Call 763-533-2775.',
  });
}
