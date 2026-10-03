import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loadDashboardState } = vi.hoisted(() => ({ loadDashboardState: vi.fn() }));
vi.mock('@/storage/feedDashboard', () => ({ loadDashboardState }));

import { useDashboardHydration } from './useDashboardHydration';

const setup = () => {
  const setSideOpen = vi.fn();
  const loadGroups = vi.fn();
  const loadShortcuts = vi.fn();
  const setFeeds = vi.fn();
  renderHook(() => useDashboardHydration(setSideOpen, loadGroups, loadShortcuts, setFeeds));
  return { setSideOpen, loadGroups, loadShortcuts, setFeeds };
};

describe('useDashboardHydration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('applies stored state', async () => {
    const feeds = [{ url: 'https://a.test', title: 'A', color: '', group: '' }];
    const groups = [{ id: 'g', title: 'G', color: '', collapsed: false }];
    const shortcuts = [{ url: 'https://s.test' }];
    loadDashboardState.mockResolvedValue({ feeds, groups, shortcuts, sideOpen: false });
    const m = setup();
    await waitFor(() => expect(m.setFeeds).toHaveBeenCalledWith(feeds));
    expect(m.setSideOpen).toHaveBeenCalledWith(false);
    expect(m.loadGroups).toHaveBeenCalledWith(groups);
    expect(m.loadShortcuts).toHaveBeenCalledWith(shortcuts);
  });

  it('falls back to default feeds when none are stored', async () => {
    loadDashboardState.mockResolvedValue({
      feeds: [],
      groups: [],
      shortcuts: [],
      sideOpen: true,
    });
    const m = setup();
    await waitFor(() => expect(m.setFeeds).toHaveBeenCalled());
    const feeds = m.setFeeds.mock.calls[0]?.[0];
    expect(feeds.map((f: { url: string }) => f.url)).toEqual([
      'https://zenn.dev/feed',
      'https://qiita.com/popular-items/feed.atom',
      'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
    ]);
    expect(feeds[0]).toEqual({ url: 'https://zenn.dev/feed', title: '', color: '', group: '' });
  });
});
