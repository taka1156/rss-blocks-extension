import { useEffect, useState } from 'react';
import { BaseButton } from '@/components/shared/BaseButton/BaseButton';
import { BaseDialog } from '@/components/shared/BaseDialog/BaseDialog';
import { BaseInput } from '@/components/shared/BaseInput/BaseInput';
import { controls, input, panel, tabButton, tabList } from './AddFeedDialog.css';

type AddFeedDialogProps = {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onSubmitFeed: (url: string) => Promise<boolean>;
  onSubmitShortcut: (url: string) => Promise<boolean>;
};

export function AddFeedDialog({
  open,
  onOpenChange,
  onSubmitFeed,
  onSubmitShortcut,
}: AddFeedDialogProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'shortcut'>('feed');

  useEffect(() => {
    if (!open) {
      setActiveTab('feed');
    }
  }, [open]);

  const closeDialog = () => {
    onOpenChange(false);
  };

  return (
    <BaseDialog
      id="addPanel"
      title="追加"
      titleId="addPanelTitle"
      closeButtonId="addPanelClose"
      open={open}
      onOpenChange={onOpenChange}
      onClose={closeDialog}
    >
      <div className={tabList} role="tablist" aria-label="追加する種類">
        <BaseButton
          id="feedTab"
          className={tabButton}
          type="button"
          role="tab"
          aria-controls="feedPanel"
          aria-selected={activeTab === 'feed'}
          onClick={() => setActiveTab('feed')}
        >
          RSS追加
        </BaseButton>
        <BaseButton
          id="shortcutTab"
          className={tabButton}
          type="button"
          role="tab"
          aria-controls="shortcutPanel"
          aria-selected={activeTab === 'shortcut'}
          tabIndex={activeTab === 'shortcut' ? 0 : -1}
          onClick={() => setActiveTab('shortcut')}
        >
          ショートカット追加
        </BaseButton>
      </div>
      {activeTab === 'feed' && (
        <div id="feedPanel" className={panel} role="tabpanel" aria-labelledby="feedTab">
          <form
            id="feedForm"
            className={controls}
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const input = form.elements.namedItem('urlInput') as HTMLInputElement | null;
              if (!input) return;
              void onSubmitFeed(input.value).then((ok) => {
                if (ok) {
                  form.reset();
                  closeDialog();
                }
              });
            }}
          >
            <BaseInput
              id="urlInput"
              className={input}
              name="urlInput"
              type="url"
              placeholder="フィードURLを入力 (https://...)"
              required
            />
            <BaseButton id="addBtn" type="submit">
              追加
            </BaseButton>
          </form>
        </div>
      )}
      {activeTab === 'shortcut' && (
        <div id="shortcutPanel" className={panel} role="tabpanel" aria-labelledby="shortcutTab">
          <form
            id="shortcutForm"
            className={controls}
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const input = form.elements.namedItem('shortcutUrl') as HTMLInputElement | null;
              if (!input) return;
              void onSubmitShortcut(input.value).then((ok) => {
                if (ok) {
                  form.reset();
                  closeDialog();
                }
              });
            }}
          >
            <BaseInput
              id="shortcutUrl"
              className={input}
              name="shortcutUrl"
              type="url"
              placeholder="ショートカットURLを入力"
              required
            />
            <BaseButton type="submit">追加</BaseButton>
          </form>
        </div>
      )}
    </BaseDialog>
  );
}
