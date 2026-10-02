import { useCallback, useState } from 'react';
import type { Group } from '@/storage/feedDashboard';

export function useGroupActions() {
  const [groups, setGroups] = useState<Group[]>([]);

  const addGroup = useCallback(
    (title?: string) => {
      const sanitizedTitle = typeof title === 'string' ? title.trim() : '';
      const group: Group = {
        id: Date.now().toString(36),
        title: sanitizedTitle || '新しいグループ',
        color: '',
        collapsed: false,
      };
      const nextGroups = [...groups, group];
      setGroups(nextGroups);
      return { ok: true as const, group, nextGroups };
    },
    [groups],
  );

  const removeGroup = useCallback(
    (groupId: string) => {
      const nextGroups = groups.filter((group) => group.id !== groupId);
      setGroups(nextGroups);
      return { ok: true as const, nextGroups };
    },
    [groups],
  );

  const updateGroup = useCallback(
    (groupId: string, patch: Partial<Group>) => {
      const nextGroups = groups.map((group) =>
        group.id === groupId ? { ...group, ...patch } : group,
      );
      setGroups(nextGroups);
      return { ok: true as const, nextGroups };
    },
    [groups],
  );

  const toggleGroupCollapse = useCallback(
    (groupId: string) => {
      const group = groups.find((item) => item.id === groupId);
      if (!group) {
        return { ok: false as const, reason: 'not-found' };
      }
      const nextGroups = groups.map((item) =>
        item.id === groupId ? { ...item, collapsed: !item.collapsed } : item,
      );
      setGroups(nextGroups);
      return {
        ok: true as const,
        nextGroups,
        group: nextGroups.find((item) => item.id === groupId) ?? null,
      };
    },
    [groups],
  );

  const moveGroup = useCallback(
    (fromId: string, toId: string) => {
      const fromIndex = groups.findIndex((group) => group.id === fromId);
      const toIndex = groups.findIndex((group) => group.id === toId);

      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
        return { ok: false as const, reason: 'invalid-move' };
      }

      const nextGroups = [...groups];
      const [group] = nextGroups.splice(fromIndex, 1);
      if (!group) {
        return { ok: false as const, reason: 'not-found' };
      }
      nextGroups.splice(toIndex, 0, group);
      setGroups(nextGroups);
      return { ok: true as const, nextGroups, group };
    },
    [groups],
  );

  const loadGroups = useCallback((nextGroups: Group[]) => {
    setGroups(nextGroups);
    return nextGroups;
  }, []);

  return {
    groups,
    setGroups,
    loadGroups,
    addGroup,
    removeGroup,
    updateGroup,
    toggleGroupCollapse,
    moveGroup,
  };
}
