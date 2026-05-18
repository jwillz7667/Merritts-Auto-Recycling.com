import { sendFormEmail, sendQuoteConfirmation } from './_lib/email.js';
import { createFormHandler } from './_lib/handler.js';
import { QuoteSchema } from './_lib/validate.js';

/**
 * Junk-car cash-quote lead form. Dual-send:
 *  1. Lead email → Brad (RECIPIENT_EMAIL), with the full submission and request meta.
 *  2. Branded confirmation → the customer at the email they submitted, echoing their
 *     vehicle + city so they have a record and reply-able thread.
 *
 * The customer confirmation is best-effort: if it fails after the lead has already been
 * delivered to Brad, we still surface the failure (502) so the form shows an error and
 * the user retries, but the lead is not lost — Brad sees it in the inbox either way.
 */
export default createFormHandler({
  schema: QuoteSchema,
  formType: 'quote',
  onValidPayload: async (payload, meta) => {
    const p = payload;
    const fields: Record<string, string | undefined> = {
      name: p.name,
      phone: p.phone,
      email: p.email,
      city: p.city,
      year: p.year,
      make: p.make,
      model: p.model,
      notes: p.notes,
    };

    await sendFormEmail({
      formType: 'quote',
      fields,
      ip: meta.ip,
      userAgent: meta.userAgent,
      referer: meta.referer,
      receivedAt: meta.receivedAt,
    });

    await sendQuoteConfirmation(p);
  },
});
