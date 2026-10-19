import { IBM_Plex_Mono, Public_Sans, Zilla_Slab } from 'next/font/google';

/** Display: a sturdy slab with the feel of a stamped equipment nameplate. Static weight only. */
export const display = Zilla_Slab({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-zilla',
  display: 'swap',
});

/**
 * The italic sets a single short line on the home page, so it is not preloaded:
 * a late swap cannot change any line's height or push content down.
 */
export const displayItalic = Zilla_Slab({
  subsets: ['latin'],
  weight: ['600'],
  style: ['italic'],
  variable: '--font-zilla-italic',
  display: 'swap',
  preload: false,
});

/** Body: Public Sans, the U.S. government's open typeface. Plain and highly readable (weight axis only). */
export const sans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public',
  display: 'swap',
});

/** Labels: drawing-annotation mono. Preloaded, because a late swap re-wraps labels above the fold. */
export const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-plex',
  display: 'swap',
});
