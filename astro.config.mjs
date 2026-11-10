// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeImageDims } from './plugins/rehype-image-dims.mjs';

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
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
  build: { inlineStylesheets: 'auto' },
});
