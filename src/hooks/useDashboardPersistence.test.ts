import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { saveDashboardState, saveShortcuts } = vi.hoisted(() => ({
  saveDashboardState: vi.fn(),
  saveShortcuts: vi.fn(),
}));
vi.mock('@/storage/feedDashboard', () => ({ saveDashboardState, saveShortcuts }));

import { useDashboardPersistence } from './useDashboardPersistence';

describe('useDashboardPersistence', () => {
  beforeEach(() => vi.clearAllMocks());

  const feeds = [{ url: 'u', title: '', color: '', group: '' }];
  const groups = [{ id: 'g', title: 't', color: '', collapsed: false }];
  const shortcuts = [{ url: 's' }];

  it('persists feeds and groups', async () => {
    const { result } = renderHook(() => useDashboardPersistence(feeds, groups, shortcuts, vi.fn()));
    await result.current.persistDashboard();
    expect(saveDashboardState).toHaveBeenCalledWith(feeds, groups);
  });

  it('persists shortcuts', async () => {
    const { result } = renderHook(() => useDashboardPersistence(feeds, groups, shortcuts, vi.fn()));
    await result.current.persistShortcuts();
    expect(saveShortcuts).toHaveBeenCalledWith(shortcuts);
  });

  it('persistFlags forwards to setSideOpen', async () => {
    const setSideOpen = vi.fn();
    const { result } = renderHook(() =>
      useDashboardPersistence(feeds, groups, shortcuts, setSideOpen),
    );
    await result.current.persistFlags(false);
    expect(setSideOpen).toHaveBeenCalledWith(false);
  });
});
