import 'server-only';
import { business } from './site';
import type { QuoteEmail } from './quote-email';

/**
 * Optional email delivery through Resend's REST API. With no API key or sender
 * configured the form falls back to a prepared mailto: and says nothing was sent.
 */
type Env = Record<string, string | undefined>;

export type ResendConfig = { apiKey: string; from: string; to: string };
export type SendResult = { ok: true; id: string } | { ok: false; reason: 'unconfigured' | 'failed'; detail?: string };

const ENDPOINT = 'https://api.resend.com/emails';
const TIMEOUT_MS = 8000;

export function resendConfig(env: Env = process.env): ResendConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.QUOTE_FROM_EMAIL?.trim();
  if (!apiKey || !from) return null;
  return { apiKey, from, to: env.QUOTE_TO_EMAIL?.trim() || business.email };
}

export async function sendQuoteEmail(
  email: QuoteEmail,
  { replyTo }: { replyTo?: string },
  { env = process.env, fetchImpl = fetch }: { env?: Env; fetchImpl?: typeof fetch } = {},
): Promise<SendResult> {
  const config = resendConfig(env);
  if (!config) return { ok: false, reason: 'unconfigured' };
  try {
    const res = await fetchImpl(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: email.subject,
        text: email.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    const body = (await res.json().catch(() => null)) as { id?: unknown; message?: unknown } | null;
    if (res.ok && body && typeof body.id === 'string') return { ok: true, id: body.id };
    return { ok: false, reason: 'failed', detail: `HTTP ${res.status}${typeof body?.message === 'string' ? `: ${body.message}` : ''}` };
  } catch (error) {
    return { ok: false, reason: 'failed', detail: error instanceof Error ? error.name : 'unknown error' };
  }
}
