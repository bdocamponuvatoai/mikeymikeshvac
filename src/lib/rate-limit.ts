/**
 * Best-effort sliding-window limiter held in memory. On serverless each warm
 * instance keeps its own window, so this slows casual abuse but is not a hard
 * guarantee; docs/DEPLOYMENT.md adds a Vercel Firewall rule for that.
 */
export function createRateLimiter({ limit, windowMs, now = Date.now }: { limit: number; windowMs: number; now?: () => number }) {
  const hits = new Map<string, number[]>();
  let lastSweep = now();

  function sweep(t: number) {
    if (t - lastSweep < windowMs) return;
    lastSweep = t;
    for (const [key, times] of hits) {
      const fresh = times.filter((x) => t - x < windowMs);
      if (fresh.length) hits.set(key, fresh);
      else hits.delete(key);
    }
  }

  return {
    /** Records a hit for `key` and reports whether it is within the limit. */
    take(key: string): { ok: boolean; remaining: number } {
      const t = now();
      sweep(t);
      const recent = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { ok: false, remaining: 0 };
      }
      recent.push(t);
      hits.set(key, recent);
      return { ok: true, remaining: limit - recent.length };
    },
    size: () => hits.size,
  };
}

/** First address in X-Forwarded-For (set by Vercel), falling back to X-Real-IP. */
export function clientIp(get: (name: string) => string | null): string {
  const forwarded = get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || get('x-real-ip')?.trim() || 'unknown';
}
