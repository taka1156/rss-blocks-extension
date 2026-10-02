import { useCallback, useState } from 'react';
import type { Shortcut } from '@/storage/feedDashboard';

export function useShortcutActions() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const addShortcut = useCallback(
    (url: string) => {
      const trimmed = typeof url === 'string' ? url.trim() : '';
      if (!trimmed) {
        return { ok: false as const, reason: 'invalid-url' };
      }
      try {
        new URL(trimmed);
      } catch {
        return { ok: false as const, reason: 'invalid-url' };
      }
      const item = { url: trimmed };
      const nextShortcuts = [...shortcuts, item];
      setShortcuts(nextShortcuts);
      return { ok: true as const, shortcut: item, nextShortcuts };
    },
    [shortcuts],
  );

  const removeShortcut = useCallback(
    (url: string) => {
      const nextShortcuts = shortcuts.filter((shortcut) => shortcut.url !== url);
      setShortcuts(nextShortcuts);
      return { ok: true as const, nextShortcuts };
    },
    [shortcuts],
  );

  const loadShortcuts = useCallback((nextShortcuts: Shortcut[]) => {
    setShortcuts(nextShortcuts);
    return nextShortcuts;
  }, []);

  return {
    shortcuts,
    setShortcuts,
    loadShortcuts,
    addShortcut,
    removeShortcut,
  };
}
