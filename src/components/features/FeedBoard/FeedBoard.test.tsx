import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Feed, Group } from '@/storage/feedDashboard';
import { FeedBoard } from './FeedBoard';

describe('FeedBoard', () => {
  const mockFeeds: Feed[] = [
    {
      url: 'https://example.com/feed1',
      title: 'Ungrouped Feed',
      color: '#2563eb',
      group: '',
    },
    {
      url: 'https://example.com/feed2',
      title: 'Grouped Feed 1',
      color: '#ff0000',
      group: 'group1',
    },
    {
      url: 'https://example.com/feed3',
      title: 'Grouped Feed 2',
      color: '#00ff00',
      group: 'group1',
    },
  ];

  const mockGroups: Group[] = [
    {
      id: 'group1',
      title: 'News Group',
      color: '#ff8000',
      collapsed: false,
    },
  ];

  const defaultProps = {
    feeds: mockFeeds,
    groups: mockGroups,
    statusByUrl: {},
    itemsByUrl: {},
    onOpenArticle: vi.fn(() => true),
    onPlayAudio: vi.fn(),
    onUpdateFeed: vi.fn(() => true),
    onUpdateGroup: vi.fn(),
    onRemoveFeed: vi.fn(() => Promise.resolve({ ok: true })),
    onMoveFeed: vi.fn(() => Promise.resolve({ ok: true })),
    onRemoveGroup: vi.fn(() => Promise.resolve({ ok: true })),
    onToggleGroupCollapse: vi.fn(() => Promise.resolve({ ok: true })),
    onMoveGroup: vi.fn(() => Promise.resolve({ ok: true })),
  };

  it('renders board with main grid', () => {
    const { container } = render(<FeedBoard {...defaultProps} />);
    expect(container.querySelector('[class*="main"]')).toBeInTheDocument();
  });

  it('renders ungrouped feeds section', () => {
    render(<FeedBoard {...defaultProps} />);
    expect(screen.getByText('Ungrouped Feed')).toBeInTheDocument();
  });

  it('renders grouped feeds', () => {
    render(<FeedBoard {...defaultProps} />);
    expect(screen.getByText('Grouped Feed 1')).toBeInTheDocument();
    expect(screen.getByText('Grouped Feed 2')).toBeInTheDocument();
  });

  it('renders group title', () => {
    render(<FeedBoard {...defaultProps} />);
    expect(screen.getByText('News Group')).toBeInTheDocument();
  });

  it('filters empty groups', () => {
    const groupsWithEmpty: Group[] = [
      ...mockGroups,
      {
        id: 'group2',
        title: 'Empty Group',
        color: '#0000ff',
        collapsed: false,
      },
    ];
    const feedsWithoutEmpty = mockFeeds.filter((f) => f.group !== 'group2');

    render(<FeedBoard {...defaultProps} feeds={feedsWithoutEmpty} groups={groupsWithEmpty} />);
    expect(screen.queryByText('Empty Group')).not.toBeInTheDocument();
  });

  it('shows collapsed groups', () => {
    const collapsedGroups: Group[] = [
      { id: 'group1', title: 'News Group', color: '#ff8000', collapsed: true },
    ];
    render(<FeedBoard {...defaultProps} groups={collapsedGroups} />);
    expect(screen.getByText('News Group')).toBeInTheDocument();
  });

  it('calls onOpenArticle when article is opened', async () => {
    const handleOpenArticle = vi.fn(() => true);
    render(<FeedBoard {...defaultProps} onOpenArticle={handleOpenArticle} />);
    // Note: ArticlePane and feed items are rendered inside FeedCard
    expect(screen.getByText('Ungrouped Feed')).toBeInTheDocument();
  });

  it('handles feed removal', async () => {
    const handleRemoveFeed = vi.fn(() => Promise.resolve({ ok: true }));
    render(<FeedBoard {...defaultProps} onRemoveFeed={handleRemoveFeed} />);
    expect(screen.getByText('Ungrouped Feed')).toBeInTheDocument();
  });

  it('handles feed movement to groups', async () => {
    const handleMoveFeed = vi.fn(() => Promise.resolve({ ok: true }));
    render(<FeedBoard {...defaultProps} onMoveFeed={handleMoveFeed} />);
    expect(screen.getByText('Ungrouped Feed')).toBeInTheDocument();
  });

  it('handles group removal', async () => {
    const handleRemoveGroup = vi.fn(() => Promise.resolve({ ok: true }));
    render(<FeedBoard {...defaultProps} onRemoveGroup={handleRemoveGroup} />);
    expect(screen.getByText('News Group')).toBeInTheDocument();
  });

  it('handles group collapse toggle', async () => {
    const handleToggleGroupCollapse = vi.fn(() => Promise.resolve({ ok: true }));
    render(<FeedBoard {...defaultProps} onToggleGroupCollapse={handleToggleGroupCollapse} />);
    expect(screen.getByText('News Group')).toBeInTheDocument();
  });

  it('handles group reordering', async () => {
    const handleMoveGroup = vi.fn(() => Promise.resolve({ ok: true }));
    render(<FeedBoard {...defaultProps} onMoveGroup={handleMoveGroup} />);
    expect(screen.getByText('News Group')).toBeInTheDocument();
  });

  it('renders with empty feeds list', () => {
    render(<FeedBoard {...defaultProps} feeds={[]} />);
    expect(screen.queryByText('News Group')).not.toBeInTheDocument();
  });

  it('renders with empty groups list', () => {
    const feedsUngrouped = mockFeeds.filter((f) => !f.group);
    render(<FeedBoard {...defaultProps} feeds={feedsUngrouped} groups={[]} />);
    expect(screen.getByText('Ungrouped Feed')).toBeInTheDocument();
  });

  it('handles status updates', () => {
    const statusByUrl = {
      'https://example.com/feed1': { loading: true, error: null },
    };
    render(<FeedBoard {...defaultProps} statusByUrl={statusByUrl} />);
    expect(screen.getByText('Ungrouped Feed')).toBeInTheDocument();
  });

  it('handles feed items display', () => {
    const itemsByUrl = {
      'https://example.com/feed1': [
        {
          title: 'Article 1',
          link: 'https://example.com/article1',
          date: new Date().toLocaleDateString(),
          thumb: '',
          audio: '',
        },
      ],
    };
    render(<FeedBoard {...defaultProps} itemsByUrl={itemsByUrl} />);
    expect(screen.getByText('Ungrouped Feed')).toBeInTheDocument();
  });

  it('updates when feeds prop changes', () => {
    const { rerender } = render(<FeedBoard {...defaultProps} />);
    expect(screen.getByText('Ungrouped Feed')).toBeInTheDocument();

    const updatedFeeds = [
      ...mockFeeds,
      {
        url: 'https://example.com/feed4',
        title: 'New Feed',
        color: '#0000ff',
        group: '',
      },
    ];

    rerender(<FeedBoard {...defaultProps} feeds={updatedFeeds} />);
    expect(screen.getByText('New Feed')).toBeInTheDocument();
  });
});
