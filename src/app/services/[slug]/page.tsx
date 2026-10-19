import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check, Phone } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { JsonLd } from '@/components/JsonLd';
import { home, serviceCopy, servicePage } from '@/lib/content';
import { servicePhotos } from '@/lib/media';
import { pageMetadata, serviceSchema } from '@/lib/seo';
import { primaryContact, services, tel } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

const find = (slug: string) => services.find((s) => s.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = find((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: serviceCopy[s.slug].description, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const s = find((await params).slug);
  if (!s) notFound();
  const c = serviceCopy[s.slug];
  const others = services.filter((o) => o.slug !== s.slug);

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <section aria-labelledby="service-heading" className="sheet-grid border-b border-rule">
        <div className="container-x grid gap-10 pt-6 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:pb-20">
          <div className="hero-rise min-w-0">
            <Breadcrumb items={[{ name: servicePage.breadcrumb, path: '/#services' }, { name: s.title, path: `/services/${s.slug}` }]} />
            <p className="label mt-8 text-copper">
              {c.number} / {s.title}
            </p>
            <h1 id="service-heading" className="mt-4 text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.98]">
              {c.promise}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">{c.description}</p>
            <Link href={`/contact?service=${s.slug}#quote`} className="btn btn-primary mt-8">
              {servicePage.cta} <ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
          <figure className="min-w-0">
            <div className="border border-ink bg-card p-2 sm:p-3">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image src={servicePhotos[s.slug]} alt={c.imageAlt} preload fetchPriority="high" quality={78} sizes="(min-width: 64rem) 45vw, 100vw" placeholder="blur" className="size-full object-cover" />
              </div>
            </div>
            <figcaption className="label mt-3 flex justify-between text-muted">
              <span>Fig. {c.number}</span>
              <span>{home.hero.imageNote}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="detail-heading" className="py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="label text-copper">{servicePage.detailEyebrow}</p>
            <h2 id="detail-heading" className="mt-4 text-4xl sm:text-5xl">
              {servicePage.detailTitle}
            </h2>
            <ul className="mt-8 border-t border-ink">
              {c.points.map((p) => (
                <li key={p} className="flex items-center gap-4 border-b border-ink py-4 text-lg">
                  <Check className="size-5 flex-none text-copper" aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-muted">{servicePage.detailBody}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={tel(primaryContact)} className="btn btn-ink">
                <Phone className="size-4" aria-hidden="true" /> {servicePage.callLink}
              </a>
              <Link href={`/contact?service=${s.slug}#quote`} className="btn btn-line text-ink">
                {servicePage.quoteLink} <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <aside aria-labelledby="note-heading" className="self-start border border-ink bg-card p-6 sm:p-8">
            <p className="label text-muted">Note</p>
            <h2 id="note-heading" className="mt-3 text-3xl">
              {c.question}
            </h2>
            <p className="mt-4 text-muted">{c.answer}</p>
          </aside>
        </div>
      </section>

      <nav aria-labelledby="related-heading" className="border-t border-rule bg-paper-deep py-16">
        <div className="container-x">
          <h2 id="related-heading" className="label text-copper">
            {servicePage.related}
          </h2>
          <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-px border border-ink bg-ink sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`} className="group flex h-full min-h-28 flex-col justify-between gap-4 bg-card p-5 hover:bg-paper">
                  <span className="label text-copper">{serviceCopy[o.slug].number}</span>
                  <span className="flex items-end justify-between gap-3">
                    <span className="font-display text-2xl leading-tight font-semibold group-hover:text-copper">{o.title}</span>
                    <ArrowUpRight className="size-5 flex-none" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <JsonLd data={serviceSchema(s.slug, s.title, c.description)} />
    </main>
  );
}
