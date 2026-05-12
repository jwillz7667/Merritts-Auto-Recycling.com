import { z } from 'zod';

/**
 * Zod schemas for every form. The shared bot-trap shape is composed in so we only have to keep
 * the `honeypot` + Turnstile token semantics correct in one place.
 *
 * Constraints are deliberately strict on length / format and loose on content — the goal is
 * "this looks like a human submission" not "this is a perfect lead". Recipient still sees raw
 * data so they can judge follow-up quality.
 */

const BotShield = {
  /** Hidden honeypot — only bots fill it. Must be empty (or absent). */
  honeypot: z.string().max(0, 'bot detected').optional().default(''),
  /** Token returned by the Cloudflare Turnstile widget on successful challenge. */
  'cf-turnstile-response': z.string().min(1, 'Turnstile token required'),
};

const Name = z.string().trim().min(2, 'name too short').max(100, 'name too long');
const Email = z.string().trim().email('invalid email').max(200, 'email too long');
const Phone = z
  .string()
  .trim()
  .min(7, 'phone too short')
  .max(30, 'phone too long')
  .regex(/^[0-9+\-\s()x.,ext]+$/i, 'phone contains invalid characters');
const Message = z.string().trim().min(10, 'message too short').max(4000, 'message too long');

export const ContactSchema = z.object({
  name: Name,
  email: Email,
  phone: Phone,
  message: Message,
  ...BotShield,
});
export type ContactPayload = z.infer<typeof ContactSchema>;

export const QuoteSchema = z.object({
  name: Name,
  email: Email,
  phone: Phone.optional().or(z.literal('').transform(() => undefined)),
  message: Message,
  ...BotShield,
});
export type QuotePayload = z.infer<typeof QuoteSchema>;

const ShortText = z.string().trim().max(200, 'value too long');
const Year = z
  .string()
  .trim()
  .regex(/^\d{4}$|^Other$/i, 'invalid year')
  .optional()
  .or(z.literal('').transform(() => undefined));

export const AppointmentSchema = z.object({
  name: Name,
  lastname: ShortText.optional().or(z.literal('').transform(() => undefined)),
  email: Email,
  phone: Phone,
  date: ShortText.min(4, 'date required'),
  time: ShortText.min(3, 'time required'),
  autoinfo: ShortText.min(2, 'vehicle info required'),
  select1: Year,
  miles: ShortText.optional().or(z.literal('').transform(() => undefined)),
  message: z
    .string()
    .trim()
    .max(4000, 'message too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  ...BotShield,
});
export type AppointmentPayload = z.infer<typeof AppointmentSchema>;

/**
 * Callback request from the cash calculator. The vehicle inputs mirror `CalculatorInputSchema`
 * but live here so the server can recompute the quote authoritatively from the same payload that
 * the form sends. Contact info follows the lighter standard used elsewhere.
 *
 * `email` is optional — many callers prefer SMS/phone follow-up and shouldn't be forced to type
 * an address. When provided we send them a branded confirmation email; when omitted we skip it.
 */
const BooleanFlag = z.preprocess((v) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (['true', '1', 'on', 'yes'].includes(s)) return true;
    if (['false', '0', 'off', 'no', ''].includes(s)) return false;
  }
  return false;
}, z.boolean());

const YearInt = z.preprocess(
  (v) => (typeof v === 'string' ? Number.parseInt(v, 10) : v),
  z
    .number()
    .int()
    .min(1950, 'year too old')
    .max(new Date().getFullYear() + 1, 'year too new'),
);

const VehicleClassKey = z.string().trim().min(1).max(40);

export const CallbackSchema = z.object({
  name: Name,
  phone: Phone,
  email: Email.optional().or(z.literal('').transform(() => undefined)),
  preferredContactTime: ShortText.optional().or(z.literal('').transform(() => undefined)),
  notes: z
    .string()
    .trim()
    .max(2000, 'notes too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}$/, 'ZIP must be 5 digits')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  vehicleClass: VehicleClassKey,
  year: YearInt,
  running: BooleanFlag,
  catalyticConverter: BooleanFlag,
  completeDrivetrain: BooleanFlag,
  wheelsAndTires: BooleanFlag,
  ...BotShield,
});
export type CallbackPayload = z.infer<typeof CallbackSchema>;
