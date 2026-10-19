'use server';

import { headers } from 'next/headers';
import { checkBot, ELAPSED_FIELD, HONEYPOT_FIELD } from '@/lib/bot';
import { buildMailto, buildQuoteEmail } from '@/lib/quote-email';
import { validateQuote } from '@/lib/quote-schema';
import type { QuoteState } from '@/lib/quote-state';
import { clientIp, createRateLimiter } from '@/lib/rate-limit';
import { sendQuoteEmail } from '@/lib/resend';

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

const text = (data: FormData, key: string) => {
  const v = data.get(key);
  return typeof v === 'string' ? v : '';
};

export async function submitQuote(_prev: QuoteState, data: FormData): Promise<QuoteState> {
  const at = Date.now();

  const verdict = checkBot({ honeypot: data.get(HONEYPOT_FIELD), elapsed: data.get(ELAPSED_FIELD) });
  if (verdict.bot) {
    // Silent fake success, so bots learn nothing. Logged so false positives stay visible.
    console.warn(`[quote] dropped as likely bot: ${verdict.reason}`);
    return { status: 'sent', at };
  }

  const h = await headers();
  if (!limiter.take(clientIp((name) => h.get(name))).ok) {
    console.warn('[quote] rate limited');
    return { status: 'limited', at };
  }

  const result = validateQuote({
    service: text(data, 'service'),
    name: text(data, 'name'),
    phone: text(data, 'phone'),
    email: text(data, 'email'),
    town: text(data, 'town'),
    message: text(data, 'message'),
    prefer: text(data, 'prefer'),
  });
  if (!result.ok) return { status: 'invalid', errors: result.errors, at };

  const email = buildQuoteEmail(result.data);
  const sent = await sendQuoteEmail(email, { replyTo: result.data.email || undefined });
  if (sent.ok) return { status: 'sent', at };

  if (sent.reason === 'failed') console.error(`[quote] delivery failed: ${sent.detail ?? 'unknown'}`);
  return { status: 'fallback', mailto: buildMailto(email), text: `${email.subject}\n\n${email.text}`, at };
}
