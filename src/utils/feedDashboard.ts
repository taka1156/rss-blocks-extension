import type { Feed } from '@/storage/feedDashboard';

export type FeedItem = {
  title: string;
  link: string;
  date: string;
  thumb: string;
  audio: string;
};

const MAX_ITEMS = 15;

function text(el: ParentNode | null | undefined, selector: string): string {
  return el?.querySelector(selector)?.textContent?.trim() ?? '';
}

function findThumb(node: Element, base: string): string {
  const attr = (tag: string, name: string) => node.getElementsByTagName(tag)[0]?.getAttribute(name);
  let url = attr('media:thumbnail', 'url') || attr('itunes:image', 'href');
  if (!url) {
    const mediaContent = node.getElementsByTagName('media:content')[0];
    const type = mediaContent?.getAttribute('type') || mediaContent?.getAttribute('medium') || '';
    if (mediaContent && !type.startsWith('video')) {
      url = mediaContent.getAttribute('url') || '';
    }
  }
  if (!url) {
    for (const el of node.querySelectorAll("enclosure, link[rel='enclosure']")) {
      const type = el.getAttribute('type') || '';
      if (type.startsWith('image')) {
        url = el.getAttribute('url') || el.getAttribute('href') || '';
        break;
      }
    }
  }
  if (!url) {
    for (const tag of ['content:encoded', 'description', 'content', 'summary']) {
      const match = (node.getElementsByTagName(tag)[0]?.textContent || '').match(
        /<img[^>]+src=["']([^"']+)["']/i,
      );
      if (match) {
        url = match[1];
        break;
      }
    }
  }
  if (!url) return '';
  try {
    return new URL(url, base).href;
  } catch {
    return '';
  }
}

function findAudio(node: Element, base: string): string {
  const isAudio = (type: string, url: string) =>
    type.startsWith('audio') || /\.(mp3|m4a|aac|ogg|oga|wav)(\?|$)/i.test(url);
  const candidates = [
    ...node.querySelectorAll("enclosure, link[rel='enclosure']"),
    ...Array.from(node.getElementsByTagName('media:content')),
  ];
  for (const el of candidates) {
    const url = el.getAttribute('url') || el.getAttribute('href') || '';
    if (url && isAudio(el.getAttribute('type') || '', url)) {
      try {
        return new URL(url, base).href;
      } catch {
        // ignore invalid URL candidates
      }
    }
  }
  return '';
}

export function parseFeed(xml: string, base: string): { title: string; items: FeedItem[] } {
  if (typeof DOMParser === 'undefined') {
    const title = (() => {
      const match = xml.match(/<(?:channel|feed)[\s\S]*?<title>([\s\S]*?)<\/title>/i)?.[1];
      if (!match) return '(無題)';
      return match.replace(/<[^>]+>/g, '').trim() || '(無題)';
    })();
    const items: FeedItem[] = [];
    const itemMatches = xml.matchAll(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/gi);

    for (const match of itemMatches) {
      const itemXml = match[0];
      const link =
        itemXml.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ||
        itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ||
        '';
      const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
      const titleText = titleMatch ? titleMatch.replace(/<[^>]+>/g, '').trim() || link : link;
      const dateMatch = itemXml.match(
        /<(?:pubDate|published|updated)\b[^>]*>([\s\S]*?)<\/(?:pubDate|published|updated)>/i,
      )?.[1];
      const date = dateMatch ? dateMatch.trim() : '';
      const thumbMatch =
        itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*>/i) ||
        itemXml.match(/<itunes:image[^>]*href=["']([^"']+)["'][^>]*>/i) ||
        itemXml.match(
          /<enclosure[^>]*type=["'][^"']*image[^"']*["'][^>]*url=["']([^"']+)["'][^>]*>/i,
        ) ||
        itemXml.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      const thumbUrl = thumbMatch?.[1];
      const audioUrl = [...itemXml.matchAll(/<(?:enclosure|media:content)\b[^>]*>/gi)]
        .map(([tag]) => {
          const url = tag.match(/\burl=["']([^"']+)["']/i)?.[1] ?? '';
          const type = tag.match(/\btype=["']([^"']+)["']/i)?.[1] ?? '';
          return type.startsWith('audio') || /\.(mp3|m4a|aac|ogg|oga|wav)(\?|$)/i.test(url)
            ? url
            : '';
        })
        .find(Boolean);
      let audio = '';
      if (audioUrl) {
        try {
          audio = new URL(audioUrl, base).href;
        } catch {
          // Ignore malformed enclosure URLs.
        }
      }

      items.push({
        title: titleText,
        link,
        date,
        thumb: thumbUrl ? new URL(thumbUrl, base).href : '',
        audio,
      });
      if (items.length >= MAX_ITEMS) break;
    }

    return { title, items };
  }

  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('XMLを解析できません');
  const root = doc.querySelector('channel') || doc.querySelector('feed') || doc.documentElement;
  const title = text(doc, 'channel > title') || text(doc, 'feed > title') || '(無題)';
  const resolve = (url: string) => {
    try {
      return url ? new URL(url, base).href : '';
    } catch {
      return '';
    }
  };
  const direct = (name: string) => [...root.children].find((child) => child.tagName === name);
  const channelImage = resolve(
    text(doc, 'channel > image > url') ||
      direct('itunes:image')?.getAttribute('href') ||
      direct('media:thumbnail')?.getAttribute('url') ||
      text(doc, 'feed > logo') ||
      text(doc, 'feed > icon'),
  );
  const items = [...doc.querySelectorAll('item, entry')].slice(0, MAX_ITEMS).map((node) => {
    const linkEl = [...node.querySelectorAll('link')].find(
      (element) => !element.getAttribute('rel') || element.getAttribute('rel') === 'alternate',
    );
    const guidElement = node.querySelector('guid');
    const guid =
      guidElement?.getAttribute('isPermaLink') === 'false' ? '' : (guidElement?.textContent ?? '');
    const rawLink = linkEl?.getAttribute('href') || linkEl?.textContent.trim() || guid.trim();
    const link = (() => {
      try {
        return rawLink ? new URL(rawLink, base).href : '';
      } catch {
        return '';
      }
    })();
    const date = text(node, 'pubDate') || text(node, 'published') || text(node, 'updated');
    return {
      title: text(node, 'title') || link,
      link,
      date,
      thumb: findThumb(node, base) || channelImage,
      audio: findAudio(node, base),
    };
  });
  return { title, items };
}

