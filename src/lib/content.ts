/**
 * Every piece of visible copy lives here. Business facts (names, numbers,
 * credentials) are imported from ./site so they are stated in exactly one place.
 * Editorial rule: describe what the team does, never promise outcomes, timings or prices.
 */
import { business, contacts, credentials, primaryContact, type ServiceSlug } from './site';

export const meta = {
  titleDefault: `${business.name} ${business.descriptor} | Heating, cooling & construction in ${business.region}`,
  description: `Veteran-owned heating, air conditioning, heat pumps and general contracting in ${business.region}. Call or text Mike or Matt for a free quote.`,
  ogTitle: 'Heating, cooling, and the house around them.',
  ogAlt: 'Mikey Mike’s HVAC & Construction: heating, cooling, and the house around them.',
  manifestDescription: `Veteran-owned heating, cooling and construction in ${business.region}.`,
} as const;

export const nav = [
  { href: '/#section', label: 'The house' },
  { href: '/#services', label: 'Services' },
  { href: '/about', label: 'About Mike' },
  { href: '/#faq', label: 'FAQ' },
] as const;

export const chrome = {
  skip: 'Skip to content',
  homeSuffix: ', home',
  quoteCta: 'Get a free quote',
  quoteShort: 'Free quote',
  menu: 'Menu',
  close: 'Close',
  menuTitle: 'Menu',
  call: (name: string) => `Call ${name}`,
  text: (name: string) => `Text ${name}`,
  quickContact: 'Quick contact',
  footerHeading: 'Tell us what the house needs.',
  footerLead: 'A heating problem, a room that never cools, or a deck you have been planning. Start with a call, a text or the request form.',
  footerTalk: 'Talk to the team',
  footerServices: 'Services',
  footerSite: 'This site',
  footerArea: `Working in ${business.region}. Share your town and the team will confirm coverage.`,
  footerPrivacy: 'Privacy',
  footerOwnerSite: 'Owner’s current site',
  footerImages: 'Photographs on this site are illustrative and do not show completed company projects or staff.',
  emailTeam: 'Email the team',
  backToTop: 'Back to top',
  titleBlock: { project: 'Project', projectValue: 'Your home', scope: 'Scope', scopeValue: 'Heating · Cooling · Building', region: 'Region', sheet: 'Sheet', sheetValue: '1 of 1' },
} as const;

