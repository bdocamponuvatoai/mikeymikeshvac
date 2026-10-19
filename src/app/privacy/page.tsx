import { Breadcrumb } from '@/components/Breadcrumb';
import { privacy } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: privacy.metaTitle, description: privacy.metaDescription, path: '/privacy' });

export default function PrivacyPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="container-x max-w-4xl pt-6 pb-20 lg:pb-28">
        <Breadcrumb items={[{ name: privacy.metaTitle, path: '/privacy' }]} />
        <p className="label mt-8 text-copper">{privacy.eyebrow}</p>
        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.98]">{privacy.title}</h1>
        <p className="label mt-5 text-muted">{privacy.updated}</p>
        <div className="mt-12 border-t border-ink">
          {privacy.sections.map((s) => (
            <section key={s.h} className="grid grid-cols-[minmax(0,1fr)] gap-3 border-b border-ink py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
              <h2 className="text-2xl">{s.h}</h2>
              <p className="min-w-0 text-lg text-muted [overflow-wrap:anywhere]">{s.p}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">{privacy.note}</p>
      </div>
    </main>
  );
}
