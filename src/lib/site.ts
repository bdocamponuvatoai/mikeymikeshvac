/**
 * Every business fact the site states lives here, and only here.
 *
 * Source: the owner's site, https://www.mikeymikeshvac.com/ (/home and /home/about),
 * re-checked 2026-10-19. Anything not on that site, or not confirmed by the owner,
 * is deliberately absent: no street address, hours, town, service radius, prices,
 * reviews, response times, years in business or emergency/24-7 claims.
 * See README → "Content and editorial policy" before adding a fact.
 */

export type Contact = {
  name: string;
  /** Human-readable number, as the owner publishes it. */
  display: string;
  /** E.164 for tel:/sms: links and structured data. */
  e164: string;
};

export const business = {
  /** Display brand. The owner's site header currently reads "HVAC & GC Services". */
  name: 'Mikey Mike’s',
  descriptor: 'HVAC & Construction',
  legalName: 'Mikey Mike’s HVAC Services LLC',
  /**
   * Region only. A town is intentionally withheld until the owner confirms it.
   * The owner lists Rhode Island as "coming soon"; it is not offered on this site.
   */
  region: 'Massachusetts',
  regionCode: 'MA',
  /** Displayed on the owner's site. Note: that site's mailto link points to info@mikeymikeshvac.com. */
  email: 'mikeymikeshvac.construction@gmail.com',
  ownerSite: 'https://www.mikeymikeshvac.com/',
  /** ISO year-month the LLC was formed (owner's About page: "January 2024"). */
  llcFormed: '2024-01',
} as const;

export const contacts = [
  { name: 'Mike', display: '508-951-6629', e164: '+15089516629' },
  { name: 'Matt', display: '774-526-9007', e164: '+17745269007' },
] as const satisfies readonly Contact[];

export const primaryContact: Contact = contacts[0];

/** Credentials stated on the owner's site. */
export const credentials = {
  licensedInsured: 'Licensed and insured HVAC and general contractor',
  licensedInsuredShort: 'Licensed & insured',
  veteranOwned: 'Veteran-owned',
  massSave: 'Mass Save participating contractor',
  epa608: 'EPA Section 608 certified',
  csl: 'Massachusetts Construction Supervisor License',
  discounts: 'Discounts for veterans and first responders',
} as const;

/** Mike's history, in order, exactly as the owner's About page tells it. */
export const history = [
  { when: 'Start', what: 'Electrical Shop, Diman Regional Vocational Technical High School' },
  { when: 'Service', what: 'United States Army, Operation Desert Storm' },
  { when: 'Trade', what: 'Service technician, American Dryer' },
  { when: '2014', what: 'HVAC Controls & Energy Management certificate, The Peterson School' },
  { when: 'Jan 2024', what: 'Mikey Mike’s HVAC Services LLC formed' },
] as const;

export const services = [
  { slug: 'heating', title: 'Heating' },
  { slug: 'cooling', title: 'Air conditioning' },
  { slug: 'heat-pumps', title: 'Heat pumps & mini-splits' },
  { slug: 'construction', title: 'General contracting' },
] as const;

export type ServiceSlug = (typeof services)[number]['slug'];

export const serviceSlugs = services.map((s) => s.slug) as [ServiceSlug, ...ServiceSlug[]];

export const tel = (c: Contact) => `tel:${c.e164}`;
export const sms = (c: Contact) => `sms:${c.e164}`;
export const mailto = `mailto:${business.email}`;
