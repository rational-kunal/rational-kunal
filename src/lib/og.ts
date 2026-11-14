/**
 * Social cards: the 1200x630 picture a link shows when it is pasted into
 * LinkedIn, Slack or a chat. Drawn at build time with satori (layout to SVG)
 * and resvg (SVG to PNG), so nothing about it runs in a browser.
 *
 * Satori reads woff but not woff2, so the fonts come from the static
 * @fontsource packages rather than the variable ones the site itself uses.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { site } from '@/data/site';

const require = createRequire(import.meta.url);
const font = (spec: string) => fs.readFileSync(require.resolve(spec));

const fonts = [
  { name: 'Bricolage', weight: 600 as const, data: font('@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-600-normal.woff') },
  { name: 'Bricolage', weight: 700 as const, data: font('@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff') },
  { name: 'Geist', weight: 400 as const, data: font('@fontsource/geist/files/geist-latin-400-normal.woff') },
  { name: 'Geist', weight: 500 as const, data: font('@fontsource/geist/files/geist-latin-500-normal.woff') },
  { name: 'Geist Mono', weight: 400 as const, data: font('@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff') },
];

const avatar = `data:image/jpeg;base64,${fs
  .readFileSync(path.join(process.cwd(), 'public', site.avatar))
  .toString('base64')}`;

/* The same tokens as src/styles/tokens.css. */
const c = {
  paper: '#15130e',
  raise: '#1e1a13',
  ink: '#f4ecd6',
  ink2: '#bdb39a',
  ink3: '#8b8270',
  mark: '#ee5d4d',
  rule: 'rgba(244, 236, 214, 0.17)',
};

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | false | undefined)[]): Node => ({
  type,
  props: { style, children: children.filter(Boolean) },
});

export type Card = {
  /** Small mono line above the title. */
  kicker: string;
  title: string;
  /** A sentence under the title. Optional. */
  body?: string;
  /** Home card: the title is the name, so it is set larger. */
  big?: boolean;
};

export async function renderCard({ kicker, title, body, big = false }: Card): Promise<Uint8Array<ArrayBuffer>> {
  const size = big ? 104 : title.length <= 32 ? 76 : title.length <= 56 ? 64 : 54;

  const tree = h(
    'div',
    { width: 1200, height: 630, display: 'flex', padding: 36, background: c.paper, boxSizing: 'border-box' },
    h(
      'div',
      {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '58px 68px 52px',
        background: c.raise,
        border: `1px solid ${c.rule}`,
        borderRadius: 26,
      },
      h(
        'div',
        { display: 'flex', flexDirection: 'column' },
        h('div', { display: 'flex', fontFamily: 'Geist Mono', fontSize: 24, color: c.ink3 }, kicker),
        h(
          'div',
          {
            display: 'flex',
            marginTop: big ? 26 : 20,
            fontFamily: 'Bricolage',
            fontWeight: big ? 700 : 600,
            fontSize: size,
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            color: c.ink,
          },
          title,
        ),
        // The one accent, as on every drawing on the site.
        h('div', { display: 'flex', width: 84, height: 6, marginTop: big ? 30 : 22, borderRadius: 3, background: c.mark }),
        body && h(
          'div',
          { display: 'flex', marginTop: big ? 30 : 22, maxWidth: 960, fontFamily: 'Geist', fontSize: big ? 31 : 26, lineHeight: 1.4, color: c.ink2 },
          body,
        ),
      ),
      h(
        'div',
        { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
        h(
          'div',
          { display: 'flex', alignItems: 'center' },
          { type: 'img', props: { src: avatar, width: 58, height: 58, style: { borderRadius: 999, marginRight: 18 } } },
          h('div', { display: 'flex', fontFamily: 'Geist', fontWeight: 500, fontSize: 28, color: c.ink }, site.name),
        ),
        h('div', { display: 'flex', fontFamily: 'Geist Mono', fontSize: 22, color: c.ink3 }, `github.com/${site.handle}`),
      ),
    ),
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  // Satori has already turned every glyph into a path, so resvg needs no fonts.
  // Skipping the system font scan is most of its time.
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: false },
  }).render().asPng();
  // Copied into a plain ArrayBuffer, which is what a Response body accepts.
  return new Uint8Array(png);
}
