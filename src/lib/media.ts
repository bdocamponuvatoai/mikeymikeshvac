import type { StaticImageData } from 'next/image';
import construction from '@/assets/photos/construction.webp';
import cooling from '@/assets/photos/cooling.webp';
import craft from '@/assets/photos/craft.webp';
import heating from '@/assets/photos/heating.webp';
import home from '@/assets/photos/home.webp';
import technician from '@/assets/photos/technician.webp';
import type { ServiceSlug } from './site';

/** All photographs are illustrative, AI-generated images; they do not show company projects or staff. */
export const photos = { home, craft, technician } as const;

export const servicePhotos: Record<ServiceSlug, StaticImageData> = {
  heating,
  cooling,
  'heat-pumps': technician,
  construction,
};

/** Where the outdoor heat pump sits in the hero photo, as a fraction of its width and height. */
export const heroUnit = { x: 0.928, y: 0.615 } as const;
