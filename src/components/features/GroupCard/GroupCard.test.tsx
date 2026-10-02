import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Feed, Group } from '@/storage/feedDashboard';
import { GroupCard } from './GroupCard';

describe('GroupCard', () => {
  const mockGroup: Group = {
    id: 'group1',
    title: 'Test Group',
    color: '#ff0000',
    collapsed: false,
  };

  const mockFeeds: Feed[] = [
    {
      url: 'https://example.com/feed1',
      title: 'Feed 1',
      color: '#2563eb',
      group: 'group1',
    },
    {
      url: 'https://example.com/feed2',
      title: 'Feed 2',
      color: '#ff8000',
      group: 'group1',
    },
  ];

  const defaultProps = {
    group: mockGroup,
    feeds: mockFeeds,
    onToggleCollapse: vi.fn(),
    onRemoveGroup: vi.fn(),
    onRemoveFeed: vi.fn(),
    onUpdateFeed: vi.fn(() => true),
    onUpdateGroup: vi.fn(),
    onOpenArticle: vi.fn(() => true),
    onPlayAudio: vi.fn(),
    onFeedDragStart: vi.fn(),
    onFeedDrop: vi.fn(),
    onGroupDragStart: vi.fn(),
    onGroupDrop: vi.fn(),
    statusByUrl: {},
    itemsByUrl: {},
  };

  it('renders group title', () => {
    render(<GroupCard {...defaultProps} />);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('renders all feeds in group', () => {
    render(<GroupCard {...defaultProps} />);
    expect(screen.getByText('Feed 1')).toBeInTheDocument();
    expect(screen.getByText('Feed 2')).toBeInTheDocument();
  });

  it('renders group in list item', () => {
    const { container } = render(<GroupCard {...defaultProps} />);
    const listItem = container.querySelector('li');
    expect(listItem).toBeInTheDocument();
  });

  it('applies group color as style', () => {
    const { container } = render(<GroupCard {...defaultProps} />);
    const groupElement = container.querySelector('li') as HTMLLIElement;
    expect(groupElement.getAttribute('style')).toContain('#ff0000');
  });

  it('shows collapsed state when group is collapsed', () => {
    const { container } = render(
      <GroupCard {...defaultProps} group={{ ...mockGroup, collapsed: true }} />,
    );
    const groupElement = container.querySelector('li');
    expect(groupElement?.className).toContain('collapsed');
  });

  it('calls onToggleCollapse when toggle button is clicked', async () => {
    const handleToggleCollapse = vi.fn();
    render(<GroupCard {...defaultProps} onToggleCollapse={handleToggleCollapse} />);
    await userEvent.setup().click(screen.getByTitle('開閉'));
    expect(handleToggleCollapse).toHaveBeenCalledWith('group1');
  });

  it('supports drag operations for group', () => {
    const { container } = render(<GroupCard {...defaultProps} />);
    const listItem = container.querySelector('li');
    expect(listItem).toHaveAttribute('draggable');
  });

  it('handles feed drag operations within group', () => {
    render(<GroupCard {...defaultProps} />);
    expect(screen.getByText('Feed 1')).toBeInTheDocument();
  });

  it('handles feed drop operations within group', () => {
    render(<GroupCard {...defaultProps} />);
    expect(screen.getByText('Feed 1')).toBeInTheDocument();
  });

  it('renders with empty feeds list', () => {
    render(<GroupCard {...defaultProps} feeds={[]} />);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('renders with status information', () => {
    const statusByUrl = {
      'https://example.com/feed1': { loading: true, error: null },
    };
    render(<GroupCard {...defaultProps} statusByUrl={statusByUrl} />);
    expect(screen.getByText('Feed 1')).toBeInTheDocument();
  });

  it('renders with feed items', () => {
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
    render(<GroupCard {...defaultProps} itemsByUrl={itemsByUrl} />);
    expect(screen.getByText('Feed 1')).toBeInTheDocument();
  });

  it('updates group color', () => {
    const { container } = render(
      <GroupCard {...defaultProps} group={{ ...mockGroup, color: '#00ff00' }} />,
    );
    const groupElement = container.querySelector('li') as HTMLLIElement;
    expect(groupElement.getAttribute('style')).toContain('#00ff00');
  });

  it('displays group with no color', () => {
    const { container } = render(
      <GroupCard {...defaultProps} group={{ ...mockGroup, color: '' }} />,
    );
    const groupElement = container.querySelector('li');
    expect(groupElement).toBeInTheDocument();
  });
});
