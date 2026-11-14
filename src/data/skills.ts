/**
 * Skills, grouped by how deep they actually go.
 * Three bands, because "a wall of 40 logos" tells a reader nothing.
 *
 * `icon` is a Phosphor Light name. Where the real logo exists in Simple Icons
 * it is used instead (`brand: true`, slug from simpleicons.org). Anything
 * without a logo of its own (SwiftUI, Core ML, ...) gets a plain glyph.
 */
export type Skill = {
  label: string;
  /** Phosphor Light name, or a Simple Icons slug when `brand` is set. */
  icon: string;
  brand?: boolean;
};

export type SkillBand = {
  heading: string;
  note: string;
  items: Skill[];
};

export const skills: SkillBand[] = [
  {
    heading: 'Where I go deep',
    note: 'Shipped, debugged at 2am, and argued about in review.',
    items: [
      { label: 'Swift', icon: 'swift', brand: true },
      { label: 'SwiftUI', icon: 'app-window' },
      { label: 'UIKit', icon: 'device-mobile' },
      { label: 'Objective-C', icon: 'apple', brand: true },
      { label: 'Swift Package Manager', icon: 'package' },
      { label: 'XCTest + snapshot testing', icon: 'test-tube' },
      { label: 'Instruments', icon: 'gauge' },
      { label: 'LLDB', icon: 'llvm', brand: true },
      { label: 'AVFoundation', icon: 'film-strip' },
      { label: 'Core ML', icon: 'brain' },
    ],
  },
  {
    heading: 'Where I am productive',
    note: 'Enough to build the whole thing and keep it maintainable.',
    items: [
      { label: 'TypeScript', icon: 'typescript', brand: true },
      { label: 'React', icon: 'react', brand: true },
      { label: 'Node', icon: 'nodedotjs', brand: true },
      { label: 'Astro', icon: 'astro', brand: true },
      { label: 'Python', icon: 'python', brand: true },
      { label: 'WebRTC', icon: 'webrtc', brand: true },
      { label: 'Chrome extensions', icon: 'googlechrome', brand: true },
      { label: 'HTML + CSS', icon: 'html5', brand: true },
    ],
  },
  {
    heading: 'Where I keep poking',
    note: 'Side projects live here before they become anything.',
    items: [
      { label: 'Terminal UI + ANSI', icon: 'terminal-window' },
      { label: 'Reverse engineering', icon: 'magnifying-glass' },
      { label: 'HLS and video pipelines', icon: 'video' },
      { label: 'C and threading', icon: 'c', brand: true },
      { label: 'Web scraping', icon: 'globe-hemisphere-west' },
      { label: 'Game loops', icon: 'game-controller' },
    ],
  },
];
