import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { home, meta } from '@/lib/content';
import { business, credentials } from '@/lib/site';

export const alt = meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const asset = (...p: string[]) => readFile(path.join(process.cwd(), 'src', 'assets', ...p));

/**
 * Satori cannot decode WebP and ignores blend modes, so the background is a JPEG with
 * the navy fade baked in (scripts/build-images.mjs), and the fonts are TTF.
 */
export default async function OpengraphImage() {
  const [bg, slab, slabItalic, mono] = await Promise.all([
    asset('og-background.jpg'),
    asset('fonts', 'ZillaSlab-SemiBold.ttf'),
    asset('fonts', 'ZillaSlab-SemiBoldItalic.ttf'),
    asset('fonts', 'IBMPlexMono-Medium.ttf'),
  ]);
  const bgSrc = `data:image/jpeg;base64,${bg.toString('base64')}`;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#122b39', color: '#f3efe6' }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> only */}
        <img src={bgSrc} width={1200} height={630} alt="" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 0 56px 72px', width: 640, height: '100%' }}>
          <div style={{ display: 'flex', fontFamily: 'Plex Mono', fontSize: 22, letterSpacing: 2, color: '#e4915c', textTransform: 'uppercase' }}>
            {`${business.descriptor} · ${business.region}`}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Zilla Slab', fontSize: 76, lineHeight: 1 }}>
            <span>{home.hero.titleA}</span>
            <span>{home.hero.titleB}</span>
            <span style={{ fontStyle: 'italic', color: '#e4915c' }}>{home.hero.titleC}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', fontFamily: 'Zilla Slab', fontSize: 40 }}>{business.name}</div>
            <div style={{ display: 'flex', fontFamily: 'Plex Mono', fontSize: 20, color: '#b4c3c9' }}>
              {`${credentials.veteranOwned} · ${credentials.licensedInsuredShort}`}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Zilla Slab', data: slab, style: 'normal', weight: 600 },
        { name: 'Zilla Slab', data: slabItalic, style: 'italic', weight: 600 },
        { name: 'Plex Mono', data: mono, style: 'normal', weight: 500 },
      ],
    },
  );
}
