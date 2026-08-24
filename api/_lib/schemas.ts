import { z } from 'zod';

const phonePattern = /^[0-9+()\-., xext]+$/i;
const personName = z.string().trim().min(2, 'Enter your name.').max(100, 'Name is too long.');
const email = z.email('Enter a valid email address.').max(200, 'Email is too long.');
const phone = z
  .string()
  .trim()
  .min(7, 'Enter a valid phone number.')
  .max(30, 'Phone number is too long.')
  .regex(phonePattern, 'Enter a valid phone number.');

const botShield = {
  companyWebsite: z.string().max(0, 'Bot submission rejected.').optional().default(''),
  'cf-turnstile-response': z.string().min(1, 'Complete the security check.'),
  contactConsent: z.union([z.literal('true'), z.literal(true)]).transform(() => true),
};

export const QuoteSchema = z.object({
  name: personName,
  email,
  phone,
  city: z.string().trim().min(2, 'Enter the vehicle city.').max(80, 'City is too long.'),
  year: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, 'Enter a four-digit year between 1900 and 2099.'),
  make: z.string().trim().min(1, 'Enter the make.').max(60, 'Make is too long.'),
  model: z.string().trim().min(1, 'Enter the model.').max(60, 'Model is too long.'),
  condition: z.enum(['runs', 'starts', 'not-running', 'damaged', 'unknown']).default('unknown'),
  titleStatus: z
    .enum(['in-hand', 'lost-damaged', 'lien', 'other-name', 'unknown'])
    .default('unknown'),
  preferredContact: z.enum(['phone', 'text', 'email']).default('phone'),
  notes: z
    .string()
    .trim()
    .max(2000, 'Details are too long.')
    .optional()
    .transform((value) => value || undefined),
  ...botShield,
});

export const ContactSchema = z.object({
  name: personName,
  email,
  phone,
  subject: z.enum([
    'vehicle-question',
    'pickup-question',
    'document-question',
    'website-question',
    'other',
  ]),
  message: z
    .string()
    .trim()
    .min(10, 'Enter at least 10 characters.')
    .max(4000, 'Message is too long.'),
  ...botShield,
});

export type QuotePayload = z.infer<typeof QuoteSchema>;
export type ContactPayload = z.infer<typeof ContactSchema>;
