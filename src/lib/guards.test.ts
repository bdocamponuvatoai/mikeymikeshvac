import { describe, expect, it, vi } from 'vitest';
import { checkBot, MIN_SUBMIT_MS } from './bot';
import { clientIp, createRateLimiter } from './rate-limit';
import { resendConfig, sendQuoteEmail } from './resend';
import { business } from './site';

describe('checkBot', () => {
  it('flags a filled honeypot', () => {
    expect(checkBot({ honeypot: 'http://spam.example', elapsed: '9000' })).toEqual({ bot: true, reason: 'honeypot' });
  });

  it('flags submissions faster than a person could type', () => {
    expect(checkBot({ honeypot: '', elapsed: String(MIN_SUBMIT_MS - 1) })).toEqual({ bot: true, reason: 'too-fast' });
  });

  it('flags missing or garbage timing', () => {
    expect(checkBot({ honeypot: '', elapsed: null })).toEqual({ bot: true, reason: 'no-timing' });
    expect(checkBot({ honeypot: '', elapsed: '' })).toEqual({ bot: true, reason: 'no-timing' });
    expect(checkBot({ honeypot: '', elapsed: 'soon' })).toEqual({ bot: true, reason: 'no-timing' });
  });

  it('lets a normal submission through', () => {
    expect(checkBot({ honeypot: '', elapsed: '45000' })).toEqual({ bot: false });
    expect(checkBot({ honeypot: null, elapsed: String(MIN_SUBMIT_MS) })).toEqual({ bot: false });
  });
});

describe('createRateLimiter', () => {
  it('allows up to the limit per key, then blocks until the window passes', () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(limiter.take('a')).toEqual({ ok: true, remaining: 1 });
    expect(limiter.take('a')).toEqual({ ok: true, remaining: 0 });
    expect(limiter.take('a').ok).toBe(false);
    expect(limiter.take('b').ok).toBe(true);
    t = 1001;
    expect(limiter.take('a').ok).toBe(true);
  });

  it('forgets idle keys so memory stays bounded', () => {
    let t = 0;
    const limiter = createRateLimiter({ limit: 5, windowMs: 1000, now: () => t });
    for (let i = 0; i < 50; i++) limiter.take(`ip-${i}`);
    expect(limiter.size()).toBe(50);
    t = 5000;
    limiter.take('fresh');
    expect(limiter.size()).toBe(1);
  });
});

describe('clientIp', () => {
  const from = (h: Record<string, string>) => (name: string) => h[name] ?? null;
  it('uses the first forwarded address', () => {
    expect(clientIp(from({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }))).toBe('203.0.113.7');
  });
  it('falls back to x-real-ip, then a shared bucket', () => {
    expect(clientIp(from({ 'x-real-ip': '198.51.100.2' }))).toBe('198.51.100.2');
    expect(clientIp(from({}))).toBe('unknown');
  });
});

describe('Resend delivery', () => {
  const email = { subject: 'Quote request: Heating', text: 'Name: Jordan' };
  const env = { RESEND_API_KEY: 're_test', QUOTE_FROM_EMAIL: 'Website <quotes@example.com>' };

  it('is unconfigured without both an API key and a sender', () => {
    expect(resendConfig({})).toBeNull();
    expect(resendConfig({ RESEND_API_KEY: 're_test' })).toBeNull();
    expect(resendConfig(env)?.to).toBe(business.email);
    expect(resendConfig({ ...env, QUOTE_TO_EMAIL: 'owner@example.com' })?.to).toBe('owner@example.com');
  });

  it('reports unconfigured without calling the API', async () => {
    const fetchImpl = vi.fn();
    expect(await sendQuoteEmail(email, {}, { env: {}, fetchImpl })).toEqual({ ok: false, reason: 'unconfigured' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('succeeds only when the API confirms with an id', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ id: 'abc' }), { status: 200 }));
    expect(await sendQuoteEmail(email, { replyTo: 'jordan@example.com' }, { env, fetchImpl })).toEqual({ ok: true, id: 'abc' });
    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toMatchObject({ to: [business.email], reply_to: 'jordan@example.com', subject: email.subject });
  });

  it('treats errors, missing ids and network failures as not sent', async () => {
    const rejected = vi.fn(async () => new Response(JSON.stringify({ message: 'domain not verified' }), { status: 403 }));
    expect(await sendQuoteEmail(email, {}, { env, fetchImpl: rejected })).toEqual({ ok: false, reason: 'failed', detail: 'HTTP 403: domain not verified' });
    const noId = vi.fn(async () => new Response('{}', { status: 200 }));
    expect((await sendQuoteEmail(email, {}, { env, fetchImpl: noId })).ok).toBe(false);
    const down = vi.fn(async () => {
      throw new DOMException('timed out', 'TimeoutError');
    });
    expect(await sendQuoteEmail(email, {}, { env, fetchImpl: down })).toEqual({ ok: false, reason: 'failed', detail: 'TimeoutError' });
  });
});
