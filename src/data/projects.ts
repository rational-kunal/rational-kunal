import { diagrams } from './diagrams';
import type { Diagram } from '@/lib/diagram';

export type ProjectKind = 'library' | 'app' | 'tool' | 'experiment';

export type Project = {
  slug: string;
  name: string;
  /** One line. What it is, not why it is great. */
  tagline: string;
  /** Two or three sentences for the detail surfaces. Plain language. */
  what: string;
  repo: string;
  demo?: string;
  /** Star count, read from the GitHub API. See README for the refresh command. */
  stars: number;
  lang: string;
  year: string;
  kind: ProjectKind;
  stack: string[];
  /** Key into src/data/diagrams.ts. Projects without one render as a compact row. */
  diagram?: keyof typeof diagrams;
  featured?: boolean;
  /** Shown on /libraries. Keep the code exactly as it should be pasted. */
  install?: { label: string; code: string }[];
  /**
   * A real screenshot, pulled from the project's own repo into
   * public/projects/<slug>/. Preferred over a drawing on small surfaces,
   * where a full diagram is unreadable.
   */
  shot?: { src: string; dark?: string; alt: string };
  /**
   * Three short steps for the compact tile diagram, used when there is no
   * screenshot. Keep each one under about twelve characters.
   */
  mini?: [string, string, string];
};

const gh = (r: string) => `https://github.com/rational-kunal/${r}`;

