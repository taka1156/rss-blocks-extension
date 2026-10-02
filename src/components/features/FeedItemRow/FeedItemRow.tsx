import { type FeedItem, formatFeedDate } from '@/utils/feedDashboard';
import { icon } from '../FeedCard/FeedCard.css';
import { itemBody, itemDate, itemLink, itemRow, itemStatus, itemThumb } from './FeedItemRow.css';

type FeedItemRowProps = {
  item: FeedItem;
  isArticleOpen: boolean;
  isAudioPlaying: boolean;
  onOpenArticle: (title: string, url: string) => boolean;
  onPlayAudio: (title: string, url: string) => void;
};

export function FeedItemRow({
  item,
  isArticleOpen,
  isAudioPlaying,
  onOpenArticle,
  onPlayAudio,
}: FeedItemRowProps) {
  return (
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
        {isArticleOpen && <span className={itemStatus}>閲覧中</span>}
        {formatFeedDate(item.date) && (
          <time className={itemDate} dateTime={item.date}>
            {formatFeedDate(item.date)}
          </time>
        )}
        {item.audio && (
          <button
            type="button"
            className={icon}
            title={isAudioPlaying ? '再生中' : '再生'}
            onClick={() => onPlayAudio(item.title, item.audio)}
          >
            {isAudioPlaying ? '⏸' : '▶'} {isAudioPlaying && '再生中'}
          </button>
        )}
      </div>
    </li>
  );
}
