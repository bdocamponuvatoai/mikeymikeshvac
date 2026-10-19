import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/env';
import { services } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [path: string, priority: number][] = [
    ['/', 1],
    ['/contact', 0.9],
    ...services.map((s): [string, number] => [`/services/${s.slug}`, 0.8]),
    ['/about', 0.6],
    ['/privacy', 0.2],
  ];
  return pages.map(([path, priority]) => ({ url: absoluteUrl(path), changeFrequency: 'monthly', priority }));
}
