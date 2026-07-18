export type RssFeedSource = {
  id: string;
  title: string;
  siteUrl: string;
  feedUrl: string;
};

export type RssNewsItem = {
  id: string;
  sourceId: string;
  sourceTitle: string;
  title: string;
  link: string;
  pubDate: string;
  isoDate: string;
  summary: string;
};

export const rssSources: RssFeedSource[] = [
  {
    id: 'hackernews',
    title: 'Hacker News',
    siteUrl: 'https://news.ycombinator.com',
    feedUrl: 'https://hnrss.org/frontpage',
  },
  {
    id: 'devto',
    title: 'Dev.to',
    siteUrl: 'https://dev.to',
    feedUrl: 'https://dev.to/feed',
  },
  {
    id: 'google-tech',
    title: 'Google News: Technology',
    siteUrl: 'https://news.google.com',
    feedUrl:
      'https://news.google.com/rss/search?q=technology+web+development+react&hl=en-US&gl=US&ceid=US:en',
  },
  {
    id: 'github-trending',
    title: 'GitHub Trending',
    siteUrl: 'https://github.com/trending',
    feedUrl:
      'https://news.google.com/rss/search?q=github+trending+open+source&hl=en-US&gl=US&ceid=US:en',
  },
  {
    id: 'css-tricks',
    title: 'CSS-Tricks',
    siteUrl: 'https://css-tricks.com',
    feedUrl: 'https://css-tricks.com/feed/',
  },
];

type Rss2JsonItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
};

type Rss2JsonResponse = {
  status?: string;
  items?: Rss2JsonItem[];
};

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

const cleanSummary = (text: string) =>
  text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export async function fetchRssNews(limitPerSource = 6): Promise<RssNewsItem[]> {
  const responses = await Promise.all(
    rssSources.map(async (source) => {
      const endpoint = `${RSS2JSON_API}${encodeURIComponent(source.feedUrl)}`;
      const res = await fetch(endpoint);
      if (!res.ok) return [] as RssNewsItem[];
      const data = (await res.json()) as Rss2JsonResponse;
      if (data.status !== 'ok' || !data.items) return [] as RssNewsItem[];

      return data.items.slice(0, limitPerSource).map((item, index) => {
        const fallbackDate = new Date().toISOString();
        const isoDate = item.pubDate ? new Date(item.pubDate).toISOString() : fallbackDate;
        return {
          id: `${source.id}-${index}-${item.link ?? item.title ?? 'item'}`,
          sourceId: source.id,
          sourceTitle: source.title,
          title: item.title?.trim() || 'Untitled',
          link: item.link || source.siteUrl,
          pubDate: item.pubDate || '',
          isoDate,
          summary: cleanSummary(item.description || ''),
        };
      });
    })
  );

  const merged = responses.flat();
  const deduped = merged.filter(
    (item, index, arr) => arr.findIndex((x) => x.link === item.link) === index
  );

  return deduped.sort((a, b) => +new Date(b.isoDate) - +new Date(a.isoDate));
}
