import { useMemo, useState } from 'react';
import type { EditValues } from '@/components/features/EditForm/EditForm';
import { FeedCard } from '@/components/features/FeedCard/FeedCard';
import { GroupCard } from '@/components/features/GroupCard/GroupCard';
import { useFeedDragAndDrop } from '@/hooks/useFeedDragAndDrop';
import type { Feed, Group } from '@/storage/feedDashboard';
import type { FeedItem } from '@/utils/feedParser';
import { grid, groups as groupsClass, main, over } from './FeedBoard.css';

type FeedBoardProps = {
  feeds: Feed[];
  groups: Group[];
  statusByUrl: Record<string, { loading: boolean; error: string | null }>;
  itemsByUrl: Record<string, FeedItem[]>;
  onOpenArticle: (title: string, url: string) => boolean;
  onPlayAudio: (title: string, url: string) => void;
  onUpdateFeed: (url: string, patch: EditValues) => boolean;
  onUpdateGroup: (groupId: string, patch: { title: string; color: string }) => void;
  onRemoveFeed: (url: string) => Promise<{ ok: boolean; nextFeeds?: Feed[] }>;
  onMoveFeed: (url: string, group: string) => Promise<{ ok: boolean; nextFeeds?: Feed[] }>;
  onRemoveGroup: (groupId: string) => Promise<{ ok: boolean; nextGroups?: Group[] }>;
  onToggleGroupCollapse: (groupId: string) => Promise<{ ok: boolean; nextGroups?: Group[] }>;
  onMoveGroup: (fromId: string, toId: string) => Promise<{ ok: boolean; nextGroups?: Group[] }>;
};

export function FeedBoard({
  feeds,
  groups,
  statusByUrl,
  itemsByUrl,
  onOpenArticle,
  onPlayAudio,
  onRemoveFeed,
  onUpdateFeed,
  onUpdateGroup,
  onMoveFeed,
  onRemoveGroup,
  onToggleGroupCollapse,
  onMoveGroup,
}: FeedBoardProps) {
  const [ungroupedOver, setUngroupedOver] = useState(false);
  const groupedFeeds = useMemo(
    () => ({
      ungrouped: feeds.filter((feed) => !feed.group),
      grouped: groups.map((group) => ({
        group,
        feeds: feeds.filter((feed) => feed.group === group.id),
      })),
    }),
    [feeds, groups],
  );

  const dragState = useFeedDragAndDrop(
    async (url, group) => {
      const result = await onMoveFeed(url, group);
      return result.ok;
    },
    async (fromId, toId) => {
      const result = await onMoveGroup(fromId, toId);
      return result.ok;
    },
  );

  return (
    <main className={main}>
      <ul
        className={`${grid} ${ungroupedOver ? over : ''}`.trim()}
        id="ungroupedGrid"
        data-group=""
        aria-label="未分類フィード"
        onDragOver={(event) => {
          event.preventDefault();
          setUngroupedOver(event.dataTransfer.types.includes('application/rss-blocks-feed'));
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setUngroupedOver(false);
          }
        }}
        onDrop={(event) => {
          setUngroupedOver(false);
          void dragState.handleFeedDrop(event, '');
        }}
      >
        {groupedFeeds.ungrouped.map((feed) => (
          <FeedCard
            key={`${feed.url}-${feed.group}`}
            feed={feed}
            status={statusByUrl[feed.url]}
            items={itemsByUrl[feed.url]}
            onOpenArticle={onOpenArticle}
            onPlayAudio={onPlayAudio}
            onUpdate={onUpdateFeed}
            onRemove={(url) => {
              void onRemoveFeed(url);
            }}
            onDragStart={dragState.handleFeedDragStart}
            onDrop={(event, groupId) => {
              void dragState.handleFeedDrop(event, groupId);
            }}
          />
        ))}
      </ul>

      <ul id="groups" className={groupsClass} aria-label="グループ一覧">
        {groupedFeeds.grouped.map((entry) => (
          <GroupCard
            key={entry.group.id}
            group={entry.group}
            feeds={feeds}
            onToggleCollapse={(groupId) => {
              void onToggleGroupCollapse(groupId);
            }}
            onRemoveGroup={(groupId) => {
              void onRemoveGroup(groupId);
            }}
            onRemoveFeed={(url) => {
              void onRemoveFeed(url);
            }}
            onOpenArticle={onOpenArticle}
            onPlayAudio={onPlayAudio}
            onUpdateFeed={onUpdateFeed}
            onUpdateGroup={onUpdateGroup}
            onFeedDragStart={dragState.handleFeedDragStart}
            onFeedDrop={(event, groupId) => {
              void dragState.handleFeedDrop(event, groupId);
            }}
            onGroupDragStart={dragState.handleGroupDragStart}
            onGroupDrop={(event, groupId) => {
              void dragState.handleGroupDrop(event, groupId);
            }}
            statusByUrl={statusByUrl}
            itemsByUrl={itemsByUrl}
          />
        ))}
      </ul>
    </main>
  );
}
