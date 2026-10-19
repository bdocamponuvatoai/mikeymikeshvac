import { describe, expect, it } from 'vitest';
import { cleanLine, cleanMultiline } from './sanitize';
import { MESSAGE_MAX, serviceLabel, validateQuote, type QuoteInput } from './quote-schema';
import { buildMailto, buildQuoteEmail, MAILTO_MAX } from './quote-email';
import { business } from './site';

const valid: QuoteInput = {
  service: 'heat-pumps',
  name: 'Jordan Reyes',
  phone: '(508) 555-0142',
  email: '',
  town: 'New Bedford',
  message: 'Looking at a mini-split for the upstairs bedrooms.',
  prefer: 'call',
};

describe('sanitize', () => {
  it('strips control characters and line breaks from single-line fields', () => {
    expect(cleanLine('  Jordan\r\nBcc: evil@example.com\u0000 ')).toBe('Jordan Bcc: evil@example.com');
    expect(cleanLine('a b\u0085c')).toBe('a b c');
  });

  it('keeps single newlines in messages but drops other controls', () => {
    expect(cleanMultiline('line one\r\nline two\u0007\n\n\n\nend')).toBe('line one\nline two\n\nend');
  });
});

describe('validateQuote', () => {
  it('accepts a complete request and cleans it', () => {
    const r = validateQuote({ ...valid, name: '  Jordan   Reyes ' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.name).toBe('Jordan Reyes');
  });

  it('reports each invalid field with its own message', () => {
    const r = validateQuote({ ...valid, name: 'J', phone: '12345', town: '', message: 'short' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['message', 'name', 'phone', 'town']);
  });

  it('rejects services and contact methods outside the enums', () => {
    const r = validateQuote({ ...valid, service: 'plumbing-emergency', prefer: 'fax' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['prefer', 'service']);
  });

  it('rejects phone numbers with letters or too few digits', () => {
    expect(validateQuote({ ...valid, phone: '508-CALL-NOW' }).ok).toBe(false);
    expect(validateQuote({ ...valid, phone: '555-0142' }).ok).toBe(false);
    expect(validateQuote({ ...valid, phone: '+1 508.555.0142' }).ok).toBe(true);
  });

  it('treats email as optional unless email is the preferred contact', () => {
    expect(validateQuote({ ...valid, email: '' }).ok).toBe(true);
    const needsEmail = validateQuote({ ...valid, prefer: 'email', email: '' });
    expect(needsEmail.ok).toBe(false);
    if (!needsEmail.ok) expect(needsEmail.errors.email).toMatch(/reply by email/);
    expect(validateQuote({ ...valid, email: 'not-an-email' }).ok).toBe(false);
    expect(validateQuote({ ...valid, prefer: 'email', email: 'jordan@example.com' }).ok).toBe(true);
  });

  it('enforces the message length limit', () => {
    expect(validateQuote({ ...valid, message: 'x'.repeat(MESSAGE_MAX + 1) }).ok).toBe(false);
  });

  it('rejects missing or non-string input without throwing', () => {
    expect(validateQuote({}).ok).toBe(false);
    expect(validateQuote(null).ok).toBe(false);
  });
});

describe('buildQuoteEmail', () => {
  it('builds the subject from the service enum only', () => {
    const r = validateQuote({ ...valid, name: 'Evil\r\nBcc: x@y.z', message: 'Subject: hijack\nplease call me back' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const email = buildQuoteEmail(r.data);
    expect(email.subject).toBe(`Quote request: ${serviceLabel('heat-pumps')}`);
    expect(email.subject).not.toMatch(/[\r\n]/);
    expect(email.text).toContain('Name: Evil Bcc: x@y.z');
    expect(email.text).toContain('Prefers: Call');
  });

  it('labels the catch-all service', () => {
    expect(serviceLabel('other')).toBe('Not sure yet');
  });
});

describe('buildMailto', () => {
  it('addresses the business and stays under the length limit', () => {
    const r = validateQuote({ ...valid, message: 'é'.repeat(MESSAGE_MAX) });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const href = buildMailto(buildQuoteEmail(r.data));
    expect(href.startsWith(`mailto:${business.email}?subject=`)).toBe(true);
    expect(href.length).toBeLessThanOrEqual(MAILTO_MAX);
  });

  it('never splits an emoji when trimming (a lone surrogate would make encoding throw)', () => {
    // A 50-unit cut from the end lands mid-pair when an odd-length tail follows the emoji.
    for (const tail of ['', 'x', 'xyz']) {
      const href = buildMailto({ subject: 'Quote request: Heating', text: '🔧'.repeat(1000) + tail });
      expect(href.length).toBeLessThanOrEqual(MAILTO_MAX);
      expect(() => decodeURIComponent(href)).not.toThrow();
    }
  });
});
