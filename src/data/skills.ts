/**
 * Skills, grouped by how deep they actually go.
 * Three bands, because "a wall of 40 logos" tells a reader nothing.
 */

export type SkillBand = {
  id: string;
  heading: string;
  note: string;
  items: string[];
};

export const skills: SkillBand[] = [
  {
    id: 'core',
    heading: 'Where I go deep',
    note: 'Shipped, debugged at 2am, and argued about in review.',
    items: [
      'Swift', 'SwiftUI', 'UIKit', 'Objective-C',
      'Swift Package Manager', 'XCTest + snapshot testing',
      'Instruments', 'LLDB', 'AVFoundation', 'Core ML',
    ],
  },
  {
    id: 'working',
    heading: 'Where I am productive',
    note: 'Enough to build the whole thing and keep it maintainable.',
    items: [
      'TypeScript', 'React', 'Node', 'Astro',
      'Python', 'WebRTC', 'Chrome extensions', 'HTML + CSS',
    ],
  },
  {
    id: 'curious',
    heading: 'Where I keep poking',
    note: 'Side projects live here before they become anything.',
    items: [
      'Terminal UI + ANSI', 'Reverse engineering', 'HLS and video pipelines',
      'C and threading', 'Web scraping', 'Game loops',
    ],
  },
];
