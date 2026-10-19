import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Phone } from 'lucide-react';
import { chrome, notFound } from '@/lib/content';
import { primaryContact, tel } from '@/lib/site';

export const metadata: Metadata = { title: notFound.title, robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="sheet-grid outline-none">
      <div className="container-x py-24 lg:py-36">
        <p className="label text-copper">{notFound.eyebrow}</p>
        <h1 className="mt-4 max-w-[16ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.98]">{notFound.heading}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{notFound.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            {notFound.home} <ArrowUpRight className="size-5" aria-hidden="true" />
          </Link>
          <a href={tel(primaryContact)} className="btn btn-line text-ink">
            <Phone className="size-4" aria-hidden="true" /> {chrome.call(primaryContact.name)}
          </a>
        </div>
      </div>
    </main>
  );
}
