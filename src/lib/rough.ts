/**
 * Hand-drawn geometry, generated at build time.
 *
 * Every path here is produced during `astro build` and baked into the HTML as
 * static SVG. Nothing in this file reaches the browser, which is how the site
 * gets a drawn-by-hand look while still shipping a zero-byte JS bundle.
 *
 * The wobble is deterministic: the same seed always yields the same path, so
 * diagrams do not shimmer between builds and diffs stay readable.
 */

/** mulberry32 - small, fast, deterministic. */
function prng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * A stream of seeds from one, so a drawing made of many strokes is still
 * decided by a single number and redraws the same on every build.
 */
export function seeds(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 1103515245 + 12345) % 2147483647);
}

export type Pen = {
  /** How far the stroke is allowed to wander, in user units. */
  wobble?: number;
  /** How many times each edge is drawn over. 2 reads as pencil, 1 as pen. */
  passes?: number;
};

type Rand = () => number;

function bowedLine(
  x1: number, y1: number, x2: number, y2: number,
  rand: Rand, wobble: number,
): string {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const amp = Math.min(wobble, len / 8);
  const jit = () => (rand() * 2 - 1) * amp;

  // Unit normal, so the bow pushes sideways rather than along the stroke.
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const bow1 = (rand() * 2 - 1) * amp * 1.7;
  const bow2 = (rand() * 2 - 1) * amp * 1.7;

  const sx = x1 + jit() * 0.6, sy = y1 + jit() * 0.6;
  const ex = x2 + jit() * 0.6, ey = y2 + jit() * 0.6;
  const c1x = x1 + (x2 - x1) * 0.32 + nx * bow1;
  const c1y = y1 + (y2 - y1) * 0.32 + ny * bow1;
  const c2x = x1 + (x2 - x1) * 0.68 + nx * bow2;
  const c2y = y1 + (y2 - y1) * 0.68 + ny * bow2;

  return `M${r2(sx)} ${r2(sy)} C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(ex)} ${r2(ey)}`;
}

export function roughLine(
  x1: number, y1: number, x2: number, y2: number,
  seed: number, pen: Pen = {},
): string {
  const { wobble = 1.6, passes = 2 } = pen;
  const rand = prng(seed);
  const out: string[] = [];
  for (let i = 0; i < passes; i++) out.push(bowedLine(x1, y1, x2, y2, rand, wobble));
  return out.join(' ');
}

/**
 * A rectangle whose corners overshoot slightly, the way a corner does when the
 * hand keeps moving a beat too long. This overshoot is the whole tell.
 */
export function roughRect(
  x: number, y: number, w: number, h: number,
  seed: number, pen: Pen = {},
): string {
  const { wobble = 1.6, passes = 2 } = pen;
  const rand = prng(seed);
  const out: string[] = [];
  const over = () => rand() * 3.5;

  for (let i = 0; i < passes; i++) {
    out.push(bowedLine(x - over(), y, x + w + over(), y, rand, wobble));
    out.push(bowedLine(x + w, y - over(), x + w, y + h + over(), rand, wobble));
    out.push(bowedLine(x + w + over(), y + h, x - over(), y + h, rand, wobble));
    out.push(bowedLine(x, y + h + over(), x, y - over(), rand, wobble));
  }
  return out.join(' ');
}

/** Straight shaft plus a two-stroke head. Returns one path for both. */
export function roughArrow(
  x1: number, y1: number, x2: number, y2: number,
  seed: number, pen: Pen = {},
): string {
  const { wobble = 1.3, passes = 2 } = pen;
  const rand = prng(seed);
  const out: string[] = [];
  for (let i = 0; i < passes; i++) out.push(bowedLine(x1, y1, x2, y2, rand, wobble));

  const ang = Math.atan2(y2 - y1, x2 - x1);
  const head = 9;
  const spread = 0.42;
  for (const dir of [1, -1]) {
    const a = ang + Math.PI + dir * spread;
    out.push(
      bowedLine(x2, y2, x2 + Math.cos(a) * head, y2 + Math.sin(a) * head, rand, 0.7),
    );
  }
  return out.join(' ');
}

/** Parallel 45-degree strokes, for shading the one box that matters. */
export function roughHatch(
  x: number, y: number, w: number, h: number,
  seed: number, gap = 7,
): string {
  const rand = prng(seed);
  const out: string[] = [];
  for (let o = -h; o < w; o += gap) {
    const x1 = x + o, y1 = y;
    const x2 = x + o + h, y2 = y + h;
    const cx1 = Math.max(x, Math.min(x + w, x1));
    const cx2 = Math.max(x, Math.min(x + w, x2));
    if (cx2 - cx1 < 1.5) continue;
    const cy1 = y1 + (cx1 - x1);
    const cy2 = y2 - (x2 - cx2);
    out.push(bowedLine(cx1, cy1, cx2, cy2, rand, 0.8));
  }
  return out.join(' ');
}

/** A squiggle used to strike through a node the project deliberately does not have. */
export function roughCross(
  x: number, y: number, w: number, h: number,
  seed: number,
): string {
  const rand = prng(seed);
  return [
    bowedLine(x + 4, y + 4, x + w - 4, y + h - 4, rand, 2),
    bowedLine(x + w - 4, y + 4, x + 4, y + h - 4, rand, 2),
  ].join(' ');
}
