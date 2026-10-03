import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DashboardHeader } from './DashboardHeader';

describe('DashboardHeader', () => {
  const defaultProps = {
    sideOpen: false,
    onOpenAddPanel: vi.fn(),
    onOpenSettingsPanel: vi.fn(),
    onAddGroup: vi.fn(),
    onRefresh: vi.fn(),
    onSideOpenChange: vi.fn(),
  };

  it('renders header with title', () => {
    render(<DashboardHeader {...defaultProps} />);
    expect(screen.getByText('RSS Decks')).toBeInTheDocument();
  });

  it('renders all action buttons', () => {
    render(<DashboardHeader {...defaultProps} />);
    expect(screen.getByRole('button', { name: /追加/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /グループ/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /更新/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /設定/i })).toBeInTheDocument();
  });

  it('calls onOpenAddPanel when add button is clicked', async () => {
    const handleOpenAddPanel = vi.fn();
    render(<DashboardHeader {...defaultProps} onOpenAddPanel={handleOpenAddPanel} />);
    await userEvent.setup().click(screen.getByRole('button', { name: /追加/i }));
    expect(handleOpenAddPanel).toHaveBeenCalledOnce();
  });

  it('calls onAddGroup when group button is clicked', async () => {
    const handleAddGroup = vi.fn();
    render(<DashboardHeader {...defaultProps} onAddGroup={handleAddGroup} />);
    const groupButton = screen.getByRole('button', { name: /グループ/i });
    await userEvent.setup().click(groupButton);
    expect(handleAddGroup).toHaveBeenCalledOnce();
  });

  it('calls onRefresh when refresh button is clicked', async () => {
    const handleRefresh = vi.fn();
    render(<DashboardHeader {...defaultProps} onRefresh={handleRefresh} />);
    const refreshButton = screen.getByRole('button', { name: /更新/i });
    await userEvent.setup().click(refreshButton);
    expect(handleRefresh).toHaveBeenCalledOnce();
  });

  it('calls onOpenSettingsPanel when settings button is clicked', async () => {
    const handleOpenSettingsPanel = vi.fn();
    render(<DashboardHeader {...defaultProps} onOpenSettingsPanel={handleOpenSettingsPanel} />);
    const settingsButton = screen.getByRole('button', { name: /設定/i });
    await userEvent.setup().click(settingsButton);
    expect(handleOpenSettingsPanel).toHaveBeenCalledOnce();
  });

  it('renders checkbox for side open toggle', () => {
    render(<DashboardHeader {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox', { name: /記事を横で開く/i });
    expect(checkbox).toBeInTheDocument();
  });

  it('reflects sideOpen state in checkbox', () => {
    const { rerender } = render(<DashboardHeader {...defaultProps} sideOpen={false} />);
    let checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    rerender(<DashboardHeader {...defaultProps} sideOpen={true} />);
    checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('calls onSideOpenChange when checkbox is toggled', async () => {
    const handleSideOpenChange = vi.fn();
    render(<DashboardHeader {...defaultProps} onSideOpenChange={handleSideOpenChange} />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.setup().click(checkbox);
    expect(handleSideOpenChange).toHaveBeenCalledWith(true);
  });

  it('has correct button attributes', () => {
    render(<DashboardHeader {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    const addButton = buttons.find((button) => button.textContent?.includes('追加'));
    expect(addButton).toHaveAttribute('aria-controls', 'addPanel');
    const settingsButton = buttons.find((button) => button.textContent?.includes('設定'));
    expect(settingsButton).toHaveAttribute('aria-haspopup', 'dialog');
  });
});
