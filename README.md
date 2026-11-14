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

## Switches

The résumé is the `resume` field in `src/data/site.ts`. It is currently a
Google Drive link, which opens in a new tab. A path under `public/` (for
example `/resume.pdf`) downloads instead.

"Open to new roles" is the `openToWork` flag in the same file. While it is
`false`, the hero kicker, the "If you are hiring" block in About and the
footer line are all left out.

One more worth a look: `src/data/about.ts` has a `current` field for a single
sentence about where you work right now. It is `null`, so the paragraph is
simply left out rather than invented.

---

## Where everything lives

```
src/
  data/             the whole site as plain data - edit here first
    site.ts           name, résumé, socials, nav, openToWork
    projects.ts       every project: tagline, stack, stars, links, screenshot
    diagrams.ts       one drawing per project that earns one, keyed by slug
    skills.ts         the three skill bands
    about.ts          the About prose
  content/
    writing/          one .md per article
    notes/            one .md per release note or announcement
  components/       presentation only; no content lives here
    layout/           Nav, Footer - on every page
    home/             the one-page home, in page order:
                        Hero (+ Miniatures, Connect), Work, Skills,
                        Writing (+ ArticleRow), About
    drawing/          build-time hand-drawn SVG: Diagram, MiniFlow, PaperGrid
    ui/               small shared pieces: Icon, Shot, Stars, Socials
  layouts/          Base (every page) and Article (every post)
  pages/            index (the whole site), writing/<slug>, og cards, rss, 404
  lib/
    content.ts        getPosts, getNotes, minutesOf - every content query
    url.ts            base-aware links, absolute URLs, external-link attrs
    dates.ts          date formatting, always in UTC
    images.ts         image sizes from file headers + the rehype plugin
    rough.ts          hand-drawn geometry, seeded and deterministic
    diagram.ts        the diagram model and orthogonal edge routing
    og.ts             the 1200x630 social card, drawn at build time
  styles/
    tokens.css        colours, type scale, spacing, radii, z-index ladder
    global.css        everything else
```

The rule the project follows: **content and configuration go in `src/data` or
`src/content`, never inside a component.** Adding a project or an article
should never mean editing markup.

---

## Adding an article

The site is one page, five sections in order: the hero, Work, Skills,
Writing, About. Articles are the exception and keep their own pages.

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

The filename is the URL. It appears in the Writing section, in `rss.xml` and in
the sitemap, with no other edits.
Set `draft: true` to keep it out of all of them.

Images go in `public/writing/<slug>/` and are referenced as
`/writing/<slug>/name.png`.

## Adding a release note

Copy `src/content/notes/_template.md` to a real filename. Files starting with
an underscore are ignored, so the template never publishes. The three latest
appear under Work. With none, nothing is drawn rather than an empty box.

## Adding a project

Add an entry to the `projects` array in `src/data/projects.ts`.

Every project is one card: a picture on top, then name, tagline, stack and
links. `featured: true` makes it a large card whose picture is its drawing
(the entry in `diagrams.ts` under the same slug) beside the real screenshot
(`shot`). A tall screenshot (a phone) stands at a fixed height, a wide one (a
window) takes a fixed width; Shot reads the image's size to tell which.
Everything else becomes a small card under "And the rest", with the screenshot
peeking in if it has one, else its three-step flow (`mini`). There are no
project pages. `article` links the project and its write-up both ways.

## Changing the top of the page

The headline and the title block are in `src/components/home/Hero.astro`.
Under the headline, `src/components/home/Miniatures.astro` draws six small scenes, each one
showing what a project does instead of saying it: NeoBrutalism's button pressing
into its hard shadow, BlinkUI's SwiftUI-style code rendering into a terminal
where only the changed region is rewritten,
OneOnOne's peers meeting through a server that steps aside, NoReels crossing a
reel out of the feed, keemat's price ticking down, ChalChitra's segments
streaming into a screen. It is CSS only. Without animation (or with reduced
motion) each tile is a still frame that still reads.

Each tile is a link to that project's entry in the Work section (`/#<slug>`),
which flashes a ring when you land on it. Star counts come from `projects.ts`;
a slug that does not exist fails the build. The scenes are hand-made, so if a
project changes enough that its scene lies, edit it there.

## Adding a diagram

Diagrams are data. Add an entry to `src/data/diagrams.ts` under the project's
slug. A featured project shows it; any other keeps it ready for when it is.

```ts
'your-slug': {
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

The site is served from the custom domain **rationalkunal.in** (registered at
GoDaddy, hosted on GitHub Pages). Both values live at the top of
`astro.config.mjs`:

```js
const SITE = 'https://rationalkunal.in';
const BASE = '/';
```

Every internal link runs through `url()` in `src/lib/url.ts`, and the image
paths inside articles are prefixed by `rehypeImageDims` in `src/lib/images.ts`,
so `BASE` is the only thing to change when the hosting target does.

`public/CNAME` holds the domain. The DNS side is, at GoDaddy, four `A` records
for `@` pointing at GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`,
`.111.153`) and a `CNAME` for `www` pointing at `rational-kunal.github.io`. In
the repository, **Settings -> Pages -> Custom domain** is set to
`rationalkunal.in` with **Enforce HTTPS** on.

To go back to the default URL, set `SITE` to `https://rational-kunal.github.io`
and `BASE` to `'/rational-kunal'` (the repository name), and remove the custom
domain in Pages settings.

For a **user page** (a repository named `rational-kunal.github.io`), `BASE` is
`'/'` and `SITE` is `https://rational-kunal.github.io`.

---

## Design notes

- **Palette** is taken from your own vector portrait, in its dark form: warm
  near-black `#15130e`, cream ink `#f4ecd6`, and the maroon of the glasses
  lifted to `#ee5d4d` as the single accent. All of it lives in `tokens.css`.
- **Dark only.** There is no light theme, nothing branches on
  `prefers-color-scheme`, screenshots always use their dark variant, and code
  is highlighted with a single `github-dark` theme.
- **Motion** is CSS only: scroll-driven reveals via `animation-timeline: view()`,
  guarded by `@supports` so unsupported browsers simply see the finished state,
  and switched off under `prefers-reduced-motion`.
- **There is no `scroll-behavior: smooth`.** Every "full drawing" link is a link to
  a fragment, and a smooth scroll is an animation: throttle it
  and the visitor lands at the top of the page instead of on the thing they
  clicked. Measured on a fragment link, smooth left the page at 0 and auto
  landed it at 2304. The offset under the sticky nav comes from
  `scroll-padding-top` on `html`, in one place.
- **Icons** are read out of `@phosphor-icons/core` (Light weight) at build time
  and inlined. Simple Icons (`brand: true`) supplies the logos Phosphor does
  not carry: dev.to, Codeforces and most of the skills. No icon font, no runtime.
- **Fonts** are three families, all self-hosted via Fontsource, with nothing
  fetched from Google at runtime. Geist is the body, Geist Mono the small
  facts. Bricolage Grotesque (`--font-display`) sets headings and names; it
  has an optical-size axis, so it gets sharper and odder as it grows.
- **Page order** is the hero, Work, Skills, Writing, About. What I built, then
  what I can do (right after the evidence), then what I wrote, ending on who I
  am and the ask, so the page finishes on the hiring path and the footer.
