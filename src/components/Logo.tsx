import Link from 'next/link';
import { chrome } from '@/lib/content';
import { business } from '@/lib/site';

/** The mark: a house in section with one copper run through it. Same drawing as src/app/icon.svg. */
function Mark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M4 15 16 5l12 10v13H4z" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="round" />
      <path d="M9 21h11a3 3 0 0 0 0-6" fill="none" stroke="#c46a3a" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

/** The visible wordmark is the link's accessible name, so voice-control users can say what they see. */
export function Logo({ tone = 'ink' }: { tone?: 'ink' | 'light' }) {
  return (
    <Link href="/" className={`flex min-h-11 items-center gap-2.5 ${tone === 'light' ? 'text-on-dark' : 'text-ink'}`}>
      <Mark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.375rem] font-semibold tracking-tight">{business.name}</span>
        <span className="sr-only"> </span>
        <span className={`label mt-1 text-[0.6875rem] ${tone === 'light' ? 'text-on-dark-muted' : 'text-muted'}`}>{business.descriptor}</span>
        <span className="sr-only">{chrome.homeSuffix}</span>
      </span>
    </Link>
  );
}
