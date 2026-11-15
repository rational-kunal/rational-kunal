import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Writing - one markdown file per article in src/content/writing/.
 * Drop a new .md in with this front matter and it appears everywhere:
 * the index, the home page, the RSS feed and the sitemap.
 */
const writing = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!_*.md'], base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Minutes. Left over from dev.to; omit and it is estimated from the body. */
    readingTime: z.number().optional(),
    /** Set when the piece also lives on dev.to, so the article can link back. */
    devto: z.string().url().optional(),
    /** Set when AI helped write the piece, so the byline says so. */
    ai: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/**
 * Notes - short release notes and announcements about the libraries.
 * Much lighter than an article: a title, a date, and a few lines.
 */
const notes = defineCollection({
  // The leading-underscore exclusion is what keeps _template.md unpublished.
  loader: glob({ pattern: ['**/*.md', '!_*.md'], base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** A `slug` from src/data/projects.ts, so the note can badge itself. */
    project: z.string().optional(),
    /** e.g. "0.4.0". Omit for anything that is not a release. */
    version: z.string().optional(),
    /** Release page, PR or issue this note points at. */
    link: z.string().url().optional(),
  }),
});

export const collections = { writing, notes };
