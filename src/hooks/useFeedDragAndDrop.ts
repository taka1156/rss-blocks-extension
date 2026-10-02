import { useCallback, useState } from 'react';
import type { Feed, Group } from '@/storage/feedDashboard';

type DragInfo = {
  kind: 'feed' | 'group';
  id: string;
};

export function useFeedDragAndDrop(
  onMoveFeed: (url: string, group: string) => Promise<boolean>,
  onMoveGroup: (fromId: string, toId: string) => Promise<boolean>,
) {
  const [dragState, setDragState] = useState<DragInfo | null>(null);

  const handleFeedDragStart = useCallback((event: React.DragEvent<HTMLElement>, feed: Feed) => {
    setDragState({ kind: 'feed', id: feed.url });
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/rss-blocks-feed', feed.url);
  }, []);

  const handleGroupDragStart = useCallback((event: React.DragEvent<HTMLElement>, group: Group) => {
    setDragState({ kind: 'group', id: group.id });
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/rss-blocks-group', group.id);
  }, []);

  const handleFeedDrop = useCallback(
    (event: React.DragEvent<HTMLElement>, groupId: string) => {
      event.preventDefault();
      if (dragState?.kind !== 'feed') return;
      void onMoveFeed(dragState.id, groupId);
      setDragState(null);
    },
    [dragState, onMoveFeed],
  );

  const handleGroupDrop = useCallback(
    (event: React.DragEvent<HTMLElement>, targetGroupId: string) => {
      event.preventDefault();
      if (dragState?.kind !== 'group' || dragState.id === targetGroupId) return;
      void onMoveGroup(dragState.id, targetGroupId);
      setDragState(null);
    },
    [dragState, onMoveGroup],
  );

  return {
    dragState,
    handleFeedDragStart,
    handleGroupDragStart,
    handleFeedDrop,
    handleGroupDrop,
  };
}
