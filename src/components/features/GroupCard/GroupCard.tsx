import { useState } from 'react';
import type { Feed, Group } from '@/storage/feedDashboard';
import type { FeedItem } from '@/utils/feedDashboard';
import { EditForm, type EditValues } from '../EditForm/EditForm';
import { FeedCard } from '../FeedCard/FeedCard';
import {
  actions,
  collapsed,
  collapsedList,
  dragging,
  feedList,
  group,
  groupHead,
  groupTitle,
  handle,
  icon,
  over,
  toggle,
} from './GroupCard.css';

type GroupCardProps = {
  group: Group;
  feeds: Feed[];
  onToggleCollapse: (groupId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onRemoveFeed: (url: string) => void;
  onUpdateFeed: (url: string, patch: EditValues) => boolean;
  onUpdateGroup: (groupId: string, patch: { title: string; color: string }) => void;
  onOpenArticle: (title: string, url: string) => boolean;
  onPlayAudio: (title: string, url: string) => void;
  onFeedDragStart: (event: React.DragEvent<HTMLElement>, feed: Feed) => void;
  onFeedDrop: (event: React.DragEvent<HTMLElement>, groupId: string) => void;
  onGroupDragStart: (event: React.DragEvent<HTMLElement>, group: Group) => void;
  onGroupDrop: (event: React.DragEvent<HTMLElement>, groupId: string) => void;
  statusByUrl: Record<string, { loading?: boolean; error?: string | null }>;
  itemsByUrl: Record<string, FeedItem[]>;
};

export function GroupCard({
  group: groupData,
  feeds,
  onToggleCollapse,
  onRemoveGroup,
  onRemoveFeed,
  onUpdateFeed,
  onUpdateGroup,
  onOpenArticle,
  onPlayAudio,
  onFeedDragStart,
  onFeedDrop,
  onGroupDragStart,
  onGroupDrop,
  statusByUrl,
  itemsByUrl,
}: GroupCardProps) {
  const [editing, setEditing] = useState(false);
  const [dragReady, setDragReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [previewColor, setPreviewColor] = useState<string | undefined>(undefined);
  const groupColor = previewColor ?? groupData.color;
  const closeEdit = () => {
    setEditing(false);
    setPreviewColor(undefined);
  };

  return (
    <li
      className={`${group} ${groupData.collapsed ? collapsed : ''} ${isDragging ? dragging : ''}`.trim()}
      style={groupColor ? ({ ['--gc' as string]: groupColor } as React.CSSProperties) : undefined}
      draggable={dragReady}
      onDragStart={(event) => {
        if (!dragReady) return;
        setIsDragging(true);
        onGroupDragStart(event, groupData);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        setDragReady(false);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onGroupDrop(event, groupData.id);
      }}
    >
      <div className={groupHead}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer-only drag handle */}
        <span
          className={handle}
          title="ドラッグして並べ替え"
          onMouseDown={() => setDragReady(true)}
          onMouseUp={() => setDragReady(false)}
        >
          ⠿
        </span>
        <button
          type="button"
          className={toggle}
          title="開閉"
          onClick={() => onToggleCollapse(groupData.id)}
        >
          {groupData.collapsed ? '▸' : '▾'}
        </button>
        <h2 className={groupTitle}>{groupData.title || '(無題のグループ)'}</h2>
        <div className={actions}>
          <button
            type="button"
            className={icon}
            title="編集"
            onClick={() => (editing ? closeEdit() : setEditing(true))}
          >
            ✎
          </button>
          <button
            type="button"
            className={icon}
            title="グループを削除（中のブロックは残ります）"
            onClick={() => {
              if (window.confirm('グループを削除します（中のブロックはグループ外に残ります）。')) {
                onRemoveGroup(groupData.id);
              }
            }}
          >
            ×
          </button>
        </div>
      </div>
      {editing && (
        <EditForm
          titleLabel="グループ名"
          titleRequired
          initial={{ title: groupData.title, url: '', color: groupData.color }}
          onColorPreview={setPreviewColor}
          onCancel={closeEdit}
          onSubmit={({ title, color }) => {
            onUpdateGroup(groupData.id, { title, color });
            closeEdit();
          }}
        />
      )}
      <ul
        className={`${feedList} ${groupData.collapsed ? collapsedList : ''} ${isOver ? over : ''}`.trim()}
        data-group={groupData.id}
        aria-label={`${groupData.title || 'グループ'} のフィード`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsOver(event.dataTransfer.types.includes('application/rss-blocks-feed'));
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOver(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsOver(false);
          onFeedDrop(event, groupData.id);
        }}
      >
        {feeds
          .filter((feed) => feed.group === groupData.id)
          .map((feed) => (
            <FeedCard
              key={`${feed.url}-${feed.group}`}
              feed={feed}
              groupId={groupData.id}
              status={statusByUrl[feed.url]}
              items={itemsByUrl[feed.url]}
              onOpenArticle={onOpenArticle}
              onPlayAudio={onPlayAudio}
              onRemove={onRemoveFeed}
              onUpdate={onUpdateFeed}
              onDragStart={onFeedDragStart}
              onDrop={onFeedDrop}
            />
          ))}
      </ul>
    </li>
  );
}
