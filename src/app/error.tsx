'use client';

import { useEffect } from 'react';
import { Phone, RotateCcw } from 'lucide-react';
import { chrome, errorPage } from '@/lib/content';
import { primaryContact, tel } from '@/lib/site';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" tabIndex={-1} className="sheet-grid outline-none">
      <div className="container-x py-24 lg:py-36">
        <p className="label text-copper">{errorPage.eyebrow}</p>
        <h1 className="mt-4 max-w-[16ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.98]">{errorPage.heading}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{errorPage.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            <RotateCcw className="size-4" aria-hidden="true" /> {errorPage.retry}
          </button>
          <a href={tel(primaryContact)} className="btn btn-line text-ink">
            <Phone className="size-4" aria-hidden="true" /> {chrome.call(primaryContact.name)}
          </a>
        </div>
      </div>
    </main>
  );
}
