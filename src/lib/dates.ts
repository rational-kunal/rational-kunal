/*
 * Front-matter dates have no time, so they parse as midnight UTC. Formatting
 * them in UTC keeps a build west of Greenwich from printing the day before.
 */
const long = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const short = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** 1 Jan 2025 */
export const fmtDate = (d: Date): string => long.format(d);

/** 1 Jan, for a list that already says the year. */
export const fmtDay = (d: Date): string => short.format(d);

/** 2025-01-01, for <time datetime>. */
export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);
