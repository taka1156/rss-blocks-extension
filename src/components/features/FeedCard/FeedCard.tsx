import { useState } from 'react';
import { FeedItemRow } from '@/components/features/FeedItemRow/FeedItemRow';
import { useCardDragState } from '@/hooks/useCardDragState';
import { useColorPreview } from '@/hooks/useColorPreview';
import { useEditState } from '@/hooks/useEditState';
import type { Feed } from '@/storage/feedDashboard';
import type { FeedItem } from '@/utils/feedDashboard';
import { EditForm, type EditValues } from '../EditForm/EditForm';
import {
  actions,
  block,
  blockHead,
  dragging,
  errorStatus,
  handle,
  icon,
  itemList,
  removeIcon,
  status,
  subtitle,
  title,
  titleText,
} from './FeedCard.css';

type FeedCardProps = {
  feed: Feed;
  groupId?: string;
  status?: { loading?: boolean; error?: string | null };
  items?: FeedItem[];
  onOpenArticle: (title: string, url: string) => boolean;
  onPlayAudio: (title: string, url: string) => void;
  onRemove: (url: string) => void;
  onUpdate: (url: string, patch: EditValues) => boolean;
  onDragStart: (event: React.DragEvent<HTMLElement>, feed: Feed) => void;
  onDrop: (event: React.DragEvent<HTMLElement>, groupId: string) => void;
};

export function FeedCard({
  feed,
  groupId = '',
  status: feedStatus,
  items = [],
  onOpenArticle,
  onPlayAudio,
  onRemove,
  onUpdate,
  onDragStart,
  onDrop,
}: FeedCardProps) {
  const { editing, setEditing } = useEditState();
  const { dragReady, setDragReady, isDragging, setIsDragging } = useCardDragState();
  const { finalColor: borderColor, setPreviewColor, resetPreview } = useColorPreview(feed.color);
  const [openArticleUrl, setOpenArticleUrl] = useState<string>('');
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string>('');

  const closeEdit = () => {
    setEditing(false);
    resetPreview();
  };
  const handleOpenArticle = (title: string, url: string) => {
    setOpenArticleUrl(url);
    return onOpenArticle(title, url);
  };
  const handlePlayAudio = (title: string, url: string) => {
    setPlayingAudioUrl(playingAudioUrl === url ? '' : url);
    onPlayAudio(title, url);
  };
  const statusText = feedStatus?.loading ? '読み込み中…' : (feedStatus?.error ?? '');

  return (
    <li
      className={`${block} ${isDragging ? dragging : ''}`.trim()}
      style={borderColor ? { borderColor } : undefined}
      draggable={dragReady}
      onDragStart={(event) => {
        if (!dragReady) return;
        event.stopPropagation();
        setIsDragging(true);
        onDragStart(event, feed);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        setDragReady(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDrop(event, groupId);
      }}
    >
      <div className={blockHead}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer-only drag handle */}
        <span
          className={handle}
          title="ドラッグして移動"
          onMouseDown={() => setDragReady(true)}
          onMouseUp={() => setDragReady(false)}
        >
          ⠿
        </span>
        <h2 className={title}>
          <span className={titleText}>{feed.title || feed.url}</span>
          <small className={subtitle}>{feed.url}</small>
        </h2>
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
            className={`${icon} ${removeIcon}`}
            title="削除"
            onClick={() => onRemove(feed.url)}
          >
            ×
          </button>
        </div>
      </div>
      {editing && (
        <EditForm
          titleLabel="タイトル"
          titlePlaceholder="空欄ならフィードのタイトルを使用"
          showUrl
          initial={{ title: feed.title, url: feed.url, color: feed.color }}
          onColorPreview={setPreviewColor}
          onCancel={closeEdit}
          onSubmit={(values) => {
            if (onUpdate(feed.url, values)) closeEdit();
          }}
        />
      )}
      {statusText && (
        <div className={`${status} ${feedStatus?.error ? errorStatus : ''}`.trim()}>
          {statusText}
        </div>
      )}
      {items.length > 0 && (
        <ul className={itemList}>
          {items.map((item) => (
            <FeedItemRow
              key={item.link || `${item.title}-${item.date}`}
              item={item}
              isArticleOpen={!!item.link && openArticleUrl === item.link}
              isAudioPlaying={playingAudioUrl === item.audio}
              onOpenArticle={handleOpenArticle}
              onPlayAudio={handlePlayAudio}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
