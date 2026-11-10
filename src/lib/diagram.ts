/**
 * Diagram model + orthogonal edge routing.
 *
 * A diagram is data, not markup. Adding one means adding an object to
 * src/data/diagrams.ts - no SVG is ever written by hand.
 */

export type Side = 'l' | 'r' | 't' | 'b';

export type DiagramNode = {
  id: string;
  x: number; y: number; w: number; h: number;
  label: string;
  /** Second line, smaller and quieter. */
  sub?: string;
  /** Hatched and drawn in the accent colour: the step that is the point. */
  emphasis?: boolean;
  /** Crossed out: a part this project deliberately does not have. */
  struck?: boolean;
  shape?: 'box' | 'round';
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  /** e.g. 'r-l' leaves the right of `from` and enters the left of `to`. */
  via?: `${Side}-${Side}`;
  dashed?: boolean;
  accent?: boolean;
};

export type DiagramNote = {
  x: number; y: number;
  text: string;
  anchor?: 'start' | 'middle' | 'end';
};

export type Diagram = {
  seed: number;
  width: number;
  height: number;
  /** Read out below the drawing, and used as the SVG accessible description. */
  caption: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  notes?: DiagramNote[];
};

export type Pt = { x: number; y: number };

const STUB = 18;

function anchorOf(n: DiagramNode, side: Side): Pt {
  switch (side) {
    case 'l': return { x: n.x,         y: n.y + n.h / 2 };
    case 'r': return { x: n.x + n.w,   y: n.y + n.h / 2 };
    case 't': return { x: n.x + n.w / 2, y: n.y };
    case 'b': return { x: n.x + n.w / 2, y: n.y + n.h };
  }
}

function outward(side: Side): Pt {
  switch (side) {
    case 'l': return { x: -1, y: 0 };
    case 'r': return { x: 1,  y: 0 };
    case 't': return { x: 0,  y: -1 };
    case 'b': return { x: 0,  y: 1 };
  }
}

/** Fallback sides when an edge does not declare `via`. */
function inferSides(a: DiagramNode, b: DiagramNode): [Side, Side] {
  const dx = (b.x + b.w / 2) - (a.x + a.w / 2);
  const dy = (b.y + b.h / 2) - (a.y + a.h / 2);
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? ['r', 'l'] : ['l', 'r'];
  }
  return dy >= 0 ? ['b', 't'] : ['t', 'b'];
}

const horizontal = (s: Side) => s === 'l' || s === 'r';

/**
 * Returns the polyline an edge follows: anchor, stub, elbows, stub, anchor.
 * Collinear points are dropped so a straight run stays a single stroke.
 */
export function routeEdge(
  from: DiagramNode, to: DiagramNode, via?: `${Side}-${Side}`,
): Pt[] {
  const [sa, sb] = via
    ? (via.split('-') as [Side, Side])
    : inferSides(from, to);

  const p0 = anchorOf(from, sa);
  const p3 = anchorOf(to, sb);
  const oa = outward(sa);
  const ob = outward(sb);
  const p1 = { x: p0.x + oa.x * STUB, y: p0.y + oa.y * STUB };
  const p2 = { x: p3.x + ob.x * STUB, y: p3.y + ob.y * STUB };

  const mid: Pt[] = [];
  if (horizontal(sa) && horizontal(sb)) {
    const mx = (p1.x + p2.x) / 2;
    mid.push({ x: mx, y: p1.y }, { x: mx, y: p2.y });
  } else if (!horizontal(sa) && !horizontal(sb)) {
    const my = (p1.y + p2.y) / 2;
    mid.push({ x: p1.x, y: my }, { x: p2.x, y: my });
  } else if (horizontal(sa)) {
    mid.push({ x: p2.x, y: p1.y });
  } else {
    mid.push({ x: p1.x, y: p2.y });
  }

  return dedupe([p0, p1, ...mid, p2, p3]);
}

function dedupe(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.x - p.x) < 0.6 && Math.abs(last.y - p.y) < 0.6) continue;
    out.push(p);
  }
  // Drop a middle point that sits on the straight line between its neighbours.
  const cleaned: Pt[] = [];
  for (let i = 0; i < out.length; i++) {
    const a = cleaned[cleaned.length - 1];
    const c = out[i + 1];
    const b = out[i];
    if (a && c) {
      const col =
        (Math.abs(a.x - b.x) < 0.6 && Math.abs(b.x - c.x) < 0.6) ||
        (Math.abs(a.y - b.y) < 0.6 && Math.abs(b.y - c.y) < 0.6);
      if (col) continue;
    }
    cleaned.push(b);
  }
  return cleaned;
}

/** Midpoint of the longest segment: where an edge label reads best. */
export function labelSpot(pts: Pt[]): Pt {
  let best = 0, bestLen = -1;
  for (let i = 0; i < pts.length - 1; i++) {
    const len = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    if (len > bestLen) { bestLen = len; best = i; }
  }
  const a = pts[best], b = pts[best + 1];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
