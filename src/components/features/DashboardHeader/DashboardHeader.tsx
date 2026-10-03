import { useTranslation } from 'react-i18next';
import iconUrl from '@/assets/icon.png';
import { LanguageMenu } from '@/components/features/LanguageMenu/LanguageMenu';
import { BaseButton } from '@/components/shared/BaseButton/BaseButton';
import { baseButton, buttonSub } from '@/components/shared/BaseButton/BaseButton.css';
import { BaseInput } from '@/components/shared/BaseInput/BaseInput';
import {
  brand,
  brandIcon,
  checkLabel,
  header,
  helpLink,
  title,
  tools,
} from './DashboardHeader.css';

type DashboardHeaderProps = {
  // Omit the dashboard handlers to render the minimal header used by the help page.
  sideOpen?: boolean;
  onOpenAddPanel?: () => void;
  onOpenSettingsPanel?: () => void;
  onAddGroup?: () => void;
  onRefresh?: () => void;
  onSideOpenChange?: (checked: boolean) => void;
};

export function DashboardHeader({
  sideOpen = false,
  onOpenAddPanel,
  onOpenSettingsPanel,
  onAddGroup,
  onRefresh,
  onSideOpenChange,
}: DashboardHeaderProps) {
  const { t } = useTranslation();
  const isDashboard = Boolean(onOpenAddPanel);

  return (
    <header className={header}>
      <div className={brand}>
        <img className={brandIcon} src={iconUrl} alt="RSS Decks Logo" />
        <h1 className={title}>RSS Decks</h1>
      </div>
      <div className={tools}>
        {isDashboard && (
          <>
            <BaseButton
              id="addPanelToggle"
              type="button"
              aria-controls="addPanel"
              onClick={onOpenAddPanel}
            >
              {t('header.add')}
            </BaseButton>
            <BaseButton id="addGroupBtn" type="button" variant="secondary" onClick={onAddGroup}>
              {t('header.addGroup')}
            </BaseButton>
            <BaseButton id="refreshBtn" type="button" variant="secondary" onClick={onRefresh}>
              {t('header.refresh')}
            </BaseButton>
            <BaseButton
              id="settingsToggle"
              type="button"
              variant="secondary"
              aria-haspopup="dialog"
              onClick={onOpenSettingsPanel}
            >
              {t('header.settings')}
            </BaseButton>
            <a
              id="helpLink"
              className={`${baseButton} ${buttonSub} ${helpLink}`}
              href="/help.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('header.help')}
            </a>
            <label className={checkLabel} htmlFor="sideToggle">
              <BaseInput
                type="checkbox"
                id="sideToggle"
                checked={sideOpen}
                onChange={(event) => onSideOpenChange?.(event.target.checked)}
              />
              {t('header.sideToggle')}
            </label>
          </>
        )}
        <LanguageMenu />
      </div>
    </header>
  );
}
