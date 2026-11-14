// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeImageDims } from './src/lib/images.ts';

// ---------------------------------------------------------------------------
// DEPLOY TARGET — the only two lines you edit when the hosting repo changes.
//
//   User page  (repo named `rational-kunal.github.io`)
//     site: 'https://rational-kunal.github.io'   base: '/'
//
//   Project page (repo named e.g. `portfolio`)
//     site: 'https://rational-kunal.github.io'   base: '/portfolio'
// ---------------------------------------------------------------------------
const SITE = 'https://rational-kunal.github.io';
const BASE = '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // Reserves space for every local article image, so nothing jumps on load.
    rehypePlugins: [rehypeImageDims],
    shikiConfig: {
      // The site is dark only, so code gets one theme and no CSS switch.
      theme: 'github-dark',
      wrap: false,
    },
  },
  build: { inlineStylesheets: 'auto' },
});
