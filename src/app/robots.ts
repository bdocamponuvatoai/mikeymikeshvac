import type { MetadataRoute } from 'next';
import { absoluteUrl, indexable } from '@/lib/env';

/** Previews and local builds disallow everything; only Vercel production is crawlable. */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') };
}
