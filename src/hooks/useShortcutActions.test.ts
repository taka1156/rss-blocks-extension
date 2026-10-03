import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useShortcutActions } from './useShortcutActions';

describe('useShortcutActions', () => {
  it.each(['', '   ', 'not a url', undefined as unknown as string])(
    'addShortcut rejects %j',
    (input) => {
      const { result } = renderHook(() => useShortcutActions());
      expect(result.current.addShortcut(input)).toEqual({ ok: false, reason: 'invalid-url' });
      expect(result.current.shortcuts).toEqual([]);
    },
  );

  it('addShortcut adds a trimmed url', () => {
    const { result } = renderHook(() => useShortcutActions());
    act(() => {
      result.current.addShortcut('  https://a.test  ');
    });
    expect(result.current.shortcuts).toEqual([{ url: 'https://a.test' }]);
  });

  it('removeShortcut removes by url', () => {
    const { result } = renderHook(() => useShortcutActions());
    act(() => result.current.setShortcuts([{ url: 'a' }, { url: 'b' }]));
    act(() => {
      result.current.removeShortcut('a');
    });
    expect(result.current.shortcuts).toEqual([{ url: 'b' }]);
  });

  it('loadShortcuts sets and returns shortcuts', () => {
    const { result } = renderHook(() => useShortcutActions());
    const next = [{ url: 'x' }];
    let ret: unknown;
    act(() => {
      ret = result.current.loadShortcuts(next);
    });
    expect(ret).toBe(next);
    expect(result.current.shortcuts).toEqual(next);
  });
});
