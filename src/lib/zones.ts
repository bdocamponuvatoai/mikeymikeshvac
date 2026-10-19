import type { ServiceSlug } from './site';

/**
 * Geometry for the house cross-section (SVG viewBox 0 0 800 480) and the mapping
 * from each part of the house to the service that covers it. Pointer taps on the
 * drawing are resolved with `zoneAt`; keyboard users get the same choice as tabs.
 */
export type ZoneId = 'basement' | 'attic' | 'living' | 'outside';
export type Point = readonly [x: number, y: number];
export type Polygon = readonly Point[];

export type Zone = {
  id: ZoneId;
  service: ServiceSlug;
  /** One or more areas of the drawing that select this zone. */
  shapes: readonly Polygon[];
  /** Where the zone's leader label is anchored in the drawing. */
  anchor: Point;
};

export const VIEWBOX = { width: 800, height: 480 } as const;
export const GROUND_Y = 380;

export const zones: readonly Zone[] = [
  {
    id: 'basement',
    service: 'heating',
    shapes: [[[200, 380], [600, 380], [600, 470], [200, 470]]],
    anchor: [560, 425],
  },
  {
    id: 'attic',
    service: 'cooling',
    shapes: [[[200, 170], [400, 60], [600, 170]]],
    anchor: [470, 130],
  },
  {
    id: 'living',
    service: 'heat-pumps',
    shapes: [
      [[200, 170], [600, 170], [600, 380], [200, 380]],
      // Outdoor unit beside the house.
      [[105, 322], [190, 322], [190, 380], [105, 380]],
    ],
    anchor: [250, 240],
  },
  {
    id: 'outside',
    service: 'construction',
    shapes: [[[600, 300], [780, 300], [780, 380], [600, 380]]],
    anchor: [700, 318],
  },
];

/** Ray-casting point-in-polygon test. Points exactly on an edge may fall either side. */
export function pointInPolygon([x, y]: Point, polygon: Polygon): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]!;
    const [xj, yj] = polygon[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** The zone under a point in drawing coordinates, or null for empty sky and ground. */
export function zoneAt(point: Point): Zone | null {
  return zones.find((z) => z.shapes.some((shape) => pointInPolygon(point, shape))) ?? null;
}

/** Index of the next tab for an arrow/Home/End key, wrapping at the ends (WAI-ARIA tabs pattern). */
export function nextTabIndex(current: number, key: string, count: number): number | null {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % count;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
