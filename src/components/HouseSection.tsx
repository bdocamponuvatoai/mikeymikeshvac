'use client';

import Link from 'next/link';
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { home, serviceCopy } from '@/lib/content';
import { services } from '@/lib/site';
import { GROUND_Y, nextTabIndex, VIEWBOX, zoneAt, zones, type Point, type ZoneId } from '@/lib/zones';

const copy = home.section;
const titleOf = (slug: string) => services.find((s) => s.slug === slug)?.title ?? slug;
const points = (shape: readonly Point[]) => shape.map(([x, y]) => `${x},${y}`).join(' ');

/** One stroke of linework. `pathLength` lets the draw-in animation work on any shape. */
function L({ d, className = '' }: { d: string; className?: string }) {
  return <path className={`ln draw ${className}`} d={d} pathLength={1} />;
}

/**
 * Signature interaction: a cross-section of a house. Pointer users tap the drawing
 * (resolved through `zoneAt`); keyboard and screen-reader users get the same choice
 * as WAI-ARIA tabs with arrow-key navigation. Both drive the same state.
 */
export function HouseSection() {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState<ZoneId>('basement');
  const [hover, setHover] = useState<ZoneId | null>(null);
  const [cursor, setCursor] = useState<Point | null>(null);

  const activeIndex = zones.findIndex((z) => z.id === active);
  const zone = zones[activeIndex] ?? zones[0]!;
  const zoneCopy = copy.zones[zone.id];
  const service = serviceCopy[zone.service];

  function toDrawing(e: PointerEvent<SVGSVGElement>): Point | null {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return [p.x, p.y];
  }

  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    if (e.pointerType !== 'mouse') return;
    const p = toDrawing(e);
    setCursor(p);
    setHover(p ? (zoneAt(p)?.id ?? null) : null);
  }

  function onPointerUp(e: PointerEvent<SVGSVGElement>) {
    const p = toDrawing(e);
    const hit = p && zoneAt(p);
    if (hit) setActive(hit.id);
  }

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    const next = nextTabIndex(activeIndex, e.key, zones.length);
    if (next === null) return;
    e.preventDefault();
    setActive(zones[next]!.id);
    tabRefs.current[next]?.focus();
  }

  const hoverZone = hover ? copy.zones[hover] : null;
  const [ax, ay] = zone.anchor;
  const labelX = ax > 560 ? ax - 150 : ax + 18;
  const labelY = ay < 120 ? ay + 26 : ay - 30;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
      <figure className="min-w-0">
        <div className="sheet-grid relative border border-ink bg-card">
          <span className="label absolute top-3 left-3 text-muted" aria-hidden="true">
            Section A–A
          </span>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
            role="img"
            aria-label={copy.drawingLabel}
            className="drawing block h-auto w-full touch-manipulation select-none"
            data-pointer={hover ? 'zone' : undefined}
            onPointerMove={onPointerMove}
            onPointerLeave={() => {
              setCursor(null);
              setHover(null);
            }}
            onPointerUp={onPointerUp}
          >
            <defs>
              <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="rgb(154 74 31 / 0.07)" />
                <line x1="0" y1="0" x2="0" y2="8" stroke="rgb(154 74 31 / 0.45)" strokeWidth="1.5" />
              </pattern>
            </defs>

            {/* Interactive zones sit under the linework so the drawing stays crisp when highlighted. */}
            {zones.map((z) =>
              z.shapes.map((shape, i) => (
                <polygon key={`${z.id}-${i}`} className="zone" points={points(shape)} data-active={z.id === active} data-hover={z.id === hover && z.id !== active} />
              )),
            )}

            {/* Ground and earth hatching */}
            <L className="ln-heavy" d={`M20 ${GROUND_Y}H780`} />
            {Array.from({ length: 12 }, (_, i) => (
              <L key={`gl${i}`} className="ln-thin" d={`M${30 + i * 14} ${GROUND_Y + 4}l-8 10`} />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <L key={`gr${i}`} className="ln-thin" d={`M${700 + i * 14} ${GROUND_Y + 4}l-8 10`} />
            ))}

            {/* Basement and foundation */}
            <L className="ln-heavy" d="M200 380V470H600V380" />
            <L className="ln-thin" d="M192 470h416" />
            {/* Heating unit, trunk duct and riser */}
            <L d="M250 404h50v62h-50z" />
            <L className="ln-thin" d="M256 418h38M256 426h38M256 434h38" />
            <L d="M300 392h240M300 402h230v-22M540 392v-12" />
            <L className="ln-thin" d="M275 404v-14h25" />

            {/* Walls and floors */}
            <L className="ln-heavy" d="M200 380V170M600 380V170" />
            <L d="M200 270h400M200 170h400" />
            {/* Windows */}
            <L d="M262 302h56v50h-56zM482 302h56v50h-56zM262 200h56v44h-56zM482 200h56v44h-56z" />
            <L className="ln-thin" d="M290 302v50M510 302v50M290 200v44M510 200v44" />
            {/* Mini-split heads */}
            <L d="M380 278h58v12h-58zM380 180h58v12h-58z" />
            <L className="ln-thin" d="M386 286h46M386 188h46" />

            {/* Roof, attic and chimney */}
            <L className="ln-heavy" d="M184 179L400 52l216 127" />
            <L className="ln-thin" d="M200 170L400 62l200 108" />
            <L d="M470 102V68h30v51" />
            <circle className="ln ln-thin draw" cx="400" cy="128" r="11" pathLength={1} />
            {/* Attic air handler and duct runs */}
            <L d="M360 140h80v22h-80z" />
            <L d="M440 151h100v19M360 151H260v19" />

            {/* Outdoor heat pump unit and refrigerant line set */}
            <L d="M112 330h70v50h-70z" />
            <circle className="ln draw" cx="147" cy="355" r="16" pathLength={1} />
            <L className="ln-thin" d="M135 355h24M147 343v24" />
            <L className="ln-copper" d="M182 344h10v-60h188" />

            {/* Deck, railing and steps */}
            <L className="ln-heavy" d="M600 352h140" />
            <L d="M600 358h140M640 358v22M700 358v22M736 358v22" />
            <L d="M610 352v-30h125v30" />
            <L className="ln-thin" d="M625 322v30M640 322v30M655 322v30M670 322v30M685 322v30M700 322v30M715 322v30" />
            <L d="M740 352h15v14h15v14" />

            {/* Leader label for the active zone */}
            <g aria-hidden="true" className="leader">
              <circle cx={ax} cy={ay} r="5" fill="var(--color-copper)" />
              <path d={`M${ax} ${ay}L${labelX + (labelX < ax ? 132 : 0)} ${labelY + 6}`} stroke="var(--color-copper)" strokeWidth="1.5" fill="none" />
              <rect x={labelX} y={labelY - 10} width="132" height="22" fill="var(--color-ink)" />
              <text x={labelX + 8} y={labelY + 5} className="txt" style={{ fill: 'var(--color-paper)' }}>
                {zoneCopy.ref} · {zoneCopy.label.toUpperCase()}
              </text>
            </g>

            {/* Crosshair readout for mouse users: a drafting-table cursor, alongside the normal pointer. */}
            {cursor && (
              <g aria-hidden="true" pointerEvents="none">
                <path d={`M${cursor[0]} 0V${VIEWBOX.height}M0 ${cursor[1]}H${VIEWBOX.width}`} stroke="var(--color-copper)" strokeWidth="0.75" strokeDasharray="3 4" />
                <text x={Math.min(cursor[0] + 10, VIEWBOX.width - 190)} y={Math.max(cursor[1] - 10, 16)} className="txt">
                  {`X ${Math.round(cursor[0])}  Y ${Math.round(cursor[1])}`}
                  {hoverZone ? `  ${hoverZone.ref}` : ''}
                </text>
              </g>
            )}
          </svg>
        </div>
        <figcaption className="label mt-3 flex flex-wrap justify-between gap-2 text-muted">
          <span>{copy.hint}</span>
          <span>{copy.legend}</span>
        </figcaption>
      </figure>

      <div className="min-w-0">
        <div role="tablist" aria-label={copy.tablistLabel} className="grid grid-cols-2 gap-px border border-ink bg-ink lg:grid-cols-1">
          {zones.map((z, i) => {
            const selected = z.id === active;
            const zc = copy.zones[z.id];
            return (
              <button
                key={z.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${id}-tab-${z.id}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(z.id)}
                onKeyDown={onTabKey}
                className={`flex min-h-16 flex-col items-start justify-center gap-0.5 px-4 py-3 text-left transition-colors lg:flex-row lg:items-center lg:justify-between ${
                  selected ? 'bg-ink text-paper' : 'bg-card text-ink hover:bg-paper-deep'
                }`}
              >
                <span className={`label ${selected ? 'text-copper-bright' : 'text-copper'}`}>{zc.ref}</span>
                <span className="font-display text-lg leading-tight lg:mr-auto lg:ml-4">{zc.label}</span>
                <span className={`hidden text-sm lg:inline ${selected ? 'text-on-dark-muted' : 'text-muted'}`}>{titleOf(z.service)}</span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${zone.id}`} tabIndex={0} className="mt-8">
          <p className="label text-copper">
            {service.number} / {titleOf(zone.service)}
          </p>
          <h3 className="mt-3 text-3xl sm:text-4xl">{service.promise}</h3>
          <p className="mt-4 text-muted">{zoneCopy.body}</p>
          <ul className="mt-5 space-y-2">
            {service.points.map((p) => (
              <li key={p} className="flex gap-3">
                <Check className="mt-1 size-4 flex-none text-copper" aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/contact?service=${zone.service}#quote`} className="btn btn-primary">
              {copy.askLink} <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href={`/services/${zone.service}`} className="btn btn-line text-ink">
              {copy.detailsLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
