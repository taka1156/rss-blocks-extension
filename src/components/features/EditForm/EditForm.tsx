import { type FormEvent, useState } from 'react';
import { BaseButton } from '@/components/shared/BaseButton/BaseButton';
import { buttons, colorInput, colorRow, form, label } from './EditForm.css';

export type EditValues = { title: string; url: string; color: string };

type EditFormProps = {
  titleLabel: string;
  titlePlaceholder?: string;
  titleRequired?: boolean;
  showUrl?: boolean;
  initial: EditValues;
  onColorPreview: (color: string | undefined) => void;
  onSubmit: (values: EditValues) => void;
  onCancel: () => void;
};

export function EditForm({
  titleLabel,
  titlePlaceholder,
  titleRequired = false,
  showUrl = false,
  initial,
  onColorPreview,
  onSubmit,
  onCancel,
}: EditFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [url, setUrl] = useState(initial.url);
  const [color, setColor] = useState(initial.color);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ title: title.trim(), url: url.trim(), color });
  };

  return (
    <form className={form} onSubmit={handleSubmit}>
      <label className={label}>
        {titleLabel}
        <input
          name="title"
          value={title}
          placeholder={titlePlaceholder}
          required={titleRequired}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      {showUrl && (
        <label className={label}>
          URL
          <input
            name="url"
            type="url"
            value={url}
            required
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
      )}
      <label className={label}>
        枠線の色
        <span className={colorRow}>
          <input
            className={colorInput}
            name="color"
            type="color"
            value={color || '#2563eb'}
            onChange={(event) => {
              setColor(event.target.value);
              onColorPreview(event.target.value);
            }}
          />
          <BaseButton
            type="button"
            variant="secondary"
            onClick={() => {
              setColor('');
              onColorPreview('');
            }}
          >
            標準に戻す
          </BaseButton>
        </span>
      </label>
      <div className={buttons}>
        <BaseButton type="submit">保存</BaseButton>
        <BaseButton type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </BaseButton>
      </div>
    </form>
  );
}
