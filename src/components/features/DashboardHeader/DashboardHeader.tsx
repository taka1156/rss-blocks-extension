import { BaseButton } from '@/components/shared/BaseButton/BaseButton';
import { BaseInput } from '@/components/shared/BaseInput/BaseInput';
import { checkLabel, header, title, tools } from './DashboardHeader.css';

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
      <h1 className={title}>RSS Blocks</h1>
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
