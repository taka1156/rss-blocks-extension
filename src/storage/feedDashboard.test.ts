import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getItems, setItems, setItem } = vi.hoisted(() => ({
  getItems: vi.fn(),
  setItems: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock('@wxt-dev/storage', () => ({ storage: { getItems, setItems, setItem } }));

import {
  dashboardStorageKeys,
  loadDashboardState,
  saveDashboardFlag,
  saveDashboardState,
  saveShortcuts,
} from './feedDashboard';

const entries = (data: Record<string, unknown>) =>
  Object.entries(dashboardStorageKeys).map(([name, key]) => ({ key, value: data[name] }));

describe('feedDashboard storage', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('loadDashboardState', () => {
    it('requests all dashboard keys', async () => {
      getItems.mockResolvedValue([]);
      await loadDashboardState();
      expect(getItems).toHaveBeenCalledWith(Object.values(dashboardStorageKeys));
    });

    it('returns defaults when nothing is stored', async () => {
      getItems.mockResolvedValue(entries({}));
      expect(await loadDashboardState()).toEqual({
        feeds: [],
        groups: [],
        shortcuts: [],
        sideOpen: true,
      });
    });

    it('returns defaults when stored values have wrong types', async () => {
      getItems.mockResolvedValue(
        entries({ feeds: 'x', groups: {}, shortcuts: 1, sideOpen: 'yes' }),
      );
      expect(await loadDashboardState()).toEqual({
        feeds: [],
        groups: [],
        shortcuts: [],
        sideOpen: true,
      });
    });

    it('normalizes feeds and drops invalid ones', async () => {
      getItems.mockResolvedValue(
        entries({
          feeds: [
            { url: '  https://a.test/feed  ', title: ' T ', color: 5, group: true },
            { url: '' },
            { title: 'no url' },
            null,
            'str',
          ],
        }),
      );
      const { feeds } = await loadDashboardState();
      expect(feeds).toEqual([
        { url: 'https://a.test/feed', title: 'T', color: '5', group: 'true' },
      ]);
    });

    it('normalizes groups with defaults', async () => {
      getItems.mockResolvedValue(
        entries({
          groups: [
            { id: ' g1 ', title: ' Tech ', color: '#fff', collapsed: true },
            { id: 'g2', collapsed: 'x' },
            { title: 'no id' },
            null,
          ],
        }),
      );
      const { groups } = await loadDashboardState();
      expect(groups).toEqual([
        { id: 'g1', title: 'Tech', color: '#fff', collapsed: true },
        { id: 'g2', title: '新しいグループ', color: '', collapsed: false },
      ]);
    });

    it('normalizes shortcuts and drops invalid ones', async () => {
      getItems.mockResolvedValue(
        entries({ shortcuts: [{ url: ' https://s.test ' }, { url: ' ' }, null, 3] }),
      );
      const { shortcuts } = await loadDashboardState();
      expect(shortcuts).toEqual([{ url: 'https://s.test' }]);
    });

    it('respects a stored sideOpen boolean', async () => {
      getItems.mockResolvedValue(entries({ sideOpen: false }));
      expect((await loadDashboardState()).sideOpen).toBe(false);
    });
  });

  describe('save functions', () => {
    it('saveDashboardState stores feeds and groups', async () => {
      const feeds = [{ url: 'u', title: '', color: '', group: '' }];
      const groups = [{ id: 'g', title: 't', color: '', collapsed: false }];
      await saveDashboardState(feeds, groups);
      expect(setItems).toHaveBeenCalledWith([
        { key: 'sync:feeds', value: feeds },
        { key: 'sync:groups', value: groups },
      ]);
    });

    it('saveShortcuts stores shortcuts', async () => {
      await saveShortcuts([{ url: 'u' }]);
      expect(setItem).toHaveBeenCalledWith('sync:shortcuts', [{ url: 'u' }]);
    });

    it('saveDashboardFlag stores sideOpen', async () => {
      await saveDashboardFlag('sideOpen', false);
      expect(setItem).toHaveBeenCalledWith('sync:sideOpen', false);
    });
  });
});
