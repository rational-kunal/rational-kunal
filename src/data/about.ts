/**
 * The about page, in prose.
 *
 * Everything here is written from things that are already public: the repos,
 * the articles, the libraries. The one gap is marked below, because only you
 * know the answer and nothing should guess it for you.
 */

export const about = {
  /* TODO - one honest sentence about where you are right now.
     Something like: "I work on the iOS app at <company>, where I own <area>."
     Set it to null and the paragraph is simply left out. */
  current: null as string | null,

  paragraphs: [
    'I started where a lot of people start on iOS: making an app do a thing. Then I wanted to know why it did the thing, and that question has not stopped since. It is how a snake game in a terminal turned into a declarative UI framework, and how being annoyed at Instagram turned into an afternoon with class-dump.',
    'The label on my work says iOS, and that is honestly where I am deepest: Swift, the frameworks, the debugger, the parts of UIKit nobody reads about until something breaks. But the problems I enjoy rarely stay inside one runtime. A price tracker needs a scraper. A video player needs you to know what a transport stream is. A better pull request needs a browser extension. So I follow them out.',
    'I write things down as I go, usually because I had to work something out twice before it stuck. Most of what is here started as a note to myself. If a project has a drawing on this site, it is because the shape of the thing is the explanation, and a paragraph was doing a worse job of it.',
  ],
} as const;
