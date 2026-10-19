import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Same mark as icon.svg, on a full-bleed square so iOS can round the corners itself. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#122b39' }}>
        <svg width="132" height="132" viewBox="0 0 32 32">
          <path d="M6 16 16 7.5 26 16v10H6z" fill="none" stroke="#f3efe6" strokeWidth="2.25" strokeLinejoin="round" />
          <path d="M10.5 21.5h9a2.75 2.75 0 0 0 0-5.5" fill="none" stroke="#e4915c" strokeWidth="2.25" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
