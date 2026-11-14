/**
 * Image sizes, read from the file header at build time, so the browser can
 * reserve an image's space before it loads and nothing jumps.
 *
 * Used by Shot for project screenshots, and as a rehype plugin (wired up in
 * astro.config.mjs) for every local <img> in an article.
 */
import fs from 'node:fs';
import path from 'node:path';

export type Size = { w: number; h: number };

const cache = new Map<string, Size | undefined>();

/** Width and height of a file under public/ (PNG, GIF or JPEG), else undefined. */
export function imageSize(src: string): Size | undefined {
  const file = path.join(process.cwd(), 'public', src);
  if (!cache.has(file)) cache.set(file, read(file));
  return cache.get(file);
}

function read(file: string): Size | undefined {
  if (!fs.existsSync(file)) return undefined;
  const head = Buffer.alloc(32);
  const fd = fs.openSync(file, 'r');
  try {
    fs.readSync(fd, head, 0, 32, 0);
  } finally {
    fs.closeSync(fd);
  }
  // GIF87a / GIF89a: little-endian width and height at byte 6.
  if (head.toString('ascii', 0, 3) === 'GIF') return { w: head.readUInt16LE(6), h: head.readUInt16LE(8) };
  // PNG: IHDR width and height, big-endian, at byte 16.
  if (head.readUInt32BE(0) === 0x89504e47) return { w: head.readUInt32BE(16), h: head.readUInt32BE(20) };
  // JPEG keeps its size in a frame header further in, so that one is read whole.
  if (head.readUInt16BE(0) === 0xffd8) return jpegSize(fs.readFileSync(file));
  return undefined;
}

function jpegSize(b: Buffer): Size | undefined {
  for (let i = 2; i + 9 < b.length; ) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    // SOF0-SOF15, skipping the four that are not frame headers.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return undefined;
}

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[] };

/**
 * Rehype plugin: stamp the real width and height onto every local <img> in an
 * article. A phone screen recording is about twice as tall as it is wide, and
 * at the full text column fills more than a screen, so one is also marked
 * .is-tall and held to phone width in global.css.
 */
export function rehypeImageDims() {
  const visit = (node: HastNode): void => {
    if (node.tagName === 'img' && node.properties) stamp(node.properties);
    node.children?.forEach(visit);
  };
  return visit;
}

function stamp(p: Record<string, unknown>): void {
  if (typeof p.src !== 'string' || !p.src.startsWith('/') || (p.width && p.height)) return;
  const size = imageSize(p.src);
  if (!size) return;
  p.width = size.w;
  p.height = size.h;
  if (size.h > size.w * 1.4) p.className = [...[p.className ?? []].flat(), 'is-tall'];
  p.loading ??= 'lazy';
  p.decoding ??= 'async';
}
