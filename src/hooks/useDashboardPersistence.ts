import { useCallback } from 'react';
import {
  type Feed,
  type Group,
  type Shortcut,
  saveDashboardFlag,
  saveDashboardState,
  saveShortcuts,
} from '@/storage/feedDashboard';

export function useDashboardPersistence(
  feeds: Feed[],
  groups: Group[],
  shortcuts: Shortcut[],
  setThumbs: (value: boolean) => void,
  setSideOpen: (value: boolean) => void,
) {
  const persistDashboard = useCallback(async () => {
    await saveDashboardState(feeds, groups);
  }, [feeds, groups]);

  const persistShortcuts = useCallback(async () => {
    await saveShortcuts(shortcuts);
  }, [shortcuts]);

  const persistFlags = useCallback(
    async (key: 'thumbs' | 'sideOpen', value: boolean) => {
      if (key === 'thumbs') setThumbs(value);
      else setSideOpen(value);
      await saveDashboardFlag(key, value);
    },
    [setSideOpen, setThumbs],
  );

  return { persistDashboard, persistShortcuts, persistFlags };
}
