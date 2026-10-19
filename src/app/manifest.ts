import type { MetadataRoute } from 'next';
import { meta } from '@/lib/content';
import { business } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${business.name} ${business.descriptor}`,
    short_name: business.name,
    description: meta.manifestDescription,
    start_url: '/',
    display: 'browser',
    background_color: '#f3efe6',
    theme_color: '#f3efe6',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
