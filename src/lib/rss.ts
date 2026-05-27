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
    id: 'ircc',
    title: 'IRCC Newsroom',
    siteUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/news.html',
    feedUrl:
      'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-07-23&pick=50&format=atom&atomtitle=Immigration,%20Refugees%20and%20Citizenship%20Canada',
  },
  {
    id: 'google-humanitarian-visa',
    title: 'Google News: Humanitarian Visa',
    siteUrl: 'https://news.google.com',
    feedUrl:
      'https://news.google.com/rss/search?q=humanitarian+visa+OR+asylum+policy&hl=en-US&gl=US&ceid=US:en',
  },
  {
    id: 'google-refugee-immigration',
    title: 'Google News: Refugee Immigration',
    siteUrl: 'https://news.google.com',
    feedUrl:
      'https://news.google.com/rss/search?q=refugee+resettlement+immigration&hl=en-US&gl=US&ceid=US:en',
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