export const home = {
  hero: {
    eyebrow: `HVAC & construction · ${business.region}`,
    titleA: 'Heating, cooling,',
    titleB: 'and the house',
    titleC: 'around them.',
    lead: 'Mike and Matt take on heating and air-conditioning repairs and installs, heat pumps and ductless mini-splits, and general contracting, from decks and siding to remodels.',
    primary: 'Get a free quote',
    secondary: `Call ${primaryContact.name} · ${primaryContact.display}`,
    imageAlt: 'Illustrative white clapboard New England home at sunset with an outdoor heat pump beside the porch',
    annotation: 'Outdoor unit',
    annotationRef: 'A',
    imageNote: 'Illustrative image',
  },
  proof: [credentials.veteranOwned, credentials.licensedInsuredShort, credentials.massSave, credentials.epa608],
  section: {
    eyebrow: 'Sheet A-1 · The house, in section',
    title: 'Point to the part of the house that needs work.',
    lead: 'One team covers the whole drawing, from the equipment in the basement to the deck out back. Pick a part of the house to see what we do there.',
    tablistLabel: 'Parts of the house',
    hint: 'Tap a part of the drawing, or use the arrow keys on the tabs.',
    detailsLink: 'See the service',
    askLink: 'Ask about this',
    drawingLabel: 'Cross-section drawing of a two-storey New England house showing the basement, living spaces, attic and outside areas.',
    legend: 'Schematic drawing, not to scale.',
    zones: {
      basement: { label: 'Basement', ref: 'A-1', body: 'The heating system and the controls that run it: diagnosis and repair when the heat can’t keep up, replacement or a new installation when it’s time.' },
      attic: { label: 'Attic & ducts', ref: 'A-2', body: 'Central air and cooling systems: repair when a room won’t cool, replacement or a new installation when the old system is done.' },
      living: { label: 'Living space', ref: 'A-3', body: 'Ductless mini-splits heat and cool rooms without existing ductwork, with the outdoor unit set beside the house. Ask about options and current Mass Save eligibility.' },
      outside: { label: 'Outside', ref: 'A-4', body: 'Decks, siding, roofing and concrete outside, plus remodeling, plumbing and electrical project needs inside.' },
    },
  },
  services: {
    eyebrow: 'Services · 01–04',
    title: 'Four kinds of work. One crew to call.',
    lead: 'Start with whichever is closest to what you need. Every job begins with a conversation about your house.',
    more: 'Read more',
  },
  story: {
    eyebrow: 'Revision history',
    title: 'From an Army uniform to your basement.',
    lead: `${business.name} is veteran-owned. Mike’s path into the trades started in a vocational electrical shop and ran through military service and hands-on work as a service technician.`,
    link: 'Read Mike’s story',
    imageAlt: 'Illustrative close-up of gloved hands tightening a copper refrigerant connection on an outdoor unit',
    tableHead: { when: 'Rev.', what: 'Description' },
  },
  steps: {
    eyebrow: 'How it works',
    title: 'Three steps. No guesswork.',
    items: [
      { title: 'Tell us what you need.', body: 'A room that won’t cool. A system ready for replacement. A bigger plan for your home. Start with a call, a text or the request form.' },
      { title: 'Talk through the options.', body: 'Share your town and the project details. The team discusses the scope, answers your questions and arranges the next step.' },
      { title: 'Make a plan for your home.', body: 'Review the proposed work and the quote with the team, then confirm the details and timing before anything starts.' },
    ],
  },
  community: {
    eyebrow: 'Service deserves service',
    title: 'For the people who show up for others.',
    body: 'Veterans and first responders can ask about discounts. Ask the team for the current details and eligibility.',
    cta: 'Ask about discounts',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Straight answers.',
    lead: 'Something not covered here?',
    callLink: `Call ${primaryContact.name}`,
    items: [
      { q: 'What can I ask you to do?', a: 'Heating and air-conditioning repair and installation, heat pumps, ductless mini-splits and general contracting. Construction work includes decks, siding, roofing, remodeling, concrete, and plumbing and electrical project needs.' },
      { q: 'Where do you work?', a: `${business.region}. Tell the team your town when you get in touch and they will confirm coverage. The owner’s site lists Rhode Island general contracting as coming soon; it isn’t offered yet.` },
      { q: 'Are quotes free?', a: 'Yes. Call or text Mike or Matt, email the team, or send the request form with your project details. A quote request does not book an appointment; the team arranges the next step with you.' },
      { q: 'Do you work with Mass Save?', a: 'Yes. The business is a Mass Save participating contractor. Ask about your specific project: program eligibility and incentives have to be confirmed and are not guaranteed.' },
      { q: 'Do veterans and first responders get a discount?', a: 'Yes, discounts are offered to veterans and first responders. Ask the team for the current details and eligibility.' },
      { q: 'What should I include when I get in touch?', a: 'Your name, town, a contact number, the type of work and a short description of the problem or project. Photos of the equipment and its model label help with the first conversation.' },
    ],
  },
} as const;

export type ServiceCopy = {
  number: string;
  promise: string;
  description: string;
  points: readonly string[];
  question: string;
  answer: string;
  imageAlt: string;
};

