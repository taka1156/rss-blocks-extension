import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useEditState } from './useEditState';

describe('useEditState', () => {
  it('opens, closes and toggles', () => {
    const { result } = renderHook(() => useEditState());
    expect(result.current.editing).toBe(false);
    act(() => result.current.openEdit());
    expect(result.current.editing).toBe(true);
    act(() => result.current.closeEdit());
    expect(result.current.editing).toBe(false);
    act(() => result.current.toggleEdit());
    expect(result.current.editing).toBe(true);
    act(() => result.current.toggleEdit());
    expect(result.current.editing).toBe(false);
  });

  it('setEditing sets directly', () => {
    const { result } = renderHook(() => useEditState());
    act(() => result.current.setEditing(true));
    expect(result.current.editing).toBe(true);
  });
});
