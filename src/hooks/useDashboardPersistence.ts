import { useCallback } from 'react';
import {
  type Feed,
  type Group,
  type Shortcut,
  saveDashboardState,
  saveShortcuts,
} from '@/storage/feedDashboard';

export function useDashboardPersistence(
  feeds: Feed[],
  groups: Group[],
  shortcuts: Shortcut[],
  setSideOpen: (value: boolean) => void,
) {
  const persistDashboard = useCallback(async () => {
    await saveDashboardState(feeds, groups);
  }, [feeds, groups]);

  const persistShortcuts = useCallback(async () => {
    await saveShortcuts(shortcuts);
  }, [shortcuts]);

  const persistFlags = useCallback(
    async (value: boolean) => {
      setSideOpen(value);
    },
    [setSideOpen],
  );

  return { persistDashboard, persistShortcuts, persistFlags };
}
