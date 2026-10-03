import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@/components/shared/BaseButton/BaseButton';
import { menu, menuItem, menuItemActive, root } from './LanguageMenu.css';

const LANGUAGES = ['ja', 'en'] as const;

export function LanguageMenu() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={root} ref={rootRef}>
      <BaseButton
        id="languageToggle"
        type="button"
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('header.languageLabel')}
        onClick={() => setOpen((prev) => !prev)}
      >
        🌐 {t(`header.language.${i18n.language.startsWith('ja') ? 'ja' : 'en'}`)} ▾
      </BaseButton>
      {open && (
        <div className={menu} role="menu">
          {LANGUAGES.map((lang) => {
            const active = i18n.language.startsWith(lang);
            return (
              <button
                key={lang}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                lang={lang}
                className={`${menuItem} ${active ? menuItemActive : ''}`.trim()}
                onClick={() => {
                  void i18n.changeLanguage(lang);
                  setOpen(false);
                }}
              >
                {t(`header.language.${lang}`)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
