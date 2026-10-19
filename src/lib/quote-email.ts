import { emailCopy, form } from './content';
import { mailto } from './site';
import { serviceLabel, type Quote } from './quote-schema';

export type QuoteEmail = { subject: string; text: string };

/**
 * Builds the email the team receives. The subject is assembled only from enum
 * values, never from free text, so user input cannot shape a header.
 */
export function buildQuoteEmail(q: Quote): QuoteEmail {
  const l = emailCopy.labels;
  const rows: [string, string][] = [
    [l.service, serviceLabel(q.service)],
    [l.name, q.name],
    [l.phone, q.phone],
    [l.email, q.email || '—'],
    [l.town, q.town],
    [l.prefer, form.preferOptions[q.prefer]],
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', `${l.message}:`, q.message, '', '—', emailCopy.footer].join('\n');
  return { subject: emailCopy.subject(serviceLabel(q.service)), text };
}

// Some mail apps truncate or refuse mailto: URLs longer than about 2,000 characters.
export const MAILTO_MAX = 1900;

/** A prepared mailto: link for the fallback path, trimmed to stay under common length limits. */
export function buildMailto(email: QuoteEmail): string {
  const build = (body: string) => `${mailto}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(body)}`;
  let href = build(email.text);
  // Trim by code points, not UTF-16 units: half an emoji makes encodeURIComponent throw.
  const chars = Array.from(email.text);
  while (href.length > MAILTO_MAX && chars.length > 0) {
    chars.splice(-50);
    href = build(`${chars.join('')}…`);
  }
  return href;
}
