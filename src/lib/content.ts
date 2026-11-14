/**
 * Every query over src/content goes through here, so "published" and
 * "newest first" are decided in one place.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

/** Every published article, newest first. Drafts never get past this. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

/** Minutes to read: the front-matter value when set, else ~200 words a minute. */
export function minutesOf(post: Post): number {
  const words = (post.body ?? '').trim().split(/\s+/).length;
  return post.data.readingTime ?? Math.max(1, Math.round(words / 200));
}

/**
 * The latest release notes, newest first. Asking Astro for an empty
 * collection prints a warning on every build, so it is only asked once a
 * real note exists. _template.md does not count.
 */
export async function getNotes(limit = 3): Promise<CollectionEntry<'notes'>[]> {
  const files = Object.keys(import.meta.glob('/src/content/notes/*.md'));
  if (!files.some((f) => !f.split('/').pop()!.startsWith('_'))) return [];
  const notes = await getCollection('notes');
  return notes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()).slice(0, limit);
}
