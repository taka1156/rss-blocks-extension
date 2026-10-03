import iconUrl from '@/assets/icon.png';
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
  sideOpen: boolean;
  onOpenAddPanel: () => void;
  onOpenSettingsPanel: () => void;
  onAddGroup: () => void;
  onRefresh: () => void;
  onSideOpenChange: (checked: boolean) => void;
};

export function DashboardHeader({
  sideOpen,
  onOpenAddPanel,
  onOpenSettingsPanel,
  onAddGroup,
  onRefresh,
  onSideOpenChange,
}: DashboardHeaderProps) {
  return (
    <header className={header}>
      <div className={brand}>
        <img className={brandIcon} src={iconUrl} alt="RSS Decks Logo" />
        <h1 className={title}>RSS Decks</h1>
      </div>
      <div className={tools}>
        <BaseButton
          id="addPanelToggle"
          type="button"
          aria-controls="addPanel"
          onClick={onOpenAddPanel}
        >
          ＋ 追加
        </BaseButton>
        <BaseButton id="addGroupBtn" type="button" variant="secondary" onClick={onAddGroup}>
          ＋ グループ
        </BaseButton>
        <BaseButton id="refreshBtn" type="button" variant="secondary" onClick={onRefresh}>
          更新
        </BaseButton>
        <BaseButton
          id="settingsToggle"
          type="button"
          variant="secondary"
          aria-haspopup="dialog"
          onClick={onOpenSettingsPanel}
        >
          ⚙ 設定
        </BaseButton>
        <a
          id="helpLink"
          className={`${baseButton} ${buttonSub} ${helpLink}`}
          href="/help.html"
          target="_blank"
          rel="noreferrer"
        >
          ? ヘルプ
        </a>
        <label className={checkLabel} htmlFor="sideToggle">
          <BaseInput
            type="checkbox"
            id="sideToggle"
            checked={sideOpen}
            onChange={(event) => onSideOpenChange(event.target.checked)}
          />
          記事を横で開く
        </label>
      </div>
    </header>
  );
}
