import type { Diagram } from '@/lib/diagram';

/**
 * One entry per project that earns a drawing, keyed by the project's slug.
 * A featured project shows its drawing in the Work section; the others keep
 * theirs ready for the day they are featured.
 *
 * Coordinates are plain SVG user units on a 760-wide canvas. Nothing is
 * auto-laid-out, because a diagram that explains something has to be composed,
 * not packed. To add one: copy the closest entry, move the boxes, done.
 */
export const diagrams: Partial<Record<string, Diagram>> = {
  /* ----------------------------------------------------------------------- */
  blinkui: {
    seed: 1317,
    width: 760,
    height: 332,
    caption:
      'A view tree is diffed against the previous frame, the difference is patched into a cell buffer, and only the changed cells are written to the terminal as escape codes. A keypress mutates state, which invalidates the tree and starts the loop again.',
    nodes: [
      { id: 'view',  x: 24,  y: 96,  w: 146, h: 62, label: 'View tree',     sub: 'structs, value type' },
      { id: 'diff',  x: 216, y: 96,  w: 146, h: 62, label: 'Diff last frame', sub: 'what moved?', emphasis: true },
      { id: 'buf',   x: 408, y: 96,  w: 146, h: 62, label: 'Cell buffer',   sub: 'cols x rows' },
      { id: 'term',  x: 600, y: 96,  w: 136, h: 62, label: 'Terminal',      sub: 'ANSI escapes' },
      { id: 'state', x: 216, y: 228, w: 146, h: 56, label: '@State mutates' },
    ],
    edges: [
      { from: 'view',  to: 'diff',  via: 'r-l', label: 'body' },
      { from: 'diff',  to: 'buf',   via: 'r-l', label: 'patch', accent: true },
      { from: 'buf',   to: 'term',  via: 'r-l', label: 'write' },
      { from: 'term',  to: 'state', via: 'b-r', label: 'keypress' },
      { from: 'state', to: 'view',  via: 'l-t', label: 'invalidate' },
    ],
    notes: [
      { x: 400, y: 314, text: 'only the cells that changed get written back, so a redraw costs bytes, not a screen', anchor: 'middle' },
    ],
  },

  /* ----------------------------------------------------------------------- */
  neobrutalism: {
    seed: 4802,
    width: 760,
    height: 302,
    caption:
      'A single view modifier wraps any SwiftUI view in two extra layers: a solid offset shape behind it standing in for the shadow, and a hard two-point stroke over it. Both composite back into one component.',
    nodes: [
      { id: 'view',   x: 24,  y: 112, w: 158, h: 64, label: 'Any SwiftUI view', sub: 'Button, Card, Toggle' },
      { id: 'mod',    x: 222, y: 112, w: 150, h: 64, label: '.neoBrutalism()',  sub: 'one ViewModifier', emphasis: true },
      { id: 'shadow', x: 412, y: 36,  w: 168, h: 58, label: 'Solid offset shape', sub: '+4 +4, zero blur' },
      { id: 'stroke', x: 412, y: 186, w: 168, h: 58, label: 'Hard 2pt stroke' },
      { id: 'out',    x: 620, y: 112, w: 116, h: 64, label: 'Component' },
    ],
    edges: [
      { from: 'view',   to: 'mod',    via: 'r-l' },
      { from: 'mod',    to: 'shadow', via: 'r-l', label: 'background', accent: true },
      { from: 'mod',    to: 'stroke', via: 'r-l', label: 'overlay', accent: true },
      { from: 'shadow', to: 'out',    via: 'r-l' },
      { from: 'stroke', to: 'out',    via: 'r-l' },
    ],
    notes: [
      { x: 496, y: 284, text: 'the shadow is a second filled shape, not a blur. that is the whole trick.', anchor: 'middle' },
    ],
  },

  /* ----------------------------------------------------------------------- */
  keemat: {
    seed: 2291,
    width: 760,
    height: 334,
    caption:
      'A background task wakes the app a few times a day, fetches each saved product page, parses the price out of it, and appends to a local SwiftData history. There is no account and no server: the phone holds everything.',
    nodes: [
      { id: 'list',   x: 24,  y: 94,  w: 146, h: 60, label: 'Your list',  sub: 'stays on device' },
      { id: 'wake',   x: 214, y: 94,  w: 146, h: 60, label: 'BGTask wakes', sub: 'a few times a day' },
      { id: 'scrape', x: 404, y: 94,  w: 150, h: 60, label: 'Fetch + parse', sub: 'price out of HTML', emphasis: true },
      { id: 'store',  x: 588, y: 94,  w: 148, h: 60, label: 'SwiftData', sub: 'price history' },
      { id: 'none',   x: 284, y: 232, w: 220, h: 58, label: 'Account, server, sync', struck: true },
    ],
    edges: [
      { from: 'list',   to: 'wake',   via: 'r-l' },
      { from: 'wake',   to: 'scrape', via: 'r-l' },
      { from: 'scrape', to: 'store',  via: 'r-l', label: 'append' },
      { from: 'store',  to: 'list',   via: 't-t', label: 'notify on a drop' },
      { from: 'scrape', to: 'none',   via: 'b-t', label: 'never', dashed: true, accent: true },
    ],
    notes: [
      { x: 394, y: 312, text: 'the phone is the whole backend. nothing leaves it except the page request.', anchor: 'middle' },
    ],
  },

  /* ----------------------------------------------------------------------- */
  nottheinstagram: {
    seed: 3907,
    width: 760,
    height: 346,
    caption:
      'Sideloadly injects the framework into a decrypted Instagram and installs it. When the app opens, each hook first checks that the method it wants still has the signature it expects, and only then swaps in the slower version: a feed that waits, a Reels tab that opens on a pause. If an update changed the method, that one feature stays off and the app works as normal.',
    nodes: [
      { id: 'fw',     x: 24,  y: 34,  w: 156, h: 58, label: 'The framework', sub: 'one file per feature' },
      { id: 'ipa',    x: 24,  y: 136, w: 156, h: 58, label: 'Decrypted .ipa' },
      { id: 'side',   x: 222, y: 85,  w: 148, h: 58, label: 'Sideloadly', sub: 'inject + sign' },
      { id: 'open',   x: 432, y: 85,  w: 152, h: 58, label: 'Instagram opens', sub: 'framework loads' },
      { id: 'check',  x: 432, y: 228, w: 152, h: 60, label: 'Signature matches?', sub: 'checked per hook', emphasis: true },
      { id: 'hook',   x: 626, y: 228, w: 110, h: 60, label: 'Swap it in', sub: 'the slow version' },
      { id: 'off',    x: 222, y: 228, w: 148, h: 60, label: 'Leave it alone', sub: 'that feature is off' },
    ],
    edges: [
      { from: 'fw',    to: 'side',  via: 'r-l' },
      { from: 'ipa',   to: 'side',  via: 'r-l' },
      { from: 'side',  to: 'open',  via: 'r-l', label: 'install' },
      { from: 'open',  to: 'check', via: 'b-t' },
      { from: 'check', to: 'hook',  via: 'r-l', label: 'yes', accent: true },
      { from: 'check', to: 'off',   via: 'l-r', label: 'no', dashed: true },
    ],
    notes: [
      { x: 380, y: 328, text: 'an Instagram update can switch off one feature. it cannot break the app.', anchor: 'middle' },
    ],
  },

  /* ----------------------------------------------------------------------- */
  noreels: {
    seed: 7734,
    width: 760,
    height: 302,
    caption:
      'The decrypted app binary is dumped to headers, the class backing a feed item is located, and the method that decides whether an item is a reel is swizzled to skip it. The binary is then re-signed and installed.',
    nodes: [
      { id: 'ipa',     x: 24,  y: 38,  w: 152, h: 58, label: 'Decrypted .ipa' },
      { id: 'dump',    x: 216, y: 38,  w: 160, h: 58, label: 'class-dump', sub: 'headers out' },
      { id: 'find',    x: 416, y: 38,  w: 170, h: 58, label: 'Find the feed type' },
      { id: 'swizzle', x: 416, y: 180, w: 170, h: 58, label: 'Swizzle the check', sub: 'is a reel? skip it', emphasis: true },
      { id: 'sign',    x: 216, y: 180, w: 160, h: 58, label: 'Re-sign + install' },
      { id: 'feed',    x: 24,  y: 180, w: 152, h: 58, label: 'A feed, no reels' },
    ],
    edges: [
      { from: 'ipa',     to: 'dump',    via: 'r-l' },
      { from: 'dump',    to: 'find',    via: 'r-l' },
      { from: 'find',    to: 'swizzle', via: 'b-t', accent: true },
      { from: 'swizzle', to: 'sign',    via: 'l-r' },
      { from: 'sign',    to: 'feed',    via: 'l-r' },
    ],
    notes: [
      { x: 380, y: 278, text: 'my own device, my own account, purely to find out whether it was possible.', anchor: 'middle' },
    ],
  },

  /* ----------------------------------------------------------------------- */
  oneonone: {
    seed: 5518,
    width: 760,
    height: 300,
    caption:
      'Two browsers exchange an offer and an answer through a small signalling step, then open a direct peer connection. Video, audio and chat travel on that direct link and never pass through the server again.',
    nodes: [
      { id: 'a',     x: 30,  y: 110, w: 140, h: 64, label: 'Browser A' },
      { id: 'sig',   x: 310, y: 30,  w: 160, h: 56, label: 'Signalling', sub: 'handshake only' },
      { id: 'b',     x: 600, y: 110, w: 140, h: 64, label: 'Browser B' },
      { id: 'media', x: 310, y: 180, w: 160, h: 60, label: 'Direct connection', sub: 'media + data channel', emphasis: true },
    ],
    edges: [
      { from: 'a',     to: 'sig',   via: 't-l', label: 'offer', dashed: true },
      { from: 'sig',   to: 'b',     via: 'r-t', label: 'answer', dashed: true },
      { from: 'a',     to: 'media', via: 'r-l', accent: true },
      { from: 'media', to: 'b',     via: 'r-l', accent: true },
    ],
    notes: [
      { x: 385, y: 272, text: 'the server only introduces them. after that, the call never touches it.', anchor: 'middle' },
    ],
  },

  /* ----------------------------------------------------------------------- */
  chalchitra: {
    seed: 6140,
    width: 760,
    height: 322,
    caption:
      'The playlist is parsed to pick a bitrate, segments are fetched and demuxed by hand, and the decoded frames are handed to a display layer as sample buffers. Nothing in the chain is AVPlayer.',
    nodes: [
      { id: 'm3u8',  x: 24,  y: 112, w: 140, h: 60, label: '.m3u8', sub: 'the playlist' },
      { id: 'parse', x: 204, y: 112, w: 148, h: 60, label: 'Pick a variant', sub: 'bitrate ladder' },
      { id: 'seg',   x: 392, y: 112, w: 140, h: 60, label: 'Fetch .ts', sub: 'segment by segment' },
      { id: 'demux', x: 392, y: 214, w: 140, h: 56, label: 'Demux + decode', emphasis: true },
      { id: 'layer', x: 580, y: 112, w: 156, h: 60, label: 'AVSampleBuffer', sub: 'DisplayLayer' },
    ],
    edges: [
      { from: 'm3u8',  to: 'parse', via: 'r-l' },
      { from: 'parse', to: 'seg',   via: 'r-l' },
      { from: 'seg',   to: 'demux', via: 'b-t' },
      { from: 'demux', to: 'layer', via: 'r-l', label: 'CMSampleBuffer', accent: true },
    ],
    notes: [
      { x: 380, y: 300, text: 'no AVPlayer anywhere. the point was to find out what AVPlayer does for you.', anchor: 'middle' },
    ],
  },
};
