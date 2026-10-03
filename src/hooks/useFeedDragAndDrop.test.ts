import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFeedDragAndDrop } from './useFeedDragAndDrop';

const makeEvent = () =>
  ({
    preventDefault: vi.fn(),
    dataTransfer: { effectAllowed: '', setData: vi.fn() },
  }) as unknown as React.DragEvent<HTMLElement> & {
    preventDefault: ReturnType<typeof vi.fn>;
    dataTransfer: { effectAllowed: string; setData: ReturnType<typeof vi.fn> };
  };

const feed = { url: 'https://a.test', title: '', color: '', group: '' };
const group = { id: 'g1', title: 'G', color: '', collapsed: false };

const setup = () => {
  const onMoveFeed = vi.fn().mockResolvedValue(true);
  const onMoveGroup = vi.fn().mockResolvedValue(true);
  const { result } = renderHook(() => useFeedDragAndDrop(onMoveFeed, onMoveGroup));
  return { result, onMoveFeed, onMoveGroup };
};

describe('useFeedDragAndDrop', () => {
  it('starts with no drag state', () => {
    expect(setup().result.current.dragState).toBeNull();
  });

  it('feed drag start sets state and data transfer', () => {
    const { result } = setup();
    const e = makeEvent();
    act(() => result.current.handleFeedDragStart(e, feed));
    expect(result.current.dragState).toEqual({ kind: 'feed', id: feed.url });
    expect(e.dataTransfer.effectAllowed).toBe('move');
    expect(e.dataTransfer.setData).toHaveBeenCalledWith('application/rss-blocks-feed', feed.url);
  });

  it('group drag start sets state and data transfer', () => {
    const { result } = setup();
    const e = makeEvent();
    act(() => result.current.handleGroupDragStart(e, group));
    expect(result.current.dragState).toEqual({ kind: 'group', id: 'g1' });
    expect(e.dataTransfer.setData).toHaveBeenCalledWith('application/rss-blocks-group', 'g1');
  });

  it('feed drop moves the feed and clears state', () => {
    const { result, onMoveFeed } = setup();
    act(() => result.current.handleFeedDragStart(makeEvent(), feed));
    const e = makeEvent();
    act(() => result.current.handleFeedDrop(e, 'g2'));
    expect(e.preventDefault).toHaveBeenCalled();
    expect(onMoveFeed).toHaveBeenCalledWith(feed.url, 'g2');
    expect(result.current.dragState).toBeNull();
  });

  it('feed drop is ignored when not dragging a feed', () => {
    const { result, onMoveFeed } = setup();
    act(() => result.current.handleGroupDragStart(makeEvent(), group));
    act(() => result.current.handleFeedDrop(makeEvent(), 'g2'));
    expect(onMoveFeed).not.toHaveBeenCalled();
    expect(result.current.dragState).not.toBeNull();
  });

  it('group drop moves the group and clears state', () => {
    const { result, onMoveGroup } = setup();
    act(() => result.current.handleGroupDragStart(makeEvent(), group));
    act(() => result.current.handleGroupDrop(makeEvent(), 'g2'));
    expect(onMoveGroup).toHaveBeenCalledWith('g1', 'g2');
    expect(result.current.dragState).toBeNull();
  });

  it('group drop is ignored on itself or when not dragging a group', () => {
    const { result, onMoveGroup } = setup();
    act(() => result.current.handleGroupDragStart(makeEvent(), group));
    act(() => result.current.handleGroupDrop(makeEvent(), 'g1'));
    expect(onMoveGroup).not.toHaveBeenCalled();
    act(() => result.current.handleFeedDragStart(makeEvent(), feed));
    act(() => result.current.handleGroupDrop(makeEvent(), 'g2'));
    expect(onMoveGroup).not.toHaveBeenCalled();
  });

  it('group drop with no drag still prevents default', () => {
    const { result } = setup();
    const e = makeEvent();
    act(() => result.current.handleGroupDrop(e, 'g2'));
    expect(e.preventDefault).toHaveBeenCalled();
  });
});
