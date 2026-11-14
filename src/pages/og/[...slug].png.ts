/**
 * One social card per page that can be shared: /og/index.png for the home
 * page, /og/writing/<slug>.png for each article. Built once, at build time.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { site } from '@/data/site';
import { getPosts, minutesOf } from '@/lib/content';
import { fmtDate } from '@/lib/dates';
import { renderCard, type Card } from '@/lib/og';

export const getStaticPaths = (async () => [
  {
    params: { slug: 'index' },
    props: { kicker: site.role, title: site.name, body: site.description, big: true } satisfies Card,
  },
  ...(await getPosts()).map((post) => ({
    params: { slug: `writing/${post.id}` },
    props: {
      kicker: `${fmtDate(post.data.published)}, ${minutesOf(post)} min read`,
      title: post.data.title,
      body: post.data.description,
    } satisfies Card,
  })),
]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderCard(props as Card), {
    headers: { 'Content-Type': 'image/png' },
  });
