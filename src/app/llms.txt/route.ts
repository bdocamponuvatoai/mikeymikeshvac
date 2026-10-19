import { home, serviceCopy } from '@/lib/content';
import { absoluteUrl } from '@/lib/env';
import { business, contacts, credentials, services } from '@/lib/site';

export const dynamic = 'force-static';

/** Plain-text summary for language-model crawlers, built from the same facts as the pages. */
export function GET() {
  const lines = [
    `# ${business.name} ${business.descriptor}`,
    '',
    `> ${business.legalName}. Veteran-owned heating, air conditioning, heat pump and general contracting work in ${business.region}.`,
    '',
    '## Contact',
    ...contacts.map((c) => `- ${c.name}: ${c.display}`),
    `- Email: ${business.email}`,
    `- Request a free quote: ${absoluteUrl('/contact')}`,
    '',
    '## Services',
    ...services.map((s) => `- [${s.title}](${absoluteUrl(`/services/${s.slug}`)}): ${serviceCopy[s.slug].description}`),
    '',
    '## Credentials (as stated by the business)',
    ...Object.values(credentials)
      .filter((c) => c !== credentials.licensedInsuredShort)
      .map((c) => `- ${c}`),
    '',
    '## FAQ',
    ...home.faq.items.flatMap(({ q, a }) => [`- ${q} ${a}`]),
    '',
    'Not stated: street address, hours, prices, response times. Ask the team.',
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
