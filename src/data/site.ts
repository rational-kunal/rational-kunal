/**
 * Everything about the person, in one file.
 * Edit here and the whole site follows - nothing below is hard-coded in a page.
 */

export const site = {
  name: 'Kunal Kamble',
  handle: 'rational-kunal',
  role: 'Software engineer',
  // Shown under the name in the hero. Keep it to one line.
  title: 'iOS is where I went deep. It is not where I stop.',
  description:
    'Software engineer with an iOS core. I build things end to end, write about how they work, and draw the diagram before the code.',
  locale: 'en',
  // Used for the résumé button and the OG image fallback.
  resume: '/resume.pdf',
  /* TODO - flip this to `true` the moment you drop the PDF at public/resume.pdf.
     While it is false the Résumé buttons still render, but they point at the
     résumé block on /about instead of downloading a file that is not there. */
  resumeReady: false,
  avatar: '/kunal.jpg',
  mark: '/mark.png',
} as const;

/** Where a Résumé button should go, given whether the PDF exists yet. */
export const resumeHref = site.resumeReady ? site.resume : '/about#resume';
export const resumeIsFile = site.resumeReady;

export type SocialLink = {
  label: string;
  href: string;
  icon: 'github' | 'devto' | 'linkedin' | 'x' | 'mail' | 'rss';
  /** Shown in the nav rail, not only in the footer. */
  primary?: boolean;
  /** true when the URL still needs to be filled in. */
  todo?: boolean;
};

/* ---------------------------------------------------------------------------
 * TODO - THREE LINKS STILL NEED REAL URLS
 *
 *   linkedin : replace the `#` with your profile URL, then delete `todo: true`
 *   x        : same, or delete the whole entry if you do not want it listed
 *   mail     : put the address you are happy to publish. It is deliberately
 *              not filled in here, because the only address this project knows
 *              is your private Claude-filtered one.
 *
 * Entries with `todo: true` render as a dimmed, non-clickable icon with a
 * title tooltip, so the row never looks broken while you track them down.
 * ------------------------------------------------------------------------- */
export const socials: SocialLink[] = [
  { label: 'GitHub',   href: 'https://github.com/rational-kunal', icon: 'github', primary: true },
  { label: 'Dev.to',   href: 'https://dev.to/rationalkunal',      icon: 'devto',  primary: true },
  { label: 'LinkedIn', href: '#', icon: 'linkedin', primary: true, todo: true },
  { label: 'X',        href: '#', icon: 'x',        todo: true },
  { label: 'Email',    href: '#', icon: 'mail',     primary: true, todo: true },
];

export const nav = [
  { label: 'Work',      href: '/work' },
  { label: 'Libraries', href: '/libraries' },
  { label: 'Writing',   href: '/writing' },
  { label: 'About',     href: '/about' },
];
