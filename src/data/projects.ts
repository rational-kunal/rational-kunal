/**
 * Every project, in one list. The Work section, the scenes at the top of the
 * page and the article pages all read from here.
 */
import { site } from './site';

export type Project = {
  slug: string;
  name: string;
  /** One line. What it is, not why it is great. */
  tagline: string;
  /** Two or three sentences, shown on the small cards. Plain language. */
  what: string;
  repo: string;
  demo?: string;
  /** Star count, read from the GitHub API. See README for the refresh command. */
  stars: number;
  stack: string[];
  /** A big card at the top of Work, with its drawing from src/data/diagrams.ts. */
  featured?: boolean;
  /** A real screenshot, pulled from the project's own repo into public/projects/<slug>/. */
  shot?: {
    src: string;
    /** Shown instead of `src` when there is one: the site is dark only. */
    dark?: string;
    alt: string;
    /** For an animated src (a GIF): a still shown instead under reduced motion. */
    still?: string;
  };
  /**
   * Three short steps: the stand-in picture for a project with no drawing or
   * no screenshot. Keep each one under about twelve characters.
   */
  mini?: [string, string, string];
  /** Slug of an article in src/content/writing about this project. Linked both ways. */
  article?: string;
};

const gh = (repo: string) => `https://github.com/${site.handle}/${repo}`;

export const projects: Project[] = [
  {
    slug: 'neobrutalism',
    name: 'NeoBrutalism',
    tagline: 'A SwiftUI component set with hard edges and no blur.',
    what: 'Buttons, cards, toggles and inputs in the neo-brutalist style, as a Swift package you add and use. The look comes from a single view modifier: a solid offset shape standing in for the shadow and a hard stroke on top, so every component composes the same way.',
    repo: gh('NeoBrutalism'),
    stars: 149,
    stack: ['Swift 6', 'SwiftUI', 'iOS 17+', 'SPM', 'Snapshot tests'],
    featured: true,
    shot: {
      src: '/projects/neobrutalism/gallery.png',
      dark: '/projects/neobrutalism/gallery-dark.png',
      alt: 'The NeoBrutalism component gallery: buttons, cards and inputs with hard offset shadows.',
    },
    mini: ['your view', 'hard shadow', 'component'],
  },
  {
    slug: 'blinkui',
    name: 'BlinkUI',
    tagline: 'SwiftUI, but it renders into a terminal.',
    what: 'A declarative UI framework for the terminal. You write a view tree the way you would in SwiftUI; it diffs against the last frame and writes only the cells that changed as ANSI escapes. State changes invalidate the tree and the loop runs again.',
    repo: gh('BlinkUI'),
    stars: 95,
    stack: ['Swift 6', 'macOS 14+', 'ANSI', 'Diffing'],
    featured: true,
    shot: {
      src: '/projects/blinkui/demo.png',
      alt: 'BlinkUI running in a terminal window: a line of text above two buttons, Blue pill and Red pill, with Blue pill focused.',
    },
    mini: ['view tree', 'diff', 'terminal'],
    article: 'snake-game-in-the-terminal',
  },
  {
    slug: 'keemat',
    name: 'keemat',
    tagline: 'Price tracking with no account, no server, no subscription.',
    what: 'An iOS price tracker where the list and its history live on the phone. A background task wakes a few times a day, fetches each saved page, parses the price and appends to a local store. Nothing syncs anywhere, because there is nowhere to sync to.',
    repo: gh('keemat'),
    stars: 6,
    stack: ['Swift', 'SwiftData', 'BGTaskScheduler', 'Scraping'],
    featured: true,
    shot: {
      src: '/projects/keemat/list.png',
      alt: 'The keemat tracked-item list on an iPhone, showing current prices.',
    },
    mini: ['wake up', 'fetch price', 'local store'],
  },
  {
    slug: 'noreels',
    name: 'NoReelsOnInstagram',
    tagline: 'Reverse engineering Instagram to switch reels off.',
    what: 'I wanted to know whether an iOS app I did not build could be changed from the outside. Dump the headers, find the class behind a feed item, swizzle the method that decides whether it is a reel, re-sign, install. It worked, on my own device and account.',
    repo: gh('NoReelsOnInstagram'),
    stars: 8,
    stack: ['Objective-C', 'class-dump', 'Method swizzling', 'Code signing'],
    featured: true,
    shot: {
      src: '/projects/noreels/demo.gif',
      still: '/projects/noreels/screenshot.png',
      alt: 'Instagram on an iPhone: scrolling the feed into a reel brings up a "Bhai kya kar raha hai tu?" meme instead of the reel.',
    },
    mini: ['dump headers', 'swizzle', 're-sign'],
    article: 'unreel-your-instagram',
  },
  {
    slug: 'p2p-rps',
    name: 'P2P Rock Paper Scissors',
    tagline: 'Two phones, one game, no server in between.',
    what: 'Rock paper scissors over a direct peer connection between nearby devices. The interesting part is not the game, it is making two phones agree on a result when neither of them is in charge.',
    repo: gh('P2P-Rock-Paper-Scissor'),
    stars: 20,
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
    stack: ['WebRTC', 'JavaScript', 'Data channels'],
    mini: ['browser A', 'direct link', 'browser B'],
  },
  {
    slug: 'chalchitra',
    name: 'ChalChitra',
    tagline: 'An HLS player built without AVPlayer.',
    what: 'Parse the playlist, pick a variant, pull segments, demux and decode them by hand, then hand sample buffers to a display layer. Built to find out what AVPlayer is quietly doing for you every time you use it.',
    repo: gh('ChalChitra'),
    stars: 2,
    stack: ['Swift', 'HLS', 'AVFoundation', 'CoreMedia'],
    mini: ['.m3u8', 'decode', 'display'],
  },
  {
    slug: 'sssnake',
    name: 'SSSnake',
    tagline: 'Snake, in the terminal, in Swift.',
    what: 'The game that pushed me into terminal rendering, and the reason BlinkUI exists. Game loop, input handling and a screen that redraws without flickering.',
    repo: gh('SSSnake'),
    stars: 4,
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
    stack: ['Vanilla JS', 'js13k', 'Canvas'],
    mini: ['input', 'entities', '13 kB'],
  },
];

const bySlug = new Map(projects.map((p) => [p.slug, p]));
export const findProject = (slug: string): Project | undefined => bySlug.get(slug);

/** Where a project is read in full: its card in the Work section. */
export const projectHref = (p: Project): string => `/#${p.slug}`;
