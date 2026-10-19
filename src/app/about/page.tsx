import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageSquare, Phone } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { RevisionBlock } from '@/components/RevisionBlock';
import { about, chrome, home } from '@/lib/content';
import { photos } from '@/lib/media';
import { pageMetadata } from '@/lib/seo';
import { contacts, credentials, mailto, sms, tel } from '@/lib/site';

export const metadata = pageMetadata({ title: about.metaTitle, description: about.metaDescription, path: '/about' });

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <section aria-labelledby="about-heading" className="sheet-grid border-b border-rule">
        <div className="container-x hero-rise pt-6 pb-14 lg:pb-20">
          <Breadcrumb items={[{ name: about.metaTitle, path: '/about' }]} />
          <p className="label mt-8 text-copper">{about.eyebrow}</p>
          <h1 id="about-heading" className="mt-4 max-w-[18ch] text-[clamp(2.5rem,7vw,5rem)] leading-[0.98]">
            {about.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">{about.lead}</p>
        </div>
      </section>

      <section aria-labelledby="story-heading" className="py-20 lg:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <article className="min-w-0">
            <h2 id="story-heading" className="text-4xl sm:text-5xl">
              {about.storyTitle}
            </h2>
            <div className="mt-6 max-w-[62ch] space-y-5 text-lg">
              {about.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <figure className="mt-10">
              <div className="relative aspect-[3/2] overflow-hidden border border-ink">
                <Image src={photos.craft} alt={about.imageAlt} sizes="(min-width: 64rem) 50vw, 100vw" quality={74} placeholder="blur" className="size-full object-cover" />
              </div>
              <figcaption className="label mt-3 flex justify-between text-muted">
                <span>Fig. 2</span>
                <span>{home.hero.imageNote}</span>
              </figcaption>
            </figure>
          </article>

          <div className="min-w-0 space-y-12">
            <section aria-labelledby="record-heading">
              <h2 id="record-heading" className="label text-copper">
                {about.recordTitle}
              </h2>
              <div className="mt-4">
                <RevisionBlock tone="light" />
              </div>
            </section>

            <section aria-labelledby="credentials-heading">
              <h2 id="credentials-heading" className="label text-copper">
                {about.credentialsTitle}
              </h2>
              <ul className="mt-4 border-t border-ink">
                {Object.values(credentials)
                  .filter((c) => c !== credentials.licensedInsuredShort)
                  .map((c) => (
                    <li key={c} className="border-b border-ink py-3.5 font-semibold">
                      {c}
                    </li>
                  ))}
              </ul>
              <p className="mt-3 text-sm text-muted">{about.credentialsNote}</p>
            </section>

            <section aria-labelledby="team-heading" className="border border-ink bg-card p-6 sm:p-8">
              <h2 id="team-heading" className="text-3xl">
                {about.teamTitle}
              </h2>
              <p className="mt-3 text-muted">{about.teamBody}</p>
              <ul className="mt-6 grid gap-3">
                {contacts.map((c) => (
                  <li key={c.name} className="flex flex-wrap gap-2">
                    <a href={tel(c)} className="btn btn-ink flex-1">
                      <Phone className="size-4" aria-hidden="true" /> {chrome.call(c.name)} · {c.display}
                    </a>
                    <a href={sms(c)} className="btn btn-line text-ink" aria-label={chrome.text(c.name)}>
                      <MessageSquare className="size-4" aria-hidden="true" /> Text
                    </a>
                  </li>
                ))}
              </ul>
              <a href={mailto} className="prose-link mt-4 inline-flex min-h-11 items-center font-semibold">
                {chrome.emailTeam}
              </a>
              <Link href="/contact" className="btn btn-primary mt-4 w-full">
                {about.cta} <ArrowUpRight className="size-5" aria-hidden="true" />
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