export function formatFeedDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' });
}

export function createFeedItem(
  item: FeedItem,
  key: string,
  options: {
    onOpenArticle: (nextTitle: string, nextUrl: string) => void;
    onPlayAudio: (nextTitle: string, nextUrl: string) => void;
    isSideOpen: () => boolean;
  },
): HTMLElement {
  const li = document.createElement('li');
  (li as HTMLElement & { _itemKey?: string })._itemKey = key;
  if (item.thumb) {
    const thumbLink = document.createElement('a');
    thumbLink.className = 'thumb-link';
    const image = new Image();
    image.className = 'thumb';
    image.alt = '';
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => thumbLink.remove());
    image.src = item.thumb;
    thumbLink.append(image);
    bindFeedLink(thumbLink, item, options);
    li.append(thumbLink);
  }
  const body = document.createElement('div');
  body.className = 'item-body';
  const label = document.createElement('span');
  label.className = 'article-reading-label';
  label.textContent = '閲覧中';
  label.hidden = true;
  const link = document.createElement('a');
  link.textContent = item.title;
  bindFeedLink(link, item, options, label);
  const time = document.createElement('time');
  time.textContent = formatFeedDate(item.date);
  body.append(link, label, time);
  if (item.audio) {
    const button = document.createElement('button');
    button.className = 'play';
    button.textContent = '▶';
    button.title = '再生';
    button.setAttribute('aria-label', '再生');
    button.addEventListener('click', () => options.onPlayAudio(item.title, item.audio));
    body.append(button);
  }
  li.append(body);
  return li;
}

function bindFeedLink(
  anchor: HTMLAnchorElement,
  item: Pick<FeedItem, 'link' | 'title'>,
  options: {
    onOpenArticle: (nextTitle: string, nextUrl: string) => void;
    onPlayAudio: (nextTitle: string, nextUrl: string) => void;
    isSideOpen: () => boolean;
  },
  label?: HTMLElement,
): void {
  anchor.href = item.link;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.addEventListener('click', (event) => {
    if (
      !options.isSideOpen() ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    event.preventDefault();
    if (label) label.hidden = false;
    options.onOpenArticle(item.title || item.link, item.link);
  });
}

export function createDefaultFeedBlock(feed: Feed): HTMLElement {
  const block = document.createElement('section');
  block.className = 'block';
  (block as HTMLElement & { _feed?: Feed })._feed = feed;
  if (feed.color) block.style.borderColor = feed.color;

  const blockHead = document.createElement('div');
  blockHead.className = 'block-head';

  const handle = document.createElement('span');
  handle.className = 'handle';
  handle.title = 'ドラッグして移動';
  handle.textContent = '⠿';

  const titleWrap = document.createElement('h2');
  const titleEl = document.createElement('span');
  titleEl.textContent = feed.title || feed.url;
  const small = document.createElement('small');
  small.textContent = feed.url;
  titleWrap.append(titleEl, small);

  const actions = document.createElement('div');
  actions.className = 'actions';
  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'icon edit';
  editButton.title = '編集';
  editButton.textContent = '✎';
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'icon remove';
  removeButton.title = '削除';
  removeButton.textContent = '×';
  actions.append(editButton, removeButton);

  blockHead.append(handle, titleWrap, actions);

  const status = document.createElement('div');
  status.className = 'status';
  status.textContent = '読み込み中…';

  block.append(blockHead, status);
  return block;
}
