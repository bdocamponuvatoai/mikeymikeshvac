import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ContactBar } from '@/components/ContactBar';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { chrome, meta } from '@/lib/content';
import { indexable, siteUrl } from '@/lib/env';
import { organizationSchema } from '@/lib/seo';
import { business } from '@/lib/site';
import { display, displayItalic, mono, sans } from './fonts';
import './globals.css';

// No canonical or openGraph.url here: those are per page (see lib/seo.ts), so they never leak into the 404.
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: meta.titleDefault, template: `%s | ${business.name}` },
  description: meta.description,
  applicationName: `${business.name} ${business.descriptor}`,
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: `${business.name} ${business.descriptor}`,
    title: meta.ogTitle,
    description: meta.description,
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f3efe6',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${display.variable} ${displayItalic.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="btn btn-ink fixed top-2 left-2 z-50 -translate-y-24 focus-visible:translate-y-0"
        >
          {chrome.skip}
        </a>
        <Header />
        {children}
        <Footer />
        <ContactBar />
        <JsonLd data={organizationSchema()} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
