# rational

Portfolio and writing for [Kunal Kamble](https://github.com/rational-kunal).

Astro 5, static output, **zero JavaScript shipped to the browser**. Every
diagram on the site is generated during the build and baked into the HTML as
SVG, so the pages animate and draw themselves with nothing but CSS.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> ./dist
npm run preview  # serve ./dist locally
```

---

## Before this goes live

Four things only you can fill in. While any of them are outstanding, a dashed
red checklist appears at the top of every page in `npm run dev` and never in a
build, so visitors do not see it.

| What | Where |
|---|---|
| LinkedIn URL | `src/data/site.ts` -> `socials`, replace `'#'` and delete `todo: true` |
| X URL | same, or delete the entry if you do not want it listed |
| Public email | same. It is deliberately blank: the only address this repo knew was your private filtered one |
| Résumé PDF | drop it at `public/resume.pdf`, then set `resumeReady: true` in `src/data/site.ts` |

Until `resumeReady` is true, every Résumé button points at the résumé block on
`/about`, which explains how to ask for it. Nothing links to a missing file.

One more worth a look: `src/data/about.ts` has a `current` field for a single
sentence about where you work right now. It is `null`, so the paragraph is
simply left out rather than invented.

---

## Where everything lives

```
src/
  data/           the whole site as plain data - edit here first
    site.ts         name, socials, nav, résumé flag
    projects.ts     every project, its stack, stars, links, install snippets
    diagrams.ts     one diagram spec per project that earns a drawing
    skills.ts       the three skill bands
    about.ts        the about-page prose
  content/
    writing/        one .md per article
    notes/          one .md per release note or announcement
  lib/
    rough.ts        hand-drawn geometry, seeded and deterministic
    diagram.ts      the diagram model and orthogonal edge routing
    url.ts          base-aware links, dates, reading time
  components/     presentation only; no content lives here
  layouts/        Base (every page) and Article (every post)
  pages/          routes
  styles/
    tokens.css      colours, type scale, spacing, radii, z-index ladder
    global.css      everything else
```

The rule the project follows: **content and configuration go in `src/data` or
`src/content`, never inside a component.** Adding a project or an article
should never mean editing markup.

---

## Adding an article

Create `src/content/writing/my-article.md`:

```markdown
---
title: "What I worked out"
description: "One sentence. It shows in the list and in the social card."
published: 2026-03-14
tags: ["swift", "ios"]
devto: "https://dev.to/rationalkunal/..."   # optional
draft: false
---

Body in normal markdown. Code blocks are highlighted at build time.
```

The filename is the URL. It appears on `/writing`, on the home page if it is
one of the three newest, in `rss.xml` and in the sitemap, with no other edits.
Set `draft: true` to keep it out of all of them.

Images go in `public/writing/<slug>/` and are referenced as
`/writing/<slug>/name.png`.

## Adding a release note

Copy `src/content/notes/_template.md` to a real filename. Files starting with
an underscore are ignored, so the template never publishes. Notes show newest
first on `/libraries`; when there are none, that section shows a proper empty
state rather than a blank gap.

## Adding a project

Add an entry to the `projects` array in `src/data/projects.ts`. Set
`featured: true` to surface it on the home page. `kind: 'library'` moves it to
`/libraries` and lets it carry `install` snippets.

## Adding a diagram

Diagrams are data. Add an entry to `src/data/diagrams.ts` and point a project
at it with `diagram: 'yourKey'`.

```ts
yourKey: {
  seed: 1234,          // any number; the same seed always draws the same wobble
  width: 760,          // user units; 760 is the house width
  height: 300,
  caption: 'Read out under the drawing, and used as the SVG description.',
  nodes: [
    { id: 'a', x: 24, y: 110, w: 150, h: 60, label: 'Input', sub: 'smaller line' },
    { id: 'b', x: 230, y: 110, w: 150, h: 60, label: 'The point', emphasis: true },
    { id: 'c', x: 436, y: 110, w: 150, h: 60, label: 'Output' },
  ],
  edges: [
    { from: 'a', to: 'b', via: 'r-l', label: 'optional' },
    { from: 'b', to: 'c', via: 'r-l', accent: true },
  ],
  notes: [{ x: 300, y: 250, text: 'an aside, in the margin', anchor: 'middle' }],
}
```

- `emphasis: true` hatches the box and draws it in the accent colour. Use it on
  the one step that is the actual idea.
- `struck: true` crosses a box out, for the thing the project deliberately does
  not have. `keemat` uses it for the server it does not need.
- `via` is `'<exit side>-<entry side>'` from `l`, `r`, `t`, `b`. Leave it off
  and the sides are inferred from where the boxes sit.
- Coordinates are placed by hand on purpose. A diagram that explains something
  has to be composed, not auto-packed.

## Refreshing star counts

`stars` in `src/data/projects.ts` is a snapshot. To re-read them:

```bash
curl -s "https://api.github.com/users/rational-kunal/repos?per_page=100" \
  | python3 -c "import json,sys; [print(r['name'], r['stargazers_count']) for r in json.load(sys.stdin)]"
```

---

## Deploying

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
In the repository settings, set **Pages -> Build and deployment -> Source** to
**GitHub Actions** once, and that is the whole setup.

The site is configured for a **user page** - a repository named
`rational-kunal.github.io`, served at the domain root. Both values live at the
top of `astro.config.mjs`:

```js
const SITE = 'https://rational-kunal.github.io';
const BASE = '/';
```

For a **project page** (a repository named anything else), change `BASE` to
`'/<repo-name>'`. Every internal link runs through `url()` in `src/lib/url.ts`,
so nothing else needs touching.

For a custom domain, set `SITE` to it, leave `BASE` as `'/'`, and add a
`public/CNAME` file containing the domain.

---

## Design notes

- **Palette** is taken from your own vector portrait: warm paper `#fff6d5`,
  near-black ink, and the maroon of the glasses as the single accent. Changing
  the three seed values at the top of `tokens.css` moves the whole site.
- **Light and dark** both ship and follow the system setting. There is no
  toggle, because a toggle needs JavaScript to persist.
- **Motion** is CSS only: scroll-driven reveals via `animation-timeline: view()`,
  guarded by `@supports` so unsupported browsers simply see the finished state,
  and switched off under `prefers-reduced-motion`.
- **Icons** are read out of `@phosphor-icons/core` (Light weight) at build time
  and inlined. Simple Icons supplies the dev.to mark only, since Phosphor has
  no equivalent. No icon font, no runtime.
- **Fonts** are Geist and Geist Mono, self-hosted via Fontsource. Nothing is
  fetched from Google at runtime.
