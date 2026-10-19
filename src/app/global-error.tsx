'use client';

import { useEffect } from 'react';
import { errorPage } from '@/lib/content';
import { business, primaryContact, tel } from '@/lib/site';

/** Last-resort boundary: replaces the root layout, so it carries its own minimal inline styling. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-US">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f3efe6', color: '#14232c' }}>
        <main style={{ maxWidth: '40rem', margin: '0 auto', padding: '6rem 1.25rem' }}>
          <p style={{ color: '#9a4a1f', fontWeight: 600 }}>{business.name}</p>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.05, margin: '1rem 0' }}>{errorPage.heading}</h1>
          <p style={{ color: '#4f5b61', fontSize: '1.125rem' }}>{errorPage.body}</p>
          <p style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            <button type="button" onClick={reset} style={{ minHeight: 48, padding: '0 1.25rem', background: '#9a4a1f', color: '#fff', border: 0, fontWeight: 600, fontSize: '1rem' }}>
              {errorPage.retry}
            </button>
            <a href={tel(primaryContact)} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '0 1.25rem', border: '1.5px solid #14232c', color: '#14232c', fontWeight: 600 }}>
              {primaryContact.name} · {primaryContact.display}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
