import { useCallback, useState } from 'react';

export function useDialogUiState() {
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'shortcut'>('feed');

  const openAddPanel = useCallback(() => setAddPanelOpen(true), []);
  const closeAddPanel = useCallback(() => setAddPanelOpen(false), []);
  const openSettingsPanel = useCallback(() => setSettingsPanelOpen(true), []);
  const closeSettingsPanel = useCallback(() => setSettingsPanelOpen(false), []);
  const selectTab = useCallback((tab: 'feed' | 'shortcut') => setActiveTab(tab), []);

  return {
    addPanelOpen,
    settingsPanelOpen,
    activeTab,
    openAddPanel,
    closeAddPanel,
    openSettingsPanel,
    closeSettingsPanel,
    selectTab,
  };
}
