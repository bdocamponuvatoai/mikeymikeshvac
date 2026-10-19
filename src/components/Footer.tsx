import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { chrome, home } from '@/lib/content';
import { business, contacts, mailto, services, tel } from '@/lib/site';
import { Logo } from './Logo';

export function Footer() {
  const tb = chrome.titleBlock;
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-navy pb-24 text-on-dark lg:pb-0">
      <div className="container-x py-16 lg:py-24">
        <div className="grid gap-8 border-b border-rule-dark pb-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="label text-copper-bright">{home.hero.eyebrow}</p>
            <h2 className="mt-4 max-w-[16ch] text-4xl sm:text-5xl lg:text-6xl">{chrome.footerHeading}</h2>
          </div>
          <div>
            <p className="max-w-prose text-on-dark-muted">{chrome.footerLead}</p>
            <Link href="/contact" className="btn mt-6 bg-copper-bright text-navy hover:bg-[#f0a476]">
              {chrome.quoteCta} <ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-[30ch] text-[0.9375rem] text-on-dark-muted">{chrome.footerArea}</p>
          </div>
          <div>
            <h3 className="label text-on-dark-muted">{chrome.footerTalk}</h3>
            <ul className="mt-4 space-y-1">
              {contacts.map((c) => (
                <li key={c.name}>
                  <a href={tel(c)} className="inline-flex min-h-11 items-center hover:text-copper-bright">
                    {c.name} · {c.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={mailto} className="inline-flex min-h-11 items-center [overflow-wrap:anywhere] hover:text-copper-bright">
                  {chrome.emailTeam}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="label text-on-dark-muted">{chrome.footerServices}</h3>
            <ul className="mt-4 space-y-1">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="inline-flex min-h-11 items-center hover:text-copper-bright">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="label text-on-dark-muted">{chrome.footerSite}</h3>
            <ul className="mt-4 space-y-1">
              <li>
                <Link href="/about" className="inline-flex min-h-11 items-center hover:text-copper-bright">
                  {home.story.link}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-copper-bright">
                  {chrome.footerPrivacy}
                </Link>
              </li>
              <li>
                <a href={business.ownerSite} className="inline-flex min-h-11 items-center hover:text-copper-bright" rel="noopener">
                  {chrome.footerOwnerSite} <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Drawing title block: the sign-off corner of every sheet in a drawing set. */}
        <dl className="grid grid-cols-2 border border-rule-dark text-[0.9375rem] sm:grid-cols-4">
          {[
            [tb.project, tb.projectValue],
            [tb.scope, tb.scopeValue],
            [tb.region, business.region],
            [tb.sheet, tb.sheetValue],
          ].map(([k, v], i) => (
            <div key={k} className={`p-4 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t sm:border-t-0' : ''} ${i === 2 ? 'sm:border-l' : ''} border-rule-dark`}>
              <dt className="label text-on-dark-muted">{k}</dt>
              <dd className="mt-1">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col gap-3 text-sm text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName}
          </p>
          <p className="max-w-[60ch]">{chrome.footerImages}</p>
        </div>
      </div>
    </footer>
  );
}
