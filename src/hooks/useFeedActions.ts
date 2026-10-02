import { useCallback, useState } from 'react';
import { type Feed, loadDashboardState } from '@/storage/feedDashboard';

const DEFAULT_FEEDS = [
  'https://zenn.dev/feed',
  'https://qiita.com/popular-items/feed.atom',
  'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
] as const;

function normalizeFeed(feed: string | Partial<Feed>): Feed {
  if (typeof feed === 'string') {
    return { url: feed, title: '', color: '', group: '' };
  }
  return { title: '', color: '', group: '', ...feed, url: feed.url ?? '' };
}

export function useFeedActions() {
  const [feeds, setFeeds] = useState<Feed[]>([]);

  const loadFeeds = useCallback(async () => {
    const state = await loadDashboardState();
    const nextFeeds = state.feeds.length > 0 ? state.feeds : DEFAULT_FEEDS.map(normalizeFeed);
    setFeeds(nextFeeds);
    return nextFeeds;
  }, []);

  const addFeed = useCallback(
    (url: string) => {
      const trimmed = typeof url === 'string' ? url.trim() : '';
      if (!trimmed) return { ok: false as const, reason: 'empty' };
      try {
        new URL(trimmed);
      } catch {
        return { ok: false as const, reason: 'invalid-url' };
      }
      if (feeds.some((feed) => feed.url === trimmed)) {
        return { ok: false as const, reason: 'duplicate' };
      }
      const feed: Feed = { url: trimmed, title: '', color: '', group: '' };
      const nextFeeds = [...feeds, feed];
      setFeeds(nextFeeds);
      return { ok: true as const, feed, nextFeeds };
    },
    [feeds],
  );

  const removeFeed = useCallback(
    (url: string) => {
      const nextFeeds = feeds.filter((feed) => feed.url !== url);
      setFeeds(nextFeeds);
      return { ok: true as const, nextFeeds };
    },
    [feeds],
  );

  const updateFeed = useCallback(
    (url: string, patch: Partial<Feed>) => {
      const nextFeeds = feeds.map((feed) => (feed.url === url ? { ...feed, ...patch } : feed));
      setFeeds(nextFeeds);
      return { ok: true as const, nextFeeds };
    },
    [feeds],
  );

  const moveFeed = useCallback(
    (url: string, group: string) => {
      const nextFeeds = feeds.map((feed) => (feed.url === url ? { ...feed, group } : feed));
      setFeeds(nextFeeds);
      return { ok: true as const, nextFeeds };
    },
    [feeds],
  );

  return {
    feeds,
    setFeeds,
    loadFeeds,
    addFeed,
    removeFeed,
    updateFeed,
    moveFeed,
  };
}
