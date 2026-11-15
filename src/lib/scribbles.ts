/**
 * Rehype plugin: the hand-drawn marks on an article, drawn at build time with
 * the same pen as the diagrams (src/lib/rough.ts), so posts ship no JS.
 *
 *   ## heading                    a scribbled underline
 *   > callout                     a sketched box around it
 *   <aside class="note">…</aside>  an arrow pointing back at the text
 *   <p class="hand">…</p>          an arrow pointing into the phone beside it
 *
 * Headings and callouts written in Markdown arrive as elements. Notes are
 * written as raw HTML, which Astro only parses after this plugin runs, so
 * those arrows are spliced into the raw string instead.
 *
 * Each mark is seeded by the text it belongs to, so it redraws the same on
 * every build and only changes when that text does.
 */
import { roughArrow, roughLine, roughRect, seedOf } from './rough';

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/** One stroke as SVG. `stretch` lets it take any box; the stroke keeps its weight. */
function svg(kind: string, w: number, h: number, d: string, stretch = false): string {
  const fit = stretch ? ' preserveAspectRatio="none"' : '';
  return `<svg class="scribble scribble--${kind}" viewBox="0 0 ${w} ${h}"${fit} aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
}

const underline = (seed: number) => svg('under', 300, 16, roughLine(4, 9, 296, 7, seed, { wobble: 2.2 }), true);
const box = (seed: number) => svg('box', 600, 80, roughRect(4, 4, 592, 72, seed, { wobble: 1.8 }), true);
const noteArrow = (seed: number) => svg('note', 58, 34, roughArrow(52, 26, 6, 12, seed, { wobble: 1 }));
const handArrow = (seed: number) => svg('hand', 110, 66, roughArrow(100, 8, 14, 56, seed, { wobble: 1.4 }));

const textOf = (n: HastNode): string => n.value ?? n.children?.map(textOf).join('') ?? '';
const raw = (value: string): HastNode => ({ type: 'raw', value });

// The opening tag may carry a style (--at), so it is matched up to its own `>`.
const NOTE = /(<aside class="note"[^>]*>)([\s\S]*?)(<\/aside>)/g;
const HAND = /(<p class="hand"[^>]*>)([\s\S]*?)(<\/p>)/g;

export function rehypeScribbles() {
  const visit = (node: HastNode): void => {
    if (node.type === 'raw' && node.value) {
      node.value = node.value
        .replace(NOTE, (_, open, body, close) => `${open}${noteArrow(seedOf(body))}<span>${body}</span>${close}`)
        .replace(HAND, (m, _o, body) => `${m}${handArrow(seedOf(body))}`);
      return;
    }
    if (node.tagName === 'h2') node.children?.push(raw(underline(seedOf(textOf(node)))));
    if (node.tagName === 'blockquote') node.children?.unshift(raw(box(seedOf(textOf(node)))));
    node.children?.forEach(visit);
  };
  return visit;
}
