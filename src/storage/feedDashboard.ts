import { storage } from '@wxt-dev/storage';

export type Feed = {
  url: string;
  title: string;
  color: string;
  group: string;
};

export type Group = {
  id: string;
  title: string;
  color: string;
  collapsed: boolean;
};

export type Shortcut = {
  url: string;
};

export type DashboardState = {
  feeds: Feed[];
  groups: Group[];
  shortcuts: Shortcut[];
  thumbs: boolean;
  sideOpen: boolean;
};

export const dashboardStorageKeys = {
  feeds: 'sync:feeds',
  groups: 'sync:groups',
  shortcuts: 'sync:shortcuts',
  thumbs: 'sync:thumbs',
  sideOpen: 'sync:sideOpen',
} as const;

function toStringValue(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).trim();
  return '';
}

function normalizeFeed(value: unknown): Feed | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<Feed>;
  const url = toStringValue(candidate.url);
  if (!url) return null;
  return {
    url,
    title: toStringValue(candidate.title),
    color: toStringValue(candidate.color),
    group: toStringValue(candidate.group),
  };
}

function normalizeGroup(value: unknown): Group | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<Group>;
  const id = toStringValue(candidate.id);
  if (!id) return null;
  return {
    id,
    title: toStringValue(candidate.title) || '新しいグループ',
    color: toStringValue(candidate.color),
    collapsed: typeof candidate.collapsed === 'boolean' ? candidate.collapsed : false,
  };
}

function normalizeShortcut(value: unknown): Shortcut | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<Shortcut>;
  const url = toStringValue(candidate.url);
  if (!url) return null;
  return { url };
}

export async function loadDashboardState(): Promise<DashboardState> {
  const result = await storage.getItems([
    dashboardStorageKeys.feeds,
    dashboardStorageKeys.groups,
    dashboardStorageKeys.shortcuts,
    dashboardStorageKeys.thumbs,
    dashboardStorageKeys.sideOpen,
  ] as const);

  const data = Object.fromEntries(
    result.map((entry: { key: string; value: unknown }) => [
      entry.key.replace(/^sync:/, ''),
      entry.value,
    ]),
  ) as Partial<Record<keyof DashboardState, unknown>>;

  const feeds = Array.isArray(data.feeds)
    ? data.feeds.map(normalizeFeed).filter((feed): feed is Feed => feed !== null)
    : [];
  const groups = Array.isArray(data.groups)
    ? data.groups.map(normalizeGroup).filter((group): group is Group => group !== null)
    : [];
  const shortcuts = Array.isArray(data.shortcuts)
    ? data.shortcuts
        .map(normalizeShortcut)
        .filter((shortcut): shortcut is Shortcut => shortcut !== null)
    : [];

  return {
    feeds,
    groups,
    shortcuts,
    thumbs: typeof data.thumbs === 'boolean' ? data.thumbs : true,
    sideOpen: typeof data.sideOpen === 'boolean' ? data.sideOpen : true,
  };
}

export async function saveDashboardState(feeds: Feed[], groups: Group[]): Promise<void> {
  await storage.setItems([
    { key: dashboardStorageKeys.feeds, value: feeds },
    { key: dashboardStorageKeys.groups, value: groups },
  ]);
}

export async function saveShortcuts(shortcuts: Shortcut[]): Promise<void> {
  await storage.setItem(dashboardStorageKeys.shortcuts, shortcuts);
}

export async function saveDashboardFlag(key: 'thumbs' | 'sideOpen', value: boolean): Promise<void> {
  const storageKey = dashboardStorageKeys[key];
  await storage.setItem(storageKey, value);
}
