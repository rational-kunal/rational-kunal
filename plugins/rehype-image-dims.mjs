import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';

/**
 * Stamp intrinsic width and height onto every local <img> in an article.
 *
 * Markdown gives no dimensions, so the browser cannot reserve space and the
 * page jumps as each (often large) GIF arrives. Reading the real size from
 * disk at build time keeps CLS at zero without touching the markdown.
 */

/** Dimensions straight from the file header. No dependency needed for these. */
function sizeOf(file) {
  const fd = fs.openSync(file, 'r');
  const buf = Buffer.alloc(32);
  fs.readSync(fd, buf, 0, 32, 0);
  fs.closeSync(fd);

  // GIF87a / GIF89a: little-endian width and height at byte 6.
  if (buf.toString('ascii', 0, 3) === 'GIF') {
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  }
  // PNG: IHDR width and height, big-endian, at byte 16.
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // JPEG needs a marker walk, so read the whole file for those.
  if (buf.readUInt16BE(0) === 0xffd8) return jpegSize(file);
  return null;
}

function jpegSize(file) {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    // SOF0-SOF15, skipping the four that are not frame headers.
    if (marker >= 0xc0 && marker <= 0xcf &&
        marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

export function rehypeImageDims({ publicDir = 'public' } = {}) {
  const cache = new Map();

  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      const src = node.properties?.src;
      if (typeof src !== 'string' || !src.startsWith('/')) return;
      if (node.properties.width && node.properties.height) return;

      const file = path.join(process.cwd(), publicDir, src);
      if (!cache.has(file)) {
        let dims = null;
        try {
          if (fs.existsSync(file)) dims = sizeOf(file);
        } catch {
          dims = null;
        }
        cache.set(file, dims);
      }

      const dims = cache.get(file);
      if (!dims) return;
      node.properties.width = dims.w;
      node.properties.height = dims.h;
      node.properties.loading ??= 'lazy';
      node.properties.decoding ??= 'async';
    });
  };
}
