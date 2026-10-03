import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loadDashboardState } = vi.hoisted(() => ({ loadDashboardState: vi.fn() }));
vi.mock('@/storage/feedDashboard', () => ({ loadDashboardState }));

import { useFeedActions } from './useFeedActions';

const feed = (url: string, extra = {}) => ({ url, title: '', color: '', group: '', ...extra });

describe('useFeedActions', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('loadFeeds', () => {
    it('loads stored feeds', async () => {
      const stored = [feed('https://a.test')];
      loadDashboardState.mockResolvedValue({ feeds: stored });
      const { result } = renderHook(() => useFeedActions());
      await act(async () => {
        await result.current.loadFeeds();
      });
      expect(result.current.feeds).toEqual(stored);
    });

    it('uses default feeds when storage is empty', async () => {
      loadDashboardState.mockResolvedValue({ feeds: [] });
      const { result } = renderHook(() => useFeedActions());
      await act(async () => {
        await result.current.loadFeeds();
      });
      expect(result.current.feeds).toHaveLength(3);
      expect(result.current.feeds[0]).toEqual(feed('https://zenn.dev/feed'));
    });
  });

  describe('addFeed', () => {
    it.each([
      ['', 'empty'],
      ['   ', 'empty'],
      ['not a url', 'invalid-url'],
    ])('rejects %j as %s', (input, reason) => {
      const { result } = renderHook(() => useFeedActions());
      expect(result.current.addFeed(input)).toEqual({ ok: false, reason });
      expect(result.current.feeds).toEqual([]);
    });

    it('rejects non-string input as empty', () => {
      const { result } = renderHook(() => useFeedActions());
      expect(result.current.addFeed(undefined as unknown as string)).toEqual({
        ok: false,
        reason: 'empty',
      });
    });

    it('adds a trimmed feed', () => {
      const { result } = renderHook(() => useFeedActions());
      let res: ReturnType<typeof result.current.addFeed> | undefined;
      act(() => {
        res = result.current.addFeed('  https://a.test/feed  ');
      });
      expect(res).toMatchObject({ ok: true, feed: feed('https://a.test/feed') });
      expect(result.current.feeds).toEqual([feed('https://a.test/feed')]);
    });

    it('rejects duplicates', () => {
      const { result } = renderHook(() => useFeedActions());
      act(() => {
        result.current.addFeed('https://a.test');
      });
      expect(result.current.addFeed('https://a.test')).toEqual({ ok: false, reason: 'duplicate' });
      expect(result.current.feeds).toHaveLength(1);
    });
  });

  describe('mutations', () => {
    const init = () => {
      const hook = renderHook(() => useFeedActions());
      act(() => hook.result.current.setFeeds([feed('a'), feed('b')]));
      return hook.result;
    };

    it('removeFeed removes by url', () => {
      const result = init();
      act(() => {
        result.current.removeFeed('a');
      });
      expect(result.current.feeds).toEqual([feed('b')]);
    });

    it('updateFeed patches only the target', () => {
      const result = init();
      let res: ReturnType<typeof result.current.updateFeed> | undefined;
      act(() => {
        res = result.current.updateFeed('b', { title: 'B' });
      });
      expect(res?.ok).toBe(true);
      expect(result.current.feeds).toEqual([feed('a'), feed('b', { title: 'B' })]);
    });

    it('moveFeed sets the group', () => {
      const result = init();
      act(() => {
        result.current.moveFeed('a', 'g1');
      });
      expect(result.current.feeds).toEqual([feed('a', { group: 'g1' }), feed('b')]);
    });
  });
});
