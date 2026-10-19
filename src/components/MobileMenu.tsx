'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { chrome, nav } from '@/lib/content';
import { business, contacts, credentials, tel } from '@/lib/site';
import { Logo } from './Logo';

/**
 * Full-screen menu on a native modal <dialog>: focus is trapped and Escape closes it
 * for free, and focus returns to the Menu button on close.
 */
export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  const close = () => dialog.current?.close();

  // Close after client-side navigation, and when the viewport grows into the desktop layout.
  useEffect(() => close(), [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 64rem)');
    const onChange = () => desktop.matches && close();
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        className="label inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-ink px-3.5 text-ink"
      >
        {chrome.menu} <Menu className="size-4" aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        aria-label={chrome.menuTitle}
        className="menu-dialog on-dark"
        // Any link closes the menu, including same-page ones (e.g. the logo on "/") that don't change the pathname.
        onClick={(e) => (e.target as HTMLElement).closest('a') && close()}
      >
        <div className="container-x flex min-h-full flex-col pb-8">
          <div className="flex h-(--header-h) items-center justify-between">
            <Logo tone="light" />
            <button
              type="button"
              onClick={close}
              autoFocus
              className="label inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-on-dark-muted px-3.5 text-on-dark"
            >
              {chrome.close} <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6">
            <ul className="border-t border-rule-dark">
              {nav.map((l, i) => (
                <li key={l.href} className="border-b border-rule-dark">
                  <Link href={l.href} className="flex min-h-16 items-center justify-between gap-4 py-3">
                    <span className="flex items-baseline gap-4">
                      <span className="label text-copper-bright">0{i + 1}</span>
                      <span className="font-display text-3xl">{l.label}</span>
                    </span>
                    <ArrowUpRight className="size-6 text-on-dark-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid gap-3 pt-10">
            <Link href="/contact" className="btn bg-copper-bright text-navy hover:bg-[#f0a476]">
              {chrome.quoteCta} <ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
            {contacts.map((c) => (
              <a key={c.name} href={tel(c)} className="btn btn-line text-on-dark">
                <Phone className="size-4" aria-hidden="true" /> {chrome.call(c.name)} · {c.display}
              </a>
            ))}
            <p className="label mt-3 text-on-dark-muted">
              {credentials.veteranOwned} · {business.region}
            </p>
          </div>
        </div>
      </dialog>
    </div>
  );
}
