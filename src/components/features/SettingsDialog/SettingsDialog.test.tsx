import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsDialog } from './SettingsDialog';

// Mock storage functions
vi.mock('@/storage/feedDashboard', () => ({
  loadDashboardState: vi.fn(() =>
    Promise.resolve({
      feeds: [{ url: 'https://example.com/feed', title: 'Feed', color: '#2563eb', group: '' }],
      groups: [{ id: 'group1', title: 'Group', color: '#ff0000', collapsed: false }],
      shortcuts: [{ url: 'https://example.com' }],
      sideOpen: false,
    }),
  ),
  saveDashboardState: vi.fn(() => Promise.resolve()),
  saveShortcuts: vi.fn(() => Promise.resolve()),
  saveDashboardFlag: vi.fn(() => Promise.resolve()),
}));

describe('SettingsDialog', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    // Mock URL.createObjectURL
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    open: false,
    onOpenChange: vi.fn(),
    onImport: vi.fn(),
  };

  it('renders dialog when open is true', () => {
    render(<SettingsDialog {...defaultProps} open={true} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<SettingsDialog {...defaultProps} open={true} />);
    const closeButton = screen.getByRole('button', { name: /閉じる/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onOpenChange when close button is clicked', async () => {
    const handleOpenChange = vi.fn();
    render(<SettingsDialog {...defaultProps} open={true} onOpenChange={handleOpenChange} />);
    const closeButton = screen.getByRole('button', { name: /閉じる/i });
    await userEvent.setup().click(closeButton);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders export button', () => {
    render(<SettingsDialog {...defaultProps} open={true} />);
    const exportButton = screen.getByRole('button', { name: /エクスポート|export/i });
    expect(exportButton).toBeInTheDocument();
  });

  it('renders import input', () => {
    render(<SettingsDialog {...defaultProps} open={true} />);
    const importInput = screen.getByDisplayValue('') as HTMLInputElement;
    // The import input should exist (though it might be hidden)
    expect(importInput.type).toBe('file');
  });

  it('calls onImport with valid dashboard state', async () => {
    const handleImport = vi.fn();
    render(<SettingsDialog {...defaultProps} open={true} onImport={handleImport} />);

    const validState = {
      feeds: [{ url: 'https://example.com/feed', title: 'Test', color: '', group: '' }],
      groups: [],
      shortcuts: [],
      sideOpen: true,
    };

    const file = new File([JSON.stringify(validState)], 'settings.json', {
      type: 'application/json',
    });

    const importInput = screen.getByDisplayValue('') as HTMLInputElement;
    await userEvent.setup().upload(importInput, file);

    await waitFor(() => {
      expect(handleImport).toHaveBeenCalled();
    });
  });

  it('handles invalid JSON gracefully', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<SettingsDialog {...defaultProps} open={true} onImport={vi.fn()} />);

    const file = new File(['invalid json'], 'settings.json', {
      type: 'application/json',
    });

    const importInput = screen.getByDisplayValue('') as HTMLInputElement;
    await userEvent.setup().upload(importInput, file);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it('rejects invalid dashboard state', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<SettingsDialog {...defaultProps} open={true} onImport={vi.fn()} />);

    const invalidState = {
      feeds: 'not-an-array', // Invalid
      groups: [],
    };

    const file = new File([JSON.stringify(invalidState)], 'settings.json', {
      type: 'application/json',
    });

    const importInput = screen.getByDisplayValue('') as HTMLInputElement;
    await userEvent.setup().upload(importInput, file);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('形式が正しくありません'));
    });

    alertSpy.mockRestore();
  });

  it('accepts partial dashboard state', async () => {
    const handleImport = vi.fn();
    render(<SettingsDialog {...defaultProps} open={true} onImport={handleImport} />);

    const partialState = {
      feeds: [{ url: 'https://example.com/feed', title: '', color: '', group: '' }],
      // groups and shortcuts are undefined, which is valid
    };

    const file = new File([JSON.stringify(partialState)], 'settings.json', {
      type: 'application/json',
    });

    const importInput = screen.getByDisplayValue('') as HTMLInputElement;
    await userEvent.setup().upload(importInput, file);

    await waitFor(() => {
      expect(handleImport).toHaveBeenCalled();
    });
  });

  it('filters out invalid feed items on import', async () => {
    const handleImport = vi.fn();
    render(<SettingsDialog {...defaultProps} open={true} onImport={handleImport} />);

    const state = {
      feeds: [
        { url: 'https://valid.com/feed', title: 'Valid', color: '', group: '' },
        { url: '', title: 'Invalid - no URL', color: '', group: '' }, // Should be filtered
        null, // Should be filtered
      ],
    };

    const file = new File([JSON.stringify(state)], 'settings.json', {
      type: 'application/json',
    });

    const importInput = screen.getByDisplayValue('') as HTMLInputElement;
    await userEvent.setup().upload(importInput, file);

    await waitFor(() => {
      expect(handleImport).toHaveBeenCalled();
      const calls = handleImport.mock.calls;
      if (calls.length > 0 && calls[0]) {
        const importedData = calls[0][0];
        expect(importedData?.feeds?.length).toBe(1);
      }
    });
  });
});
