import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ShortcutSection } from './ShortcutSection';

describe('ShortcutSection', () => {
  const defaultProps = {
    shortcuts: [],
    onRemoveShortcut: vi.fn(),
  };

  it('renders section with title', () => {
    render(<ShortcutSection {...defaultProps} />);
    expect(screen.getByText('ショートカット')).toBeInTheDocument();
  });

  it('shows empty state when no shortcuts', () => {
    render(<ShortcutSection {...defaultProps} />);
    expect(screen.getByText('登録されたショートカットはありません')).toBeInTheDocument();
  });

  it('renders shortcut entry for each url', () => {
    const shortcuts = [
      { url: 'https://example.com' },
      { url: 'https://github.com' },
      { url: 'https://google.com' },
    ];
    render(<ShortcutSection shortcuts={shortcuts} onRemoveShortcut={vi.fn()} />);
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(screen.getByText('github.com')).toBeInTheDocument();
    expect(screen.getByText('google.com')).toBeInTheDocument();
  });

  it('removes www prefix from hostname', () => {
    const shortcuts = [{ url: 'https://www.example.com' }];
    render(<ShortcutSection shortcuts={shortcuts} onRemoveShortcut={vi.fn()} />);
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('renders links with correct href', () => {
    const shortcuts = [{ url: 'https://example.com/path' }];
    render(<ShortcutSection shortcuts={shortcuts} onRemoveShortcut={vi.fn()} />);
    const link = screen.getByRole('link', { name: /example\.com/i });
    expect(link).toHaveAttribute('href', 'https://example.com/path');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders remove button for each shortcut', () => {
    const shortcuts = [{ url: 'https://example.com' }, { url: 'https://github.com' }];
    render(<ShortcutSection shortcuts={shortcuts} onRemoveShortcut={vi.fn()} />);
    const removeButtons = screen.getAllByRole('button', { name: /削除/i });
    expect(removeButtons).toHaveLength(2);
  });

  it('calls onRemoveShortcut when remove button is clicked', async () => {
    const handleRemoveShortcut = vi.fn();
    const shortcuts = [{ url: 'https://example.com' }];
    render(<ShortcutSection shortcuts={shortcuts} onRemoveShortcut={handleRemoveShortcut} />);
    const removeButton = screen.getByRole('button', { name: /example\.com.*削除/i });
    await userEvent.setup().click(removeButton);
    expect(handleRemoveShortcut).toHaveBeenCalledWith('https://example.com');
  });

  it('renders fallback icon with first character when icon fails', async () => {
    const shortcuts = [{ url: 'https://example.com' }];
    const { container } = render(
      <ShortcutSection shortcuts={shortcuts} onRemoveShortcut={vi.fn()} />,
    );
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();

    // Simulate image load failure
    if (image) {
      image.dispatchEvent(new Event('error'));
    }

    // Look for fallback text
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('sets correct accessibility attributes for remove button', () => {
    const shortcuts = [{ url: 'https://example.com' }];
    render(<ShortcutSection shortcuts={shortcuts} onRemoveShortcut={vi.fn()} />);
    const removeButton = screen.getByRole('button', { name: /example\.com.*削除/i });
    expect(removeButton).toHaveAttribute('aria-label', expect.stringContaining('example.com'));
    expect(removeButton).toHaveAttribute('title', expect.stringContaining('example.com'));
  });

  it('renders link title with full URL', () => {
    const shortcuts = [{ url: 'https://example.com/path' }];
    render(<ShortcutSection shortcuts={shortcuts} onRemoveShortcut={vi.fn()} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('title', 'https://example.com/path');
  });

  it('handles invalid URLs gracefully', () => {
    const shortcuts = [{ url: 'not-a-valid-url' }, { url: 'https://valid.com' }];
    render(<ShortcutSection shortcuts={shortcuts} onRemoveShortcut={vi.fn()} />);
    // Invalid URL should not render, valid one should
    expect(screen.getByText('valid.com')).toBeInTheDocument();
  });
});
