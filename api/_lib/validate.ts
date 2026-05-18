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

const ShortText = z.string().trim().max(200, 'value too long');
const Year = z
  .string()
  .trim()
  .regex(/^\d{4}$|^Other$/i, 'invalid year')
  .optional()
  .or(z.literal('').transform(() => undefined));

/**
 * Quick "tell us about your junk car" lead form — name, contact, and vehicle basics. Dual-send
 * pattern: lead to Brad + branded confirmation back to the customer at the email they provided.
 */
const VehiclePart = z.string().trim().min(1, 'required').max(60, 'too long');
const QuoteYear = z
  .string()
  .trim()
  .regex(/^(19|20)\d{2}$/, 'enter a 4-digit year between 1900 and 2099');
export const QuoteSchema = z.object({
  name: Name,
  email: Email,
  phone: Phone,
  city: ShortText.min(2, 'city required').max(80, 'city too long'),
  year: QuoteYear,
  make: VehiclePart,
  model: VehiclePart,
  notes: z
    .string()
    .trim()
    .max(2000, 'notes too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  ...BotShield,
});
export type QuotePayload = z.infer<typeof QuoteSchema>;

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
