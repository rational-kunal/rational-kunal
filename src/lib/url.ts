/**
 * Prefix a path with the configured `base`, so moving the site from a user
 * page to a project page stays a one-line change in astro.config.mjs.
 * Full URLs (and mailto:) pass through untouched.
 */
export function url(p: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(p)) return p;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}${p.startsWith('/') ? p : `/${p}`}` || '/';
}

/** The same path as a full URL on the deployed site: canonical links, cards, JSON-LD. */
export const absolute = (p: string): string => new URL(url(p), import.meta.env.SITE).href;

/** True for a link to another site. mailto: and fragments are not. */
export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);

/** Spread onto a link: one that leaves the site opens in a new tab, with no opener. */
export const external = (href: string, rel = 'noopener'): { target?: '_blank'; rel?: string } =>
  isExternal(href) ? { target: '_blank', rel } : {};
