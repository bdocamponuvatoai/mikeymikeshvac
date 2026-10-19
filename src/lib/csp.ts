/**
 * Content-Security-Policy and security headers, built per deployment stage so the
 * Vercel toolbar works on previews and Next's dev tooling works locally, without
 * loosening production.
 */
export type Stage = 'production' | 'preview' | 'development';

export function resolveStage(env: Record<string, string | undefined> = process.env): Stage {
  if (env.NODE_ENV === 'development') return 'development';
  return env.VERCEL_ENV === 'preview' ? 'preview' : 'production';
}

export function buildCsp(stage: Stage): string {
  const preview = stage === 'preview';
  const dev = stage === 'development';
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    // 'unsafe-inline' is required: statically rendered App Router pages inline their RSC payload scripts.
    'script-src': ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'", 'https://va.vercel-scripts.com'] : []), ...(preview ? ['https://vercel.live'] : [])],
    'style-src': ["'self'", "'unsafe-inline'", ...(preview ? ['https://vercel.live'] : [])],
    'img-src': ["'self'", 'data:', 'blob:', ...(preview ? ['https://vercel.live', 'https://vercel.com'] : [])],
    'font-src': ["'self'", ...(preview ? ['https://vercel.live', 'https://assets.vercel.com'] : [])],
    'connect-src': ["'self'", ...(dev ? ['ws:', 'https://va.vercel-scripts.com'] : []), ...(preview ? ['https://vercel.live', 'wss://ws-us3.pusher.com'] : [])],
    'frame-src': preview ? ['https://vercel.live'] : ["'none'"],
    'frame-ancestors': ["'none'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'manifest-src': ["'self'"],
  };
  const policy = Object.entries(directives).map(([k, v]) => `${k} ${v.join(' ')}`);
  if (!dev) policy.push('upgrade-insecure-requests');
  return policy.join('; ');
}

export function securityHeaders(stage: Stage): { key: string; value: string }[] {
  return [
    { key: 'Content-Security-Policy', value: buildCsp(stage) },
    // No includeSubDomains/preload until every subdomain of the production domain is confirmed HTTPS.
    { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), hid=(), magnetometer=(), gyroscope=(), accelerometer=(), browsing-topics=()',
    },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ];
}
