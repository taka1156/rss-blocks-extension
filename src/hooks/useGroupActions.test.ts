import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGroupActions } from './useGroupActions';

const group = (id: string, extra = {}) => ({
  id,
  title: id,
  color: '',
  collapsed: false,
  ...extra,
});

const init = (groups = [group('a'), group('b'), group('c')]) => {
  const hook = renderHook(() => useGroupActions());
  act(() => hook.result.current.setGroups(groups));
  return hook.result;
};

describe('useGroupActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('addGroup uses a trimmed title', () => {
    const { result } = renderHook(() => useGroupActions());
    act(() => {
      result.current.addGroup('  News  ');
    });
    expect(result.current.groups).toHaveLength(1);
    expect(result.current.groups[0]).toMatchObject({
      title: 'News',
      color: '',
      collapsed: false,
      id: Date.now().toString(36),
    });
  });

  it.each([undefined, '', '   '])('addGroup defaults the title for %j', (title) => {
    const { result } = renderHook(() => useGroupActions());
    act(() => {
      result.current.addGroup(title);
    });
    expect(result.current.groups[0]?.title).toBe('新しいグループ');
  });

  it('removeGroup removes by id', () => {
    const result = init();
    act(() => {
      result.current.removeGroup('b');
    });
    expect(result.current.groups.map((g) => g.id)).toEqual(['a', 'c']);
  });

  it('updateGroup patches only the target', () => {
    const result = init();
    act(() => {
      result.current.updateGroup('a', { title: 'X' });
    });
    expect(result.current.groups[0]?.title).toBe('X');
    expect(result.current.groups[1]?.title).toBe('b');
  });

  it('toggleGroupCollapse toggles and returns the group', () => {
    const result = init();
    let res: ReturnType<typeof result.current.toggleGroupCollapse> | undefined;
    act(() => {
      res = result.current.toggleGroupCollapse('a');
    });
    expect(res).toMatchObject({ ok: true, group: { id: 'a', collapsed: true } });
    expect(result.current.groups[0]?.collapsed).toBe(true);
  });

  it('toggleGroupCollapse reports not-found', () => {
    const result = init();
    expect(result.current.toggleGroupCollapse('zzz')).toEqual({ ok: false, reason: 'not-found' });
  });

  it('moveGroup reorders', () => {
    const result = init();
    act(() => {
      result.current.moveGroup('a', 'c');
    });
    expect(result.current.groups.map((g) => g.id)).toEqual(['b', 'c', 'a']);
  });

  it('moveGroup moves backwards', () => {
    const result = init();
    act(() => {
      result.current.moveGroup('c', 'a');
    });
    expect(result.current.groups.map((g) => g.id)).toEqual(['c', 'a', 'b']);
  });

  it.each([
    ['same id', 'a', 'a'],
    ['unknown from', 'zzz', 'a'],
    ['unknown to', 'a', 'zzz'],
  ])('moveGroup rejects %s', (_label, from, to) => {
    const result = init();
    expect(result.current.moveGroup(from, to)).toEqual({ ok: false, reason: 'invalid-move' });
    expect(result.current.groups.map((g) => g.id)).toEqual(['a', 'b', 'c']);
  });

  it('loadGroups sets and returns groups', () => {
    const { result } = renderHook(() => useGroupActions());
    const next = [group('x')];
    let ret: unknown;
    act(() => {
      ret = result.current.loadGroups(next);
    });
    expect(ret).toBe(next);
    expect(result.current.groups).toEqual(next);
  });
});
