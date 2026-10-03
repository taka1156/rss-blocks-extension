import { useCallback, useEffect, useRef, useState } from 'react';
import type { Feed } from '@/storage/feedDashboard';
import { parseFeed } from '@/utils/feedParser';

function retryAfter(response: Response): string {
  const value = response.headers.get('Retry-After');
  if (!value) return '';
  const seconds = Number(value);
  if (Number.isFinite(seconds)) {
    return `（${Math.max(1, Math.ceil(seconds))}秒後に再試行してください）`;
  }
  const retryAt = Date.parse(value);
  if (Number.isNaN(retryAt)) return '';
  const secondsUntilRetry = Math.max(1, Math.ceil((retryAt - Date.now()) / 1000));
  return `（${secondsUntilRetry}秒後に再試行してください）`;
}

const MAX_RETRIES = 2;
const MAX_WAIT_MS = 10000;
const REQUEST_GAP_MS = 300;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function retryWaitMs(response: Response, attempt: number): number {
  const value = response.headers.get('Retry-After');
  let ms = 1000 * 2 ** attempt;
  if (value) {
    const seconds = Number(value);
    const parsed = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(value) - Date.now();
    if (Number.isFinite(parsed)) ms = parsed;
  }
  return Math.min(Math.max(ms, 1000), MAX_WAIT_MS);
}

async function fetchWithRetry(url: string): Promise<Response> {
  let response = await fetch(url);
  for (let attempt = 0; response.status === 429 && attempt < MAX_RETRIES; attempt++) {
    await sleep(retryWaitMs(response, attempt));
    response = await fetch(url);
  }
  return response;
}

export function useFeedRefresh(
  feeds: Feed[],
  updateFeed: (url: string, patch: Partial<Feed>) => Promise<{ ok: boolean }>,
) {
  const feedsRef = useRef(feeds);
  const updateFeedRef = useRef(updateFeed);
  const activeUrls = useRef(new Set<string>());
  const autoRefreshKey = useRef('');
  feedsRef.current = feeds;
  updateFeedRef.current = updateFeed;
  const feedUrlKey = JSON.stringify(feeds.map((feed) => feed.url));

  const [itemsByUrl, setItemsByUrl] = useState<
    Record<string, ReturnType<typeof parseFeed>['items']>
  >({});
  const [statusByUrl, setStatusByUrl] = useState<
    Record<string, { loading: boolean; error: string | null }>
  >({});

  const refreshFeed = useCallback(async (feed: Feed) => {
    const key = feed.url;
    if (activeUrls.current.has(key)) return;
    activeUrls.current.add(key);
    setStatusByUrl((prev) => ({ ...prev, [key]: { loading: true, error: null } }));

    try {
      const response = await fetchWithRetry(feed.url);
      if (!response.ok) {
        const retryHint = response.status === 429 ? retryAfter(response) : '';
        throw new Error(`HTTP ${response.status}${retryHint}`);
      }
      const { title, items } = parseFeed(await response.text(), feed.url);
      setItemsByUrl((prev) => ({ ...prev, [key]: items }));

      if (title && !feed.title) {
        await updateFeedRef.current(feed.url, { title });
      }

      setStatusByUrl((prev) => ({ ...prev, [key]: { loading: false, error: null } }));
    } catch (error) {
      setStatusByUrl((prev) => ({
        ...prev,
        [key]: {
          loading: false,
          error: error instanceof Error ? error.message : '取得に失敗しました',
        },
      }));
    } finally {
      activeUrls.current.delete(key);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    for (const feed of feedsRef.current) {
      await refreshFeed(feed);
      await sleep(REQUEST_GAP_MS);
    }
  }, [refreshFeed]);

  useEffect(() => {
    if (autoRefreshKey.current === feedUrlKey) return;
    autoRefreshKey.current = feedUrlKey;
    void refreshAll();
  }, [feedUrlKey, refreshAll]);

  return {
    refreshAll,
    refreshFeed,
    statusByUrl,
    itemsByUrl,
  };
}
