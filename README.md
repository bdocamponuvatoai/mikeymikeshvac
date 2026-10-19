# Mikey Mike’s HVAC & Construction

[![CI](https://github.com/bdocamponuvatoai/mikeymikeshvac/actions/workflows/ci.yml/badge.svg)](https://github.com/bdocamponuvatoai/mikeymikeshvac/actions/workflows/ci.yml)
![Next.js 16](https://img.shields.io/badge/Next.js-16.4-000?logo=nextdotjs)
![React 19](https://img.shields.io/badge/React-19.3-149eca?logo=react)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.3-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000?logo=vercel)

The marketing site for **Mikey Mike’s HVAC & Construction**, a veteran-owned heating, cooling and general contracting business in Massachusetts. It is a fully static Next.js App Router site with one Server Action (the quote form), built for Vercel.

> **Design concept: “the house, in section.”** The site reads like a builder’s drawing set: ink on drafting paper, navy for depth, and copper, the colour of refrigerant line sets, as the single accent.

## Contents

- [Overview](#overview)
- [The experience](#the-experience)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Data and form flow](#data-and-form-flow)
- [Design system](#design-system)
- [Quality, accessibility and performance](#quality-accessibility-and-performance)
- [Security](#security)
- [Deployment](#deployment)
- [Content and editorial policy](#content-and-editorial-policy)
- [Maintenance guide](#maintenance-guide)

## Overview

| | |
| --- | --- |
| Pages | Home, four service pages, About, Contact (quote form), Privacy, plus 404, error and global-error |
| Rendering | Every route is prerendered static (`○` / `●`); the quote form posts to a Server Action |
| Business facts | One file: [`src/lib/site.ts`](src/lib/site.ts) |
| Copy | One file: [`src/lib/content.ts`](src/lib/content.ts) |
| Form delivery | Resend when configured; otherwise an honest “nothing was sent” fallback with a prepared email |
| Hosting | Vercel (Node.js runtime). Indexing is on only for the production deployment |

This replaces an earlier build on a vinext / Cloudflare Workers runtime. The content, verified facts and illustrative photography were carried over; the design, stack and form were rebuilt.

## The experience

- **Hero.** “Heating, cooling, and the house around them.” The photograph carries a drawing-style callout pinned to the outdoor heat pump, and a data plate lists only the credentials the business states.
- **The house, in section (signature interaction).** An architectural cross-section of a New England house. Tap the basement, attic, living space or deck and the panel shows the service that covers it, with an “Ask about this” link that carries the choice into the quote form (`/contact?service=…`).
  - Mouse users get a drafting-table crosshair readout; touch users tap.
  - Keyboard and screen-reader users get the same choice as a WAI-ARIA tablist with arrow keys, Home and End.
- **Services.** Four numbered rows (01–04) leading to a page per service.
- **Revision history.** Mike’s path, from vocational electrical shop to U.S. Army to an HVAC controls certificate, set as a drawing’s revision block.
- **Quote form.** Validated on the client and the server with one schema. It only says “sent” after the email provider confirms.
- **Mobile.** A full-screen menu on native `<dialog>` and a thumb-reach Call / Free quote bar, with 44px+ targets throughout.
- **Motion.** CSS only: the hero rises in, and the drawing’s linework draws itself as it scrolls into view (`animation-timeline: view()`). Text never fades, and everything is off under `prefers-reduced-motion`.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), React 19.3 |
| Language | TypeScript 6 (`strict`, `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS 4.3 with `@theme` tokens in `src/app/globals.css` |
| Fonts | `next/font/google`: Zilla Slab 600 (display), Public Sans (body, weight axis only), IBM Plex Mono 500 (labels) |
| Images | `next/image` (AVIF/WebP), static imports from `src/assets` |
| Validation | zod 4 (shared client/server schema, `jitless` for the CSP) |
| Email | Resend REST API, optional, behind a `server-only` module |
| Icons | lucide-react |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` (cookieless) |
| Tests | Vitest 5 (domain logic) |
| Lint | ESLint 10 with `eslint-config-next` (core-web-vitals + TypeScript) |

## Getting started

Requires Node.js 22.12+ (Node 24 recommended; CI uses 24).

```bash
npm ci
npm run dev          # http://localhost:3000
```

To run the production build locally:

```bash
npm run build
npm start            # http://localhost:3000
```

> **Windows:** stop the dev server before `npm ci` or deleting `.next`. A running server locks native binaries, and `npm ci` will leave `node_modules` half-deleted.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build. Also generates `next-env.d.ts`, which the typecheck needs |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint with zero warnings allowed |
| `npm test` | Vitest unit tests |
| `npm run check` | typecheck + lint + test (run after a build) |
| `npm run images` | Regenerate `src/assets` from the masters in `assets-src` (photos, OG background, OG fonts) |

## Environment variables

All are optional; documented in [`.env.example`](.env.example).

| Variable | Used for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, robots, JSON-LD | Falls back to `VERCEL_PROJECT_PRODUCTION_URL`. Setting it locally also turns indexing on (for Lighthouse SEO checks) |
| `RESEND_API_KEY` | Quote form delivery | Needs `QUOTE_FROM_EMAIL` too, or the form uses the fallback |
| `QUOTE_FROM_EMAIL` | Sender address | Must be on a domain verified in Resend |
| `QUOTE_TO_EMAIL` | Recipient | Defaults to the business email in `site.ts` |
| `VERCEL_ENV` | Set by Vercel | Only `production` is indexable |

## Project structure

```
src/
  app/                    Routes and metadata files
    page.tsx              Home
    about/ contact/ privacy/ services/[slug]/
    contact/actions.ts    Quote Server Action
    layout.tsx            Shell, fonts, analytics, Organization JSON-LD
    not-found.tsx error.tsx global-error.tsx
    robots.ts sitemap.ts manifest.ts llms.txt/route.ts
    icon.svg apple-icon.tsx opengraph-image.tsx
    globals.css           Tailwind v4 tokens, components, drawing styles, motion
    fonts.ts              next/font setup
  components/             Header, MobileMenu (<dialog>), ContactBar, Footer, HouseSection,
                          QuoteForm, RevisionBlock, Breadcrumb, Logo, JsonLd, NavLinks
  lib/
    site.ts               Every business fact (single source of truth)
    content.ts            Every piece of copy
    zones.ts              House drawing geometry, zone→service map, hit-testing, tab keys
    quote-schema.ts       zod schema shared by client and server
    quote-email.ts        Email body/subject builder and mailto fallback
    sanitize.ts           Control-character stripping
    bot.ts                Honeypot and timing heuristics
    rate-limit.ts         In-memory sliding-window limiter
    resend.ts             Resend REST client (server-only)
    csp.ts                CSP and security headers per deployment stage
    env.ts                Site URL and indexing rules
    seo.ts                Per-page metadata and JSON-LD builders
    media.ts              Static image imports
    *.test.ts             Unit tests
  assets/                 Web copies generated by `npm run images` (photos, OG background, TTFs)
assets-src/               Masters (not deployed): 1536×1024 photos, font TTFs and licences
scripts/build-images.mjs  Regenerates src/assets from assets-src
docs/                     DEPLOYMENT.md, CONTENT-SOURCES.md
```

## Data and form flow

```
QuoteForm (client)
  ├─ validateQuote()  ← same zod schema as the server; focus moves to the first error
  ├─ adds mm_t (ms since mount, written at submit time from a ref)
  └─ startTransition(dispatch(formData))          → useActionState
        ▼
submitQuote (Server Action, src/app/contact/actions.ts)
  1. checkBot(honeypot mm_ref_x, mm_t < 3000ms) → silent fake "sent", logged as [quote] dropped…
  2. rate limit: 5 per 10 min per IP (best effort)  → "limited"
  3. validateQuote() again, cleaning control characters → "invalid" + field errors
  4. buildQuoteEmail(): subject from the service enum only
  5. sendQuoteEmail() via Resend (8s timeout)
       ok + id  → "sent"
       else     → "fallback": prepared mailto + copyable text, "Nothing has been sent yet"
```

- **No JavaScript:** the form is hidden and the page shows direct call, text and email links.
- **Focus:** focus moves to the result panel once per result, and “Edit” returns focus to the form heading.
- **Scrolling:** the view scrolls to the form card itself, not the section top, so the focused field is on screen on phones.
- **Preselection:** `?service=` preselects the service. It is read with `useSyncExternalStore`, so hydration matches.

## Design system

Tokens live in `@theme inline` in [`src/app/globals.css`](src/app/globals.css). Tailwind’s default palette is cleared, so only these colours exist.

| Token | Hex | Role |
| --- | --- | --- |
| `paper` | `#f3efe6` | Page background (drafting paper) |
| `paper-deep` | `#e7e0d0` | Alternate sections |
| `card` | `#fbf9f4` | Sheets, form card |
| `ink` | `#14232c` | Text, rules, dark buttons |
| `navy` / `navy-2` | `#122b39` / `#1b3747` | Story section, footer, menu |
| `muted` | `#4f5b61` | Secondary text |
| `copper` | `#9a4a1f` | The accent: primary buttons, labels, active states |
| `copper-bright` | `#e4915c` | Accent on navy |
| `on-dark` / `on-dark-muted` | `#f3efe6` / `#b4c3c9` | Text on navy |
| `error` | `#9b2c14` | Form errors |

Contrast checks (WCAG AA needs 4.5:1):

| Pair | Ratio |
| --- | --- |
| ink on paper | 14.0:1 |
| muted on paper | 6.1:1 |
| copper on paper | 5.4:1 |
| white on copper | 6.2:1 |
| copper-bright on navy | 6.0:1 |
| on-dark-muted on navy | 8.1:1 |
| placeholder `#5f6a70` on white | 5.6:1 |

Copper text stays off `paper-deep` (4.7:1) except at large sizes.

- **Type:** Zilla Slab 600 for headings (a stamped-nameplate feel), Public Sans for body text, and IBM Plex Mono for drawing-style labels (`.label`).
- **Components:** `.btn` (`-primary`, `-ink`, `-line`), `.label`, `.sheet-grid` (faint drafting grid), `.dimension` (a rule with end ticks), `.container-x`.

## Quality, accessibility and performance

Measured on 2026-10-20 against `next start` on a Windows laptop.

**Build and tests**

- `npm run build`: all 17 routes prerendered static.
- `tsc --noEmit`, `eslint . --max-warnings 0` and `knip`: clean.
- 35 Vitest unit tests: validation, sanitising, email and mailto building, bot heuristics, rate limiter, IP parsing, Resend client (mocked), zone hit-testing, tab keys, site URL and indexing rules, CSP per stage.

**Real browser** (puppeteer-core, installed Chrome)

- **E2E:** 33/33 checks pass.
  - The tablist (arrow keys, Home/End, wrap, roving tabindex) and taps on the drawing.
  - The `<dialog>` menu: focus on open, Escape, focus return, close on navigation.
  - The quote form: client errors and focus, `?service=` preselection, a real Server Action round trip to the fallback, focus on the result, the prepared mailto, Edit returning focus and keeping values.
  - The bot paths (too fast, honeypot), the no-JS fallback, and the FAQ.
- The rate limit engages on the 6th request inside 10 minutes.
- **Horizontal overflow:** none. `scrollWidth` equals the viewport width on all 9 pages at 320, 360, 390, 768, 1024 and 1440px.
- No console errors or CSP violations. The only exceptions are the `/_vercel/*` analytics scripts, which 404 locally by design.

**Lighthouse 13.5** (mobile preset, simulated slow 4G, 3 runs per page, ranges not best runs; build with `NEXT_PUBLIC_SITE_URL=http://localhost:3100`)

| Page | Performance | Accessibility | Best practices* | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 90–93 | 100 | 100 | 100 | 3.3–3.5 s | 0 |
| `/contact` | 95–96 | 100 | 100 | 100 | 2.8 s | 0 |
| `/services/heat-pumps` | 95 | 100 | 100 | 100 | 2.9–3.0 s | 0 |
| `/about` | 96 | 100 | 100 | 100 | 2.8 s | 0 |
| `/privacy` | 96–97 | 100 | 100 | 100 | 2.6–2.7 s | 0 |

\* Best practices is 96 locally because the Vercel analytics scripts 404 off-platform; re-run with `--blocked-url-patterns="*/_vercel/*"` it is 100 on every page.

On the home page, LCP is the headline text, re-painted when the display font arrives. Fonts use `display: swap`; `optional` would lower LCP but could show the fallback face for a whole visit on slow connections.

**Accessibility features**

- Skip link and landmarks.
- Every field labelled, with errors tied in through `aria-describedby` and `aria-invalid`.
- `aria-pressed` toggle group for contact preference, `aria-live` status messages.
- Visible `:focus-visible` rings on light and dark sections.
- Reduced-motion support and print styles.

## Security

Headers are set in [`next.config.ts`](next.config.ts) from [`src/lib/csp.ts`](src/lib/csp.ts), and confirmed with `curl -I`.

**Content-Security-Policy**
- `default-src 'self'`, with `'unsafe-inline'` scripts (required for static App Router pages).
- `frame-ancestors 'none'`, `form-action 'self'`, `object-src 'none'`, `base-uri 'self'`, `upgrade-insecure-requests`.
- Previews only: `vercel.live` and `wss://ws-us3.pusher.com`, so the Vercel toolbar works.
- Development only: `'unsafe-eval'` and `va.vercel-scripts.com`.

**Other headers**
- HSTS `max-age=63072000`. `includeSubDomains; preload` is held back until every subdomain of the production domain is confirmed HTTPS.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
- A locked-down `Permissions-Policy` and `Cross-Origin-Opener-Policy: same-origin`.
- No `X-Powered-By`.

**Form**
- Server-side validation and control-character stripping.
- Email subjects built from enum values only.
- Honeypot and timing check, plus a per-IP rate limit (add the Vercel Firewall rule in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).

**Elsewhere**
- JSON-LD escapes `<`.
- `npm audit --omit=dev`: 0 vulnerabilities.
- **Accepted dev-only risk:** `braces` 3.0.3 (GHSA-vfj7-8cjw-p6xm), pulled in by `@next/eslint-plugin-next → fast-glob → micromatch`. No patched release exists and it never ships to the browser or server bundle.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel setup, environment variables per environment, Resend domain verification, the domain and indexing rules, the firewall rule and the pre-launch checklist.

In short: import the repo into Vercel (framework preset Next.js, no build overrides) and deploy. Previews are `noindex` with `Disallow: /`; production indexes automatically.

## Content and editorial policy

Every business fact lives in [`src/lib/site.ts`](src/lib/site.ts). Its source is the owner’s site, <https://www.mikeymikeshvac.com/> (`/home` and `/home/about`), re-checked 2026-10-19. See [docs/CONTENT-SOURCES.md](docs/CONTENT-SOURCES.md).

**Stated (verified)**
- Mike 508-951-6629 and Matt 774-526-9007; mikeymikeshvac.construction@gmail.com.
- Veteran-owned; licensed and insured HVAC and general contractor; Mass Save participating contractor.
- EPA Section 608; Massachusetts Construction Supervisor License.
- Discounts for veterans and first responders; free quotes.
- Mike’s history (Diman Regional Voc-Tech electrical shop, U.S. Army in Operation Desert Storm, American Dryer, Peterson School certificate in 2014, LLC formed January 2024).
- The services listed.

**Deliberately not stated**
- Street address or town (the owner has not confirmed one; the site says “Massachusetts”).
- Hours, prices, service radius, reviews or ratings, years in business, response times, guarantees, “24/7” or emergency service.
- Rhode Island (listed as “coming soon” by the owner).
- The sheet-metal licence (“soon to be” on the owner’s site).

**Imagery:** all photographs are AI-generated illustrations. They are labelled on the page and in the footer, and never presented as company projects or staff.

**Known discrepancies to resolve with the owner**
- **Name:** the owner’s site header now reads “HVAC & GC Services (formerly Mikey Mike’s HVAC Services)”. This site keeps “Mikey Mike’s” by decision.
- **Email:** the owner’s site displays the gmail address but its email link points to `info@mikeymikeshvac.com`.

## Maintenance guide

| To change… | Edit |
| --- | --- |
| A phone number, email, credential, legal name, Mike’s history | `src/lib/site.ts` |
| Any wording on any page, FAQ, form labels and messages, privacy text | `src/lib/content.ts` |
| Add or rename a service | `services` in `site.ts`, its entry in `serviceCopy` (`content.ts`), a photo in `servicePhotos` (`media.ts`), and a zone in `zones.ts` (a unit test fails if any are missing) |
| The house drawing or its tap areas | `src/components/HouseSection.tsx` (linework) and `src/lib/zones.ts` (polygons); run `npm test` |
| Colours, fonts, spacing tokens | `@theme` in `src/app/globals.css`, `src/app/fonts.ts` |
| A photo | Replace the master in `assets-src/photos/`, run `npm run images`, and update alt text in `content.ts` |
| The share image | `src/app/opengraph-image.tsx`; background from `npm run images` |
| Security headers or CSP | `src/lib/csp.ts` (tests in `platform.test.ts`) |
| Where quote requests go | `QUOTE_TO_EMAIL` in Vercel (no code change) |
| Add a town / street address | `business` in `site.ts`; with a verified street address, switch JSON-LD in `seo.ts` to `HVACBusiness` with `address` |

Before pushing: `npm run build && npm run check`.
