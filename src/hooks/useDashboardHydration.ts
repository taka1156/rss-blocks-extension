import { useEffect } from 'react';
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

export function useDashboardHydration(
  setSideOpen: (value: boolean) => void,
  loadGroups: (
    groups: { id: string; title: string; color: string; collapsed: boolean }[],
  ) => unknown,
  loadShortcuts: (shortcuts: { url: string }[]) => unknown,
  setFeeds: (feeds: Feed[]) => void,
) {
  useEffect(() => {
    void (async () => {
      const state = await loadDashboardState();
      setSideOpen(state.sideOpen);
      loadGroups(state.groups);
      loadShortcuts(state.shortcuts);
      const nextFeeds = state.feeds.length > 0 ? state.feeds : DEFAULT_FEEDS.map(normalizeFeed);
      setFeeds(nextFeeds);
    })();
  }, [loadGroups, loadShortcuts, setFeeds, setSideOpen]);
}
