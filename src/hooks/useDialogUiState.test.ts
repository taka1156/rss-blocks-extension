import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDialogUiState } from './useDialogUiState';

describe('useDialogUiState', () => {
  it('has initial state', () => {
    const { result } = renderHook(() => useDialogUiState());
    expect(result.current.addPanelOpen).toBe(false);
    expect(result.current.settingsPanelOpen).toBe(false);
    expect(result.current.activeTab).toBe('feed');
  });

  it('opens and closes the add panel', () => {
    const { result } = renderHook(() => useDialogUiState());
    act(() => result.current.openAddPanel());
    expect(result.current.addPanelOpen).toBe(true);
    act(() => result.current.closeAddPanel());
    expect(result.current.addPanelOpen).toBe(false);
  });

  it('opens and closes the settings panel', () => {
    const { result } = renderHook(() => useDialogUiState());
    act(() => result.current.openSettingsPanel());
    expect(result.current.settingsPanelOpen).toBe(true);
    act(() => result.current.closeSettingsPanel());
    expect(result.current.settingsPanelOpen).toBe(false);
  });

  it('selects a tab', () => {
    const { result } = renderHook(() => useDialogUiState());
    act(() => result.current.selectTab('shortcut'));
    expect(result.current.activeTab).toBe('shortcut');
  });
});
