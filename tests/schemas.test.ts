import { describe, expect, it } from 'vitest';
import { ContactSchema } from '../api/_lib/schemas';

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

  it('rejects a filled honeypot and missing consent', () => {
    expect(() =>
      ContactSchema.parse({ ...validContact, companyWebsite: 'https://spam.example' }),
    ).toThrow();
    expect(() => ContactSchema.parse({ ...validContact, contactConsent: 'false' })).toThrow();
  });
});
