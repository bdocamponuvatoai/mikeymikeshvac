import { Mail, MessageSquare, Phone } from 'lucide-react';
import { QuoteForm } from '@/components/QuoteForm';
import { contact } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { business, contacts, mailto, sms, tel } from '@/lib/site';

export const metadata = pageMetadata({ title: contact.metaTitle, description: contact.metaDescription, path: '/contact' });

export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1} className="sheet-grid outline-none">
      <div className="container-x grid gap-12 py-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-20">
        <div className="hero-rise min-w-0">
          <p className="label text-copper">{contact.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.98]">{contact.title}</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{contact.lead}</p>

          <ul className="mt-10 border-t border-ink">
            {contacts.map((c) => (
              <li key={c.name} className="border-b border-ink py-5">
                <h2 className="text-2xl">{contact.talkTo(c.name)}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={tel(c)} className="btn btn-ink" aria-label={contact.callAria(c.name, c.display)}>
                    <Phone className="size-4" aria-hidden="true" /> {c.display}
                  </a>
                  <a href={sms(c)} className="btn btn-line text-ink" aria-label={contact.textAria(c.name)}>
                    <MessageSquare className="size-4" aria-hidden="true" /> {contact.textLabel}
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <a href={mailto} className="prose-link mt-6 inline-flex min-h-11 items-center gap-2 font-semibold [overflow-wrap:anywhere]">
            <Mail className="size-4 flex-none" aria-hidden="true" /> {business.email}
          </a>
          <p className="mt-4 text-muted">{contact.area}</p>
        </div>

        <div className="min-w-0">
          <noscript>
            <style>{'.needs-js{display:none!important}'}</style>
            <p className="border border-ink bg-card p-6 text-lg">{contact.noscript}</p>
          </noscript>
          <QuoteForm />
        </div>
      </div>
    </main>
  );
}
