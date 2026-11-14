import rss from '@astrojs/rss';
import { site } from '@/data/site';
import { getPosts } from '@/lib/content';
import { url } from '@/lib/url';

export async function GET() {
  return rss({
    title: `${site.name} - writing`,
    description: site.description,
    site: import.meta.env.SITE,
    items: (await getPosts()).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      categories: post.data.tags,
      link: url(`/writing/${post.id}`),
    })),
    customData: `<language>${site.locale}</language>`,
  });
}
