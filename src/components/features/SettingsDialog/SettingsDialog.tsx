import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@/components/shared/BaseButton/BaseButton';
import { BaseDialog } from '@/components/shared/BaseDialog/BaseDialog';
import { BaseInput } from '@/components/shared/BaseInput/BaseInput';
import {
  type DashboardState,
  loadDashboardState,
  saveDashboardFlag,
  saveDashboardState,
  saveShortcuts,
} from '@/storage/feedDashboard';
import { importSettings, settingsBody } from './SettingsDialog.css';

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onImport: (nextState: DashboardState) => void | Promise<void>;
};

function isDashboardState(value: unknown): value is Partial<DashboardState> {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.feeds === undefined || Array.isArray(candidate.feeds)) &&
    (candidate.groups === undefined || Array.isArray(candidate.groups)) &&
    (candidate.shortcuts === undefined || Array.isArray(candidate.shortcuts)) &&
    (candidate.sideOpen === undefined || typeof candidate.sideOpen === 'boolean')
  );
}

export function SettingsDialog({ open, onOpenChange, onImport }: SettingsDialogProps) {
  const { t } = useTranslation();
  const closeDialog = () => {
    onOpenChange(false);
  };

  const handleExport = useCallback(async () => {
    const state = await loadDashboardState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rss-blocks-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as unknown;

        if (!isDashboardState(parsed)) {
          window.alert(t('settings.invalidFormat'));
          event.target.value = '';
          return;
        }

        const nextState: DashboardState = {
          feeds: Array.isArray(parsed.feeds)
            ? parsed.feeds
                .map((item) => {
                  if (!item || typeof item !== 'object') return null;
                  const candidate = item as Partial<{
                    url: unknown;
                    title: unknown;
                    color: unknown;
                    group: unknown;
                  }>;
                  const url = typeof candidate.url === 'string' ? candidate.url.trim() : '';
                  if (!url) return null;
                  return {
                    url,
                    title: typeof candidate.title === 'string' ? candidate.title.trim() : '',
                    color: typeof candidate.color === 'string' ? candidate.color.trim() : '',
                    group: typeof candidate.group === 'string' ? candidate.group.trim() : '',
                  };
                })
                .filter(
                  (feed): feed is { url: string; title: string; color: string; group: string } =>
                    feed !== null,
                )
            : [],
          groups: Array.isArray(parsed.groups)
            ? parsed.groups
                .map((item) => {
                  if (!item || typeof item !== 'object') return null;
                  const candidate = item as Partial<{
                    id: unknown;
                    title: unknown;
                    color: unknown;
                    collapsed: unknown;
                  }>;
                  const id = typeof candidate.id === 'string' ? candidate.id.trim() : '';
                  if (!id) return null;
                  return {
                    id,
                    title:
                      typeof candidate.title === 'string' && candidate.title.trim()
                        ? candidate.title.trim()
                        : '新しいグループ',
                    color: typeof candidate.color === 'string' ? candidate.color.trim() : '',
                    collapsed:
                      typeof candidate.collapsed === 'boolean' ? candidate.collapsed : false,
                  };
                })
                .filter(
                  (
                    group,
                  ): group is { id: string; title: string; color: string; collapsed: boolean } =>
                    group !== null,
                )
            : [],
          shortcuts: Array.isArray(parsed.shortcuts)
            ? parsed.shortcuts
                .map((item) => {
                  if (!item || typeof item !== 'object') return null;
                  const candidate = item as Partial<{ url: unknown }>;
                  const url = typeof candidate.url === 'string' ? candidate.url.trim() : '';
                  if (!url) return null;
                  return { url };
                })
                .filter((shortcut): shortcut is { url: string } => shortcut !== null)
            : [],
          sideOpen: typeof parsed.sideOpen === 'boolean' ? parsed.sideOpen : true,
        };

        await saveDashboardState(nextState.feeds, nextState.groups);
        await saveShortcuts(nextState.shortcuts);
        await saveDashboardFlag('sideOpen', nextState.sideOpen);

        await onImport(nextState);
        event.target.value = '';
        onOpenChange(false);
      } catch {
        window.alert(t('settings.readFailed'));
        event.target.value = '';
      }
    },
    [onImport, onOpenChange, t],
  );

  return (
    <BaseDialog
      id="settingsPanel"
      title={t('settings.title')}
      titleId="settingsPanelTitle"
      closeButtonId="settingsClose"
      bodyClassName={settingsBody}
      open={open}
      onOpenChange={onOpenChange}
      onClose={closeDialog}
    >
      <BaseButton id="exportSettings" type="button" onClick={() => void handleExport()}>
        {t('settings.export')}
      </BaseButton>
      <label className={importSettings} htmlFor="importSettings">
        {t('settings.import')}
        <BaseInput
          id="importSettings"
          type="file"
          accept=".json,application/json"
          onChange={(event) => {
            void handleImport(event);
          }}
        />
      </label>
    </BaseDialog>
  );
}