export const serviceCopy: Record<ServiceSlug, ServiceCopy> = {
  heating: {
    number: '01',
    promise: 'Heat you can count on.',
    description: 'Heating repairs, system replacement and new installations, with a plan that makes sense for your home.',
    points: ['Heating system diagnosis and repair', 'Replacement and new installations', 'Controls and comfort concerns'],
    question: 'Heat not keeping up?',
    answer: 'Tell us what the system is doing, what equipment you have and when the problem started. The team will talk through the next step with you.',
    imageAlt: 'Illustrative tidy basement with a heating unit, ductwork and copper piping',
  },
  cooling: {
    number: '02',
    promise: 'Keep your cool, all summer.',
    description: 'From an air conditioner that won’t cool to a brand-new installation, a clear path to a more comfortable house.',
    points: ['Air-conditioning repair', 'Central air replacement', 'New cooling system installation'],
    question: 'A room that never cools down?',
    answer: 'Uneven temperatures have different causes. Share which rooms are affected and what you notice so the team can work out the right service.',
    imageAlt: 'Illustrative sunlit living room with a wall-mounted indoor air-conditioning unit',
  },
  'heat-pumps': {
    number: '03',
    promise: 'One system for every season.',
    description: 'Heating and cooling in one system, including ductless options for spaces without existing ductwork.',
    points: ['Ductless mini-split systems', 'Heat pump installation', 'Mass Save project conversations'],
    question: 'Considering a heat pump?',
    answer: 'The right choice depends on your house, your existing equipment and how you use the space. Ask about system options and current Mass Save eligibility before committing.',
    imageAlt: 'Illustrative technician kneeling beside an outdoor heat pump unit, checking its refrigerant connections',
  },
  construction: {
    number: '04',
    promise: 'A better house, beyond HVAC.',
    description: 'Bring your home improvement plans into one conversation, from exterior projects to interior remodeling.',
    points: ['Decks, siding and roofing', 'Remodeling and concrete', 'Plumbing and electrical project needs'],
    question: 'Planning a bigger project?',
    answer: 'Send a description of the scope, your town and your preferred timing. The team will discuss the work and arrange the next step.',
    imageAlt: 'Illustrative new wooden deck with steps and outdoor chairs beside a white clapboard house',
  },
};

export const servicePage = {
  breadcrumb: 'Services',
  cta: 'Talk about your project',
  detailEyebrow: 'What this covers',
  detailTitle: 'Start with what you need.',
  detailBody: 'Every house and project is different. Get in touch with the details and talk through the scope, options and timing with the team.',
  callLink: `Call ${primaryContact.name} · ${primaryContact.display}`,
  quoteLink: 'Request a free quote',
  related: 'More ways we can help',
} as const;

export const about = {
  metaTitle: 'About Mike',
  metaDescription: `Meet Mike, the U.S. Army veteran behind ${business.name}, a veteran-owned HVAC and construction business in ${business.region}.`,
  eyebrow: 'About',
  title: 'A lifetime of showing up. Now, for your house.',
  lead: 'Technical training, military service and hands-on work in the trades, brought to the heating, cooling and building work on your home.',
  storyTitle: 'Meet Mike.',
  story: [
    'Mike’s path into the trades began in the Electrical Shop at Diman Regional Vocational Technical High School. After graduating, he served in the United States Army during Operation Desert Storm.',
    'After his military service he worked as a service technician at American Dryer. He went on to The Peterson School, earning an HVAC Controls and Energy Management certificate in 2014.',
    `He built his experience while supporting his family and growing the business, and formally established the LLC in January 2024. Today ${business.name} brings heating, cooling and general contracting together for homeowners in ${business.region}.`,
  ],
  recordTitle: 'Service record',
  credentialsTitle: 'Credentials',
  credentialsNote: 'As stated by the business. Ask the team for licence details for your project.',
  teamTitle: 'Who you will talk to',
  teamBody: 'Call or text Mike or Matt directly on their own numbers, or email the team.',
  cta: 'Talk to the team',
  imageAlt: 'Illustrative close-up of gloved hands tightening a copper refrigerant connection on an outdoor unit',
} as const;

export const contact = {
  metaTitle: 'Request a free quote',
  metaDescription: `Talk with Mike or Matt about heating, cooling, heat pumps or construction in ${business.region}. Call, text, or send a quote request.`,
  eyebrow: 'Free quote',
  title: 'Tell us what you have in mind.',
  lead: 'A small repair or a bigger project. Calling or texting is the fastest way to reach the team; the form works too.',
  talkTo: (name: string) => `Talk to ${name}`,
  callAria: (name: string, number: string) => `Call ${name} at ${number}`,
  textAria: (name: string) => `Send ${name} a text`,
  textLabel: 'Text',
  area: `Working in ${business.region}. Share your town so the team can confirm coverage.`,
  noscript: `The request form needs JavaScript. Please call, text or email the team directly using the links on this page.`,
} as const;

