import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import { HouseSection } from '@/components/HouseSection';
import { JsonLd } from '@/components/JsonLd';
import { RevisionBlock } from '@/components/RevisionBlock';
import { home, meta, serviceCopy } from '@/lib/content';
import { heroUnit, photos, servicePhotos } from '@/lib/media';
import { faqSchema, pageMetadata } from '@/lib/seo';
import { credentials, primaryContact, services, tel } from '@/lib/site';

export const metadata = pageMetadata({ description: meta.description, path: '/' });

export default function Home() {
  const { hero, section, story, steps, community, faq } = home;
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {/* ───── Hero ───── */}
      <section aria-labelledby="hero-heading" className="sheet-grid border-b border-rule">
        <div className="container-x grid gap-10 pt-10 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14 lg:pt-16 lg:pb-20">
          <div className="hero-rise min-w-0">
            <p className="label flex items-center gap-2.5 text-copper">
              <span className="size-2 bg-copper" aria-hidden="true" /> {hero.eyebrow}
            </p>
            <h1 id="hero-heading" className="mt-5 text-[clamp(2.75rem,8.5vw,5.75rem)] leading-[0.95]">
              <span className="block">{hero.titleA}</span>
              <span className="block">{hero.titleB}</span>
              <em className="block font-display-italic text-copper">{hero.titleC}</em>
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg text-muted sm:text-xl">{hero.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/contact" className="btn btn-primary">
                {hero.primary} <ArrowUpRight className="size-5" aria-hidden="true" />
              </Link>
              <a href={tel(primaryContact)} className="btn btn-line text-ink">
                <Phone className="size-4" aria-hidden="true" /> {hero.secondary}
              </a>
            </div>
          </div>

          <figure className="relative min-w-0">
            <div className="relative border border-ink bg-card p-2 sm:p-3">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={photos.home}
                  alt={hero.imageAlt}
                  preload
                  fetchPriority="high"
                  quality={70}
                  sizes="(min-width: 84rem) 680px, (min-width: 64rem) 52vw, 100vw"
                  className="size-full object-cover"
                  placeholder="blur"
                />
                {/* Callout pinned to the outdoor unit in the photo. */}
                <div
                  aria-hidden="true"
                  className="absolute"
                  style={{ left: `${heroUnit.x * 100}%`, top: `${heroUnit.y * 100}%` }}
                >
                  <span className="absolute -top-2.5 -left-2.5 block size-5 rounded-full border-2 border-white bg-copper" />
                  <span className="absolute right-3 bottom-3 block h-px w-12 origin-right rotate-[20deg] bg-white sm:w-20" />
                  <span className="label absolute right-14 bottom-6 bg-ink px-2 py-1 whitespace-nowrap text-paper sm:right-[5.5rem] sm:bottom-9">
                    {hero.annotationRef} · {hero.annotation}
                  </span>
                </div>
              </div>
            </div>
            <figcaption className="label mt-3 flex justify-between gap-4 text-muted">
              <span>Fig. 1</span>
              <span>{hero.imageNote}</span>
            </figcaption>
          </figure>
        </div>

        {/* Data plate: the credentials the business states, nothing more. */}
        <div className="container-x pb-12 lg:pb-16">
          <ul className="grid grid-cols-2 border border-ink bg-card lg:grid-cols-4" aria-label="Credentials">
            {home.proof.map((p, i) => (
              <li
                key={p}
                className={`flex min-h-20 flex-col justify-center gap-1 px-4 py-4 sm:px-5 ${i % 2 ? 'border-l border-ink' : ''} ${i > 1 ? 'border-t border-ink lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
              >
                <span className="label text-copper">0{i + 1}</span>
                <span className="font-semibold leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───── Signature: the house in section ───── */}
      <section id="section" aria-labelledby="section-heading" className="scroll-mt-(--header-h) py-20 lg:py-28">
        <div className="container-x">
          <div className="reveal grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
            <div>
              <p className="label text-copper">{section.eyebrow}</p>
              <h2 id="section-heading" className="mt-4 max-w-[18ch] text-4xl sm:text-5xl lg:text-6xl">
                {section.title}
              </h2>
            </div>
            <p className="text-lg text-muted">{section.lead}</p>
          </div>
          <div className="mt-12">
            <HouseSection />
          </div>
        </div>
      </section>

      {/* ───── Services ───── */}
      <section id="services" aria-labelledby="services-heading" className="border-y border-rule bg-paper-deep py-20 lg:py-28">
        <div className="container-x">
          <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label text-copper">{home.services.eyebrow}</p>
              <h2 id="services-heading" className="mt-4 max-w-[16ch] text-4xl sm:text-5xl lg:text-6xl">
                {home.services.title}
              </h2>
            </div>
            <p className="max-w-md text-lg text-muted">{home.services.lead}</p>
          </div>
          <ul className="mt-14 border-t border-ink">
            {services.map((s) => {
              const c = serviceCopy[s.slug];
              return (
                <li key={s.slug} className="reveal border-b border-ink">
                  <Link
                    href={`/services/${s.slug}`}
                    className="group grid grid-cols-[minmax(0,1fr)_6.5rem] gap-x-5 gap-y-3 py-8 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8 lg:grid-cols-[5rem_minmax(0,1.1fr)_minmax(0,1fr)_14rem] lg:py-10"
                  >
                    <span className="label col-span-2 text-base text-copper sm:col-span-1">{c.number}</span>
                    <span className="min-w-0">
                      <span className="block font-display text-3xl leading-tight font-semibold group-hover:text-copper sm:text-4xl">{s.title}</span>
                      <span className="mt-2 block text-muted">{c.promise}</span>
                    </span>
                    <span className="hidden min-w-0 text-[0.9375rem] lg:block">
                      {c.points.map((p) => (
                        <span key={p} className="block border-b border-rule py-1.5 last:border-b-0">
                          {p}
                        </span>
                      ))}
                    </span>
                    <span className="relative row-span-2 block aspect-[3/2] w-[6.5rem] self-start overflow-hidden border border-ink sm:row-span-1 sm:w-44 lg:w-56">
                      <Image src={servicePhotos[s.slug]} alt="" sizes="224px" quality={70} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    </span>
                    <span className="label inline-flex items-center gap-2 text-ink sm:hidden">
                      {home.services.more} <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───── Story ───── */}
      <section aria-labelledby="story-heading" className="on-dark bg-navy py-20 text-on-dark lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="reveal min-w-0">
            <p className="label text-copper-bright">{story.eyebrow}</p>
            <h2 id="story-heading" className="mt-4 max-w-[14ch] text-4xl sm:text-5xl lg:text-6xl">
              {story.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg text-on-dark-muted">{story.lead}</p>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {[credentials.epa608, credentials.csl, credentials.licensedInsured, credentials.massSave].map((c) => (
                <li key={c} className="border-l-2 border-copper-bright pl-3 text-[0.9375rem]">
                  {c}
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-10 inline-flex min-h-11 items-center gap-2 font-semibold text-copper-bright hover:underline">
              {story.link} <ArrowUpRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
          <div className="reveal min-w-0">
            <RevisionBlock />
            <figure className="mt-8">
              <div className="relative aspect-[3/2] overflow-hidden border border-rule-dark">
                <Image src={photos.craft} alt={story.imageAlt} sizes="(min-width: 64rem) 40vw, 100vw" quality={72} className="size-full object-cover" />
              </div>
              <figcaption className="label mt-3 flex justify-between text-on-dark-muted">
                <span>Fig. 2</span>
                <span>{hero.imageNote}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ───── Process ───── */}
      <section aria-labelledby="steps-heading" className="py-20 lg:py-28">
        <div className="container-x">
          <p className="label text-copper">{steps.eyebrow}</p>
          <h2 id="steps-heading" className="mt-4 text-4xl sm:text-5xl lg:text-6xl">
            {steps.title}
          </h2>
          <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.items.map((s, i) => (
              <li key={s.title} className="reveal">
                <div className="flex items-center gap-4 text-ink">
                  <span className="label text-copper">Step 0{i + 1}</span>
                  <span className="dimension flex-1" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-2xl sm:text-3xl">{s.title}</h3>
                <p className="mt-3 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── Community: the one full-colour section ───── */}
      <section aria-labelledby="community-heading" className="bg-copper text-white">
        <div className="container-x grid gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-20">
          <div>
            <p className="label">{community.eyebrow}</p>
            <h2 id="community-heading" className="mt-3 max-w-[20ch] text-4xl sm:text-5xl">
              {community.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg">{community.body}</p>
          </div>
          <Link href="/contact" className="btn btn-ink self-start lg:self-center">
            {community.cta} <ArrowUpRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" aria-labelledby="faq-heading" className="py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
          <div>
            <p className="label text-copper">{faq.eyebrow}</p>
            <h2 id="faq-heading" className="mt-4 text-4xl sm:text-5xl lg:text-6xl">
              {faq.title}
            </h2>
            <p className="mt-6 text-muted">
              {faq.lead}{' '}
              <a href={tel(primaryContact)} className="prose-link font-semibold text-ink">
                {faq.callLink} · {primaryContact.display}
              </a>
            </p>
          </div>
          <div className="border-t border-ink">
            {faq.items.map(({ q, a }, i) => (
              <details key={q} className="faq-item border-b border-ink">
                <summary className="flex min-h-16 cursor-pointer items-center gap-5 py-5">
                  <span className="label text-copper">0{i + 1}</span>
                  <span className="flex-1 text-lg leading-snug font-semibold sm:text-xl">{q}</span>
                  <span className="faq-plus" aria-hidden="true" />
                </summary>
                <p className="max-w-2xl pb-6 pl-10 text-muted sm:pl-11">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={faqSchema()} />
    </main>
  );
}
