import { parseFeed as parseFeedXml } from 'feedsmith';

export type FeedItem = {
  title: string;
  link: string;
  date: string;
  thumb: string;
  audio: string;
};

const MAX_ITEMS = 15;

type Media = { url?: string; type?: string; medium?: string };
type Loose = {
  title?: string | { value?: string };
  link?: string;
  url?: string;
  links?: { href?: string; rel?: string; type?: string }[];
  guid?: { value?: string; isPermaLink?: boolean };
  id?: string;
  pubDate?: string;
  published?: string;
  updated?: string;
  date_published?: string;
  dc?: { dates?: string[]; date?: string };
  description?: string;
  summary?: string | { value?: string };
  content?: string | { value?: string; encoded?: string };
  content_html?: string;
  image?: string | { url?: string };
  logo?: string;
  icon?: string;
  enclosures?: Media[];
  attachments?: { url?: string; mime_type?: string }[];
  media?: { thumbnails?: Media[]; contents?: Media[] };
  itunes?: { image?: string };
  items?: Loose[];
  entries?: Loose[];
};

const AUDIO_URL = /\.(mp3|m4a|aac|ogg|oga|wav)(\?|$)/i;

function str(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object' && 'value' in value) return str(value.value);
  return '';
}

function resolveUrl(url: string | undefined, base: string): string {
  try {
    return url ? new URL(url, base).href : '';
  } catch {
    return '';
  }
}

function enclosuresOf(item: Loose): { url: string; type: string }[] {
  const list: { url: string; type: string }[] = [];
  for (const e of item.enclosures ?? []) list.push({ url: e.url ?? '', type: e.type ?? '' });
  for (const l of item.links ?? []) {
    if (l.rel === 'enclosure') list.push({ url: l.href ?? '', type: l.type ?? '' });
  }
  for (const a of item.attachments ?? []) list.push({ url: a.url ?? '', type: a.mime_type ?? '' });
  return list;
}

function findThumb(item: Loose, base: string): string {
  const content = item.media?.contents?.find((c) => {
    const type = c.type || c.medium || '';
    return c.url && !type.startsWith('video');
  });
  let url =
    item.media?.thumbnails?.[0]?.url ||
    item.itunes?.image ||
    content?.url ||
    enclosuresOf(item).find((e) => e.type.startsWith('image'))?.url ||
    '';
  if (!url) {
    const html = [item.content, item.description, item.summary, item.content_html]
      .map((v) => (v && typeof v === 'object' && 'encoded' in v ? v.encoded : str(v)))
      .join('\n');
    url = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? '';
  }
  return resolveUrl(url, base);
}

function findAudio(item: Loose, base: string): string {
  const candidates = [
    ...enclosuresOf(item),
    ...(item.media?.contents ?? []).map((c) => ({ url: c.url ?? '', type: c.type ?? '' })),
  ];
  for (const { url, type } of candidates) {
    if (url && (type.startsWith('audio') || AUDIO_URL.test(url))) {
      const resolved = resolveUrl(url, base);
      if (resolved) return resolved;
    }
  }
  return '';
}

function findLink(item: Loose, base: string): string {
  const alternate = item.links?.find((l) => !l.rel || l.rel === 'alternate')?.href;
  const guid = item.guid?.isPermaLink === false ? '' : str(item.guid?.value);
  return resolveUrl(alternate || item.link || item.url || guid, base);
}

export function parseFeed(xml: string, base: string): { title: string; items: FeedItem[] } {
  let parsed: ReturnType<typeof parseFeedXml>;
  try {
    parsed = parseFeedXml(xml);
  } catch {
    throw new Error('XMLを解析できません');
  }
  const feed = parsed.feed as Loose;
  const channelImage = resolveUrl(
    str(typeof feed.image === 'string' ? feed.image : feed.image?.url) ||
      feed.itunes?.image ||
      feed.media?.thumbnails?.[0]?.url ||
      feed.logo ||
      feed.icon,
    base,
  );
  const items = (feed.items ?? feed.entries ?? []).slice(0, MAX_ITEMS).map((item) => {
    const link = findLink(item, base);
    return {
      title: str(item.title) || link,
      link,
      date:
        item.pubDate ||
        item.published ||
        item.updated ||
        item.date_published ||
        item.dc?.dates?.[0] ||
        item.dc?.date ||
        '',
      thumb: findThumb(item, base) || channelImage,
      audio: findAudio(item, base),
    };
  });
  return { title: str(feed.title) || '(無題)', items };
}

export function formatFeedDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' });
}
