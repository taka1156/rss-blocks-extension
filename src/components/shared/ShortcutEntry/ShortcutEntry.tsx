import { useState } from 'react';
import { entry, fallback, icon, link, removeButton } from './ShortcutEntry.css';

type ShortcutEntryProps = {
  url: string;
  onRemove: (url: string) => void;
};

export function ShortcutEntry({ url, onRemove }: ShortcutEntryProps) {
  const [iconFailed, setIconFailed] = useState(false);
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const hostname = parsed.hostname.replace(/^www\./, '');

  return (
    <div className={entry}>
      <a
        className={link}
        href={parsed.href}
        target="_blank"
        rel="noopener noreferrer"
        title={parsed.href}
      >
        {iconFailed ? (
          <span className={fallback}>{hostname.charAt(0).toUpperCase()}</span>
        ) : (
          <img
            className={icon}
            alt=""
            src={`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(parsed.href)}&sz=64`}
            onError={() => setIconFailed(true)}
          />
        )}
        <span>{hostname}</span>
      </a>
      <button
        type="button"
        className={removeButton}
        aria-label={`${hostname} を削除`}
        title={`${hostname} を削除`}
        onClick={() => onRemove(url)}
      >
        ×
      </button>
    </div>
  );
}
