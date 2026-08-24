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

export type ContactPayload = z.infer<typeof ContactSchema>;
