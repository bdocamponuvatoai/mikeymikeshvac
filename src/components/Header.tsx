import Link from 'next/link';
import { ArrowUpRight, Phone } from 'lucide-react';
import { chrome } from '@/lib/content';
import { primaryContact, tel } from '@/lib/site';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="container-x flex h-(--header-h) items-center justify-between gap-6">
        <Logo />
        <NavLinks />
        <div className="hidden items-center gap-5 lg:flex">
          <a href={tel(primaryContact)} className="label inline-flex min-h-11 items-center gap-2 text-ink hover:text-copper">
            <Phone className="size-4" aria-hidden="true" /> {primaryContact.display}
          </a>
          <Link href="/contact" className="btn btn-primary min-h-11 py-2.5 text-[0.9375rem]">
            {chrome.quoteCta} <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
