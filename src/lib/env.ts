/**
 * Deployment-aware settings. Only Vercel production is indexable. Previews and
 * local builds are noindex, unless NEXT_PUBLIC_SITE_URL is set on purpose for a
 * local production check (see README → Quality).
 */
type Env = Record<string, string | undefined>;

export function resolveSiteUrl(env: Env = process.env): URL {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);
  const production = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return new URL(`https://${production}`);
  return new URL('http://localhost:3000');
}

export function resolveIndexable(env: Env = process.env): boolean {
  if (env.VERCEL_ENV) return env.VERCEL_ENV === 'production';
  return Boolean(env.NEXT_PUBLIC_SITE_URL?.trim());
}

export const siteUrl = resolveSiteUrl();
export const indexable = resolveIndexable();
export const absoluteUrl = (path = '/') => new URL(path, siteUrl).toString();
