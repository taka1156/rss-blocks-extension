import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FeedItem } from '@/utils/feedParser';
import { FeedItemRow } from './FeedItemRow';

describe('FeedItemRow', () => {
  const mockItem: FeedItem = {
    title: 'Test Article',
    link: 'https://example.com/article',
    date: new Date('2024-01-01').toLocaleString(),
    thumb: 'https://example.com/thumb.jpg',
    audio: 'https://example.com/audio.mp3',
  };

  const defaultProps = {
    item: mockItem,
    isArticleOpen: false,
    isAudioPlaying: false,
    onOpenArticle: vi.fn(() => true),
    onPlayAudio: vi.fn(),
  };

  it('renders article title', () => {
    render(<FeedItemRow {...defaultProps} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('renders thumbnail image', () => {
    render(<FeedItemRow {...defaultProps} />);
    const img = screen.getByAltText('');
    expect(img).toHaveAttribute('src', 'https://example.com/thumb.jpg');
  });

  it('renders article link', () => {
    render(<FeedItemRow {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/article');
  });

  it('shows "閲覧中" when article is open', () => {
    render(<FeedItemRow {...defaultProps} isArticleOpen={true} />);
    expect(screen.getByText(/閲覧中/)).toBeInTheDocument();
  });

  it('does not show "閲覧中" when article is not open', () => {
    render(<FeedItemRow {...defaultProps} isArticleOpen={false} />);
    expect(screen.queryByText(/閲覧中/)).not.toBeInTheDocument();
  });

  it('shows audio play button', () => {
    render(<FeedItemRow {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('shows "再生中" and pause icon when audio is playing', () => {
    render(<FeedItemRow {...defaultProps} isAudioPlaying={true} />);
    expect(screen.getByText(/再生中/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('⏸');
  });

  it('shows play icon when audio is not playing', () => {
    render(<FeedItemRow {...defaultProps} isAudioPlaying={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('▶');
  });

  it('calls onOpenArticle when article link is clicked', async () => {
    const onOpenArticle = vi.fn(() => true);
    const { rerender } = render(<FeedItemRow {...defaultProps} onOpenArticle={onOpenArticle} />);

    const link = screen.getByRole('link');
    await userEvent.click(link);

    expect(onOpenArticle).toHaveBeenCalledWith('Test Article', 'https://example.com/article');
  });

  it('calls onPlayAudio when audio button is clicked', async () => {
    const onPlayAudio = vi.fn();
    render(<FeedItemRow {...defaultProps} onPlayAudio={onPlayAudio} />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(onPlayAudio).toHaveBeenCalledWith('Test Article', 'https://example.com/audio.mp3');
  });

  it('renders formatted date', () => {
    render(<FeedItemRow {...defaultProps} />);
    const time = screen.getByRole('time');
    expect(time).toBeInTheDocument();
  });

  it('renders fallback title when no title is provided', () => {
    const itemWithoutTitle: FeedItem = {
      ...mockItem,
      title: '',
      link: 'https://example.com/article',
    };
    render(<FeedItemRow {...defaultProps} item={itemWithoutTitle} />);
    expect(screen.getByText('https://example.com/article')).toBeInTheDocument();
  });

  it('renders default title when no title or link is provided', () => {
    const itemWithoutTitleOrLink: FeedItem = {
      ...mockItem,
      title: '',
      link: '',
    };
    render(<FeedItemRow {...defaultProps} item={itemWithoutTitleOrLink} />);
    expect(screen.getByText('(無題)')).toBeInTheDocument();
  });

  it('does not render audio button when audio is not available', () => {
    const itemWithoutAudio: FeedItem = {
      ...mockItem,
      audio: '',
    };
    render(<FeedItemRow {...defaultProps} item={itemWithoutAudio} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
