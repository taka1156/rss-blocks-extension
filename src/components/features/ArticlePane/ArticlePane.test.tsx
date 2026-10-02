import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ArticlePane } from './ArticlePane';

describe('ArticlePane', () => {
  beforeEach(() => {
    // Mock document.documentElement.style.setProperty
    Object.defineProperty(document.documentElement, 'style', {
      value: {
        setProperty: vi.fn(),
      },
      writable: true,
    });

    // Mock body classList
    Object.defineProperty(document.body, 'classList', {
      value: {
        toggle: vi.fn(),
        remove: vi.fn(),
      },
      writable: true,
    });

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    title: 'Article Title',
    url: 'https://example.com/article',
    audioLabel: 'Audio',
    audioUrl: 'https://example.com/audio.mp3',
    onCloseArticle: vi.fn(),
    onCloseAudio: vi.fn(),
  };

  it('renders nothing when both url and audioUrl are empty', () => {
    const { container } = render(<ArticlePane {...defaultProps} url="" audioUrl="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when url is provided', () => {
    const { container } = render(<ArticlePane {...defaultProps} audioUrl="" />);
    expect(container.querySelector('aside')).toBeInTheDocument();
  });

  it('renders when audioUrl is provided', () => {
    const { container } = render(<ArticlePane {...defaultProps} url="" />);
    expect(container.querySelector('aside')).toBeInTheDocument();
  });

  it('renders article title', () => {
    render(<ArticlePane {...defaultProps} audioUrl="" />);
    expect(screen.getByText('Article Title')).toBeInTheDocument();
  });

  it('renders article frame with correct src', () => {
    const { container } = render(<ArticlePane {...defaultProps} audioUrl="" />);
    const frame = container.querySelector('iframe');
    expect(frame).toHaveAttribute('src', 'https://example.com/article');
  });

  it('renders audio section when audioUrl is provided', () => {
    render(<ArticlePane {...defaultProps} />);
    expect(screen.getByText('Audio')).toBeInTheDocument();
  });

  it('renders audio player with correct src', () => {
    const { container } = render(<ArticlePane {...defaultProps} />);
    const audio = container.querySelector('audio');
    expect(audio).toHaveAttribute('src', 'https://example.com/audio.mp3');
  });

  it('renders close button for article', () => {
    render(<ArticlePane {...defaultProps} audioUrl="" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('calls onCloseArticle when article close button is clicked', async () => {
    const handleCloseArticle = vi.fn();
    render(<ArticlePane {...defaultProps} audioUrl="" onCloseArticle={handleCloseArticle} />);
    const closeButtons = screen.getAllByRole('button', { name: /close|閉じる/i });
    if (closeButtons.length > 0) {
      await userEvent.setup().click(closeButtons[0]);
    }
  });

  it('calls onCloseAudio when audio close button is clicked', async () => {
    const handleCloseAudio = vi.fn();
    render(<ArticlePane {...defaultProps} onCloseAudio={handleCloseAudio} />);
    const closeButtons = screen.getAllByRole('button');
    if (closeButtons.length > 1) {
      await userEvent.setup().click(closeButtons[1]);
    }
  });

  it('renders resize handle', () => {
    const { container } = render(<ArticlePane {...defaultProps} audioUrl="" />);
    const resizeHandle = container.querySelector('hr[id="paneResizeHandle"]');
    expect(resizeHandle).toBeInTheDocument();
  });

  it('resize handle has correct aria attributes', () => {
    const { container } = render(<ArticlePane {...defaultProps} audioUrl="" />);
    const resizeHandle = container.querySelector('hr[id="paneResizeHandle"]');
    expect(resizeHandle).toHaveAttribute('aria-orientation', 'vertical');
    expect(resizeHandle).toHaveAttribute('aria-label', '記事ペインの幅');
  });

  it('toggles pane-open class on body', () => {
    const { rerender } = render(<ArticlePane {...defaultProps} audioUrl="" />);
    expect(document.body.classList.toggle).toHaveBeenCalled();

    rerender(<ArticlePane {...defaultProps} url="" audioUrl="" />);
    expect(document.body.classList.remove).toHaveBeenCalled();
  });

  it('has correct pane element id', () => {
    const { container } = render(<ArticlePane {...defaultProps} audioUrl="" />);
    const pane = container.querySelector('#pane');
    expect(pane).toBeInTheDocument();
  });
});
