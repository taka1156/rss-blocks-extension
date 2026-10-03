import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { parseFeed } = vi.hoisted(() => ({ parseFeed: vi.fn() }));
vi.mock('@/utils/feedParser', () => ({ parseFeed }));

import { useFeedRefresh } from './useFeedRefresh';

const feed = (url: string, title = '') => ({ url, title, color: '', group: '' });

const res = (status: number, body = '', headers: Record<string, string> = {}) =>
  new Response(body, { status, headers });

describe('useFeedRefresh', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    parseFeed.mockReset();
    parseFeed.mockReturnValue({ title: 'Parsed', items: [{ title: 'i' }] });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const flush = () => act(() => vi.advanceTimersByTimeAsync(60000));

  it('auto-refreshes feeds on mount, stores items and updates empty title', async () => {
    fetchMock.mockResolvedValue(res(200, '<xml/>'));
    const updateFeed = vi.fn().mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useFeedRefresh([feed('https://a.test')], updateFeed));
    await flush();
    expect(fetchMock).toHaveBeenCalledWith('https://a.test');
    expect(parseFeed).toHaveBeenCalledWith('<xml/>', 'https://a.test');
    expect(result.current.itemsByUrl['https://a.test']).toEqual([{ title: 'i' }]);
    expect(result.current.statusByUrl['https://a.test']).toEqual({ loading: false, error: null });
    expect(updateFeed).toHaveBeenCalledWith('https://a.test', { title: 'Parsed' });
  });

  it('does not update the title when one already exists', async () => {
    fetchMock.mockResolvedValue(res(200, 'x'));
    const updateFeed = vi.fn().mockResolvedValue({ ok: true });
    renderHook(() => useFeedRefresh([feed('https://a.test', 'Mine')], updateFeed));
    await flush();
    expect(updateFeed).not.toHaveBeenCalled();
  });

  it('does not auto-refresh again when urls are unchanged', async () => {
    fetchMock.mockResolvedValue(res(200, 'x'));
    const updateFeed = vi.fn().mockResolvedValue({ ok: true });
    const { rerender } = renderHook(({ feeds }) => useFeedRefresh(feeds, updateFeed), {
      initialProps: { feeds: [feed('https://a.test', 'T')] },
    });
    await flush();
    rerender({ feeds: [feed('https://a.test', 'T2')] });
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('records an HTTP error', async () => {
    fetchMock.mockResolvedValue(res(500));
    const { result } = renderHook(() => useFeedRefresh([feed('https://a.test')], vi.fn()));
    await flush();
    expect(result.current.statusByUrl['https://a.test']).toEqual({
      loading: false,
      error: 'HTTP 500',
    });
  });

  it('records a network error message', async () => {
    fetchMock.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useFeedRefresh([feed('https://a.test')], vi.fn()));
    await flush();
    expect(result.current.statusByUrl['https://a.test']?.error).toBe('boom');
  });

  it('uses a fallback message for non-Error rejections', async () => {
    fetchMock.mockRejectedValue('x');
    const { result } = renderHook(() => useFeedRefresh([feed('https://a.test')], vi.fn()));
    await flush();
    expect(result.current.statusByUrl['https://a.test']?.error).toBe('取得に失敗しました');
  });

  it('retries on 429 and then succeeds', async () => {
    fetchMock
      .mockResolvedValueOnce(res(429, '', { 'Retry-After': '2' }))
      .mockResolvedValueOnce(res(200, 'ok'));
    const { result } = renderHook(() => useFeedRefresh([feed('https://a.test')], vi.fn()));
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.statusByUrl['https://a.test']?.error).toBeNull();
  });

  it('gives up after max retries with a Retry-After hint (seconds)', async () => {
    fetchMock.mockImplementation(async () => res(429, '', { 'Retry-After': '5' }));
    const { result } = renderHook(() => useFeedRefresh([feed('https://a.test')], vi.fn()));
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.current.statusByUrl['https://a.test']?.error).toBe(
      'HTTP 429（5秒後に再試行してください）',
    );
  });

  it('supports an HTTP-date Retry-After and omits hint when invalid', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const date = new Date('2026-01-01T00:00:03Z').toUTCString();
    fetchMock.mockImplementation(async () => res(429, '', { 'Retry-After': date }));
    const a = renderHook(() => useFeedRefresh([feed('https://a.test')], vi.fn()));
    await flush();
    expect(a.result.current.statusByUrl['https://a.test']?.error).toMatch(
      /^HTTP 429（\d+秒後に再試行してください）$/,
    );

    fetchMock.mockImplementation(async () => res(429, '', { 'Retry-After': 'garbage' }));
    const b = renderHook(() => useFeedRefresh([feed('https://b.test')], vi.fn()));
    await flush();
    expect(b.result.current.statusByUrl['https://b.test']?.error).toBe('HTTP 429');
  });

  it('429 without Retry-After uses backoff and no hint', async () => {
    fetchMock.mockImplementation(async () => res(429));
    const { result } = renderHook(() => useFeedRefresh([feed('https://a.test')], vi.fn()));
    await flush();
    expect(result.current.statusByUrl['https://a.test']?.error).toBe('HTTP 429');
  });

  it('refreshFeed skips a feed that is already loading', async () => {
    let resolve!: (r: Response) => void;
    fetchMock.mockImplementation(() => new Promise<Response>((r) => (resolve = r)));
    const feeds = [feed('https://a.test')];
    const { result } = renderHook(() => useFeedRefresh(feeds, vi.fn()));
    await act(async () => {
      await result.current.refreshFeed(feeds[0] as (typeof feeds)[number]);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolve(res(200, 'x'));
    await flush();
  });

  it('refreshAll refreshes every feed', async () => {
    fetchMock.mockResolvedValue(res(200, 'x'));
    const feeds = [feed('https://a.test', 'A'), feed('https://b.test', 'B')];
    const { result } = renderHook(() => useFeedRefresh(feeds, vi.fn()));
    await flush();
    fetchMock.mockClear();
    await act(async () => {
      const p = result.current.refreshAll();
      await vi.advanceTimersByTimeAsync(5000);
      await p;
    });
    expect(fetchMock.mock.calls.map((c) => c[0])).toEqual(['https://a.test', 'https://b.test']);
  });
});
