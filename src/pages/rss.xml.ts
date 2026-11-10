import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '@/data/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());

  return rss({
    title: `${site.name} - writing`,
    description: site.description,
    site: context.site ?? 'https://rational-kunal.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      categories: post.data.tags,
      link: `/writing/${post.id}`,
    })),
    customData: '<language>en</language>',
  });
}
