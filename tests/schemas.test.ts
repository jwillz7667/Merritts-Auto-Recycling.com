import { describe, expect, it } from 'vitest';
import { ContactSchema, QuoteSchema } from '../api/_lib/schemas';

const validQuote = {
  name: 'Jamie Driver',
  email: 'jamie@example.com',
  phone: '(763) 555-0100',
  city: 'Brooklyn Center',
  year: '2012',
  make: 'Ford',
  model: 'Escape',
  condition: 'not-running',
  titleStatus: 'in-hand',
  preferredContact: 'phone',
  notes: 'Vehicle is in a driveway and rolls.',
  companyWebsite: '',
  contactConsent: 'true',
  'cf-turnstile-response': 'test-token',
};

describe('quote schema', () => {
  it('accepts a complete, human-sized payload', () => {
    expect(QuoteSchema.parse(validQuote)).toMatchObject({
      year: '2012',
      make: 'Ford',
      contactConsent: true,
    });
  });

  it('supplies conservative defaults for cached legacy forms', () => {
    const legacy = { ...validQuote };
    delete (legacy as Partial<typeof validQuote>).condition;
    delete (legacy as Partial<typeof validQuote>).titleStatus;
    delete (legacy as Partial<typeof validQuote>).preferredContact;
    expect(QuoteSchema.parse(legacy)).toMatchObject({
      condition: 'unknown',
      titleStatus: 'unknown',
      preferredContact: 'phone',
    });
  });

  it('rejects a filled honeypot', () => {
    expect(() =>
      QuoteSchema.parse({ ...validQuote, companyWebsite: 'https://spam.example' }),
    ).toThrow();
  });

  it('rejects invalid years and missing consent', () => {
    expect(() => QuoteSchema.parse({ ...validQuote, year: '12' })).toThrow();
    expect(() => QuoteSchema.parse({ ...validQuote, contactConsent: 'false' })).toThrow();
  });
});

describe('contact schema', () => {
  const validContact = {
    name: 'Taylor Owner',
    email: 'taylor@example.com',
    phone: '763-555-0199',
    subject: 'vehicle-question',
    message: 'I have a question about the details needed for my vehicle.',
    companyWebsite: '',
    contactConsent: 'true',
    'cf-turnstile-response': 'test-token',
  };

  it('accepts a valid inquiry', () => {
    expect(ContactSchema.parse(validContact).subject).toBe('vehicle-question');
  });

  it('rejects short messages and unknown subjects', () => {
    expect(() => ContactSchema.parse({ ...validContact, message: 'Hi' })).toThrow();
    expect(() => ContactSchema.parse({ ...validContact, subject: 'sales-pitch' })).toThrow();
  });
});