export const projects: Project[] = [
  {
    slug: 'neobrutalism',
    name: 'NeoBrutalism',
    tagline: 'A SwiftUI component set with hard edges and no blur.',
    what: 'Buttons, cards, toggles and inputs in the neo-brutalist style, as a Swift package you add and use. The look comes from a single view modifier: a solid offset shape standing in for the shadow and a hard stroke on top, so every component composes the same way.',
    repo: gh('NeoBrutalism'),
    stars: 149,
    lang: 'Swift',
    year: '2024 - now',
    kind: 'library',
    stack: ['Swift 6', 'SwiftUI', 'iOS 17+', 'SPM', 'Snapshot tests'],
    diagram: 'neobrutalism',
    featured: true,
    install: [
      {
        label: 'Package.swift',
        code: '.package(url: "https://github.com/rational-kunal/NeoBrutalism", from: "3.0.0")',
      },
      {
        label: 'Xcode',
        code: 'File > Add Package Dependencies...\nhttps://github.com/rational-kunal/NeoBrutalism',
      },
    ],
    shot: {
      src: '/projects/neobrutalism/gallery.png',
      dark: '/projects/neobrutalism/gallery-dark.png',
      alt: 'The NeoBrutalism component gallery: buttons, cards and inputs with hard offset shadows.',
    },
  },
  {
    slug: 'blinkui',
    name: 'BlinkUI',
    tagline: 'SwiftUI, but it renders into a terminal.',
    what: 'A declarative UI framework for the terminal. You write a view tree the way you would in SwiftUI; it diffs against the last frame and writes only the cells that changed as ANSI escapes. State changes invalidate the tree and the loop runs again.',
    repo: gh('BlinkUI'),
    stars: 95,
    lang: 'Swift',
    year: '2024 - now',
    kind: 'library',
    stack: ['Swift 6', 'macOS 14+', 'ANSI', 'Diffing'],
    diagram: 'blinkui',
    featured: true,
    install: [
      {
        label: 'Run the demo',
        code: 'git clone https://github.com/rational-kunal/BlinkUI\ncd BlinkUI && swift run',
      },
    ],
    mini: ['view tree', 'diff', 'terminal'],
  },
  {
    slug: 'keemat',
    name: 'keemat',
    tagline: 'Price tracking with no account, no server, no subscription.',
    what: 'An iOS price tracker where the list and its history live on the phone. A background task wakes a few times a day, fetches each saved page, parses the price and appends to a local store. Nothing syncs anywhere, because there is nowhere to sync to.',
    repo: gh('keemat'),
    stars: 6,
    lang: 'Swift',
    year: '2025 - now',
    kind: 'app',
    stack: ['Swift', 'SwiftData', 'BGTaskScheduler', 'Scraping'],
    diagram: 'keemat',
    featured: true,
    shot: {
      src: '/projects/keemat/list.png',
      alt: 'The keemat tracked-item list on an iPhone, showing current prices.',
    },
  },
  {
    slug: 'noreels',
    name: 'NoReelsOnInstagram',
    tagline: 'Reverse engineering Instagram to switch reels off.',
    what: 'I wanted to know whether an iOS app I did not build could be changed from the outside. Dump the headers, find the class behind a feed item, swizzle the method that decides whether it is a reel, re-sign, install. It worked, on my own device and account.',
    repo: gh('NoReelsOnInstagram'),
    stars: 8,
    lang: 'Objective-C',
    year: '2024',
    kind: 'experiment',
    stack: ['Objective-C', 'class-dump', 'Method swizzling', 'Code signing'],
    diagram: 'noreels',
    featured: true,
    shot: {
      src: '/projects/noreels/screenshot.png',
      alt: 'Instagram running on a phone with the reels tab gone.',
    },
  },
  {
    slug: 'p2p-rps',
    name: 'P2P Rock Paper Scissors',
    tagline: 'Two phones, one game, no server in between.',
    what: 'Rock paper scissors over a direct peer connection between nearby devices. The interesting part is not the game, it is making two phones agree on a result when neither of them is in charge.',
    repo: gh('P2P-Rock-Paper-Scissor'),
    stars: 20,
    lang: 'Swift',
    year: '2024',
    kind: 'app',
    stack: ['Swift', 'MultipeerConnectivity'],
    mini: ['phone A', 'peer link', 'phone B'],
  },
  {
    slug: 'oneonone',
    name: 'OneOnOne',
    tagline: 'A video call where the server only does the introduction.',
    what: 'One-to-one video and chat in the browser. A small signalling step passes the offer and the answer between two peers, then the connection goes direct and the media never touches the server again.',
    repo: gh('OneOnOne'),
    demo: 'https://rational-kunal.github.io/OneOnOne/',
    stars: 5,
    lang: 'JavaScript',
    year: '2024 - 2026',
    kind: 'app',
    stack: ['WebRTC', 'JavaScript', 'Data channels'],
    diagram: 'oneonone',
    mini: ['browser A', 'direct link', 'browser B'],
  },
  {
    slug: 'chalchitra',
    name: 'ChalChitra',
    tagline: 'An HLS player built without AVPlayer.',
    what: 'Parse the playlist, pick a variant, pull segments, demux and decode them by hand, then hand sample buffers to a display layer. Built to find out what AVPlayer is quietly doing for you every time you use it.',
    repo: gh('ChalChitra'),
    stars: 2,
    lang: 'Swift',
    year: '2025',
    kind: 'experiment',
    stack: ['Swift', 'HLS', 'AVFoundation', 'CoreMedia'],
    diagram: 'chalchitra',
    mini: ['.m3u8', 'decode', 'display'],
  },
  {
    slug: 'sssnake',
    name: 'SSSnake',
    tagline: 'Snake, in the terminal, in Swift.',
    what: 'The game that pushed me into terminal rendering, and the reason BlinkUI exists. Game loop, input handling and a screen that redraws without flickering.',
    repo: gh('SSSnake'),
    stars: 4,
    lang: 'Swift',
    year: '2025',
    kind: 'experiment',
    stack: ['Swift', 'Terminal', 'Game loop'],
    mini: ['keypress', 'game loop', 'redraw'],
  },
  {
    slug: 'sober-meter',
    name: 'sober-meter',
    tagline: 'Are you sure you can drive?',
    what: 'A deliberately ineffective sobriety check that reads device sensors and runs a small on-device model. Useful as an excuse to learn Core ML end to end; not useful for deciding anything.',
    repo: gh('sober-meter'),
    stars: 11,
    lang: 'Swift',
    year: '2024',
    kind: 'app',
    stack: ['Swift', 'Core ML', 'Sensors'],
    shot: {
      src: '/projects/sober-meter/screenshot.png',
      alt: 'The sober-meter app mid-test on an iPhone.',
    },
  },
  {
    slug: 'picaso',
    name: 'Picaso',
    tagline: 'Draw a border by swiping, inside the app.',
    what: 'A Swift package for annotating screenshots in place: swipe to draw a box around the thing you are pointing at. Built because our team kept attaching screenshots to pull requests and marking them up elsewhere.',
    repo: gh('Picaso'),
    stars: 8,
    lang: 'Swift',
    year: '2024',
    kind: 'library',
    stack: ['Swift', 'SPM', 'UIKit'],
    mini: ['swipe', 'canvas layer', 'marked up'],
  },
  {
    slug: 'netflix-hotkeys',
    name: 'Netflix Hotkeys',
    tagline: 'Keyboard shortcuts for the Netflix player.',
    what: 'A Chrome extension that adds the shortcuts the player does not have. Mostly an exercise in working against a page you do not control and cannot rely on.',
    repo: gh('Netflix-Hotkeys'),
    stars: 10,
    lang: 'JavaScript',
    year: '2023',
    kind: 'tool',
    stack: ['Chrome extension', 'JavaScript', 'DOM'],
    mini: ['keypress', 'player API', 'seek'],
  },
  {
    slug: 'code2png',
    name: 'code2png',
    tagline: 'Paste code, get a highlighted PNG.',
    what: 'Highlight a snippet and render it to an image in the browser. No upload step, because the whole thing runs on a canvas on your machine.',
    repo: gh('code2png'),
    demo: 'https://rational-kunal.github.io/code2png/',
    stars: 4,
    lang: 'JavaScript',
    year: '2026',
    kind: 'tool',
    stack: ['JavaScript', 'Canvas', 'Syntax highlighting'],
    mini: ['paste code', 'highlight', 'png'],
  },
  {
    slug: 'list-to-checklist',
    name: 'List to Checklist',
    tagline: 'Turns every list on a page into something you can tick off.',
    what: 'A Chrome extension that rewrites list elements into checklists. Small, but it is the kind of thing I reach for constantly when reading a long how-to.',
    repo: gh('List-to-Checklist'),
    stars: 3,
    lang: 'JavaScript',
    year: '2023',
    kind: 'tool',
    stack: ['Chrome extension', 'React'],
    shot: {
      src: '/projects/list-to-checklist/screenshot.png',
      alt: 'A web page whose bullet list has been turned into tickable checkboxes.',
    },
  },
  {
    slug: 'over-engineered-snake',
    name: 'Over-engineered Snake',
    tagline: 'A js13k snake game with far too much architecture.',
    what: 'Vanilla JavaScript snake, built with the kind of structure the problem absolutely does not need. The constraint was thirteen kilobytes; the fun was seeing how much design survives it.',
    repo: gh('over-engineered-snake'),
    demo: 'https://rational-kunal.github.io/over-engineered-snake/',
    stars: 1,
    lang: 'JavaScript',
    year: '2022',
    kind: 'experiment',
    stack: ['Vanilla JS', 'js13k', 'Canvas'],
    mini: ['input', 'entities', '13 kB'],
  },
];

export const featured = projects.filter((p) => p.featured);

export function diagramFor(p: Project): Diagram | undefined {
  return p.diagram ? diagrams[p.diagram] : undefined;
}

export const kindLabel: Record<ProjectKind, string> = {
  library: 'Library',
  app: 'App',
  tool: 'Tool',
  experiment: 'Experiment',
};
