// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeImageDims } from './src/lib/images.ts';
import { rehypeScribbles } from './src/lib/scribbles.ts';

// ---------------------------------------------------------------------------
// DEPLOY TARGET — the only two lines you edit when the hosting repo changes.
//
//   User page  (repo named `rational-kunal.github.io`)
//     site: 'https://rational-kunal.github.io'   base: '/'
//
//   Project page (repo named e.g. `portfolio`)
//     site: 'https://rational-kunal.github.io'   base: '/portfolio'
//
//   Custom domain (current) — served from the root of rationalkunal.in,
//   with public/CNAME holding the domain.
//     site: 'https://rationalkunal.in'           base: '/'
// ---------------------------------------------------------------------------
const SITE = 'https://rationalkunal.in';
const BASE = '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // Reserves space for every local article image, so nothing jumps on load.
    // Then draws the article's underlines, boxes and arrows (see src/lib/scribbles.ts).
    rehypePlugins: [[rehypeImageDims, { base: BASE }], rehypeScribbles],
    shikiConfig: {
      // The site is dark only, so code gets one theme and no CSS switch.
      theme: 'github-dark',
      wrap: false,
    },
  },
  build: { inlineStylesheets: 'auto' },
});
