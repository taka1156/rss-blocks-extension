import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AddFeedDialog } from './AddFeedDialog';

describe('AddFeedDialog', () => {
  const defaultProps = {
    open: false,
    onOpenChange: vi.fn(),
    onSubmitFeed: vi.fn(() => Promise.resolve(true)),
    onSubmitShortcut: vi.fn(() => Promise.resolve(true)),
  };

  it('renders dialog when open is true', () => {
    const { container } = render(<AddFeedDialog {...defaultProps} open={true} />);
    expect(container.querySelector('dialog')).toBeInTheDocument();
  });

  it('renders feed and shortcut tabs', () => {
    const { container } = render(<AddFeedDialog {...defaultProps} open={true} />);
    const tabButtons = container.querySelectorAll('[role="tab"]');
    expect(tabButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('shows feed panel by default', () => {
    const { container } = render(<AddFeedDialog {...defaultProps} open={true} />);
    const feedPanel = container.querySelector('#feedPanel');
    expect(feedPanel).toBeInTheDocument();
  });

  it('switches to shortcut tab when clicked', async () => {
    render(<AddFeedDialog {...defaultProps} open={true} />);
    const shortcutTab = screen.getByRole('tab', { name: /ショートカット追加/i });
    await userEvent.setup().click(shortcutTab);
    expect(screen.getByRole('tabpanel', { name: /ショートカット追加/i })).toBeInTheDocument();
  });

  it('submits feed URL', async () => {
    const handleSubmitFeed = vi.fn(() => Promise.resolve(true));
    render(<AddFeedDialog {...defaultProps} open={true} onSubmitFeed={handleSubmitFeed} />);
    const feedPanel = screen.getByRole('tabpanel', { name: /RSS追加/i });
    const input = feedPanel.querySelector('input[name="urlInput"]') as HTMLInputElement;
    const submitButton = feedPanel.querySelector('button[type="submit"]') as HTMLButtonElement;

    await userEvent.setup().type(input, 'https://example.com/feed.xml');
    await userEvent.setup().click(submitButton);

    await waitFor(() => {
      expect(handleSubmitFeed).toHaveBeenCalledWith('https://example.com/feed.xml');
    });
  });

  it('submits shortcut URL', async () => {
    const handleSubmitShortcut = vi.fn(() => Promise.resolve(true));
    render(<AddFeedDialog {...defaultProps} open={true} onSubmitShortcut={handleSubmitShortcut} />);
    const shortcutTab = screen.getByRole('tab', { name: /ショートカット追加/i });
    await userEvent.setup().click(shortcutTab);

    const shortcutPanel = screen.getByRole('tabpanel', { name: /ショートカット追加/i });
    const input = shortcutPanel.querySelector('input[name="shortcutUrl"]') as HTMLInputElement;
    const submitButton = shortcutPanel.querySelector('button[type="submit"]') as HTMLButtonElement;

    await userEvent.setup().type(input, 'https://example.com');
    await userEvent.setup().click(submitButton);

    await waitFor(() => {
      expect(handleSubmitShortcut).toHaveBeenCalledWith('https://example.com');
    });
  });

  it('closes dialog on successful feed submission', async () => {
    const handleOpenChange = vi.fn();
    const handleSubmitFeed = vi.fn(() => Promise.resolve(true));
    render(
      <AddFeedDialog
        {...defaultProps}
        open={true}
        onOpenChange={handleOpenChange}
        onSubmitFeed={handleSubmitFeed}
      />,
    );
    const feedPanel = screen.getByRole('tabpanel', { name: /RSS追加/i });
    const input = feedPanel.querySelector('input[name="urlInput"]') as HTMLInputElement;
    const submitButton = feedPanel.querySelector('button[type="submit"]') as HTMLButtonElement;

    await userEvent.setup().type(input, 'https://example.com/feed.xml');
    await userEvent.setup().click(submitButton);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('keeps dialog open on failed feed submission', async () => {
    const handleOpenChange = vi.fn();
    const handleSubmitFeed = vi.fn(() => Promise.resolve(false));
    render(
      <AddFeedDialog
        {...defaultProps}
        open={true}
        onOpenChange={handleOpenChange}
        onSubmitFeed={handleSubmitFeed}
      />,
    );
    const feedPanel = screen.getByRole('tabpanel', { name: /RSS追加/i });
    const input = feedPanel.querySelector('input[name="urlInput"]') as HTMLInputElement;
    const submitButton = feedPanel.querySelector('button[type="submit"]') as HTMLButtonElement;

    await userEvent.setup().type(input, 'https://invalid.com');
    await userEvent.setup().click(submitButton);

    await waitFor(() => {
      expect(handleOpenChange).not.toHaveBeenCalledWith(false);
    });
  });

  it('resets to feed tab when dialog reopens', async () => {
    const { rerender } = render(<AddFeedDialog {...defaultProps} open={true} />);
    const shortcutTab = screen.getByRole('tab', { name: /ショートカット追加/i });
    await userEvent.setup().click(shortcutTab);

    rerender(<AddFeedDialog {...defaultProps} open={false} />);
    rerender(<AddFeedDialog {...defaultProps} open={true} />);

    const feedPanel = screen.getByRole('tabpanel', { name: /RSS追加/i });
    expect(feedPanel).toBeInTheDocument();
  });

  it('has close button', () => {
    render(<AddFeedDialog {...defaultProps} open={true} />);
    const closeButton = screen.getByRole('button', { name: /閉じる/i });
    expect(closeButton).toBeInTheDocument();
  });
});
