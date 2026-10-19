import type { Metadata } from 'next';
import { home, meta } from './content';
import { absoluteUrl } from './env';
import { business, contacts, services } from './site';

const shareImage = { url: '/opengraph-image', width: 1200, height: 630, alt: meta.ogAlt };

/**
 * Per-page metadata. Canonical and openGraph.url are set here, page by page, and
 * never in the root layout, where they would leak into every page and the 404.
 * Next merges metadata shallowly (a page's openGraph/twitter replaces the layout's whole
 * object), so each page carries the full set, including the share image.
 */
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const fullTitle = title ? `${title} | ${business.name}` : meta.titleDefault;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: `${business.name} ${business.descriptor}`,
      title: fullTitle,
      description,
      url: path,
      images: [shareImage],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [shareImage] },
  };
}

/** Serialises JSON-LD for an inline script, escaping `<` so content cannot close the tag. */
export function jsonLd(data: object): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}

/**
 * Organization rather than LocalBusiness/HVACBusiness: Google requires a street
 * address for LocalBusiness, and no address has been confirmed by the owner.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: `${business.name} ${business.descriptor}`,
    legalName: business.legalName,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/icon.svg'),
    email: business.email,
    telephone: contacts[0].e164,
    foundingDate: business.llcFormed,
    sameAs: [business.ownerSite],
    areaServed: { '@type': 'State', name: business.region },
    contactPoint: contacts.map((c) => ({
      '@type': 'ContactPoint',
      name: c.name,
      telephone: c.e164,
      contactType: 'customer service',
      areaServed: `US-${business.regionCode}`,
      availableLanguage: 'English',
    })),
    knowsAbout: services.map((s) => s.title),
  };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: home.faq.items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function serviceSchema(slug: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(`/services/${slug}`),
    provider: { '@id': absoluteUrl('/#organization') },
    areaServed: { '@type': 'State', name: business.region },
  };
}
