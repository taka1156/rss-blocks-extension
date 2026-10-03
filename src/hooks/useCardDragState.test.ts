import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCardDragState } from './useCardDragState';

describe('useCardDragState', () => {
  it('has initial false state', () => {
    const { result } = renderHook(() => useCardDragState());
    expect(result.current.dragReady).toBe(false);
    expect(result.current.isDragging).toBe(false);
    expect(result.current.isOver).toBe(false);
  });

  it('handleDragStart is rejected unless dragReady', () => {
    const { result } = renderHook(() => useCardDragState());
    let started = true;
    act(() => {
      started = result.current.handleDragStart();
    });
    expect(started).toBe(false);
    expect(result.current.isDragging).toBe(false);
  });

  it('handleDragStart starts dragging when ready, and handleDragEnd resets', () => {
    const { result } = renderHook(() => useCardDragState());
    act(() => result.current.setDragReady(true));
    let started = false;
    act(() => {
      started = result.current.handleDragStart();
    });
    expect(started).toBe(true);
    expect(result.current.isDragging).toBe(true);
    act(() => result.current.handleDragEnd());
    expect(result.current.isDragging).toBe(false);
    expect(result.current.dragReady).toBe(false);
  });

  it('resetDrag clears dragReady and isDragging', () => {
    const { result } = renderHook(() => useCardDragState());
    act(() => {
      result.current.setDragReady(true);
      result.current.setIsDragging(true);
    });
    act(() => result.current.resetDrag());
    expect(result.current.dragReady).toBe(false);
    expect(result.current.isDragging).toBe(false);
  });

  it('toggles isOver', () => {
    const { result } = renderHook(() => useCardDragState());
    act(() => result.current.setIsOver(true));
    expect(result.current.isOver).toBe(true);
    act(() => result.current.setIsOver(false));
    expect(result.current.isOver).toBe(false);
  });

  it('handleDragOver prevents default', () => {
    const { result } = renderHook(() => useCardDragState());
    const preventDefault = vi.fn();
    result.current.handleDragOver({ preventDefault } as unknown as React.DragEvent);
    expect(preventDefault).toHaveBeenCalled();
  });
});
