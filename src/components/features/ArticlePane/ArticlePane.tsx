import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@/components/shared/BaseButton/BaseButton';
import {
  articleFrame,
  articleTitle,
  articleWrap,
  audioBar,
  audioTitle,
  pane,
  paneHead,
  player,
  resizeHandle,
} from './ArticlePane.css';

type ArticlePaneProps = {
  title: string;
  url: string;
  audioLabel: string;
  audioUrl: string;
  onCloseArticle: () => void;
  onCloseAudio: () => void;
};

// Feed audio has no captions; an empty WebVTT keeps the track valid without an empty src.
const emptyCaptions = 'data:text/vtt,WEBVTT';

export function ArticlePane({
  title,
  url,
  audioLabel,
  audioUrl,
  onCloseArticle,
  onCloseAudio,
}: ArticlePaneProps) {
  const { t } = useTranslation();
  const visible = Boolean(url || audioUrl);
  const paneRef = useRef<HTMLElement>(null);
  const [paneWidth, setPaneWidthState] = useState(() => Math.max(380, window.innerWidth * 0.42));
  const minWidth = Math.min(280, window.innerWidth * 0.25);
  const maxWidth = window.innerWidth * 0.8;

  const setPaneWidth = (width: number) => {
    const next = Math.round(Math.max(minWidth, Math.min(maxWidth, width)));
    setPaneWidthState(next);
    document.documentElement.style.setProperty('--paneWidth', `${next}px`);
  };

  useEffect(() => {
    const apply = () => {
      const min = Math.min(280, window.innerWidth * 0.25);
      const max = window.innerWidth * 0.8;
      const next = Math.round(Math.max(min, Math.min(max, paneWidth)));
      document.documentElement.style.setProperty('--paneWidth', `${next}px`);
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [paneWidth]);

  useEffect(() => {
    document.body.classList.toggle('pane-open', visible);
    return () => document.body.classList.remove('pane-open');
  }, [visible]);

  if (!visible) return null;

  return (
    <aside id="pane" className={pane} ref={paneRef}>
      <hr
        id="paneResizeHandle"
        className={resizeHandle}
        aria-orientation="vertical"
        aria-label={t('article.paneWidth')}
        aria-valuemin={Math.round(minWidth)}
        aria-valuemax={Math.round(maxWidth)}
        aria-valuenow={paneWidth}
        tabIndex={0}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setPaneWidth(window.innerWidth - event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            setPaneWidth(window.innerWidth - event.clientX);
          }
        }}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          const current = paneRef.current?.getBoundingClientRect().width ?? paneWidth;
          setPaneWidth(current + (event.key === 'ArrowLeft' ? 16 : -16));
        }}
      />
      {audioUrl && (
        <div id="audioBar" className={audioBar}>
          <span id="audioTitle" className={audioTitle}>
            {audioLabel}
          </span>
          <BaseButton
            id="audioClose"
            type="button"
            variant="icon"
            title={t('article.closePlayer')}
            onClick={onCloseAudio}
          >
            ×
          </BaseButton>
          <audio className={player} controls autoPlay src={audioUrl}>
            <track
              kind="captions"
              srcLang="ja"
              label={t('article.captionsLabel')}
              src={emptyCaptions}
              default
            />
          </audio>
        </div>
      )}
      {url && (
        <div id="articleWrap" className={articleWrap}>
          <div className={paneHead}>
            <span id="articleTitle" className={articleTitle}>
              {title || url}
            </span>
            <BaseButton
              id="articleOpen"
              type="button"
              variant="icon"
              title={t('article.openInNewTab')}
              onClick={() => window.open(url, '_blank', 'noopener')}
            >
              ↗
            </BaseButton>
            <BaseButton
              id="articleClose"
              type="button"
              variant="icon"
              title={t('common.close')}
              onClick={onCloseArticle}
            >
              ×
            </BaseButton>
          </div>
          <iframe
            id="articleFrame"
            className={articleFrame}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            referrerPolicy="no-referrer"
            title={t('article.title')}
            src={url}
          />
        </div>
      )}
    </aside>
  );
}
