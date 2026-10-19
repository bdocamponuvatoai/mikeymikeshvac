'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, MessageSquare, Phone } from 'lucide-react';
import { chrome } from '@/lib/content';
import { primaryContact, sms, tel } from '@/lib/site';

/** Thumb-reach actions on small screens. On /contact the form is already on screen, so offer a text instead. */
export function ContactBar() {
  const onContact = usePathname() === '/contact';
  return (
    <div
      role="region"
      aria-label={chrome.quickContact}
      className="no-print fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-ink bg-paper p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <a href={tel(primaryContact)} className="btn btn-line text-ink">
        <Phone className="size-4" aria-hidden="true" /> {chrome.call(primaryContact.name)}
      </a>
      {onContact ? (
        <a href={sms(primaryContact)} className="btn btn-primary">
          <MessageSquare className="size-4" aria-hidden="true" /> {chrome.text(primaryContact.name)}
        </a>
      ) : (
        <Link href="/contact" className="btn btn-primary">
          {chrome.quoteShort} <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
