/**
 * Everything about the person, in one file.
 * Edit here and the whole site follows - nothing below is hard-coded in a page.
 */
import { external, isExternal } from '@/lib/url';

export const site = {
  name: 'Kunal Kamble',
  handle: 'rational-kunal',
  role: 'Software engineer',
  description:
    'Software engineer with an iOS core. I build things end to end, write about how they work, and draw the diagram before the code.',
  locale: 'en',
  // Where every Résumé button goes. A path under public/ (like '/resume.pdf')
  // downloads; a full URL opens in a new tab.
  resume: 'https://drive.google.com/file/d/1tfk3asheAUxfrWYtPqoP5dOR5w3qCsB6/view?usp=drive_link',
  /* Temporarily off. Flip to `true` to bring back "open to new roles" in the
     hero, the "If you are hiring" block in About, and the footer line. */
  openToWork: false,
  avatar: '/kunal.jpg',
  mark: '/mark.png',
} as const;

/** Spread onto every Résumé link: a hosted file opens in a new tab, a local PDF downloads. */
export const resumeAttrs: { download?: true; target?: '_blank'; rel?: string } =
  isExternal(site.resume) ? external(site.resume) : { download: true };

export type SocialLink = {
  label: string;
  href: string;
  /** Phosphor Light name, or a Simple Icons slug when `brand` is set. */
  icon: string;
  brand?: boolean;
  /** Also listed in the hiring block while openToWork is on. */
  primary?: boolean;
  /** A quiet "old" tag in the "Find me" menu, for an account that is no longer updated. */
  old?: boolean;
};

/* In the order they appear in the hero's "Find me" menu and the footer. */
export const socials: SocialLink[] = [
  { label: 'GitHub',         href: 'https://github.com/rational-kunal',                   icon: 'github-logo',         primary: true },
  { label: 'LinkedIn',       href: 'https://www.linkedin.com/in/kunal-kamble-671b3a118/', icon: 'linkedin-logo',       primary: true },
  { label: 'Email',          href: 'mailto:kunalgk1999@gmail.com',                        icon: 'envelope-simple',     primary: true },
  { label: 'Stack Overflow', href: 'https://stackoverflow.com/users/kunal-kamble',        icon: 'stack-overflow-logo' },
  { label: 'Codeforces',     href: 'https://codeforces.com/profile/rational_kunal',       icon: 'codeforces',          brand: true },
  { label: 'Dev.to',         href: 'https://dev.to/rationalkunal',                        icon: 'devdotto',            brand: true, old: true },
];

/** The page is one long sheet, so the nav is three places on it. */
export const nav = [
  { label: 'Work',    href: '/#work' },
  { label: 'Writing', href: '/#writing' },
  { label: 'About',   href: '/#about' },
];