export const form = {
  heading: 'Request a free quote',
  intro: 'A few details make the first conversation easier. Fields marked required are needed to reply.',
  required: 'required',
  optional: 'optional',
  service: 'What do you need help with?',
  serviceOther: 'Not sure yet',
  name: 'Your name',
  phone: 'Phone number',
  phoneHint: 'With area code.',
  email: 'Email',
  emailHint: 'If you’d like a reply by email.',
  town: 'Town or city',
  message: 'Tell us a little about it',
  messageHint: (n: number, max: number) => `${n} / ${max}`,
  messagePlaceholder: 'What’s happening, or what are you planning?',
  prefer: 'Best way to reach you',
  preferOptions: { call: 'Call', text: 'Text', email: 'Email' },
  submit: 'Send request',
  submitting: 'Sending…',
  note: 'Quotes are free. A request doesn’t book an appointment; the team confirms timing with you.',
  privacy: 'How we use these details',
  errorSummary: 'Please check the highlighted fields.',
  errors: {
    service: 'Choose the kind of work.',
    name: 'Please enter your name.',
    phone: 'Please enter a phone number with area code.',
    email: 'Please enter a valid email address, or leave it blank.',
    emailRequired: 'Add an email address if you’d like a reply by email.',
    town: 'Please enter your town or city.',
    message: 'Please add a few words about the project (at least 10 characters).',
    prefer: 'Choose how you’d like to be contacted.',
  },
  sent: {
    title: 'Request sent.',
    body: 'The email service accepted your request for delivery to the team. They will reply using the contact method you chose.',
    again: 'Send another request',
  },
  fallback: {
    title: 'Nothing has been sent yet.',
    body: 'Online delivery isn’t available right now, so your request has not reached the team. It’s ready below: open it in your email app, or copy it and send it yourself.',
    open: 'Open in email app',
    copy: 'Copy request',
    copied: 'Copied to clipboard.',
    copyFailed: 'Copy didn’t work. Select the text and copy it manually.',
    or: 'Or call the team directly:',
    edit: 'Edit request',
  },
  limited: 'Too many requests from this connection. Please wait a few minutes, or call the team directly.',
  invalid: 'Some details need another look.',
} as const;

export const emailCopy = {
  subject: (service: string) => `Quote request: ${service}`,
  labels: { service: 'Service', name: 'Name', phone: 'Phone', email: 'Email', town: 'Town', prefer: 'Prefers', message: 'Message' },
  footer: `Sent from the ${business.name} website request form.`,
} as const;

export const privacy = {
  metaTitle: 'Privacy',
  metaDescription: `How the ${business.name} website handles the details you send through the quote request form.`,
  eyebrow: 'Privacy',
  title: 'What happens to your details.',
  updated: 'Last updated 19 October 2026',
  sections: [
    {
      h: 'What the request form collects',
      p: 'Your name, phone number, town, the kind of work, your message, your preferred contact method and, if you give it, your email address.',
    },
    {
      h: 'How it is used',
      p: `Only to reply to your request and discuss the work. When online delivery is switched on, the form sends your request to the team’s email inbox through an email delivery provider (Resend). When it is not, nothing is sent from the site: your own email app sends the message.`,
    },
    {
      h: 'What is not done',
      p: 'Your details are not sold, shared for marketing or stored in a database by this website. The site does not use advertising or tracking cookies.',
    },
    {
      h: 'Analytics',
      p: 'The site uses Vercel Web Analytics and Speed Insights to count page views and measure loading speed. They work without cookies and report aggregated data, not who you are.',
    },
    {
      h: 'Abuse protection',
      p: 'To block spam, the server briefly keeps a count of requests per network address in memory. It is not written to storage.',
    },
    {
      h: 'Questions or deletion',
      p: `Email ${business.email} or call ${contacts[0].name} at ${contacts[0].display} to ask what you have sent or to have it deleted from the team’s inbox.`,
    },
  ],
  note: 'This is a plain-language notice prepared for the business. It is not legal advice.',
} as const;

export const notFound = {
  title: 'Page not found',
  eyebrow: '404 · Off the drawing',
  heading: 'That page isn’t on the plans.',
  body: 'It may have moved, or the link may be mistyped.',
  home: 'Back to the home page',
} as const;

export const errorPage = {
  eyebrow: 'Something went wrong',
  heading: 'This page hit a snag.',
  body: 'Please try again. If it keeps happening, call or text the team directly.',
  retry: 'Try again',
} as const;
