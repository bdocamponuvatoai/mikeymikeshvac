# Content and asset provenance

## Business facts

Source: the owner’s site, <https://www.mikeymikeshvac.com/> (`/home`, `/home/about`, `/home/gallery`), checked 2026-10-16 for the previous build and re-checked 2026-10-19 for this one. Every fact the site states lives in `src/lib/site.ts`.

| Fact | Where on the owner’s site |
| --- | --- |
| Mike 508-951-6629, Matt 774-526-9007 | Home, About, Gallery |
| Email mikeymikeshvac.construction@gmail.com (displayed) | Home, About, Gallery. The link target there is `info@mikeymikeshvac.com`, which does not match |
| HVAC repairs and full system installs; general contracting (decks, siding, roofing, remodeling, concrete, plumbing, electrical) | Home |
| Licensed and insured HVAC and general contractor | Home |
| Mass Save participating contractor | Home |
| Discounts for veterans and first responders | Home |
| Free quotes by text or email | Home, About |
| Massachusetts (current); Rhode Island “coming soon” | Home |
| Veteran-owned | About |
| Diman Regional Voc-Tech electrical shop; U.S. Army, Operation Desert Storm; service technician at American Dryer; Peterson School HVAC Controls & Energy Management certificate, 2014; LLC formed January 2024 | About |
| EPA Section 608; Massachusetts Construction Supervisor License | About |

## Not stated, on purpose

- **Town.** The previous build said “Dartmouth, MA”. It does not appear on the owner’s site and could not be verified, so it was removed. Decided 2026-10-19.
- **Street address, hours, prices, service radius.**
- **Reviews, ratings, years in business, response times, guarantees, emergency or 24/7 service.**
- **Sheet-metal licence:** listed as “soon to be” by the owner.
- **Rhode Island:** listed as “coming soon” by the owner.

## Name

The owner’s site header now reads “HVAC & GC Services”, noting it was previously “Mikey Mike’s HVAC Services”. This site keeps the “Mikey Mike’s” brand by decision (2026-10-19). Changing it is one value, `business.name`, in `src/lib/site.ts`.

## Photography

The six photographs (`assets-src/photos/`) are AI-generated illustrative images carried over from the previous build. They do not show completed company projects, staff or customers. The site labels them “Illustrative image” under each figure, and the footer says so site-wide.

- **Masters:** 1536×1024 lossy WebP. No PNG originals exist, so the masters are copied byte-for-byte (minus any EXIF/XMP chunks; there were none).
- **Served images:** `next/image` generates the AVIF/WebP sizes. These carry no EXIF, XMP or C2PA metadata (checked 2026-10-20).
- **Owner’s gallery:** about 40 uncaptioned photos on the owner’s gallery page may be real project photos. They were not used. They need the owner’s permission and captions first.

## Fonts

Zilla Slab, Public Sans and IBM Plex Mono are licensed under the SIL Open Font License 1.1. On the site they load through `next/font`. The TTF copies used for the share image are in `assets-src/fonts/`, with their OFL texts.
