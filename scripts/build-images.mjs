// Regenerates the web copies in src/assets from the masters in assets-src.
//
//   assets-src/photos/*.webp  → src/assets/photos/*.webp  (lossless: metadata chunks stripped, pixels untouched)
//   assets-src/photos/home    → src/assets/og-background.jpg (1200×630, navy baked in, feathered edge, for next/og)
//   assets-src/fonts/*.ttf    → src/assets/fonts/*.ttf     (TTF for next/og; Satori cannot read WOFF2)
//
// The photo masters are 1536×1024 lossy WebP (no PNG originals exist), so they are copied
// as-is rather than re-encoded; next/image produces the AVIF/WebP sizes at request time.
// Usage: npm run images
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const src = (...p) => path.join(root, 'assets-src', ...p);
const out = (...p) => path.join(root, 'src', 'assets', ...p);
const NAVY = '#122b39';

/** Rebuilds a RIFF/WebP file without EXIF/XMP chunks and clears the VP8X metadata flags. */
function stripWebpMetadata(buf) {
  if (buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') throw new Error('not a WebP file');
  const chunks = [];
  for (let i = 12; i < buf.length; ) {
    const id = buf.toString('latin1', i, i + 4);
    const size = buf.readUInt32LE(i + 4);
    const end = i + 8 + size + (size & 1);
    if (id !== 'EXIF' && id !== 'XMP ') chunks.push(Buffer.from(buf.subarray(i, end)));
    i = end;
  }
  const vp8x = chunks.find((c) => c.toString('latin1', 0, 4) === 'VP8X');
  if (vp8x) vp8x[8] &= ~0b0000_1100; // EXIF (0x08) and XMP (0x04) flags
  const body = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.write('RIFF', 0, 'latin1');
  header.writeUInt32LE(body.length + 4, 4);
  header.write('WEBP', 8, 'latin1');
  return { data: Buffer.concat([header, body]), dropped: buf.length - 12 - body.length };
}

await mkdir(out('photos'), { recursive: true });
await mkdir(out('fonts'), { recursive: true });

for (const file of (await readdir(src('photos'))).filter((f) => f.endsWith('.webp'))) {
  const { data, dropped } = stripWebpMetadata(await readFile(src('photos', file)));
  await writeFile(out('photos', file), data);
  console.log(`photo  ${file}${dropped ? ` (stripped ${dropped} bytes of metadata)` : ''}`);
}

// Share image background: the photo on the right, fading into solid navy on the left
// so the headline sits on flat colour. Satori ignores blend modes, so the blend is baked in here.
const W = 1200;
const H = 630;
const photoW = 820;
const photo = await sharp(src('photos', 'home.webp')).resize(photoW, H, { fit: 'cover', position: 'centre' }).toBuffer();
const feather = Buffer.from(
  `<svg width="${photoW}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.38" stop-color="#fff" stop-opacity="1"/>` +
    `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);
const fadedPhoto = await sharp(photo).ensureAlpha().composite([{ input: feather, blend: 'dest-in' }]).png().toBuffer();
await sharp({ create: { width: W, height: H, channels: 3, background: NAVY } })
  .composite([{ input: fadedPhoto, left: W - photoW, top: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out('og-background.jpg'));
console.log('og     og-background.jpg');

for (const file of (await readdir(src('fonts'))).filter((f) => f.endsWith('.ttf'))) {
  await copyFile(src('fonts', file), out('fonts', file));
  console.log(`font   ${file}`);
}
