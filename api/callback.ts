import { calculate, loadPricing } from './_lib/calculator.js';
import { sendCallbackEmails } from './_lib/email.js';
import { createFormHandler } from './_lib/handler.js';
import { CallbackSchema, type CallbackPayload } from './_lib/validate.js';

/**
 * Cash-calculator callback endpoint.
 *
 * The client renders a preliminary quote using `/data/scrap-pricing.json` directly. When the
 * user requests a follow-up call, the original vehicle inputs are POSTed here — never the
 * computed quote — so the server recomputes from the same authoritative pricing table and the
 * email Brad receives is always trustworthy regardless of what was rendered in the browser.
 */
export default createFormHandler({
  schema: CallbackSchema,
  formType: 'callback',
  onValidPayload: async (payload: CallbackPayload, meta) => {
    const pricing = loadPricing();
    const quote = calculate(
      {
        vehicleClass: payload.vehicleClass,
        year: payload.year,
        running: payload.running,
        catalyticConverter: payload.catalyticConverter,
        completeDrivetrain: payload.completeDrivetrain,
        wheelsAndTires: payload.wheelsAndTires,
      },
      pricing,
    );

    await sendCallbackEmails({
      customer: {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        preferredContactTime: payload.preferredContactTime,
        notes: payload.notes,
        zip: payload.zip,
      },
      vehicle: {
        classKey: quote.vehicleClass.key,
        classLabel: quote.vehicleClass.label,
        weightLbs: quote.vehicleClass.weightLbs,
        year: payload.year,
        yearBucketLabel: quote.yearBucket.label,
        running: payload.running,
        catalyticConverter: payload.catalyticConverter,
        completeDrivetrain: payload.completeDrivetrain,
        wheelsAndTires: payload.wheelsAndTires,
      },
      quote,
      ip: meta.ip === 'unknown' ? undefined : meta.ip,
      userAgent: meta.userAgent,
      referer: meta.referer,
      receivedAt: meta.receivedAt,
    });
  },
});
