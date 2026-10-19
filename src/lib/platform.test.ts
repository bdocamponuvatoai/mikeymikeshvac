import { describe, expect, it } from 'vitest';
import { buildCsp, resolveStage, securityHeaders } from './csp';
import { resolveIndexable, resolveSiteUrl } from './env';
import { nextTabIndex, pointInPolygon, zoneAt, zones } from './zones';
import { services } from './site';
import { home, serviceCopy } from './content';

describe('house zones', () => {
  it('maps each part of the drawing to its service', () => {
    expect(zoneAt([400, 420])?.service).toBe('heating');
    expect(zoneAt([400, 120])?.service).toBe('cooling');
    expect(zoneAt([400, 300])?.service).toBe('heat-pumps');
    expect(zoneAt([150, 350])?.service).toBe('heat-pumps');
    expect(zoneAt([700, 350])?.service).toBe('construction');
  });

  it('returns null for sky and open ground', () => {
    expect(zoneAt([40, 40])).toBeNull();
    expect(zoneAt([230, 90])).toBeNull(); // outside the roof slope
    expect(zoneAt([700, 450])).toBeNull();
  });

  it('covers every service exactly once and has copy for every zone', () => {
    expect(zones.map((z) => z.service).sort()).toEqual(services.map((s) => s.slug).sort());
    for (const z of zones) expect(home.section.zones[z.id].label).toBeTruthy();
    for (const s of services) expect(serviceCopy[s.slug].points.length).toBeGreaterThan(0);
  });

  it('handles concave shapes in pointInPolygon', () => {
    const l = [[0, 0], [10, 0], [10, 2], [2, 2], [2, 10], [0, 10]] as const;
    expect(pointInPolygon([1, 9], l)).toBe(true);
    expect(pointInPolygon([5, 5], l)).toBe(false);
  });

  it('moves between tabs with arrow keys, Home and End, wrapping around', () => {
    expect(nextTabIndex(0, 'ArrowRight', 4)).toBe(1);
    expect(nextTabIndex(3, 'ArrowRight', 4)).toBe(0);
    expect(nextTabIndex(0, 'ArrowLeft', 4)).toBe(3);
    expect(nextTabIndex(2, 'Home', 4)).toBe(0);
    expect(nextTabIndex(0, 'End', 4)).toBe(3);
    expect(nextTabIndex(1, 'Enter', 4)).toBeNull();
  });
});

describe('site URL and indexing', () => {
  it('prefers an explicit URL, then the Vercel production domain, then localhost', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://example.com' }).origin).toBe('https://example.com');
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'mikey.vercel.app' }).origin).toBe('https://mikey.vercel.app');
    expect(resolveSiteUrl({}).origin).toBe('http://localhost:3000');
  });

  it('indexes only Vercel production, or a deliberate local check', () => {
    expect(resolveIndexable({ VERCEL_ENV: 'production' })).toBe(true);
    expect(resolveIndexable({ VERCEL_ENV: 'preview', NEXT_PUBLIC_SITE_URL: 'https://example.com' })).toBe(false);
    expect(resolveIndexable({})).toBe(false);
    expect(resolveIndexable({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3100' })).toBe(true);
  });
});

describe('content security policy', () => {
  it('locks production down', () => {
    const csp = buildCsp('production');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).not.toContain('vercel.live');
  });

  it('opens the Vercel toolbar on previews only, and eval in dev only', () => {
    expect(buildCsp('preview')).toContain('https://vercel.live');
    expect(buildCsp('preview')).toContain('wss://ws-us3.pusher.com');
    expect(buildCsp('preview')).not.toContain('unsafe-eval');
    expect(buildCsp('development')).toContain("'unsafe-eval'");
    expect(buildCsp('development')).toContain('https://va.vercel-scripts.com');
  });

  it('resolves the stage from the environment', () => {
    expect(resolveStage({ NODE_ENV: 'development' })).toBe('development');
    expect(resolveStage({ NODE_ENV: 'production', VERCEL_ENV: 'preview' })).toBe('preview');
    expect(resolveStage({ NODE_ENV: 'production' })).toBe('production');
  });

  it('sends HSTS without includeSubDomains or preload', () => {
    const hsts = securityHeaders('production').find((h) => h.key === 'Strict-Transport-Security');
    expect(hsts?.value).toBe('max-age=63072000');
  });
});
