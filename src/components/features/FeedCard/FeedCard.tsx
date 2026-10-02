import { useCardDragState } from '@/hooks/useCardDragState';
import { useColorPreview } from '@/hooks/useColorPreview';
import { useEditState } from '@/hooks/useEditState';
import type { Feed } from '@/storage/feedDashboard';
import { type FeedItem, formatFeedDate } from '@/utils/feedDashboard';
import { EditForm, type EditValues } from '../EditForm/EditForm';
import {
  actions,
  block,
  blockHead,
  dragging,
  errorStatus,
  handle,
  icon,
  itemBody,
  itemDate,
  itemLink,
  itemList,
  itemRow,
  itemThumb,
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

  const closeEdit = () => {
    setEditing(false);
    resetPreview();
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
            <li className={itemRow} key={item.link || `${item.title}-${item.date}`}>
              {item.thumb && <img className={itemThumb} src={item.thumb} alt="" loading="lazy" />}
              <div className={itemBody}>
                <a
                  className={itemLink}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    if (!item.link) return;
                    if (onOpenArticle(item.title, item.link)) event.preventDefault();
                  }}
                >
                  {item.title || item.link || '(無題)'}
                </a>
                {formatFeedDate(item.date) && (
                  <time className={itemDate} dateTime={item.date}>
                    {formatFeedDate(item.date)}
                  </time>
                )}
                {item.audio && (
                  <button
                    type="button"
                    className={icon}
                    title="再生"
                    onClick={() => onPlayAudio(item.title, item.audio)}
                  >
                    ▶
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
