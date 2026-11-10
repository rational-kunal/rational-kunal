/**
 * Prefix a path with the configured `base`, so moving the site from a user
 * page to a project page stays a one-line change in astro.config.mjs.
 */
export function url(p: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const path = p.startsWith('/') ? p : `/${p}`;
  return `${base}${path}` || '/';
}

/** 1 Jan 2025 */
export function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(d);
}

/** 2025-01-01, for <time datetime>. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** ~200 words a minute, floored at one. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}
